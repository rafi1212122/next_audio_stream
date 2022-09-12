import { Artist } from "@prisma/client";
import axios from "axios";
import { GetServerSidePropsContext } from "next";
import Head from "next/head"
import { useEffect, useState } from "react";

export default function Explore({ artist }:{ artist: Artist }) {

    return(
        <div style={{ margin: '1rem' }}>
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

    if(!artist){
        return{
            notFound: true
        }
    }

    return{
        props: {
            artist: JSON.parse(JSON.stringify(artist))
        }
    }
}