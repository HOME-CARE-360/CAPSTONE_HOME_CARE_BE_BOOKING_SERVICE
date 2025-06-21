import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedAccessException } from '../errors/share-auth.error';


@Injectable()
export class PaymentAPIKeyGuard implements CanActivate {
    constructor(private readonly configService: ConfigService) { }
    canActivate(
        context: ExecutionContext,
    ): boolean {
        const request = context.switchToHttp().getRequest();
        const xAPIKey = request.headers['Authorization']?.split(' ')[1]
        if (xAPIKey !== this.configService.get("PAYMENT_API_KEY")) {
            throw UnauthorizedAccessException
        }
        return true
    }
}