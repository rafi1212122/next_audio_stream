import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '../../../helpers/prismaConnect'

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    switch(req.method){
        case'POST':
            if(!req.body.name)return res.status(400).json({ message: "name is required!" })
            const createArtist = await prisma.artist.create({
                data: {
                    name: req.body.name,
                    altName: req.body.alt_name,
                }
            })
            return res.json({artist: createArtist})
        case'GET':
            if(req.query.p&&Array.isArray(req.query.p)){
                return res.status(400).json({
                    message: "Invalid query!"
                })
            }

            const artists = await prisma.artist.findMany({
                where: {
                    OR: [
                        {
                            name: {
                                contains: Array.isArray(req.query.q)?req.query.q.pop():req.query.q||'',
                                mode: 'insensitive'
                            },
                        },
                        {
                            altName: {
                                contains: Array.isArray(req.query.q)?req.query.q.pop():req.query.q||'',
                                mode: 'insensitive'
                            }
                        }
                    ]
                },
                take: 15,
                skip: req.query.p?15*parseInt(String(req.query.p)):0
            })
            return res.json({ artists, count: await prisma.artist.count() })
        default:
            return res.status(405).json({ message: req.method+' method is not allowed!' })
    }
}
