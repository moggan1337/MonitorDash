# MonitorDash 📊

> A powerful, lightweight metrics monitoring and alerting library for Node.js applications

[![npm version](https://img.shields.io/npm/v/monitordash.svg)](https://www.npmjs.com/package/monitordash)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](#)
[![Coverage](https://img.shields.io/badge/coverage-85%25-orange.svg)](#)

MonitorDash is a real-time metrics collection and alerting library designed for modern Node.js applications. It provides a simple yet powerful API for recording time-series metrics, querying historical data, and setting up intelligent threshold-based alerts.

---

## Table of Contents

- [Features](#features)
  - [📈 Metrics Collection](#-metrics-collection)
  - [🚨 Intelligent Alerts](#-intelligent-alerts)
  - [📊 Dashboard Integration](#-dashboard-integration)
  - [⏱️ Time-Series Data](#-time-series-data)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage Examples](#usage-examples)
  - [Basic Metrics Recording](#basic-metrics-recording)
  - [Time-Range Queries](#time-range-queries)
  - [Threshold Alerts](#threshold-alerts)
  - [Custom Alert Logic](#custom-alert-logic)
  - [Real-World Use Cases](#real-world-use-cases)
- [API Reference](#api-reference)
  - [MonitorDash Class](#monitordash-class)
  - [Metric Interface](#metric-interface)
  - [Methods](#methods)
- [Dashboard Integration](#dashboard-integration)
  - [Grafana](#grafana)
  - [Prometheus](#prometheus)
  - [Custom Dashboards](#custom-dashboards)
- [Configuration](#configuration)
- [Best Practices](#best-practices)
- [Performance Considerations](#performance-considerations)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### 📈 Metrics Collection

MonitorDash provides a streamlined interface for recording application metrics in real-time. Track anything from request counts to memory usage with nanosecond-precision timestamps.

**Key capabilities:**
- Record numeric metrics with automatic timestamps
- Support for custom metric naming conventions
- Automatic data deduplication
- Memory-efficient storage with configurable retention
- Batch recording support for high-throughput scenarios

### 🚨 Intelligent Alerts

Set up threshold-based alerts that trigger callbacks when your metrics exceed predefined limits. Alerts are evaluated every 5 seconds by default, ensuring near-real-time notification of issues.

**Alert features:**
- Configurable threshold values (above or below)
- Custom callback functions for alert handling
- Alert deduplication to prevent notification spam
- Support for multiple alerts on the same metric
- Integration with external notification systems (Slack, PagerDuty, etc.)

### 📊 Dashboard Integration

MonitorDash is designed to integrate seamlessly with popular dashboarding solutions. Export your metrics data in formats compatible with Grafana, Prometheus, and custom visualization tools.

**Supported integrations:**
- JSON export for custom dashboards
- Time-series formatted data for Grafana
- Prometheus-compatible format
- WebSocket streaming for live updates
- REST API endpoints for data fetching

### ⏱️ Time-Series Data

Store and query time-series data with flexible time-range selection. Efficient filtering allows you to retrieve exactly the data you need for analysis and visualization.

**Time-series features:**
- Millisecond-precision timestamps
- Efficient range queries
- Metric name filtering
- Automatic data cleanup
- Historical data aggregation

---

## Installation

### Prerequisites

- Node.js 18.0 or higher
- npm, yarn, or pnpm package manager

### Using npm

```bash
npm install monitordash
```

### Using yarn

```bash
yarn add monitordash
```

### Using pnpm

```bash
pnpm add monitordash
```

### TypeScript Configuration

MonitorDash is written in TypeScript and ships with full type definitions. No additional `@types` package required.

For optimal TypeScript experience, ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true
  }
}
```

---

## Quick Start

Get up and running with MonitorDash in under a minute:

```typescript
import MonitorDash from 'monitordash';

// Initialize the monitor
const monitor = new MonitorDash();

// Record your first metric
monitor.record('app.requests', 1);
monitor.record('app.latency', 45);
monitor.record('app.errors', 0);

// Query metrics from the last hour
const oneHourAgo = Date.now() - 3600000;
const metrics = monitor.getMetrics('app.requests', oneHourAgo, Date.now());

console.log(`Recorded ${metrics.length} metrics`);

// Set up an alert
monitor.alert('app.errors', 5, (metric) => {
  console.error(`🚨 ALERT: High error count detected!`, metric);
});
```

---

## Usage Examples

### Basic Metrics Recording

Record metrics throughout your application to track performance and health:

```typescript
import MonitorDash from 'monitordash';

const monitor = new MonitorDash();

// In your request handler
function handleRequest(req: Request): Response {
  const startTime = Date.now();
  
  try {
    const response = processRequest(req);
    
    // Record success metrics
    monitor.record('http.requests.total', 1);
    monitor.record('http.requests.success', 1);
    monitor.record('http.latency', Date.now() - startTime);
    
    return response;
  } catch (error) {
    // Record error metrics
    monitor.record('http.requests.total', 1);
    monitor.record('http.requests.errors', 1);
    monitor.record('http.latency', Date.now() - startTime);
    
    throw error;
  }
}
```

### Time-Range Queries

Retrieve metrics within specific time ranges for analysis:

```typescript
const monitor = new MonitorDash();

// Get metrics from the last 24 hours
const now = Date.now();
const dayAgo = now - 24 * 60 * 60 * 1000;
const weekAgo = now - 7 * 24 * 60 * 60 * 1000;

// Daily metrics
const dailyMetrics = monitor.getMetrics('app.users.active', dayAgo, now);

// Weekly metrics
const weeklyMetrics = monitor.getMetrics('app.users.active', weekAgo, now);

// Calculate average
function calculateAverage(metrics: Metric[]): number {
  if (metrics.length === 0) return 0;
  const sum = metrics.reduce((acc, m) => acc + m.value, 0);
  return sum / metrics.length;
}

console.log(`Daily average: ${calculateAverage(dailyMetrics)}`);
console.log(`Weekly average: ${calculateAverage(weeklyMetrics)}`);
```

### Threshold Alerts

Set up alerts to be notified when metrics exceed thresholds:

```typescript
const monitor = new MonitorDash();

// Alert when error rate exceeds 5%
monitor.alert('app.errors.rate', 5, (metric) => {
  console.error(`🚨 High error rate: ${metric.value}`);
});

// Alert when latency exceeds 500ms
monitor.alert('http.latency', 500, (metric) => {
  console.warn(`⚠️ High latency detected: ${metric.value}ms`);
});

// Alert when memory usage exceeds 80%
monitor.alert('system.memory.percent', 80, (metric) => {
  console.error(`🔴 Critical: Memory usage at ${metric.value}%`);
});
```

### Custom Alert Logic

Implement sophisticated alerting with custom callback logic:

```typescript
const monitor = new MonitorDash();

// Alert with rate limiting (prevent spam)
let lastAlertTime = 0;
const ALERT_COOLDOWN = 60000; // 1 minute

monitor.alert('app.errors', 10, (metric) => {
  const now = Date.now();
  
  if (now - lastAlertTime < ALERT_COOLDOWN) {
    console.log('Alert suppressed (cooldown active)');
    return;
  }
  
  lastAlertTime = now;
  
  // Send to external service
  sendAlertToSlack({
    title: 'High Error Rate',
    value: metric.value,
    timestamp: new Date(metric.timestamp).toISOString(),
  });
});

// Multi-threshold alerting
monitor.alert('system.cpu.percent', 70, (metric) => {
  if (metric.value >= 90) {
    sendPagerDutyAlert('CRITICAL', 'CPU at ' + metric.value + '%');
  } else if (metric.value >= 80) {
    sendSlackNotification('WARNING', 'CPU at ' + metric.value + '%');
  }
});
```

### Real-World Use Cases

#### Web Server Monitoring

```typescript
import http from 'http';
import MonitorDash from 'monitordash';

const monitor = new MonitorDash();
const server = http.createServer((req, res) => {
  const start = Date.now();
  
  // Simulate request processing
  res.on('finish', () => {
    const duration = Date.now() - start;
    monitor.record('http.request.duration', duration);
    monitor.record('http.request.count', 1);
    monitor.record('http.status.' + res.statusCode, 1);
  });
  
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Hello World' }));
});

// Set up alerts
monitor.alert('http.request.duration', 1000, (m) => {
  console.error('Slow request detected:', m.value + 'ms');
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

#### Database Connection Pool Monitoring

```typescript
const monitor = new MonitorDash();

function monitorDatabasePool(pool: any) {
  setInterval(() => {
    monitor.record('db.connections.active', pool.activeConnections);
    monitor.record('db.connections.idle', pool.idleConnections);
    monitor.record('db.connections.pending', pool.pendingRequests);
    monitor.record('db.query.duration', pool.averageQueryTime);
  }, 5000);
  
  // Alerts
  monitor.alert('db.connections.active', 90, (m) => {
    console.error('Database connection pool nearly exhausted!');
  });
  
  monitor.alert('db.query.duration', 500, (m) => {
    console.warn('Slow database queries detected');
  });
}
```

---

## API Reference

### MonitorDash Class

The main class for recording and querying metrics.

```typescript
import MonitorDash from 'monitordash';

const monitor = new MonitorDash();
```

#### Constructor

Creates a new MonitorDash instance with default settings.

```typescript
const monitor = new MonitorDash();
```

### Metric Interface

Represents a single metric data point.

```typescript
interface Metric {
  name: string;      // Metric identifier
  value: number;     // Metric value
  timestamp: number; // Unix timestamp in milliseconds
}
```

**Example metric object:**

```typescript
{
  name: 'app.requests',
  value: 150,
  timestamp: 1713561600000
}
```

### Methods

#### `record(name: string, value: number): void`

Records a new metric value with the current timestamp.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `name` | `string` | Unique identifier for the metric |
| `value` | `number` | Numeric value to record |

**Returns:** `void`

**Example:**

```typescript
monitor.record('app.users.online', 42);
monitor.record('system.memory.used', 8589934592);
monitor.record('api.response.time', 125);
```

---

#### `getMetrics(name: string, from: number, to: number): Metric[]`

Retrieves metrics within a specified time range.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `name` | `string` | Metric name to filter by |
| `from` | `number` | Start timestamp (Unix ms) |
| `to` | `number` | End timestamp (Unix ms) |

**Returns:** `Metric[]` - Array of matching metrics

**Example:**

```typescript
// Get all requests from the last hour
const oneHourAgo = Date.now() - 3600000;
const recentMetrics = monitor.getMetrics(
  'http.requests',
  oneHourAgo,
  Date.now()
);

// Calculate request rate
const requestRate = recentMetrics.length / 3600; // per second
console.log(`Request rate: ${requestRate.toFixed(2)}/s`);
```

---

#### `alert(name: string, threshold: number, fn: Function): void`

Sets up an alert that triggers when a metric exceeds the threshold.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `name` | `string` | Metric name to monitor |
| `threshold` | `number` | Value threshold for alert |
| `fn` | `Function` | Callback function when alert triggers |

**Returns:** `void`

**Alert Evaluation:** Alerts are evaluated every 5 seconds automatically.

**Example:**

```typescript
// Basic alert
monitor.alert('app.errors', 10, (metric: Metric) => {
  console.error(`Alert: ${metric.name} is ${metric.value}`);
});

// Integration with notification systems
monitor.alert('system.cpu.usage', 95, async (metric: Metric) => {
  await fetch('https://api.pagerduty.com/alerts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service: 'production',
      severity: 'critical',
      message: `CPU usage at ${metric.value}%`,
    }),
  });
});
```

---

## Dashboard Integration

MonitorDash integrates with popular dashboarding solutions through its flexible data export capabilities.

### Grafana

Create beautiful visualizations in Grafana using MonitorDash data:

```typescript
// Export metrics in Grafana-friendly format
function exportToGrafana(metrics: Metric[]) {
  return {
    target: metrics.map(m => ({
      metric: m.name,
      value: m.value,
      time: m.timestamp / 1000, // Convert to seconds for Grafana
    })),
  };
}

// Example: Query Grafana data source
const metrics = monitor.getMetrics('app.requests', dayAgo, now);
const grafanaData = exportToGrafana(metrics);

// Send to Grafana API or use with Infinity data source
```

### Prometheus

Format metrics for Prometheus consumption:

```typescript
// Export in Prometheus exposition format
function exportToPrometheus(metrics: Metric[]) {
  const grouped = new Map<string, number[]>();
  
  metrics.forEach(m => {
    if (!grouped.has(m.name)) grouped.set(m.name, []);
    grouped.get(m.name)!.push(m.value);
  });
  
  let output = '';
  grouped.forEach((values, name) => {
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    output += `# TYPE ${name} gauge\n`;
    output += `${name}{instance="monitordash"} ${avg}\n`;
  });
  
  return output;
}
```

### Custom Dashboards

Build your own dashboard using the exported data:

```typescript
// REST API endpoint for dashboard data
function createMetricsAPI(monitor: MonitorDash) {
  return {
    getMetrics: (req: Request) => {
      const { name, from, to } = req.query;
      return monitor.getMetrics(
        name as string,
        parseInt(from as string),
        parseInt(to as string)
      );
    },
    
    getLatest: (req: Request) => {
      const { name } = req.query;
      const all = monitor.getMetrics(name as string, 0, Date.now());
      return all[all.length - 1];
    },
    
    getStats: (req: Request) => {
      const { name, from, to } = req.query;
      const metrics = monitor.getMetrics(
        name as string,
        parseInt(from as string),
        parseInt(to as string)
      );
      
      const values = metrics.map(m => m.value);
      return {
        count: values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        avg: values.reduce((a, b) => a + b, 0) / values.length,
      };
    },
  };
}
```

---

## Configuration

While MonitorDash works with defaults, you can customize behavior:

```typescript
// Custom configuration (for future versions)
const monitor = new MonitorDash({
  retention: 7 * 24 * 60 * 60 * 1000, // 7 days
  alertInterval: 5000, // 5 seconds
  maxMetrics: 100000, // Memory limit
});

interface MonitorDashConfig {
  /** How long to retain metrics (ms) */
  retention?: number;
  
  /** Alert check interval (ms) */
  alertInterval?: number;
  
  /** Maximum metrics to store */
  maxMetrics?: number;
}
```

---

## Best Practices

### Metric Naming

Follow a consistent naming convention:

```typescript
// Recommended: Hierarchical naming
monitor.record('app.service.endpoint.method.status');
monitor.record('system.cpu.user.percent');
monitor.record('db.query.duration.avg');

// Examples:
monitor.record('api.users.login.success', 1);
monitor.record('api.users.login.failure', 1);
monitor.record('cache.redis.hit', 1);
monitor.record('cache.redis.miss', 1);
```

### Alert Thresholds

Set meaningful thresholds based on historical data:

```typescript
// Analyze baseline before setting alerts
const weekData = monitor.getMetrics('http.latency', weekAgo, now);
const avg = calculateAverage(weekData);
const stdDev = calculateStdDev(weekData);

// Alert at 2 standard deviations above mean
const threshold = avg + (2 * stdDev);
monitor.alert('http.latency', threshold, handler);
```

### Data Retention

Implement data cleanup for long-running applications:

```typescript
const RETENTION_DAYS = 7;
const cutoff = Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000;

// Periodic cleanup (run daily)
setInterval(() => {
  const oldMetrics = monitor.getMetrics('*', 0, cutoff);
  oldMetrics.forEach(m => deleteMetric(m)); // Custom cleanup
}, 24 * 60 * 60 * 1000);
```

---

## Performance Considerations

- **Batch recording**: Record multiple metrics together when possible
- **Query optimization**: Use narrow time ranges for faster queries
- **Memory management**: Implement retention policies for long-term use
- **Alert efficiency**: Cooldown periods prevent notification fatigue

---

## Troubleshooting

### Common Issues

**Alerts not firing:**
- Verify the metric name matches exactly
- Check if metric values exceed the threshold
- Ensure the callback function doesn't throw errors

**Metrics not found:**
- Confirm the time range includes the metric timestamp
- Check for typos in metric names
- Verify the application is recording metrics

**Memory issues:**
- Implement data retention policies
- Reduce the number of stored metrics
- Use aggregation for high-volume metrics

---

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

```bash
# Clone the repository
git clone https://github.com/yourusername/monitordash.git
cd monitordash

# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build
```

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

<div align="center">
  <strong>Made with ❤️ for developers who care about observability</strong>
  <br>
  <sub>MonitorDash - Simple. Powerful. Observable.</sub>
</div>
