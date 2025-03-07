import { database } from '@/database';
import { User } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { jwt, validations } from '../../../utils';

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
            return registerUser(req, res);
        default:
            res.status(400).json({ message: 'Invalid method' });
    };
};

const registerUser = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { email = '', password = '', name = '' } = req.body as {
        email: string,
        password: string,
        name: string
    };

    if (password.length < 6) {
        return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
    };

    if (name.length < 2) {
        return res.status(400).json({ message: 'El nombre debe tener al menos 2 caracteres' });
    };

    if (password.length < 2) {
        return res.status(400).json({ message: 'El nombre debe tener al menos 2 caracteres' });
    };

    if (!validations.isValidEmail(email)) {
        return res.status(400).json({ message: 'El email no es valido' });
    };

    await database.connect();
    const user = await User.findOne({email});

    if (user) {
        return res.status(400).json({ message: 'El email ya está registrado' });
    };

    const newUser = new User({
        email: email.toLowerCase(),
        password: bcrypt.hashSync(password),
        role: 'client',
        name
    });

    try {
        await newUser.save({validateBeforeSave: true});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Revisar logs del servidor' });
    };

    const { _id, role } = newUser;
    const token = jwt.signToken(_id, email);

    return res.status(200).json({
        token,
        user: {
            email,
            name,
            role
        }
    });
};
