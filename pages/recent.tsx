import { Anchor, Card, Grid, Group, Image, Paper, Skeleton, Stack, Text, Title } from "@mantine/core"
import axios from "axios"
import Head from "next/head"
import Link from "next/link"
import { Fragment, useContext, useEffect, useState } from "react"
import { MusicCol } from "../components/Music/MusicsGrid"
import DataContext from "../helpers/DataContext"

export default function Recent() {
  const [recentData, setRecentData] = useState([])
  const [recentIds, setRecentIds] = useState([])
  const { queue } = useContext(DataContext)

  useEffect(()=> {
    setTimeout(() => {
      if(Array.isArray(JSON.parse(localStorage?.getItem('recent')))){
        let recent = JSON.parse(localStorage?.getItem('recent'))
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
          if(Array.isArray(data.music)){
            return setRecentData(data.music)
          }else {
            return setRecentData([data.music])
          }
        })
      }
    }, 250)
  }, [queue])
  
  return (
    <div style={{ margin: '1rem' }}>
      <Head>
        <title>Recently Played</title>
      </Head>
      <Title pt={'md'} mb={'xs'} sx={(theme) => ({ color: theme.colorScheme === 'dark' ? "white" : "black" })} order={3}>Recently Played</Title>
      <Grid columns={10}>
      {recentIds?.map((i, index)=>{
          let music = recentData.find(v => v.id === i)
          return music ? <MusicCol music={music}/>: 
            <Grid.Col key={i} span={5} sm={10/3} md={10/4} xl={10/6}>
                <Link passHref href={`/`}>
                    <Card component="a" shadow="sm" p="sm" radius="md" withBorder>
                        <Stack spacing={0}>
                            <Paper radius={'sm'} sx={()=>({ background: '#555555', height: '7rem', width: '7rem' })}/>
                            <Stack spacing={0} pt={'sm'}>
                                <Skeleton visible radius="sm" width={'45%'}><Text weight={500}>Loading</Text></Skeleton>
                                <Skeleton visible mt="xs" radius="sm" width={'85%'}><Text size="sm" color="dimmed">loading...</Text></Skeleton>
                            </Stack>
                        </Stack>
                    </Card>
                </Link>
            </Grid.Col>
      })}
      </Grid>
    </div>
  )
}
