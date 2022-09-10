import { Artist } from "@prisma/client";
import axios from "axios";
import { GetServerSidePropsContext } from "next";
import Head from "next/head"
import { useEffect, useState } from "react";

export default function Explore({ artist }:{ artist: Artist }) {
    const [artists, setArtists] = useState([])

    useEffect(()=> {
        getArtists()
    }, [])
    
    const getArtists = async () => {
        await axios.get('/api/manage/artists').then((data)=> {
            setArtists(data.data)
        }).catch((err)=>console.log(err))
    }

    return(
        <div>
            <Head>
                <title>Edit {artist.name}</title>
            </Head>
        </div>
    );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const artist = await prisma.artist.findFirst({
        where: {
            id: Array.isArray(ctx.query.id)?ctx.query.id.pop():ctx.query.id
        }
    })

    return{
      props: {
        artist: JSON.parse(JSON.stringify(artist))
      }
    }
  }