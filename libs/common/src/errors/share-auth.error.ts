import { UnauthorizedException, ForbiddenException } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

export const UnauthorizedAccessException = new RpcException(
    new UnauthorizedException('Error.UnauthorizedAccess')
);
export const InvalidAccessTokenException = new RpcException(
    new UnauthorizedException('Error.InvalidAccessToken')
);
export const MissingAccessTokenException = new RpcException(
    new UnauthorizedException('Error.MissingAccessToken')
);
export const ForbiddenExceptionRpc = new RpcException(
    new ForbiddenException()
);

