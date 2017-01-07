class AbstractDriver {
  createCounter(name, help, labels) {
    const counter = this._createDriverCounter(name, help, labels);
    return this._wrapCounter(counter);
  }

  createHistogram(name, help, labelsOrConf, conf) {
    const hist = this._createDriverHistogram(name, help, labelsOrConf, conf);
    return this._wrapHistogram(hist);
  }

  getMetrics() {
    throwNotImpl();
  }

  disableDefaultMetrics() {
    throwNotImpl();
  }

  _wrapCounter(counter) {
    return {
      inc: (labels, value) => this._incrementCounter(counter, labels, value),
    };
  }

  _createDriverCounter(name, help, labels) {
    throwNotImpl();
  }

  _incrementCounter(counter, labels, value) {
    throwNotImpl();
  }

  _wrapHistogram(hist) {
    return {
      observe: (labels, value) => this._observeHistogram(hist, labels, value),
    };
  }

  _createDriverHistogram(name, help, labelsOrConf, conf) {
    throwNotImpl();
  }

  _observeHistogram(hist, labels, value) {
    throwNotImpl();
  }
}

function throwNotImpl() {
  throw new Error('not implemented');
}

module.exports = AbstractDriver;
