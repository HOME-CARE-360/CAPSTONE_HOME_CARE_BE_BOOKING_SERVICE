import { RpcException } from '@nestjs/microservices';

export const UserNotFoundException = new RpcException({
    message: 'Error.UserNotFound',
    path: 'code',
});
