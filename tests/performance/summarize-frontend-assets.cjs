// Summarize retained Lighthouse diagnostics and browser/image evidence.
// node tests/performance/summarize-frontend-assets.cjs [evidence-directory]
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const directory = process.argv[2] || 'tests/performance/2026-11-05-assets-local';
const read = name => JSON.parse(fs.readFileSync(path.join(directory, name), 'utf8'));
const before = read('browser-before.json');
const after = read('browser-after.json');
assert.ok(before.passed && after.passed, 'Both browser verification phases must pass');

function imageBytes(snapshot) {
  return snapshot.images.reduce((sum, image) => {
    const resource = snapshot.resourceTimings.find(item => item.name === image.currentSrc);
    assert.ok(resource?.encodedBodySize > 0, `Missing image byte evidence: ${image.currentSrc}`);
    return sum + resource.encodedBodySize;
  }, 0);
}

const browserComparisons = after.routes.map(current => {
  const previous = before.routes.find(item => item.route === current.route && item.viewport.width === current.viewport.width && item.viewport.deviceScaleFactor === current.viewport.deviceScaleFactor);
  const beforeBytes = imageBytes(previous);
  const afterBytes = imageBytes(current);
  return {
    route: current.route, viewport: current.viewport,
    beforeImageBodyBytes: beforeBytes, afterImageBodyBytes: afterBytes,
    savedBytes: beforeBytes - afterBytes, savedPercent: (1 - afterBytes / beforeBytes) * 100,
    selectedImages: current.images.map(image => ({ alt: image.alt, currentSrc: image.currentSrc, widthCssPx: image.geometry.width, heightCssPx: image.geometry.height })),
  };
});

const auditKeys = ['uses-responsive-images', 'modern-image-formats', 'uses-optimized-images', 'unsized-images', 'unused-javascript', 'unused-css-rules', 'render-blocking-resources', 'font-display'];
const lighthouse = [];
let referenceSettings;
for (const phase of ['before', 'after']) {
  const manifest = read(`${phase}/asset-manifest.json`);
  for (const route of ['home', 'want-to-help']) {
    const report = read(`${phase}/${route}.report.json`);
    assert.ok(!report.runtimeError, `${phase}/${route} must have no Lighthouse runtime error`);
    if (referenceSettings) assert.deepEqual(report.configSettings, referenceSettings, 'Lighthouse settings must match');
    else referenceSettings = report.configSettings;
    const network = report.audits['network-requests'].details.items;
    assert.ok(network.some(item => item.url.endsWith(`/${manifest.entrypoints[0]}`)), 'Audit must load its identified production entry');
    lighthouse.push({
      phase, route, fetchTime: report.fetchTime, lighthouseVersion: report.lighthouseVersion,
      runtimeError: report.runtimeError || null, runWarnings: report.runWarnings,
      benchmarkIndex: report.environment.benchmarkIndex,
      entryScript: manifest.entrypoints[0],
      metricsMs: Object.fromEntries(['first-contentful-paint', 'largest-contentful-paint', 'total-blocking-time', 'speed-index'].map(key => [key, report.audits[key].numericValue])),
      cls: report.audits['cumulative-layout-shift'].numericValue,
      seo: report.categories.seo.score * 100,
      totalTransferBytes: network.reduce((sum, item) => sum + item.transferSize, 0),
      audits: Object.fromEntries(auditKeys.map(key => [key, {
        score: report.audits[key].score,
        potentialSavingsBytes: report.audits[key].details?.overallSavingsBytes || 0,
        items: report.audits[key].details?.items || [],
      }])),
    });
  }
}

const summary = {
  generatedAtUtc: new Date().toISOString(),
  scope: 'Local production asset-delivery verification; one Lighthouse diagnostic per route and phase. No repeated timing experiment or final deployed performance claim.',
  byteMethod: 'Sum Resource Timing encodedBodySize for each selected image, after scrolling to decode all lazy images in fresh cache-disabled browser contexts. Body bytes exclude HTTP headers, scripts, and other resource types.',
  browserChecks: { before: before.checks.length, after: after.checks.length, capturesPerPhase: after.routes.length, bothPassed: true },
  coverDensityChecks: after.coverDensityChecks || [],
  browserComparisons, lighthouse, lighthouseConfigSettings: referenceSettings,
  imageEncodingEvidence: 'image-encoding.json',
};
fs.writeFileSync(path.join(directory, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`);
console.log(JSON.stringify({ output: path.join(directory, 'summary.json'), browserCaptures: browserComparisons.length, lighthouseDiagnostics: lighthouse.length }));
