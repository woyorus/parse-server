const instrumentation = require('../src/index');

const manager = new instrumentation.InstrumentationManager(
    new instrumentation.drivers.Prometheus(),
    true
);

const c = manager.createCounter('requests', 'requests in', ['path']);

setInterval(() => c.inc({ path: '/no' }), 2000);

const h = manager.createHistogram(
    'latency',
    'ms',
    ['path'],
    { buckets: instrumentation.linearBuckets(0, 5, 20).map(Math.round) }
);

setInterval(() => {
  h.observe({ path: '/yes' }, Math.floor(Math.random() * 100));
}, 3000);

setTimeout(() => manager.setHealthy(true), 5000);

manager.serve();
