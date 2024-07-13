import { Product, User } from '../../models';
import { database, seedDatabase } from '../../database';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    name: string
}

export default async function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    if (process.env.NODE_ENV === 'production') {
        return res.status(400).json({ name: 'No tiene acceso a este servicio' });
    }

    await database.connect();

    await User.deleteMany(); // Solo en development
    await User.insertMany(seedDatabase.initialData.users);

    await Product.deleteMany(); // Solo en development
    await Product.insertMany(seedDatabase.initialData.products);

    await database.disconnect();

    res.status(200).json({ name: 'Proceso realizado correctamente' });
}