// src/common/guards/verified-provider.guard.ts
import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { REQUEST_USER_KEY } from '../constants/auth.constant';
import { AccessTokenPayload } from '../types/jwt.type';
import { ProviderNotVerifiedException, ServiceProviderNotFoundException } from '../errors/share-provider.error';

@Injectable()
export class VerifiedProviderGuard implements CanActivate {
    constructor(private readonly prisma: PrismaService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();


        const user = req[REQUEST_USER_KEY] as AccessTokenPayload;
        const providerId = user.providerId;

        if (!providerId) {
            throw ServiceProviderNotFoundException;
        }

        const provider = await this.prisma.serviceProvider.findUnique({
            where: { id: providerId },
            select: { verificationStatus: true },
        });

        if (!provider) {
            throw ServiceProviderNotFoundException;
        }
        if (!provider.verificationStatus) {
            throw ProviderNotVerifiedException;
        }

        return true;
    }
}
