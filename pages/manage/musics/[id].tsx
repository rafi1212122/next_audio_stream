import { ActionIcon, Button, Card, Group, Input, LoadingOverlay, Table, Text, Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { Artist } from "@prisma/client";
import axios from "axios";
import { GetServerSidePropsContext } from "next";
import Head from "next/head"
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";

export default function Explore({ music }) {
    const [submitting, setSubmitting] = useState(false)
    const [newArtistIdInput, setNewArtistIdInput] = useState("")
    const [newTitleInput, setNewTitleInput] = useState(music.title)
    const [newAltTitleInput, setNewAltTitleInput] = useState(music.altTitle)
    const [newAlbumIndexInput, setNewAlbumIndexInput] = useState(parseInt(music.albumIndex))
    const router = useRouter()

    const addArtistHandler = async () => {
        setSubmitting(true)
        await axios.post(`/api/manage/musics/${music.id}`, { artistId: newArtistIdInput })
        .then(()=> {
            showNotification({
                id: 'add-artist-manage-song',
                title: "Success!",
                message: null,
                color: 'green',
                radius: 'xs',
            });
            router.replace(router.asPath);
        }).catch((err)=> {
            return showNotification({
                id: 'create-audio-error',
                title: "Error!",
                message: err?.response?.data?.error?.meta?.cause,
                color: 'red',
                radius: 'xs',
            });
        })
        setSubmitting(false)
    }

    const updateAndApproveHandler = async () => {
        setSubmitting(true)
        await axios.put(`/api/manage/musics/${music.id}`, {
            title: newTitleInput,
            altTitle: newAltTitleInput,
            albumIndex: newAlbumIndexInput,
            approved: true,
        })
        .then(()=> {
            showNotification({
                id: 'add-artist-manage-song',
                title: "Success!",
                message: "Successfully updated.",
                color: 'green',
                radius: 'xs',
            });
            router.replace(router.asPath);
        }).catch((err)=> {
            return showNotification({
                id: 'create-audio-error',
                title: "Error!",
                message: err?.response?.data?.message,
                color: 'red',
                radius: 'xs',
            });
        })
        setSubmitting(false)
    }

    return(
        <div style={{ margin: '1rem' }}>
            <Head>
                <title>Edit {`${music.title} ${music.altTitle&&`(${music.altTitle})`}`}</title>
            </Head>
            <Card>
                <Card.Section withBorder p={'sm'}>
                    <Title sx={(theme) => ({ color: theme.colorScheme === 'dark' ? "white" : "black" })} order={3}>Edit {`${music.title} ${music.altTitle&&`(${music.altTitle})`}`}</Title>
                </Card.Section>
                <Card.Section  style={{ position:'relative', display: 'flex', flexDirection: 'column', gap: '0.5rem' }} px='md' py={'sm'}>
                    <LoadingOverlay loaderProps={{ size: 'md', color: 'blue', variant: 'oval' }} visible={submitting} overlayBlur={2} />
                    <Input.Wrapper id={'title'} label="Title">
                        <Input autoComplete="off" mt={'0.1rem'} required id={'title'} type='text' placeholder="Title" value={newTitleInput} onChange={(e:ChangeEvent<any>) => setNewTitleInput(e.target.value)}/>
                    </Input.Wrapper>
                    <Input.Wrapper id={'alt-title'} label="Alternative Title">
                        <Input autoComplete="off" mt={'0.1rem'} required id={'alt-title'} type='text' placeholder="Alternative Title" value={newAltTitleInput} onChange={(e:ChangeEvent<any>) => setNewAltTitleInput(e.target.value)}/>
                    </Input.Wrapper>
                    <Input.Wrapper id={'album-index'} label="Album Index">
                        <Input autoComplete="off" mt={'0.1rem'} required id={'album-index'} type='number' placeholder="Album Index" value={newAlbumIndexInput} onChange={(e:ChangeEvent<any>) => setNewAlbumIndexInput(e.target.value)}/>
                    </Input.Wrapper>
                    <audio style={{ marginTop: '0.5rem' }} controls src={`/api/files/${music.resourceKey}`}></audio>
                </Card.Section>
                <Card.Section style={{ position:'relative', display: 'flex', flexDirection: 'column', gap: '0.5rem' }} sx={(theme)=>({ background: theme.colorScheme==='dark' ? "rgba(255,255,255,3%)" : "rgba(0,0,0,3%)" })} px='md' py={'sm'}>
                    <LoadingOverlay loaderProps={{ display: 'none' }} visible={submitting} overlayBlur={2} />
                    <Group position="apart">
                        <Text size={'lg'} weight='bold'>Artists:</Text>
                        <Input
                            type={'text'}
                            value={newArtistIdInput}
                            onChange={(e:ChangeEvent<any>) => setNewArtistIdInput(e.target.value)}
                            placeholder="Add artist with id"
                            rightSection={
                                <ActionIcon onClick={addArtistHandler}><svg width={20} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg></ActionIcon>
                            }
                        />
                    </Group>
                    <Table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Alternative Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {music.artists.map((i: Artist)=> {
                                return(
                                    <tr key={i.id}>
                                        <td>{i.id}</td>
                                        <td>{i.name}</td>
                                        <td>{i.altName}</td>
                                        <td>
                                            <ActionIcon component="a" target={'_blank'} href={`/artists/${i.id}`} color={'green'}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={18}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg></ActionIcon>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                </Card.Section>
                <Card.Section style={{ display: 'flex', justifyContent: 'space-between' }} withBorder p={'sm'}>
                    <Link passHref href={`/manage/musics`}>
                        <Button color={'gray'} variant='outline' component="a" type='submit'>Back</Button>
                    </Link>
                    <Button onClick={updateAndApproveHandler}>{"Save & Approve"}</Button>
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