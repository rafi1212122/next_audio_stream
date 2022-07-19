import { MantineProvider } from '@mantine/core'
import { useColorScheme } from '@mantine/hooks'
import { useEffect, useState } from 'react'
import {Howl, Howler} from 'howler';
import Layout from '../components/Layout'
import DataContext from '../helpers/DataContext'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  const [sound, setSound] = useState()
  const [queue, setQueue] = useState([])
  const [playerState, setPlayerState] = useState({
    isPlaying:false,
    isMuted: false,
    isLooping: false,
    volume: 100
  })
  const [ts, setTs] = useState(0)

  useEffect(()=>{
    let playerRefresh = setInterval(()=>setTs(new Date().getTime()), 1000)
  }, [])

  useEffect(()=>{
    console.log(queue)
    if(playerState.isLooping){
      return
    }
    const soundInit = new Howl({
      src: [queue[0]],
      html5: true,
      autoplay: playerState.isPlaying,
      volume: playerState.volume/100,
      onend: ()=>setQueue(queue.slice(1))
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
      <DataContext.Provider value={[playerState, setPlayerState, sound, queue, setQueue]}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </DataContext.Provider>
    </MantineProvider>
  )
}

export default MyApp
