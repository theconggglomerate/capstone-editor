const router = require('express').Router()
const proxy = require('http-proxy-middleware')

router.use(
  '/',
  proxy({
    target: process.env.BONSAI_URL || 'http://localhost:9200',
    changeOrigin: true,
    ws: true,
    pathRewrite: {'^/api/es': ''}
  })
)

module.exports = router
