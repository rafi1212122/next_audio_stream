import { ActionIcon, AspectRatio, Card, Grid, Group, Image, Stack, Text, Title } from "@mantine/core"
import { Album, Music } from "@prisma/client"
import { GetServerSidePropsContext } from "next"
import Head from "next/head"
import Link from "next/link"
import { prisma } from '../../../helpers/prismaConnect'
import dayjs from 'dayjs'
import { useContext } from "react"
import DataContext from "../../../helpers/DataContext"

export default function ArtistPage({ album }) {
    const { setQueue, queue } = useContext(DataContext)

    return(
        <div>
            <Head>
                <title>{album.name}</title>
            </Head>
            <div style={{ backgroundImage:`url(/api/files/${album.albumArt}?q=75&w=512)`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'top', backgroundColor: '#000000' }}>
                <Group style={{ minHeight: '25vh', display: 'flex', backdropFilter: 'blur(0.3rem) brightness(0.7)' }} spacing={0}>
                    <AspectRatio m={'1rem'} style={{ backgroundImage:`url(/api/files/${album.albumArt}?q=75&w=512)`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#000000', alignSelf: 'flex-end', width: '20vh' }} ratio={1/1}>
                        <img style={{ objectFit: 'contain', backdropFilter: 'blur(0.5rem) brightness(0.5)', boxShadow: "0 0 0.25rem rgb(0 0 0 / 40%)" }} src={`/api/files/${album.albumArt}?q=75&w=512`}/>
                    </AspectRatio>
                    <Stack mb={'1rem'} ml={'1rem'} style={{ alignSelf: 'flex-end' }} spacing={3}>
                        <Title style={{ color:'white', textShadow: "0 0 0.25rem rgb(0 0 0 / 40%)" }} order={1}>{album.name}</Title>
                        <Group spacing={'xs'} style={{ color:'white', textShadow: "0 0 0.25rem rgb(0 0 0 / 40%)", fontWeight: 'normal' }}>
                            <Link passHref href={`/artists/${album.artist.id}`}>
                                <Text component="a" sx={{
                                    ":hover": {
                                        textDecoration: 'underline'
                                    },
                                    cursor: 'pointer'
                                }} size={'lg'}>{`${album.artist.name} ${`${album.artist.altName&&`(${album.artist.altName})`}`}`}</Text>
                            </Link>
                            <Text size={'lg'}>•</Text>
                            <Text size={'lg'}>{dayjs(album.releaseDate).format('MM-YYYY')}</Text>
                        </Group>
                    </Stack>
                </Group>
            </div>
            <div style={{ margin: '1rem' }}>
                <Group position="apart">
                    <Title sx={(theme) => ({ color: theme.colorScheme === 'dark' ? "white" : "black" })} order={3}>Songs</Title>
                    <Link passHref href={`/albums/${album.id}/songs/new`}>
                        <ActionIcon component="a" variant="light" color={'blue'}><svg xmlns="http://www.w3.org/2000/svg" width={'20px'} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg></ActionIcon>
                    </Link>
                </Group>
                <Stack pt={'md'}>
                    <Card>
                    {album.musics.map((e: any) => {
                        return<Card.Section key={e.id} withBorder p={'sm'} pt={'xs'}>
                                <Group>
                                    <ActionIcon onClick={()=>setQueue(queue.concat({ id: e.id, url: `/api/files/${e.resourceKey}`, poster: `/api/files/${album.albumArt}?q=75&w=512`, title: e.title, altTitle: e.altTitle, artists: e.artists, albumId: album.id }))} size={'lg'} color={'blue'}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={'22px'}><path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" /></svg></ActionIcon>
                                    <Stack spacing={0}>
                                        <Text><b>{`${e.title} (${e.altTitle})`}</b></Text>
                                        <Group spacing={0}>
                                        {e.artists.map((a: any)=>
                                            <Link passHref href={`/artists/${a.id}`}>
                                                <Text sx={{
                                                    ":hover": {
                                                        textDecoration: 'underline'
                                                    }
                                                }} component="a" size={'xs'}>{a.name}</Text>
                                            </Link>
                                        )}
                                        </Group>
                                    </Stack>
                                </Group>
                            </Card.Section>
                    })}
                    </Card>
                </Stack>
            </div>
        </div>
    );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const albumData = await prisma.album.findFirst({
        where: {
            id: String(ctx.params.id),
            approved: true
        },
        include: {
            musics: {
                where: {
                    approved: true
                },
                include: {
                    artists: {
                        select: {
                            name: true,
                            id: true
                        }
                    }
                }
            },
            artist: {
                select: {
                    id: true,
                    name: true,
                    altName: true,
                }
            }
        }
    })

    if(!albumData) return{
        notFound: true
    }

    return{
      props: {
        album: JSON.parse(JSON.stringify(albumData, (key, value) => (typeof value === 'bigint' ? value.toString() : value)))
      }
    }
  }