import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '../../../../../helpers/prismaConnect'
import AWS from 'aws-sdk'

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if(!Array.isArray(req.query.path))return res.status(400).json({ message: "Invaid params!" })
    const objectKey = `media/audio/${req.query.path.join('/')}`
    const s3 = new AWS.S3({
        accessKeyId: process.env.S3_ACCESS_KEY ,
        secretAccessKey: process.env.S3_SECRET_KEY ,
        endpoint: 'http://127.0.0.1:9000' ,
        s3ForcePathStyle: true, // needed with minio?
        signatureVersion: 'v4'
    });

    const fileAttr = await s3.headObject({ Bucket: 'test', Key: objectKey }).promise()

    res.setHeader('Content-Type', fileAttr.ContentType)
    res.setHeader('Content-Length', fileAttr.ContentLength)
    if(req.headers.range){
        let range = req.headers.range;
        let bytes = range.replace(/bytes=/, '').split('-');
        let start = parseInt(bytes[0], 10);

        let total = fileAttr.ContentLength;
        let end = bytes[1] ? parseInt(bytes[1], 10) : total - 1;
        let chunksize = (end - start) + 1;

        res.writeHead(206, {
           'Content-Range'  : 'bytes ' + start + '-' + end + '/' + total,
           'Accept-Ranges'  : 'bytes',
           'Content-Length' : chunksize,
        });
        return s3.getObject({ Bucket: 'test', Key: objectKey, Range: `${req.headers.range}${fileAttr.ContentLength}` }).createReadStream().pipe(res)
    }
    s3.getObject({ Bucket: 'test', Key: objectKey }).createReadStream().pipe(res)
}

export const config = {
    api: {
        responseLimit: false,
    },
}