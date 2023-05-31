'use strict'

import fp from 'fastify-plugin';
import { readFile } from 'fs/promises'

async function fastifySwaggerUi (fastify, opts) {
  fastify.decorate('swaggerCSP', require('../static/csp.json'))

  fastify.register(require('../lib/routes'), {
    prefix: opts.routePrefix || '/docs',
    uiConfig: opts.uiConfig || {},
    initOAuth: opts.initOAuth || {},
    hooks: opts.uiHooks,
    theme: opts.theme || {},
    logo: opts.logo || { type: 'image/svg+xml', content: await readFile(require.resolve('../static/logo.svg')) },
    ...opts
  })
}

module.exports = fp(fastifySwaggerUi, {
  fastify: '4.x',
  name: '@fastify/swagger-ui',
  dependencies: ['@fastify/swagger']
})
module.exports.default = fastifySwaggerUi
module.exports.fastifySwaggerUi = fastifySwaggerUi
