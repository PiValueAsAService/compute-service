import Fastify from 'fastify'
import 'dotenv/config'

const config = {
    listen: {
        host: process.env.SERVER__LISTEN__HOST,
        api: process.env.SERVER__LISTEN__API
    }
}

const fastify = Fastify({
    logger: true
})

const calculatePiValue = (size) => {
    let i = 1n;
    let x = 3n * (10n ** (BigInt(size) + 19n));
    let pi = x;
    while (x > 0) {
        x = x * i / ((i + 1n) * 4n);
        pi += x / (i + 2n);
        i += 2n;
    }

    return pi / (10n ** 20n);
}

fastify.get(
    '/api/v1/pi',
    {
        schema: {
            querystring: {
                type: 'object',
                properties: {
                    size: {
                        type: 'integer',
                        minimum: 1,
                        maximum: 100000,
                    }
                },
                required: ['size']
            }
        },
        handler: async (request, reply) => {
            reply.type('application/json').code(200)
            return {
                value: '3,' + calculatePiValue(request.query.size).toString().substring(1)
            }
        }
    }
)

fastify.get('/health', async (request, reply) => {
    reply.type('application/json').code(200)
    return { status: 'OK' }
})

fastify.listen({
    host: config.listen.host,
    port: config.listen.api
}, (err) => {
    if (err) throw err
})
