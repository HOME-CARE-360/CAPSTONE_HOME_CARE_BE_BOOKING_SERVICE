import { RpcException } from '@nestjs/microservices';

export const StaffNotFoundOrNotBelongToProviderException = new RpcException({
    message: 'Error.StaffNotFoundOrNotBelongToProvider',
    path: ['staffId'],
});
