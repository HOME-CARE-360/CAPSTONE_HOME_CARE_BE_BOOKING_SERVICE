import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RabbitService {
    private readonly log = new Logger(RabbitService.name);
    constructor(
        @Inject('RMQ_MAIN') private mainClient: ClientProxy,
        @Inject('RMQ_RETRY') private retryClient: ClientProxy,
    ) { }

    emit(event: string, payload: any) {
        this.mainClient.emit(event, payload);
    }

    retry(event: string, payload: any, retryCount = 0, maxRetry = 3) {
        if (retryCount >= maxRetry) {
            this.log.warn(`Exceeded retryCount ${maxRetry} – DEAD message`);
            return;
        }
        this.retryClient.emit(event, { ...payload, retryCount: retryCount + 1 });
    }
}
