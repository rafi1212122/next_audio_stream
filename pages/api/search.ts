import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '../../helpers/prismaConnect'

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    switch(req.method){
        case'GET':
            if(!req.query.q||typeof req.query.q !== 'string'){
                return res.json({
                    artists: []
                })
            }

            const artists = await prisma.artist.findMany({
                where: {
                    OR: [
                        {
                            name: {
                                contains: req.query.q,
                                mode: 'insensitive'
                            },
                        },
                        {
                            altName: {
                                contains: req.query.q,
                                mode: 'insensitive'
                            }
                        }
                    ]
                },
                include: {
                    albums: {
                        select: {
                            albumArt: true
                        },
                        orderBy: {
                            releaseDate: 'desc'
                        },
                        take: 1
                    }
                },
                take: 7,
            })
            return res.json({ artists })
        default:
            return res.status(405).json({ message: req.method+' method is not allowed!' })
    }
}
