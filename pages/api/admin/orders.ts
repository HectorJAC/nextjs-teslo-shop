import { database } from '@/database';
import { IOrder } from '@/interfaces';
import { Order } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = 
| { message: string}
| IOrder[]

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'GET':
            return getOrders(req, res);
    
        default:
            res.status(400).json({ message: 'Bad Request' });
    };
};

const getOrders = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    await database.connect();

    const orders = await Order.find()
        .sort({ createdAt: 'desc' })
        .populate('user', 'name email')
        .lean();

    await database.disconnect();
    return res.status(200).json(orders);
};
