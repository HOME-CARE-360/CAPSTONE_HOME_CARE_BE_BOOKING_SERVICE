import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'RMQ_MAIN',
                transport: Transport.RMQ,
                options: {
                    urls: ['amqp://user:pass@rabbitmq.default.svc.cluster.local:5672'],
                    queue: 'homecare.main',
                    queueOptions: {
                        durable: true,
                        'x-dead-letter-exchange': 'homecare.retry.exchange',
                        'x-dead-letter-routing-key': 'homecare.retry',
                    },
                },
            },
            {
                name: 'RMQ_RETRY',
                transport: Transport.RMQ,
                options: {
                    urls: ['amqp://user:pass@rabbitmq.default.svc.cluster.local:5672'],
                    queue: 'homecare.retry',
                    queueOptions: {
                        durable: true,
                        'x-message-ttl': 10000,
                        'x-dead-letter-exchange': '',
                        'x-dead-letter-routing-key': 'homecare.main',
                    },
                },
            },
        ]),
    ],
    exports: ['RMQ_MAIN', 'RMQ_RETRY'],
})
export class RabbitMQModule { }
