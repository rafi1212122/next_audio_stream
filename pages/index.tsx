import { Card, Grid, Image, Paper, Stack, Text, Title } from "@mantine/core"
import axios from "axios"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import DataContext from "../helpers/DataContext"

export default function Home() {
  const [recentData, setRecentData] = useState([])
  const [recentIds, setRecentIds] = useState([])
  const { queue } = useContext(DataContext)
  const router = useRouter()

  useEffect(()=> {
    if(Array.isArray(JSON.parse(localStorage.getItem('recent')))){
      let recent = JSON.parse(localStorage.getItem('recent'))
      setRecentIds(recent)
      if(recent.length<1)return
      let url = '/api/musics'
      for (let index = 0; index < recent.length; index++) {
        if(index===0){
          url = url.concat(`?id=${recent[index]}`)
        }else{
          url = url.concat(`&id=${recent[index]}`)
        }
      }
      axios.get(url).then(({data}) => {
        if(!data.music)return
        setRecentData(data.music)
      })
    }
  }, [])
  
  return (
    <div style={{ margin: '1rem' }}>
      <Head>
        <title>Home</title>
      </Head>
      <Title pt={'md'} mb={'xs'} sx={(theme) => ({ color: theme.colorScheme === 'dark' ? "white" : "black" })} order={3}>Recently Played</Title>
      <Grid>
      {recentIds?.map((i)=>{
          let music = recentData.find(v => v.id === i)
          return music ? (
              <Grid.Col key={music.id} span={5} sm={10/3} md={10/4} xl={10/6}>
                  <Link passHref href={`/albums/${music.album.id}`}>
                      <Card component="a" shadow="sm" p="sm" radius="md" withBorder>
                          <Stack spacing={0} style={{ alignItems: 'flex-start' }}>
                              <Image height={'7rem'} width={'7rem'} radius={'sm'} src={`/api/files/${music.album.albumArt}?q=75&w=256`}/>
                              <Stack spacing={0} pt={'sm'}>
                                  <Text weight={500}>{`${music.title} ${music.altTitle&&`(${music.altTitle})`}`}</Text>
                                  <Text size="sm" color="dimmed">{music.artists.map((artist: any, index: any)=>`${index<music.artists.length&&index!==0?", ":""}${`${artist.name} ${`${artist.altName&&`(${artist.altName})`}`}`}`)}</Text>
                              </Stack>
                          </Stack>
                      </Card>
                  </Link>
              </Grid.Col>
          ): <>
              <Grid.Col key={i} span={5} sm={10/3} md={10/4} xl={10/6}>
                  <Link passHref href={`/`}>
                      <Card component="a" shadow="sm" p="sm" radius="md" withBorder>
                          <Stack spacing={0} style={{ alignItems: 'flex-start' }}>
                              <Paper radius={'sm'} sx={()=>({ background: '#555555', height: '7rem', width: '7rem' })}/>
                              <Stack spacing={0} pt={'sm'}>
                                  <Text weight={500}>Loading</Text>
                                  <Text size="sm" color="dimmed">loading..</Text>
                              </Stack>
                          </Stack>
                      </Card>
                  </Link>
              </Grid.Col>
            </>
      })}
      </Grid>
    </div>
  )
}
