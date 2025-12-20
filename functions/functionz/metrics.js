const counters = {};

function incrementCounter(name, label) {
  if (!counters[name]) {
    counters[name] = { total: 0, labels: {}, updatedAt: null };
  }

  const metric = counters[name];
  metric.total += 1;
  if (label) {
    metric.labels[label] = (metric.labels[label] || 0) + 1;
  }
  metric.updatedAt = new Date().toISOString();
}

function getMetricsSnapshot() {
  return {
    counters,
    lastUpdated: Object.values(counters).reduce((latest, metric) => {
      if (!metric.updatedAt) return latest;
      if (!latest || new Date(metric.updatedAt) > new Date(latest)) return metric.updatedAt;
      return latest;
    }, null),
  };
}

module.exports = {
  incrementCounter,
  getMetricsSnapshot,
};
