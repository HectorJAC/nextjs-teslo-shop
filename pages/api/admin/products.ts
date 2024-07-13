import { database } from '@/database';
import { IProduct } from '@/interfaces';
import { Product } from '@/models';
import { isValidObjectId } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config(process.env.CLOUDINARY_URL || '');

type Data = 
| { message: string }
| IProduct[]
| IProduct

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'GET':
            return getProducts(req, res);
        case 'PUT':
            return updateProduct(req, res);
        case 'POST':
            return createProduct(req, res);
        default:
            res.status(400).json({ message: 'Bad Request' });
    };
};

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    await database.connect();

    const products = await Product.find().sort({ title: 'asc' }).lean();

    await database.disconnect();

    const updatedProducts = products.map((product) => {
        product.images = product.images.map((image) => {
            return image.includes('http') ? image : `${process.env.HOST_NAME}/products/${image}`;
        });
        return product;
    });

    res.status(200).json(updatedProducts);
};

const updateProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { _id = '', images = [] } = req.body as IProduct;

    if (!isValidObjectId(_id)) {
        return res.status(400).json({ message: 'ID invalido' });
    };

    if (images.length < 2) {
        return res.status(400).json({ message: 'Debe subir al menos dos imagenes' });
    };

    try {
        await database.connect();

        const product = await Product.findById(_id);
        if (!product) {
            await database.disconnect();
            return res.status(400).json({ message: 'No existe un producto con ese ID' });
        };

        product.images.forEach(async (image) => {
            if (!images.includes(image)) {
                const [fileId, extension] = image.substring(image.lastIndexOf('/') + 1).split('.');
                await cloudinary.api.delete_resources([fileId]);
            }
        });

        await product.updateOne(req.body);
        await database.disconnect();

        return res.status(200).json(product);
    } catch (error) {
        console.log(error);
        await database.disconnect();
        return res.status(400).json({ message: 'Revisar logs del servidor' });
    };
};

const createProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { images = [] } = req.body as IProduct;

    if (images.length < 2) {
        return res.status(400).json({ message: 'Debe subir al menos dos imagenes' });
    };

    try {
        await database.connect();
        const productInDB = await Product.findOne({ slug: req.body.slug});
        if (productInDB) {
            await database.disconnect();
            return res.status(400).json({ message: 'Ya existe un producto con ese slug' });
        };

        const product = new Product(req.body);
        await product.save();

        await database.disconnect();

        res.status(201).json(product);
    } catch (error) {
        console.log(error);
        await database.disconnect();
        return res.status(400).json({ message: 'Revisar logs del servidor' });
    }
};

