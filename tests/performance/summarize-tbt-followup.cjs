// node tests/performance/summarize-tbt-followup.cjs [evidence-directory]
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const directory = process.argv[2] || 'tests/performance/2026-11-10-tbt-followup';
const read = file => JSON.parse(fs.readFileSync(path.join(directory, file), 'utf8'));
const environment = read('environment.json');
const median = values => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
const metrics = {
  FCP: { audit: 'first-contentful-paint', targetExclusive: 2000 },
  LCP: { audit: 'largest-contentful-paint', targetExclusive: 2500 },
  TBT: { audit: 'total-blocking-time', targetExclusive: 200 },
  'Speed Index': { audit: 'speed-index', targetExclusive: 3400 },
};
let settings;
const phases = {};
for (const phase of ['before', 'after']) {
  const manifest = read(`${phase}/asset-manifest.json`);
  const entry = manifest.entrypoints.find(item => item.endsWith('.js'));
  const runs = [];
  for (let number = 1; number <= 5; number++) {
    const report = read(`${phase}/run-${number}.report.json`);
    assert.ok(!report.runtimeError, `${phase} run ${number} runtime error`);
    if (settings) assert.deepEqual(report.configSettings, settings, 'Full settings must match in both phases');
    else settings = report.configSettings;
    assert.equal(report.requestedUrl, 'http://127.0.0.1:4173/');
    const requests = report.audits['network-requests'].details.items;
    assert.ok(requests.some(item => item.url.endsWith(`/${entry}`)), `${phase} run ${number} entry mismatch`);
    const values = Object.fromEntries(Object.entries(metrics).map(([name, definition]) => [name, report.audits[definition.audit].numericValue]));
    Object.values(values).forEach(value => assert.ok(Number.isFinite(value), 'Every timing must be numeric'));
    runs.push({
      run: number, reportJson: `${phase}/run-${number}.report.json`, reportHtml: `${phase}/run-${number}.report.html`,
      fetchTime: report.fetchTime, ...values, SEO: report.categories.seo.score * 100,
      cls: report.audits['cumulative-layout-shift'].numericValue,
      warnings: report.runWarnings, benchmarkIndex: report.environment.benchmarkIndex,
      scriptBytes: requests.filter(item => item.resourceType === 'Script').reduce((sum, item) => sum + item.resourceSize, 0),
      initialChunkRequests: requests.filter(item => /\.chunk\.js$/.test(item.url)).map(item => item.url),
    });
  }
  phases[phase] = {
    entry, runs, startupBundle: read(`${phase}/startup-bundle.json`),
    metrics: Object.fromEntries([...Object.keys(metrics), 'SEO'].map(name => {
      const values = runs.map(run => run[name]);
      const targetMet = value => name === 'SEO' ? value >= 90 && value <= 100 : value < metrics[name].targetExclusive;
      return [name, { median: median(values), min: Math.min(...values), max: Math.max(...values), medianMeetsTarget: targetMet(median(values)), runsMeetingTarget: values.filter(targetMet).length }];
    })),
  };
}
const summary = {
  generatedAtUtc: new Date().toISOString(), url: 'http://127.0.0.1:4173/',
  scope: environment.scope || 'Controlled local production experiment. The earlier deployed 413ms median is retained separately; public results require deployment and a fresh hosted audit.',
  environment, lighthouseVersion: '12.8.2', settings,
  aggregation: 'Independent numeric median of all five runs in each phase; timings in ms; no reports discarded.',
  ...phases,
  tbtReductionPercent: (1 - phases.after.metrics.TBT.median / phases.before.metrics.TBT.median) * 100,
  allFiveMetricTargetsMet: Object.values(phases.after.metrics).every(metric => metric.medianMeetsTarget),
  everyRunMeetsEveryTarget: Object.values(phases.after.metrics).every(metric => metric.runsMeetingTarget === 5),
  startupJavaScriptGzipReductionPercent: (1 - phases.after.startupBundle.gzipBytes / phases.before.startupBundle.gzipBytes) * 100,
  warningsRetained: Object.fromEntries(Object.entries(phases).map(([phase, value]) => [phase, value.runs.reduce((sum, run) => sum + run.warnings.length, 0)])),
};
fs.writeFileSync(path.join(directory, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`);
console.log(JSON.stringify({ allFiveMetricTargetsMet: summary.allFiveMetricTargetsMet, everyRunMeetsEveryTarget: summary.everyRunMeetsEveryTarget, before: phases.before.metrics, after: phases.after.metrics, tbtReductionPercent: summary.tbtReductionPercent, warningsRetained: summary.warningsRetained }, null, 2));
