import { ActionIcon, AspectRatio, Card, Grid, Group, Image, Stack, Text, Title } from "@mantine/core"
import { Album, Artist, Music } from "@prisma/client"
import { GetServerSidePropsContext } from "next"
import Head from "next/head"
import Link from "next/link"
import { useContext } from "react"
import DataContext from "../../../helpers/DataContext"
import { prisma } from '../../../helpers/prismaConnect'

export default function ArtistPage({ artist }) {
    const { setQueue, queue, setPlayerState, playerState } = useContext(DataContext)

    return(
        <div>
            <Head>
                <title>{`${artist.name} ${artist.altName&&`(${artist.altName})`}`}</title>
            </Head>
            <div style={{ backgroundImage: `url(${artist.albums.length>0?`/api/files/${artist.albums[0].albumArt}?q=75&w=512`:"https://storj.rafi12.cyou/storage/files/cl7w0go0z0009seqr6rpma22a/Cover_02.jpg"})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'top', backgroundColor: '#000000' }}>
                <div style={{ minHeight: '25vh', display: 'flex', backdropFilter: 'blur(0.3rem) brightness(0.7)' }}>
                    <Stack m={'1rem'} style={{ alignSelf: 'flex-end' }} spacing={3}>
                        <Title style={{ color:'white', textShadow: "0 0 0.25rem rgb(0 0 0 / 40%)" }} order={1}>{artist.name}</Title>
                        <Title style={{ color:'white', textShadow: "0 0 0.25rem rgb(0 0 0 / 40%)", fontWeight: 'normal' }} order={4}>{artist.altName}</Title>
                    </Stack>
                </div>
            </div>
            <div style={{ margin: '1rem' }}>
                <Group position="apart">
                    <Title sx={(theme) => ({ color: theme.colorScheme === 'dark' ? "white" : "black" })} order={3}>Songs</Title>
                    <ActionIcon color={'blue'}><svg xmlns="http://www.w3.org/2000/svg" width={'20px'} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg></ActionIcon>
                </Group>
                <Stack pt={'md'}>
                    <Card>
                    {artist.musics.map((e: any) => {
                        return<Card.Section key={e.id} withBorder p={'sm'} pt={'xs'}>
                                <Group>
                                    <ActionIcon onClick={()=>queue[0]?.id===e.id?setPlayerState(playerState=>({...playerState, isPlaying: !playerState.isPlaying})):setQueue(queue.concat({ id: e.id, url: `/api/files/${e.resourceKey}`, poster: `/api/files/${e.album.albumArt}?q=75&w=512`, title: e.title, altTitle: e.altTitle, artists: e.artists, albumId: e.album.id }))} size={'lg'} color={'blue'}>{(queue[0]?.id===e.id&&playerState.isPlaying)?<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={'22px'}><path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" /></svg>:<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={'22px'}><path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" /></svg>}</ActionIcon>
                                    <Stack spacing={0}>
                                        <Text><b>{`${e.title} ${e.altTitle&&`(${e.altTitle})`}`}</b></Text>
                                        <Group spacing={0}>
                                        {e.artists.map((a: any, index: any)=>
                                            <Link passHref href={`/artists/${a.id}`}>
                                                <Text sx={{
                                                    ":hover": {
                                                        textDecoration: 'underline'
                                                    }
                                                }} component="a" size={'xs'}>{index<e.artists.length&&index!==0?", ":""}{a.name}</Text>
                                            </Link>
                                        )}
                                        </Group>
                                    </Stack>
                                </Group>
                            </Card.Section>
                    })}
                    </Card>
                </Stack>
                <Group pt={'lg'} position="apart">
                    <Title sx={(theme) => ({ color: theme.colorScheme === 'dark' ? "white" : "black" })} order={3}>Albums / Singles</Title>
                    <Group spacing={3}>
                        <Link passHref href={`/artists/${artist.id}/albums/new`}>
                            <ActionIcon component="a" variant="light" color={'blue'}><svg xmlns="http://www.w3.org/2000/svg" width={'20px'} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg></ActionIcon>
                        </Link>
                        <ActionIcon color={'blue'}><svg xmlns="http://www.w3.org/2000/svg" width={'20px'} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg></ActionIcon>
                    </Group>
                </Group>
                <Grid pt={'md'} columns={20}>
                    {artist.albums.map((e: Album) => {
                        return<Grid.Col span={10} lg={5} xl={20/6} sm={20/3}>
                            <Link passHref href={`/albums/${e.id}`}>
                                <Card component="a">
                                    <Card.Section>
                                        <AspectRatio style={{ backgroundImage:`url(/api/files/${e.albumArt}?q=75&w=512)`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#000000' }} ratio={1/1}>
                                            <img style={{ objectFit: 'contain', backdropFilter: 'blur(0.5rem) brightness(0.5)' }} src={`/api/files/${e.albumArt}?q=75&w=512`}/>
                                        </AspectRatio>
                                    </Card.Section>
                                    <Card.Section p={'sm'} pt={'xs'}>
                                        <Text>{e.name}</Text>
                                    </Card.Section>
                                </Card>
                            </Link>
                        </Grid.Col>
                    })}
                </Grid>
            </div>
        </div>
    );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const artistData = await prisma.artist.findFirst({
        where: {
            id: String(ctx.params.id)
        },
        include: {
            albums: {
                take: 10,
                orderBy: {
                    releaseDate: 'desc'
                }
            },
            musics: {
                where: {
                    approved: true
                },
                take: 5,
                orderBy: {
                    streams: 'desc'
                },
                include: {
                    artists: {
                        select: {
                            name: true,
                            id: true
                        }
                    },
                    album: {
                        select: {
                            id: true,
                            albumArt: true,
                        }
                    }
                }
            }
        }
    })

    if(!artistData) return{
        notFound: true
    }

    return{
      props: {
        artist: JSON.parse(JSON.stringify(artistData, (key, value) => (typeof value === 'bigint' ? value.toString() : value)))
      }
    }
  }