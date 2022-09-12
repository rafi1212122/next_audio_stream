import { Card, Input, LoadingOverlay, Title } from "@mantine/core";
import { Artist } from "@prisma/client";
import axios from "axios";
import { GetServerSidePropsContext } from "next";
import Head from "next/head"
import { useEffect, useState } from "react";

export default function Explore({ music }) {
    const [submitting, setSubmitting] = useState(false)

    return(
        <div style={{ margin: '1rem' }}>
            <Head>
                <title>Edit {`${music.title} (${music.altTitle})`}</title>
            </Head>
            <Card>
                <Card.Section p={'sm'}>
                    <Title sx={(theme) => ({ color: theme.colorScheme === 'dark' ? "white" : "black" })} order={3}>Edit {`${music.title} (${music.altTitle})`}</Title>
                </Card.Section>
                <Card.Section withBorder style={{ position:'relative', display: 'flex', flexDirection: 'column', gap: '0.5rem' }} px='md' py={'sm'}>
                    <LoadingOverlay loaderProps={{ size: 'md', color: 'blue', variant: 'oval' }} visible={submitting} overlayBlur={2} />
                    <Input.Wrapper id={'title'} label="Title">
                        <Input autoComplete="off" mt={'0.1rem'} required id={'title'} type='text' placeholder="Title" defaultValue={music.title}/>
                    </Input.Wrapper>
                    <Input.Wrapper id={'title'} label="Alternative Title">
                        <Input autoComplete="off" mt={'0.1rem'} required id={'title'} type='text' placeholder="Alternative Title" defaultValue={music.altTitle}/>
                    </Input.Wrapper>
                    <audio style={{ marginTop: '0.5rem' }} controls src={`/api/files/${music.resourceKey}`}></audio>
                </Card.Section>
            </Card>
        </div>
    );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const music = await prisma.music.findFirst({
        where: {
            id: Array.isArray(ctx.query.id)?ctx.query.id.pop():ctx.query.id
        },
        include: {
            artists: true
        }
    })

    if(!music){
        return{
            notFound: true
        }
    }

    return{
        props: {
            music: JSON.parse(JSON.stringify(music, (key, value) => (typeof value === 'bigint' ? value.toString() : value)))
        }
    }
}