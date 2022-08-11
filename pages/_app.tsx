import { MantineProvider } from '@mantine/core'
import { useColorScheme } from '@mantine/hooks'
import { useEffect, useState } from 'react'
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
  const colorScheme = useColorScheme()
  const [profile, setProfile] = useState({})
  const [queue, setQueue] = useState([])
  const [playerState, setPlayerState] = useState({
      isPlaying: false,
      progress: 0,
      max: 0,
      isSeeking: false,
      isLooping: false,
      isMuted: false,
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

  if(router.pathname == "/_error"){
    return<Component {...pageProps} />
  }

  return(
    <MantineProvider theme={{ colorScheme }} withNormalizeCSS withGlobalStyles>
      <DataContext.Provider value={[playerState, setPlayerState, queue, setQueue, profile]}>
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
