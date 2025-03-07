import { User } from "@/models";
import { database } from ".";
import bcrypt from 'bcryptjs'

export const checkUserEmailPassowrd = async (email: string, password: string) => {
    await database.connect();
    const user = await User.findOne({ email });
    await database.disconnect();

    if (!user) {
        return null;
    };

    if (!bcrypt.compareSync(password, user.password!)) {
        return null;
    };

    const { role, name, _id } = user;

    return {
        _id,
        email: email.toLocaleLowerCase(),
        role,
        name
    }
};

export const oAuthToDBUser = async (oAuthEmail: string, oAuthName: string) => {
    await database.connect();
    const user = await User.findOne({ email: oAuthEmail });

    if (user) {
        await database.disconnect();
        const { _id, name, email, role } = user;
        return { _id, name, email, role }
    };

    const newUser = new User({
        email: oAuthEmail,
        name: oAuthName,
        password: '@',
        role: 'client'
    });
    await newUser.save();
    await database.disconnect();

    const { _id, name, email, role } = newUser;
    return { _id, name, email, role };
};
