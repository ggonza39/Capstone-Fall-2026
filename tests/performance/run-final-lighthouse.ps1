param(
    [Parameter(Mandatory = $true)][string]$LighthouseCli,
    [string]$OutputDirectory = 'tests/performance/2026-11-10-final-mobile',
    [string]$Url = 'https://capstone-fall-2026.vercel.app/',
    [string]$ChromePath = 'C:\Program Files\Google\Chrome\Application\chrome.exe',
    [switch]$RequireStaticHome
)

$ErrorActionPreference = 'Stop'
$outputPath = [IO.Path]::GetFullPath($OutputDirectory)
if (Test-Path -LiteralPath $outputPath) {
    throw "Use a new evidence directory; refusing to overwrite $outputPath"
}
New-Item -ItemType Directory -Path $outputPath | Out-Null
$utf8 = New-Object Text.UTF8Encoding($false)

function Write-Json($value, [string]$name) {
    [IO.File]::WriteAllText((Join-Path $outputPath $name), ($value | ConvertTo-Json -Depth 12), $utf8)
}

function Get-DeploymentSnapshot {
    $response = Invoke-WebRequest $Url -UseBasicParsing
    $entry = [regex]::Match($response.Content, '<script\b[^>]*src="([^"]+)"').Groups[1].Value
    if (-not $entry) { throw 'The deployed HTML has no entry script' }
    $htmlBytes = [Text.Encoding]::UTF8.GetBytes($response.Content)
    $sha = [Security.Cryptography.SHA256]::Create()
    $htmlHash = [BitConverter]::ToString($sha.ComputeHash($htmlBytes)).Replace('-', '').ToLowerInvariant()
    $sha.Dispose()
    return [ordered]@{
        capturedAtUtc = [DateTime]::UtcNow.ToString('o')
        requestedUrl = $Url
        status = [int]$response.StatusCode
        etag = $response.Headers['ETag']
        lastModified = $response.Headers['Last-Modified']
        vercelCache = $response.Headers['X-Vercel-Cache']
        vercelId = $response.Headers['X-Vercel-Id']
        entryScript = $entry
        staticHomeInRawHtml = $response.Content.Contains('data-prerendered="home"')
        htmlSha256 = $htmlHash
    }
}

$preflight = Get-DeploymentSnapshot
if ($RequireStaticHome -and -not $preflight.staticHomeInRawHtml) {
    throw 'The live HTML does not contain the build-rendered homepage. Verify that the new postbuild and Vercel routing configuration were deployed before collecting confirmation results.'
}
$manifestResponse = Invoke-WebRequest ([Uri]::new([Uri]$Url, 'asset-manifest.json').AbsoluteUri) -UseBasicParsing
$manifest = $manifestResponse.Content | ConvertFrom-Json
# Builds with extracted CSS may list the stylesheet before the entry script.
if ($manifest.entrypoints -notcontains $preflight.entryScript.TrimStart('/')) {
    throw 'Deployment HTML and asset manifest do not identify the same entry'
}
[IO.File]::WriteAllText((Join-Path $outputPath 'asset-manifest.json'), $manifestResponse.Content, $utf8)
$htmlResponse = Invoke-WebRequest $Url -UseBasicParsing
[IO.File]::WriteAllText((Join-Path $outputPath 'index.html'), $htmlResponse.Content, $utf8)

$metadata = [ordered]@{
    measuredClientDate = [TimeZoneInfo]::ConvertTimeFromUtc([DateTime]::UtcNow, [TimeZoneInfo]::FindSystemTimeZoneById('Eastern Standard Time')).ToString('yyyy-MM-dd')
    timezone = 'America/New_York'
    requestedUrl = $Url
    localReferenceCommit = (git rev-parse HEAD).Trim()
    deployedCommit = $null
    deployedCommitNote = 'Public artifacts do not expose a verified source commit; the local commit is a reference only.'
    nodeVersion = (node --version).Trim()
    lighthouseCli = $LighthouseCli
    lighthouseVersion = ((node $LighthouseCli --version) | Out-String).Trim()
    chromePath = $ChromePath
    chromeVersion = (Get-Item -LiteralPath $ChromePath).VersionInfo.ProductVersion
    operatingSystem = Get-CimInstance Win32_OperatingSystem | Select-Object Caption, Version, OSArchitecture
    cpu = Get-CimInstance Win32_Processor | Select-Object Name, NumberOfCores, NumberOfLogicalProcessors
    runProcedure = 'Five sequential navigation audits; fresh Chrome process/profile and default storage reset each run; no URL blocking, interactions, builds, tests, or other browser audits during collection.'
    optimizedImageVariants = @($manifest.files.PSObject.Properties | Where-Object { $_.Name -match '-(210|260|380|420|480|800|1200)\.webp$' }).Count
    preflight = $preflight
    afterEachRun = @()
}
Write-Json $metadata 'deployment.json'

for ($run = 1; $run -le 5; $run++) {
    $reportPath = Join-Path $outputPath "run-$run"
    node $LighthouseCli $Url --only-categories=performance,seo --form-factor=mobile --throttling-method=simulate --output=json --output=html --output-path=$reportPath --chrome-path=$ChromePath --chrome-flags="--headless=new --no-first-run --no-default-browser-check --disable-extensions" --quiet
    if ($LASTEXITCODE -ne 0) { throw "Lighthouse run $run failed; existing evidence is retained" }
    $snapshot = Get-DeploymentSnapshot
    $metadata.afterEachRun += $snapshot
    Write-Json $metadata 'deployment.json'
    if ($snapshot.entryScript -ne $preflight.entryScript -or $snapshot.etag -ne $preflight.etag -or $snapshot.htmlSha256 -ne $preflight.htmlSha256) {
        throw "Deployment changed during run $run; evidence is retained and must not be treated as a stable five-run set"
    }
    $report = Get-Content -LiteralPath "$reportPath.report.json" -Raw | ConvertFrom-Json
    if ($report.runtimeError) { throw "Lighthouse run $run reported a runtime error; evidence is retained" }
    [PSCustomObject]@{
        run = $run
        FCP = $report.audits.'first-contentful-paint'.numericValue
        LCP = $report.audits.'largest-contentful-paint'.numericValue
        TBT = $report.audits.'total-blocking-time'.numericValue
        SpeedIndex = $report.audits.'speed-index'.numericValue
        SEO = 100 * $report.categories.seo.score
        Warnings = @($report.runWarnings).Count
    } | ConvertTo-Json -Compress | Write-Output
}
$metadata.unchangedAcrossAllRuns = $true
$metadata.completedAtUtc = [DateTime]::UtcNow.ToString('o')
Write-Json $metadata 'deployment.json'
