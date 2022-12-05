import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '../../helpers/prismaConnect'
import AWS from 'aws-sdk'
import cuid from "cuid";
import jwt from 'jsonwebtoken'
import mime from 'mime-types'
import ffmpeg from 'fluent-ffmpeg';
import streamifier from 'streamifier'
import stream from 'stream'

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    const token:string = req.cookies._token
    const decodedToken = jwt.decode(token) as any

    switch(req.method){
        case'GET': 
            const { id } = req.query
            if(!id){
                return res.status(400).json({ message: "Required at least one id!" })
            }else if(Array.isArray(id)){
                return res.json(JSON.parse(JSON.stringify({
                    music: await prisma.music.findMany({
                        where: {
                            id: {
                                in: id
                            }
                        },
                        include: {
                            album: {
                                select: {
                                    id: true,
                                    albumArt: true,
                                }
                            },
                            artists: true
                        },
                    })
                }, (key, value) => (typeof value === 'bigint' ? value.toString() : value))))
            }else{
                return res.json(JSON.parse(JSON.stringify({
                    music: await prisma.music.findFirst({
                        where: {
                            id
                        },
                        include: {
                            album: {
                                select: {
                                    id: true,
                                    albumArt: true,
                                }
                            },
                            artists: true
                        },
                    })
                }, (key, value) => (typeof value === 'bigint' ? value.toString() : value))))
            }

        case'POST':
            if(!decodedToken) return res.status(403).json({ message: "You must be logged in to use this feature" })
            const { title, altTitle, audio, artistIds, albumId, albumIndex } = req.body
            if(!title||!audio||!artistIds||!albumId||!albumIndex)return res.status(400).json({ message: "Invalid body!" })
            let audioBase = audio.match(/^data:([A-Za-z0-9-+\/]+);base64,(.+)$/);
            if(!(audio.startsWith('data:audio')||audio.startsWith('data:video/webm'))||audioBase.length<3)return res.status(400).json({ message: "Unsupported audio!" })
            const s3 = new AWS.S3({
                accessKeyId: process.env.S3_ACCESS_KEY ,
                secretAccessKey: process.env.S3_SECRET_KEY ,
                endpoint: 'http://127.0.0.1:9000' ,
                s3ForcePathStyle: true, // needed with minio?
                signatureVersion: 'v4'
            });
            let pass = new stream.PassThrough();
            ffmpeg(streamifier.createReadStream(Buffer.from(audioBase[2], 'base64'))).audioCodec('libopus').audioBitrate('196k').format('ogg').noVideo().outputOptions('-map_metadata -1').output(pass, { end: true }).run()
            const uploadAudio = await s3.upload({ Bucket: 'test', Key: `media/audio/${cuid()}.ogg`, Body: pass, ContentType: audioBase[1] }).promise()
            const newData = await prisma.music.create({
                data: {
                    title,
                    altTitle: altTitle&&altTitle,
                    userId: decodedToken.sub,
                    albumId,
                    approved: decodedToken.level==='ADMIN',
                    resourceKey: uploadAudio.Key,
                    albumIndex: parseInt(albumIndex),
                    artists: {
                        connect: artistIds.map((id)=>{
                            return {
                                id: String(id)
                            }
                        })
                    },
                },
                select: {
                    id: true,
                    title: true,
                    altTitle: true,
                    userId: true,
                    albumId: true,
                    approved: true,
                    albumIndex: true,
                    artists: true,
                }
            })

            return res.json(JSON.parse(JSON.stringify({
                message: `Successfully ${decodedToken.level==='ADMIN'?'added!':'submitted!'}`,
                data: newData
            }, (key, value) => (typeof value === 'bigint' ? value.toString() : value))))
        default:
            return res.status(405).json({ message: req.method+' method is not allowed!' })
    }
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '120MB'
        }
    }
}