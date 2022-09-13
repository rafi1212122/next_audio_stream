import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '../../../../../helpers/prismaConnect'
import AWS from 'aws-sdk'
import cuid from "cuid";
import jwt from 'jsonwebtoken'
import sharp from 'sharp'

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if(!Array.isArray(req.query.path))return res.status(400).json({ message: "Invaid params!" })
    const objectKey = `media/covers/${req.query.path.join('/')}`
    const s3 = new AWS.S3({
        accessKeyId: process.env.S3_ACCESS_KEY ,
        secretAccessKey: process.env.S3_SECRET_KEY ,
        endpoint: 'http://127.0.0.1:9000' ,
        s3ForcePathStyle: true, // needed with minio?
        signatureVersion: 'v4'
    });
    const file = await s3.getObject({ Bucket: 'test', Key: objectKey }).promise().catch((err)=> {
        return res.status(404).json({ error: 'Not Found' })
    }) as any

    let processedImage: any
    if(file?.ContentType.includes('image')&&(req.query.w||req.query.q)){
        const originalWidth = (await sharp(file?.Body).metadata()).width
        processedImage = await sharp(file?.Body).resize(originalWidth<=parseInt(String(req.query.w))?originalWidth:parseInt(Array.isArray(req.query.w)?req.query.w.pop():req.query.w)||originalWidth).webp({ quality: parseInt(String(req.query.q||100))>100?100:parseInt(String(req.query.q||100)) }).toBuffer()
    }

    if(processedImage){
        res.setHeader('Content-Type', 'image/webp')
        res.setHeader('filename', `${objectKey.split('/').pop()}.webp`)
        return res.send(processedImage)
    }

    res.setHeader('Content-Type', file.ContentType)
    return res.send(file.Body)
}