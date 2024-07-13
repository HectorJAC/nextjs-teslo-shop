import { database } from '@/database';
import { IOrder, IUser } from '@/interfaces';
import { Product, Order } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

type Data = 
| {message: string}
| IOrder;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'POST':
            return createOrder(req, res);
        default:
            return res.status(400).json({ message: 'Bad request' });
    }
}

const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { orderItems, total } = req.body as IOrder;

    const token:any = await getToken({req});

    if (!token) {
        return res.status(401).json({ message: 'Debe estar autenticado' });
    };

    const productsId = orderItems.map((p) => p._id);
    
    await database.connect();

    const dbProducts = await Product.find({_id: {$in: productsId}});
    try {
        const subTotal = orderItems.reduce((prev, current) => {
            const currentPrice = dbProducts.find((p) => p.id === current._id)!.price;
            if (!currentPrice) {
                throw new Error('Producto no encontrado');
            }

            return (currentPrice * current.quantity) + prev
        }, 0);

        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
        const backendTotal = subTotal * (taxRate + 1);

        if (total !== backendTotal) {
            throw new Error('Total no cuadra con el monto');
        };

        const userId = token.user._id;
        const newOrder = new Order({
            ...req.body,
            isPaid: false,
            user: userId,
        });
        newOrder.total = Math.round(newOrder.total * 100) / 100;

        await newOrder.save();
        await database.disconnect();
        return res.status(201).json(newOrder);

    } catch (error:any) {
        await database.disconnect();
        console.error(error);
        res.status(400).json({ message: error.message || 'Error al procesar la orden, revisar logs del servidor' });
    };

    return res.status(201).json(req.body);
}
