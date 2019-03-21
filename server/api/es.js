const router = require('express').Router()
const proxy = require('http-proxy-middleware')

const filter = (pathName, req) => req.method === 'GET' || req.method === 'POST'

router.use(
  '/',
  proxy(filter, {
    target: process.env.BONSAI_URL || 'http://localhost:9200',
    changeOrigin: true,
    auth: `${process.env.BONSAI_USERNAME}:${process.env.BONSAI_PASSWORD}`,
    pathRewrite: {
      '^/api/es': process.env.BONSAI_URL || 'http://localhost:9200'
    }
  })
)

router.use((req, res) => {
  res.set('Allow', 'GET')
  res.status(405).send("Method Not Allowed: Use 'GET'")
})

module.exports = router
