import { UnauthorizedException, ForbiddenException } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

export const UnauthorizedAccessException = new RpcException(
    new UnauthorizedException('Unauthorized access'),
);

export const InvalidAccessTokenException = new RpcException(
    new UnauthorizedException('Invalid access token'),
);

export const MissingAccessTokenException = new RpcException(
    new UnauthorizedException('Access token is missing'),
);

export const ForbiddenExceptionRpc = new RpcException(
    new ForbiddenException('Access to this resource is forbidden'),
);
