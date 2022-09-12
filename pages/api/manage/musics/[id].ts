import { Music } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '../../../../helpers/prismaConnect'

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    switch(req.method){
        case'PUT':
            const { title, altTitle, albumIndex, approved } = req.body
            if(!title||!albumIndex||!approved)return res.status(400).json({ message: "Invalid body!" })

            const updatedMusic = await prisma.music.update({
                where: {
                    id: String(req.query.id)
                },
                data: {
                    title,
                    altTitle: altTitle?altTitle:"",
                    albumIndex: parseInt(albumIndex),
                    approved
                }
            })
            return res.json(JSON.parse(JSON.stringify({ updatedMusic }, (key, value) => (typeof value === 'bigint' ? value.toString() : value))))
        case'POST':
            const { artistId } = req.body
            if(!artistId)return res.status(400).json({ message: "Invalid body!" })

            const connectedMusic = await prisma.music.update({
                where: {
                    id: String(req.query.id)
                },
                data: {
                    artists: {
                        connect: {
                            id: artistId
                        }
                    }
                }
            }).catch(error => {
                return res.status(400).json({
                    error
                })
            }) as Music

            await prisma.album.update({
                where: {
                    id: connectedMusic.albumId
                },
                data: {
                    artists: {
                        connect: {
                            id: artistId
                        }
                    }
                }
            })
            return res.json(JSON.parse(JSON.stringify({ connectedMusic }, (key, value) => (typeof value === 'bigint' ? value.toString() : value))))
        default:
            return res.status(405).json({ message: req.method+' method is not allowed!' })
    }
}
