// libs/common/src/tcp/raw-tcp-client.service.ts
import { Injectable } from '@nestjs/common';
import * as net from 'net';

@Injectable()
export class RawTcpClientService {
    constructor(
        private readonly host: string,
        private readonly port: number,
        private readonly timeout = 5000,
    ) { }

    send(message: object): Promise<any> {
        return new Promise((resolve, reject) => {
            const client = new net.Socket();
            const dataString = JSON.stringify(message) + '\n';
            let buffer = '';

            client.connect(this.port, this.host, () => {
                client.write(dataString);
            });

            client.setEncoding('utf-8');

            client.on('data', (chunk) => {
                buffer += chunk.toString();
                if (buffer.includes('\n')) {
                    try {
                        const response = JSON.parse(buffer.trim());
                        resolve(response);
                        client.destroy();
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    } catch (err) {
                        reject(new Error('Invalid response from server'));
                        client.destroy();
                    }
                }
            });

            client.on('error', (err) => {
                reject(err);
                client.destroy();
            });

            client.setTimeout(this.timeout, () => {
                reject(new Error('TCP request timed out'));
                client.destroy();
            });
        });
    }
}
