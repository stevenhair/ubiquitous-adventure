# ubiquitous-adventure
Reproduction of a Rascal bug: https://github.com/guidesmiths/rascal/issues/153

## The bug

This demonstrates a bug where you cannot override a subscription queue. Even if you provide the queue in the overrides,
the subscription will still watch the original queue.

## The reproduction

1. Run a RabbitMQ instance on localhost:5672 (the easiest way to do this is using Docker:
   `docker run -p '5672:5672' -it rabbitmq`)
2. Run the reproduction code: `npm start`

The desired result is that you should see "Received message: published on 2" printed to standard out, but you'll
actually see "Received message: published on 1". This indicates that the message was published to "queue1" rather than
"queue2".
