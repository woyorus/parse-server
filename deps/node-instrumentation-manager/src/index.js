const drivers = require('./drivers/index');
const genBuckets = require('./genBuckets');
const http = require('http');

const metricsPath = '/varz';
const healthCheckPath = '/healthz';

function InstrumentationManager(driver, disableDefaultMetrics = false) {
  this.driver = driver;
  this.server = null;
  this.healthy = false;

  if (disableDefaultMetrics === true) {
    this.driver.disableDefaultMetrics();
  }
}

InstrumentationManager.prototype.setHealthy = function(value) {
  this.healthy = value;
};

InstrumentationManager.prototype.createCounter = function(metricName, metricHelp, labels) {
  return this.driver.createCounter(metricName, metricHelp, labels);
};

InstrumentationManager.prototype.createHistogram = function(metricName, metricHelp, labelsOrConf, conf) {
  return this.driver.createHistogram(metricName, metricHelp, labelsOrConf, conf);
};

InstrumentationManager.prototype.serve = function(port = 9090) {
  const header = { 'Content-Type': 'text/plain' };
  this.server = http.createServer((req, res) => {
    switch (req.url) {
    case metricsPath:
      res.writeHead(200, header);
      res.end(this.driver.getMetrics());
      break;

    case healthCheckPath:
      if (this.healthy === true) {
        res.writeHead(200, header);
        res.end('OK');
      } else {
        res.writeHead(503, header);
        res.end('Service unavailable');
      }
      break;

    default:
      res.writeHead(404, header);
      res.end('Not Found');
      break;
    }
  });

  this.server.listen(port, function() {
    console.log(` [*] serving metrics at http://0.0.0.0:${port}${metricsPath}`);
  });
};

let sharedManager;

module.exports = Object.assign({}, {
  InstrumentationManager,
  drivers,
  setSharedManager: function(manager) {
    sharedManager = manager;
  },
  sharedManager: function() {
    return sharedManager;
  },
}, genBuckets);
