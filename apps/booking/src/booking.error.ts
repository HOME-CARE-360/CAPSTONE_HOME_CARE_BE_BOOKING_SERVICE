import {
    UnprocessableEntityException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';



export const ServiceRequestNotFoundException = new RpcException(
    new UnprocessableEntityException([
        { message: 'Error.ServiceRequestNotFound', path: ['id'] },
    ])
);

export const ServiceRequestInvalidStatusException = new RpcException(
    new UnprocessableEntityException([
        {
            message: 'Error.ServiceRequestInProgress',
            path: ['status'],
        },
    ])
);
export const BookingNotFoundOrNotBelongToProviderException = new RpcException(
    new UnprocessableEntityException([
        {
            message: 'Error.BookingNotFoundOrNotBelongToProvider',
            path: ['bookingId'],
        },
    ])
);
export const UserInvalidRoleException = new RpcException(
    new UnprocessableEntityException([
        {
            message: 'Error.UserMustBeCustomerOrProvider',
            path: ['user'],
        },
    ])
);
export const BuildWalletBalanceInsufficientException = (min: number) =>
    new RpcException(
        new UnprocessableEntityException([
            { message: 'Error.WalletBalanceInsufficient', path: ['wallet', 'balance'], meta: { min } },
        ])
    );