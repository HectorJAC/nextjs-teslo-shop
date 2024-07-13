import { database } from '@/database';
import { Order, Product, User } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
    numberOfOrders: number;
    paidOrders: number;
    notPaidOrdes: number;
    numberOfClients: number;
    numberOfProducts: number;
    productsWithNoInventory: number;
    lowInventory: number;
};

export default async function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    await database.connect();

    const [
        numberOfOrders,
        paidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventory,
        lowInventory
    ] = await Promise.all([
        Order.countDocuments(),
        Order.find({ isPaid: true }).countDocuments(),
        User.find({ role: 'client' }).countDocuments(),
        Product.countDocuments(),
        Product.find({ inStock: 0 }).countDocuments(),
        Product.find({ inStock: { $lt: 10 } }).countDocuments(),
    ]);

    await database.disconnect();

    res.status(200).json({
        numberOfOrders,
        paidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventory,
        lowInventory,
        notPaidOrdes: numberOfOrders - paidOrders,
    });
};
