const client = require('prom-client');
const AbstractDriver = require('./AbstractDriver');

class PrometheusDriver extends AbstractDriver {
  getMetrics() {
    return client.register.metrics();
  }

  disableDefaultMetrics() {
    clearInterval(client.defaultMetrics());
    client.register.clear();
  }

  _createDriverCounter(name, help, labels) {
    return new client.Counter(name, help, labels);
  }

  _incrementCounter(counter, labels, value) {
    counter.inc(labels, value);
  }

  _createDriverHistogram(name, help, labelsOrConf, conf) {
    return new client.Histogram(name, help, labelsOrConf, conf);
  }

  _observeHistogram(hist, labels, value) {
    hist.observe(labels, value);
  }
}

module.exports = PrometheusDriver;
