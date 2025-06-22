import { Module } from '@nestjs/common';

import { CommonModule } from 'libs/common/src';
import { ConfigModule } from 'libs/common/src/modules/config.module';
import { JwtModule } from '@nestjs/jwt';
import { BookingsController } from './booking.controller';
import { BookingsService } from './booking.service';
import { BookingRepository } from './booking.repo';
import { PAYMENT_SERVICE } from 'libs/common/src/constants/service-name.constant';
import { RawTcpClientService } from 'libs/common/src/tcp/raw-tcp-client.service';

@Module({
  imports: [CommonModule, ConfigModule, JwtModule],
  controllers: [BookingsController],
  providers: [BookingsService, BookingRepository,
    {
      provide: PAYMENT_SERVICE,
      useFactory: () => {
        const host = process.env.PAYMENT_HOST || 'localhost';
        const port = parseInt(process.env.PAYMENT_TCP_PORT || '4001');
        return new RawTcpClientService(host, port);
      },
    }
  ],
})
export class BookingsModule { }
