import { AspectRatio, Card, Grid, Image, Input, Stack, Text } from "@mantine/core"
import { useDebouncedState } from "@mantine/hooks"
import { Artist } from "@prisma/client"
import axios from "axios"
import Head from "next/head"
import Link from "next/link"
import { ChangeEvent, useEffect, useState } from "react"

export default function Explore() {
    const [artists, setArtists] = useState([])
    const [searchQuery, setSearchQuery] = useDebouncedState("", 600, { leading: true })

    useEffect(()=> {
        getArtists()
    }, [searchQuery])

    useEffect(()=> {
        console.log(artists)
    }, [artists])
    
    const getArtists = async () => {
        await axios.get(`/api/search?q=${searchQuery}`).then((data)=> {
            setArtists(data.data.artists)
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
            <Grid pt={'2rem'} columns={10}>
            {artists.map((i)=>{
                return(
                    <Grid.Col key={i.id} span={5} md={2}>
                        <Link passHref href={`/artists/${i.id}`}>
                            <Card component="a" shadow="sm" p="sm" radius="md" withBorder>
                                <Card.Section>
                                    <AspectRatio style={{ backgroundImage:`url(${i.albums.length>0?`/api/files/${i.albums[0].albumArt}?q=75&w=512`:"https://storj.rafi12.cyou/storage/files/cl5t9ylr80000xwd93wupaafn/Cover_01.jpg"})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#000000', maxHeight:'25vh' }} ratio={1 / 1}>
                                        <img style={{ objectFit: 'contain', backdropFilter: 'blur(0.5rem) brightness(0.5)' }} src={`${i.albums.length>0?`/api/files/${i.albums[0].albumArt}?q=75&w=512`:"https://storj.rafi12.cyou/storage/files/cl5t9ylr80000xwd93wupaafn/Cover_01.jpg"}`}/>
                                    </AspectRatio>
                                </Card.Section>
                                <Stack spacing={0} pt={'sm'}>
                                    <Text weight={500}>{i.name}</Text>
                                    <Text size="sm" color="dimmed">{i.altName}</Text>
                                </Stack>
                            </Card>
                        </Link>
                    </Grid.Col>
                )
            })}
            </Grid>
        </div>
    );
}