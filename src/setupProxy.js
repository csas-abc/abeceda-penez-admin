const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    console.log('REGISTER PROXY');
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://localhost:4000',
            changeOrigin: true,
            pathRewrite: {
                "^/api": "/"
            }
        })
    );
};
