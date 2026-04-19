# MonitorDash 📊

**Monitoring Dashboard** - Metrics, alerts, dashboards.

## Features

- **📈 Metrics** - Record metrics
- **⏱️ Time Series** - Historical data
- **🚨 Alerts** - Threshold alerts
- **📊 Dashboard** - Visualize data

## Installation

```bash
npm install monitordash
```

## Usage

```typescript
import { MonitorDash } from 'monitordash';

const monitor = new MonitorDash();

// Record metrics
monitor.record('requests', 150);
monitor.record('latency', 45);
monitor.record('errors', 2);

// Get metrics
const metrics = monitor.getMetrics('requests', Date.now() - 3600000, Date.now());

// Alert
monitor.alert('errors', 10, (metric) => {
  console.log('Too many errors!', metric);
});
```

## API

| Method | Description |
|--------|-------------|
| `record(name, value)` | Record a metric |
| `getMetrics(name, from, to)` | Get historical |
| `alert(name, threshold, fn)` | Set alert |

## License

MIT
