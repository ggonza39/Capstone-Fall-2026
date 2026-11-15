// node tests/performance/summarize-final-lighthouse.cjs [final-evidence-directory]
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const directory = process.argv[2] || 'tests/performance/2026-11-10-final-mobile';
const initialDirectory = path.join(__dirname, '2026-11-05-initial-mobile');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const initial = read(path.join(initialDirectory, 'summary.json'));
const initialReport = read(path.join(initialDirectory, 'run-1.report.json'));
const deployment = read(path.join(directory, 'deployment.json'));
assert.equal(deployment.unchangedAcrossAllRuns, true, 'Deployment identity must remain stable across all runs');
const median = values => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
const definitions = [
  { metric: 'FCP', audit: 'first-contentful-paint', baseline: 5700, targetExclusive: 2000 },
  { metric: 'LCP', audit: 'largest-contentful-paint', baseline: 21800, targetExclusive: 2500 },
  { metric: 'TBT', audit: 'total-blocking-time', baseline: 700, targetExclusive: 200 },
  { metric: 'Speed Index', audit: 'speed-index', baseline: 8700, targetExclusive: 3400 },
];
const reports = [];
const runs = [];
for (let run = 1; run <= 5; run++) {
  const report = read(path.join(directory, `run-${run}.report.json`));
  assert.ok(!report.runtimeError, `Run ${run} must have no runtime error`);
  assert.equal(report.lighthouseVersion, initial.lighthouseVersion, 'Lighthouse version must match initial measurement');
  assert.equal(report.requestedUrl, initial.requestedUrl, 'Requested route/origin must match initial measurement');
  assert.deepEqual(report.configSettings, initial.settings, 'Full Lighthouse settings must match initial measurement');
  assert.ok(report.audits['network-requests'].details.items.some(item => item.url.endsWith(deployment.preflight.entryScript)), `Run ${run} must load the recorded deployed entry script`);
  const values = Object.fromEntries(definitions.map(definition => {
    const value = report.audits[definition.audit].numericValue;
    assert.ok(Number.isFinite(value), `Run ${run} must have a numeric ${definition.metric}`);
    return [definition.metric, value];
  }));
  assert.ok(Number.isFinite(report.categories.seo.score), `Run ${run} must have an SEO score`);
  runs.push({
    run, reportJson: `run-${run}.report.json`, reportHtml: `run-${run}.report.html`,
    fetchTimeUtc: report.fetchTime, ...values,
    seoScore: report.categories.seo.score * 100,
    performanceScore: report.categories.performance.score * 100,
    cls: report.audits['cumulative-layout-shift'].numericValue,
    benchmarkIndex: report.environment.benchmarkIndex,
    warnings: report.runWarnings,
    hostUserAgent: report.environment.hostUserAgent,
  });
  reports.push(report);
}
const comparisons = definitions.map(definition => {
  const values = runs.map(run => run[definition.metric]);
  const finalMedian = median(values);
  const initialMedian = initial.comparisons.find(item => item.metric === definition.metric).initialMedian;
  return {
    metric: definition.metric, unit: 'ms', documentedProjectBaseline: definition.baseline,
    initialMedian, finalMedian, minimum: Math.min(...values), maximum: Math.max(...values),
    targetExclusive: definition.targetExclusive, meetsTarget: finalMedian < definition.targetExclusive,
    allRunsMeetTarget: values.every(value => value < definition.targetExclusive),
    improvementPercentVsDocumentedBaseline: (definition.baseline - finalMedian) / definition.baseline * 100,
    improvementPercentVsInitialDeployed: (initialMedian - finalMedian) / initialMedian * 100,
  };
});
const seoValues = runs.map(run => run.seoScore);
const seoMedian = median(seoValues);
comparisons.push({
  metric: 'SEO', unit: 'score/100', documentedProjectBaseline: 40,
  initialMedian: initial.comparisons.find(item => item.metric === 'SEO').initialMedian,
  finalMedian: seoMedian, minimum: Math.min(...seoValues), maximum: Math.max(...seoValues),
  targetInclusive: [90, 100], meetsTarget: seoMedian >= 90 && seoMedian <= 100,
  allRunsMeetTarget: seoValues.every(score => score >= 90 && score <= 100),
  pointChangeVsDocumentedBaseline: seoMedian - 40,
  pointChangeVsInitialDeployed: seoMedian - initial.comparisons.find(item => item.metric === 'SEO').initialMedian,
});
const browserPath = path.join(directory, 'browser-verification.json');
const browser = fs.existsSync(browserPath) ? read(browserPath) : null;
const manualPath = path.join(directory, 'manual-review.json');
const manual = fs.existsSync(manualPath) ? read(manualPath) : null;

const summary = {
  phase: 'Final deployed implementation after frontend performance/SEO optimization',
  clientDate: deployment.measuredClientDate,
  requestedUrl: initial.requestedUrl, route: '/',
  aggregation: 'Independent median for each metric across all five sequential runs; timings in milliseconds. No runs discarded.',
  baselineSource: 'documentation/milestones/Milestone-3.md, PBI-14',
  baselineComparability: initial.baselineComparability,
  lighthouseVersion: reports[0].lighthouseVersion, settings: reports[0].configSettings,
  environmentComparison: {
    initialNode: initial.deployment.nodeVersion, finalNode: deployment.nodeVersion,
    initialChrome: initial.deployment.chromeVersion, finalChrome: deployment.chromeVersion,
    initialHostUserAgent: initialReport.environment.hostUserAgent,
    finalHostUserAgent: reports[0].environment.hostUserAgent,
    chromeVersionChanged: initial.deployment.chromeVersion !== deployment.chromeVersion,
    operatingSystemMatches: JSON.stringify(initial.deployment.operatingSystem) === JSON.stringify(deployment.operatingSystem),
    cpuMatches: JSON.stringify(initial.deployment.cpu) === JSON.stringify(deployment.cpu),
    note: 'Browser version changed between measurement sets; Lighthouse settings, machine profile, runtime and deployed URL are recorded. Timing changes are observed results, not a controlled attribution to code alone.',
  },
  deployment, runs, comparisons,
  benchmarkIndexRange: [Math.min(...runs.map(run => run.benchmarkIndex)), Math.max(...runs.map(run => run.benchmarkIndex))],
  remainingAuditFindings: reports.map((report, index) => ({
    run: index + 1,
    audits: Object.fromEntries(['unused-javascript', 'mainthread-work-breakdown', 'bootup-time', 'long-tasks', 'uses-responsive-images', 'modern-image-formats', 'render-blocking-resources', 'font-display'].map(key => [key, {
      score: report.audits[key]?.score,
      displayValue: report.audits[key]?.displayValue,
      numericValue: report.audits[key]?.numericValue,
      details: report.audits[key]?.details,
    }])),
  })),
  validation: {
    runs: runs.length, runtimeErrors: 0,
    warnings: runs.reduce((count, run) => count + run.warnings.length, 0),
    settingsIdenticalAcrossRunsAndInitial: true,
    deployedEntryAndHtmlStableAcrossRuns: true,
    reportEntriesVerified: true,
    homePageScreenshotManuallyVerified: manual?.lighthouseHomeScreenshotVerified === true,
  },
  supplementalDeploymentChecks: browser ? {
    passed: browser.passed, routes: browser.routes.length, checks: browser.checks.length,
    errors: browser.errors, workshopLimitation: browser.workshopLimitation,
    unknownPageHttpStatus: browser.routes.find(route => route.route === '/final-performance-missing-page')?.status,
    note: 'Rendered metadata/content and crawl files, not additional Lighthouse category scores or timing measurements.',
  } : null,
  limitations: [
    'Historical documented baseline raw reports and conditions are unavailable.',
    'Chrome updated from the initial measurement; CPU/network conditions and other intervening application changes also limit causal comparisons.',
    'Homepage mobile simulated lab measurements only; not all routes, interaction latency, field users, indexing/rankings, or payment readiness.',
    'Overall 50% improvement criterion is not evaluated because aggregate versus per-metric interpretation remains unresolved.',
  ],
};
fs.writeFileSync(path.join(directory, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`);
console.log(JSON.stringify({ directory, comparisons, validation: summary.validation, environmentComparison: summary.environmentComparison }, null, 2));
