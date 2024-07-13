import { database } from '@/database';
import { User } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { jwt } from '../../../utils';

type Data = 
| {message: string}
| {
    token: string,
    user: {
        email: string,
        name: string,
        role: string
    }
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'POST':
            return loginUser(req, res);
        default:
            res.status(400).json({ message: 'Invalid method' });
    };
};

const loginUser = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { email = '', password = '' } = req.body;

    await database.connect();
    const user = await User.findOne({email});
    await database.disconnect();

    if (!user) {
        return res.status(400).json({ message: 'Email o contraseña incorrectos' });
    };

    if (!bcrypt.compareSync(password, user.password!)) {
        return res.status(400).json({ message: 'Email o contraseña incorrectos' });
    };

    const { name, role } = user;
    const token = jwt.signToken(user._id, email);

    return res.status(200).json({
        token,
        user: {
            email,
            name,
            role
        }
    });
};
