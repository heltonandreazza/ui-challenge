//test our app in prouctiond mode
module.exports = {
    server: {
        baseDir: './dist',
        middleware: {
            1: require('connect-history-api-fallback')({ index: '/index.html', verbose: true })
        }
    }
}