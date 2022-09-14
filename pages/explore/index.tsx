import { AspectRatio, Card, Grid, Group, Image, Input, Stack, Text, Title } from "@mantine/core"
import { useDebouncedState } from "@mantine/hooks"
import { Album, Artist } from "@prisma/client"
import axios from "axios"
import Head from "next/head"
import Link from "next/link"
import { ChangeEvent, useEffect, useState } from "react"

export default function Explore() {
    const [artists, setArtists] = useState([])
    const [musics, setMusics] = useState([])
    const [albums, setAlbums] = useState([])
    const [searchQuery, setSearchQuery] = useDebouncedState("", 600, { leading: true })

    useEffect(()=> {
        search()
    }, [searchQuery])
    
    const search = async () => {
        await axios.get(`/api/search?q=${searchQuery}`).then((data)=> {
            setMusics(data.data.musics)
            setArtists(data.data.artists)
            setAlbums(data.data.albums)
        }).catch((err)=>console.log(err))
    }

    return(
        <div style={{ margin: '1rem' }}>
            <Head>
                <title>Explore</title>
            </Head>
            <Input.Wrapper id={'q'} label="Search">
                <Input autoComplete="off" icon={<svg xmlns="http://www.w3.org/2000/svg" width={'18px'} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>} mt={'0.1rem'} id={'q'} type='text' placeholder="Search query..." defaultValue={searchQuery} onChange={(e: ChangeEvent<any>) => setSearchQuery(e.currentTarget.value)}/>
            </Input.Wrapper>

            {musics?.length>0&&<>
            <Title pt={'md'} sx={(theme) => ({ color: theme.colorScheme === 'dark' ? "white" : "black" })} order={3}>Songs</Title>
            <Grid pt={'md'} columns={10}>
            {musics?.map((i)=>{
                return(
                    <Grid.Col key={i.id} span={5} sm={10/3} md={10/4} xl={10/6}>
                        <Link passHref href={`/albums/${i.album.id}`}>
                            <Card component="a" shadow="sm" p="sm" radius="md" withBorder>
                                <Stack spacing={0} style={{ alignItems: 'flex-start' }}>
                                    <Image height={'7rem'} width={'7rem'} radius={'sm'} src={`/api/files/${i.album.albumArt}?q=75&w=256`}/>
                                    <Stack spacing={0} pt={'sm'}>
                                        <Text weight={500}>{`${i.title} ${i.altTitle&&`(${i.altTitle})`}`}</Text>
                                        <Text size="sm" color="dimmed">{i.artists.map((artist: any, index: any)=>`${index<i.artists.length&&index!==0?", ":""}${`${artist.name} ${`${artist.altName&&`(${artist.altName})`}`}`}`)}</Text>
                                    </Stack>
                                </Stack>
                            </Card>
                        </Link>
                    </Grid.Col>
                )
            })}
            </Grid></>}
            {artists?.length>0&&<>
            <Title pt={'lg'} sx={(theme) => ({ color: theme.colorScheme === 'dark' ? "white" : "black" })} order={3}>Artists</Title>
            <Grid pt={'md'} columns={10}>
            {artists?.map((i)=>{
                return(
                    <Grid.Col key={i.id} span={10} sm={5} md={10/3} xl={2}>
                        <Link passHref href={`/artists/${i.id}`}>
                            <Card component="a" shadow="sm" p="sm" radius="md" withBorder>
                                <Group style={{ alignItems: 'flex-start' }}>
                                    <Image height={'7rem'} width={'7rem'} radius={'sm'} src={`${i.albums.length>0?`/api/files/${i.albums[0].albumArt}?q=75&w=256`:"https://dummyimage.com/256x256/555/555"}`}/>
                                    <Stack spacing={0} pt={'sm'}>
                                        <Text weight={500}>{i.name}</Text>
                                        <Text size="sm" color="dimmed">{i.altName}</Text>
                                    </Stack>
                                </Group>
                            </Card>
                        </Link>
                    </Grid.Col>
                )
            })}
            </Grid></>}
            {albums?.length>0&&<>
            <Title pt={'lg'} sx={(theme) => ({ color: theme.colorScheme === 'dark' ? "white" : "black" })} order={3}>Albums</Title>
            <Grid pt={'md'} columns={10}>
            {albums?.map((i: Album)=>{
                return(
                    <Grid.Col key={i.id} span={5} sm={10/3} md={10/4} xl={10/6}>
                        <Link passHref href={`/albums/${i.id}`}>
                            <Card component="a" shadow="sm" p="sm" radius="md" withBorder>
                                <Card.Section>
                                    <Image radius={'sm'} src={`/api/files/${i.albumArt}?q=75&w=512`}/>
                                </Card.Section>
                                <Text pt={'sm'} weight={500}>{i.name}</Text>
                            </Card>
                        </Link>
                    </Grid.Col>
                )
            })}
            </Grid></>}
        </div>
    );
}