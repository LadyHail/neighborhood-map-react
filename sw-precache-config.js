module.exports = {
  staticFileGlobs: [
    './build/**/**.html',
    './build/static/**',
  ],
  dontCacheBustUrlsMatching: /\.\w{8}\./,
  swFilePath: './build/service-worker.js'
}