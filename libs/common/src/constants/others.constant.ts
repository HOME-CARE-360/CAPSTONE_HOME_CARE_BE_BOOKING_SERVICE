export const OrderBy = {
    Asc: 'asc',
    Desc: 'desc',
} as const

export const SortBy = {
    Price: 'price',
    CreatedAt: 'createdAt',
    Discount: 'discount',
} as const

export type OrderByType = (typeof OrderBy)[keyof typeof OrderBy]
export type SortByType = (typeof SortBy)[keyof typeof SortBy]
export const EVENTS = {
    PAYMENT_CREATE: 'payment.create',
    PAYMENT_SUCCESS: 'payment.success',
    READY_FOR_INSPECTION: 'request.ready',
};
