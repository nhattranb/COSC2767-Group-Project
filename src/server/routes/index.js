const router = require('express').Router();
const apiRoutes = require('./api');

const keys = require('../config/keys');
const { apiURL } = keys.app;

const api = `/${apiURL}`;
const Prometheus = require('prom-client');
const register = new Prometheus.Registry();


// prometheus metrics.yaml

register.setDefaultLabels({
    app: 'rmit-app'
})
Prometheus.collectDefaultMetrics({register})

const http_request_counter = new Prometheus.Counter({
    name: 'http_request_count',
    help: 'Count of HTTP requests made to my app',
    labelNames: ['method', 'route', 'statusCode'],
});

const http_request_duration = new Prometheus.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 0.5, 1, 2, 5] // buckets in seconds
});

const active_connections = new Prometheus.Gauge({
    name: 'nodejs_active_connections',
    help: 'Number of active connections'
});

const failed_requests = new Prometheus.Counter({
    name: 'nodejs_failed_requests_total',
    help: 'Total number of failed requests',
    labelNames: ['method', 'route', 'error_code']
});

const memory_usage = new Prometheus.Gauge({
    name: 'nodejs_memory_usage_bytes',
    help: 'Memory usage in bytes'
});

register.registerMetric(http_request_counter);
register.registerMetric(http_request_duration);
register.registerMetric(active_connections);
register.registerMetric(failed_requests);
register.registerMetric(memory_usage);


router.get('/metrics', function(req, res)
{
    res.setHeader('Content-Type',register.contentType)

    register.metrics().then(data => res.status(200).send(data))
});

router.use(function(req, res, next)
{
    // Increment active connections
    active_connections.inc();

    // Track request duration
    const start = Date.now();

    // Track end of request
    res.on('finish', () => {
        const duration = Date.now() - start;
        http_request_duration
            .labels(req.method, req.originalUrl, res.statusCode)
            .observe(duration / 1000); // Convert to seconds

        // Decrement active connections
        active_connections.dec();

        // Track failed requests (status >= 400)
        if (res.statusCode >= 400) {
            failed_requests
                .labels(req.method, req.originalUrl, res.statusCode)
                .inc();
        }

        // Your existing counter
        http_request_counter
            .labels({ method: req.method, route: req.originalUrl, statusCode: res.statusCode })
            .inc();
    });

    next();
});

// api routes
router.use(api, apiRoutes);
router.use(api, (req, res) => res.status(404).json('No API route found'));

module.exports = router;
