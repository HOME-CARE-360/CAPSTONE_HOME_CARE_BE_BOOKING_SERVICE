import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { Transport } from '@nestjs/microservices';
import { BookingsModule } from './booking.module';

async function bootstrap() {
  const app = await NestFactory.create(BookingsModule);
  const configService = app.get(ConfigService)
  app.enableCors({});

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: "0.0.0.0",
      port: configService.get("BOOKING_TCP_PORT")

    }
  })
  await app.startAllMicroservices()
  await app.listen(configService.get("BOOKING_HTTP_PORT") as string, "0.0.0.0");
  console.log(`🚀 App listening on port ${process.env.BOOKING_HTTP_PORT as string}`);
}
bootstrap();


