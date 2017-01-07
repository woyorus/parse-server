
function* bucketGenerator(start, factor, size, next) {
  yield start;
  for (let i = 0; i < size; ++i) {
    yield start = next(start, factor);
  }
}

module.exports.linearBuckets = function(start, width, size) {
  return [...bucketGenerator(start, width, size, (x, y) => x + y)];
};

module.exports.exponentialBuckets = function(start, width, size) {
  return [...bucketGenerator(start, width, size, (x, y) => x * y)];
};

