const router = require('express').Router()
const proxy = require('http-proxy-middleware')

router.use(
  '/',
  proxy({
    target: process.env.BONSAI_URL || 'http://localhost:9200',
    changeOrigin: true,
    auth: `${process.env.BONSAI_USERNAME}:${process.env.BONSAI_PASSWORD}`,
    pathRewrite: {'^/api/es': process.env.BONSAI_URL || 'http://localhost:9200'}
  })
)

module.exports = router
