import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '../../helpers/prismaConnect'
import AWS from 'aws-sdk'
import cuid from "cuid";
import jwt from 'jsonwebtoken'
import dayjs from "dayjs";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    const token:string = req.cookies._token
    const decodedToken = jwt.decode(token) as any

    if(!decodedToken) return res.status(403).json({ message: "You must be logged in to use this feature" })
    switch(req.method){
        case'POST':
            const { name, artistId, image, type, releaseDate } = req.body
            if(!name||!artistId||!image||!type||!releaseDate)return res.status(400).json({ message: "Invalid body!" })
            if(!['ALBUM', 'SINGLE'].includes(String(type)))return res.status(400).json({ message: "Invalid type!" })
            if(!dayjs(releaseDate).isValid())return res.status(400).json({ message: "Invalid date!" })
            let imageBase = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            if(!image.startsWith('data:image')||imageBase.length<3)return res.status(400).json({ message: "Invalid image!" })
            const s3 = new AWS.S3({
                accessKeyId: process.env.S3_ACCESS_KEY ,
                secretAccessKey: process.env.S3_SECRET_KEY ,
                endpoint: 'http://127.0.0.1:9000' ,
                s3ForcePathStyle: true, // needed with minio?
                signatureVersion: 'v4'
            });
            const uploadImage = await s3.upload({ Bucket: 'test', Key: `media/covers/${cuid()}.${imageBase[1].split('/').pop()}`, Body: Buffer.from(imageBase[2], 'base64'), ContentType: imageBase[1] }).promise()
            const newData = await prisma.album.create({
                data: {
                    name,
                    artists: {
                        connect: {
                            id: artistId
                        }
                    },
                    releaseDate: dayjs(releaseDate).format(),
                    type,
                    albumArt: uploadImage.Key,
                    approved: decodedToken.level==='ADMIN'
                }
            })

            return res.json({
                message: `Successfully ${decodedToken.level==='ADMIN'?'added!':'submitted!'}`,
                data: newData
            })
        default:
            return res.status(405).json({ message: req.method+' method is not allowed!' })
    }
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '15mb'
        }
    }
}