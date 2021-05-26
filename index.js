#!/usr/bin/env node

const { BrokerAsPromised: Broker } = require('rascal');

async function getBroker() {
    return Broker.create({
        vhosts: {
            '/': {
                connection: {
                    hostname: 'localhost',
                    port: 5672,
                    user: 'guest',
                    password: 'guest',
                    vhost: '/',
                    protocol: 'amqp',
                },
                queues: {
                    queue1: {
                        assert: true,
                        options: {
                            autoDelete: true,
                        },
                    },
                    queue2: {
                        assert: true,
                        options: {
                            autoDelete: true,
                        },
                    },
                },
            },
        },
        publications: {
            pub1: {
                vhost: '/',
                queue: 'queue1',
            },
            pub2: {
                vhost: '/',
                queue: 'queue2',
            },
        },
        subscriptions: {
            sub1: {
                vhost: '/',
                queue: 'queue1',
            },
        },
    });
}

async function go() {
    const broker = await getBroker();

    const subscription = await broker.subscribe('sub1', { queue: 'queue2'});
    subscription.on('message', (message, content, ackOrNack) => {
        console.log('Received message:', content.toString());
        ackOrNack();
    });

    await broker.publish('pub1', 'published on 1');
    await broker.publish('pub2', 'published on 2');
}

go().catch((e) => {
    console.error(e);
    process.exit(1);
});
