import { Injectable } from "@nestjs/common";
import { PrismaService } from "../services/prisma.service";
import { WithdrawalStatus } from "@prisma/client";

@Injectable()
export class SharedWidthDrawRepository {
    constructor(private readonly prismaService: PrismaService) { }
    async findUnique({ id }: { id: number }) {
        return await this.prismaService.withdrawalRequest.findUnique({
            where: {
                id
            }
        })
    }

    async findMany() {
        return await this.prismaService.withdrawalRequest.findMany()
    }
    async findManyWithStatus() {
        return await this.prismaService.withdrawalRequest.findMany({
            where: {
                status: {
                    not: {

                        equals: WithdrawalStatus.COMPLETED
                    }
                }
            }
        })
    }
    async findWalletBalance(userId: number) {
        return await this.prismaService.user.findUnique({
            where: {
                id: userId
            }, include: {


                Wallet: true


            }
        })
    }
    async debitIfSufficient(userId: number, amount: number): Promise<boolean> {
        const res = await this.prismaService.wallet.updateMany({
            where: { userId, balance: { gte: amount } },
            data: { balance: { decrement: amount } },
        });
        return res.count === 1;
    }

    async credit(userId: number, amount: number): Promise<void> {
        await this.prismaService.wallet.update({
            where: { userId },
            data: { balance: { increment: amount } },
        });
    }
}