import { MantineProvider } from '@mantine/core'
import { useColorScheme } from '@mantine/hooks'
import { useEffect, useState } from 'react'
import { Howl } from 'howler';
import { useHotkeys } from '@mantine/hooks';
import Layout from '../components/Layout'
import DataContext from '../helpers/DataContext'
import '../styles/globals.css'
import { RouterTransition } from '../components/RouterTransition';
import { NotificationsProvider } from '@mantine/notifications';
import { useRouter } from 'next/router';
import axios, { AxiosResponse } from 'axios';

function MyApp({ Component, pageProps }) {
  const router =  useRouter()

  if(router.pathname == "/_error"){
    return<Component {...pageProps} />
  }
  
  const [profile, setProfile] = useState({})
  const [sound, setSound] = useState<Howl>()
  const [queue, setQueue] = useState([])
  const [playerState, setPlayerState] = useState({
    isPlaying: true,
    isMuted: false,
    isLooping: false,
    volume: 50
  })

  useEffect(()=>{
    getProfile()
  }, [router.asPath])

  const getProfile = async () => {
    await axios.get('/api/auth/user').then((response: AxiosResponse) => {
      setProfile(response.data.user)
    }).catch(()=>{
      setProfile(null)
    })
  }

  useHotkeys([
    ['space', ()=>setPlayerState(playerState=>({...playerState, isPlaying:!playerState.isPlaying}))]
  ])

  useEffect(()=>{
    console.log(queue)
    if(playerState.isLooping){
      return
    }
    const soundInit = new Howl({
      src: [queue[0]?.url],
      html5: true,
      autoplay: playerState.isPlaying,
      volume: playerState.volume/100,
      onend: ()=>setQueue(queue.slice(1)),
      onplay: ()=>console.log('playing'),
    });
    setSound(soundInit)
  }, [queue])

  useEffect(()=>{
    if(playerState.isPlaying){
      sound?.play()
    }else{
      sound?.pause()
    }
  }, [playerState.isPlaying])
  
  useEffect(()=>{
    sound?.volume(playerState.volume/100)
  }, [playerState.volume])

  useEffect(()=>{
    sound?.mute(playerState.isMuted)
  }, [playerState.isMuted])
  
  useEffect(()=>{
    sound?.loop(playerState.isLooping)
    if(playerState.isLooping){
      sound?.off('end')
    }else{
      sound?.on('end', ()=>setQueue(queue.slice(1)))
    }
  }, [playerState.isLooping])

  return(
    <MantineProvider theme={{ colorScheme: useColorScheme() }} withNormalizeCSS withGlobalStyles>
      <DataContext.Provider value={[playerState, setPlayerState, sound, queue, setQueue, profile]}>
        <RouterTransition/>
        <Layout>
          <NotificationsProvider autoClose={3000} zIndex={10000} position={'top-right'}>
            <Component {...pageProps} />
          </NotificationsProvider>
        </Layout>
      </DataContext.Provider>
    </MantineProvider>
  )
}

export default MyApp
