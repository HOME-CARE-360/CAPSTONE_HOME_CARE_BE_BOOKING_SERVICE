import { Module } from '@nestjs/common';

import { CommonModule } from 'libs/common/src';
import { ConfigModule } from 'libs/common/src/modules/config.module';
import { JwtModule } from '@nestjs/jwt';
import { BookingsController } from './booking.controller';
import { BookingsService } from './booking.service';
import { BookingRepository } from './booking.repo';

@Module({
  imports: [CommonModule, ConfigModule, JwtModule],
  controllers: [BookingsController],
  providers: [BookingsService, BookingRepository],
})
export class ManagersModule { }
