import { Input } from "@mantine/core"
import { useDebouncedState } from "@mantine/hooks"
import axios from "axios"
import Head from "next/head"
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
            setArtists(data.data)
        }).catch((err)=>console.log(err))
    }

    return(
        <div>
            <Head>
                <title>Explore</title>
            </Head>
            <Input.Wrapper id={'q'} label="Search">
                <Input mt={'0.1rem'} id={'q'} type='text' placeholder="Search query..." defaultValue={searchQuery} onChange={(e: ChangeEvent<any>) => setSearchQuery(e.currentTarget.value)}/>
            </Input.Wrapper>
        </div>
    );
}