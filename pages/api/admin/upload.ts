import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { IncomingForm, File } from 'formidable';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config(process.env.CLOUDINARY_URL || '');

type Data = {
    message: string;
};

export const config = {
    api: {
        bodyParser: false
    }
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'POST':
            return uploadFile(req, res); ;
        default:
            return res.status(200).json({ message: 'Bad Request' });
    }
};

const saveFile = async (file: formidable.File):Promise<string> => {
    // const data = fs.readFileSync(file.filepath);
    // fs.writeFileSync(`./public/${file.originalFilename}`, data);
    // fs.unlinkSync(file.filepath);
    // return;

    const data = cloudinary.uploader.upload(file.filepath, {folder: '/public/products'});
    return (await data).secure_url;
};

const parseFiles = async (req: NextApiRequest):Promise<string> => {
    return new Promise((resolve, reject) => {
        const form = new IncomingForm();
        form.parse(req, async(err, fields, files) => {
        
        if (err) {
            return reject(err);
        }

        if (!files.file) {
            return reject(new Error('Missing required parameter - file'));
          }
    
          const fileList = Array.isArray(files.file) ? files.file : [files.file];
          const filePaths = await Promise.all(fileList.map(file => saveFile(file)));
          resolve(filePaths[0]);
        })
    })
};

const uploadFile = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const imageUrl = await parseFiles(req)    

    return res.status(200).json({ message: imageUrl });
};

