import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '../../../../helpers/prismaConnect'

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    switch(req.method){
        case'GET':
            if(req.query.p&&Array.isArray(req.query.p)){
                return res.status(400).json({
                    message: "Invalid query!"
                })
            }

            const musics = await prisma.music.findMany({
                where: {
                    OR: [
                        {
                            title: {
                                contains: Array.isArray(req.query.q)?req.query.q.pop():req.query.q||'',
                                mode: 'insensitive'
                            },
                        },
                        {
                            altTitle: {
                                contains: Array.isArray(req.query.q)?req.query.q.pop():req.query.q||'',
                                mode: 'insensitive'
                            }
                        }
                    ],
                    approved: req.query.approved&&!!parseInt(String(req.query.approved))
                },
                take: 15,
                skip: req.query.p?15*parseInt(String(req.query.p)):0,
                include: {
                    artists: {
                        select: {
                            name: true,
                            altName: true
                        }
                    }
                }
            })
            return res.json(JSON.parse(JSON.stringify({ musics, count: await prisma.artist.count() }, (key, value) => (typeof value === 'bigint' ? value.toString() : value))))
        default:
            return res.status(405).json({ message: req.method+' method is not allowed!' })
    }
}
