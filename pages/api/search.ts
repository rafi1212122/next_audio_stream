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
                        },
                        {
                            musics: {
                                some: {
                                    OR: [
                                        {
                                            title: {
                                                contains: req.query.q,
                                                mode: 'insensitive'
                                            },
                                        },
                                        {
                                            altTitle: {
                                                contains: req.query.q,
                                                mode: 'insensitive'
                                            }
                                        }
                                    ]
                                }
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
                orderBy:{
                    _relevance: {
                        fields: ['name', 'altName'],
                        sort: 'desc',
                        search: req.query.q.split(' ').join(' | '),
                    }
                },
                take: 5,
            })

            const musics = await prisma.music.findMany({
                where: {
                    OR: [
                        {
                            title: {
                                contains: req.query.q,
                                mode: 'insensitive'
                            },
                        },
                        {
                            altTitle: {
                                contains: req.query.q,
                                mode: 'insensitive'
                            }
                        },
                        {
                            artists: {
                                some: {
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
                                }
                            }
                        }
                    ],
                    approved: true
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
                take: 5,
            })

            return res.json(JSON.parse(JSON.stringify({ artists, musics }, (key, value) => (typeof value === 'bigint' ? value.toString() : value))))
        default:
            return res.status(405).json({ message: req.method+' method is not allowed!' })
    }
}
