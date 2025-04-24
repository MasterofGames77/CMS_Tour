// Performance monitoring utility class for tracking execution times and metrics
class PerformanceMonitor {
  // Initialize metrics storage using Map for efficient key-value operations
  constructor() {
    this.metrics = new Map();
  }

  // Start tracking execution time for a given operation label
  start(label) {
    this.metrics.set(label, {
      startTime: process.hrtime(), // Capture high-resolution timestamp
      count: (this.metrics.get(label)?.count || 0) + 1 // Increment operation count
    });
  }

  // End tracking and calculate duration for a given operation label
  end(label) {
    const metric = this.metrics.get(label);
    if (!metric) return null; // Return null if no matching start time found

    // Calculate duration in milliseconds using high-resolution time
    const [seconds, nanoseconds] = process.hrtime(metric.startTime);
    const duration = seconds * 1000 + nanoseconds / 1000000; // Convert to milliseconds

    // Update metrics with total time and average time calculations
    this.metrics.set(label, {
      ...metric,
      totalTime: (metric.totalTime || 0) + duration, // Accumulate total execution time
      avgTime: ((metric.totalTime || 0) + duration) / metric.count // Calculate average time per operation
    });

    return duration; // Return the duration of this specific operation
  }

  // Get all collected metrics as a plain object
  getMetrics() {
    return Object.fromEntries(this.metrics); // Convert Map to plain object for easier serialization
  }

  // Reset all collected metrics
  reset() {
    this.metrics.clear(); // Clear all stored metrics
  }
}

// Export a singleton instance of the PerformanceMonitor
module.exports = new PerformanceMonitor(); 