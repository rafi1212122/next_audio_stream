import { Button, Card, FileButton, Group, Input, LoadingOverlay, Text, Title } from "@mantine/core"
import { showNotification } from "@mantine/notifications";
import axios, { AxiosError, AxiosResponse } from "axios";
import { GetServerSidePropsContext } from "next"
import Head from "next/head"
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import { prisma } from '../../../../helpers/prismaConnect'

export default function AlbumNewSong({ album }) {
    const [submitting, setSubmitting] = useState(false)
    const [file, setFile] = useState<File | null>(null);
    const [base64File, setBase64File] = useState("");
    const [titleInput, setTitleInput] = useState("");
    const [altTitleInput, setAltTitleInput] = useState("");
    const [albumIndexInput, setAlbumIndexInput] = useState<number>();
    const router =  useRouter()

    useEffect(()=> {
        if(!file)return setBase64File("")
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            setBase64File(String(reader.result));
        };
    }, [file])

    const submitHadler = async () => {
        if(!base64File){
            return showNotification({
                id: 'create-audio-error',
                title: "Error!",
                message: "No audio selected",
                color: 'red',
                radius: 'xs',
            });
        }
        setSubmitting(true)
        await axios.post('/api/musics', {
            title: titleInput,
            altTitle: altTitleInput,
            artistId: album.artist.id,
            albumId: album.id,
            albumIndex: albumIndexInput,
            audio: base64File,
        }).then((response) => {
            showNotification({
                id: 'create-audio-error',
                title: "Success!",
                message: response.data.message,
                color: 'green',
                radius: 'xs',
            });
            return router.push(`/albums/${router.query.id}`)
        }).catch((err)=>{
            if(err.response.status!==400&&err.response.status!==403){
                return showNotification({
                    id: 'create-audio-error',
                    title: "Error!",
                    message: err.response.statusText,
                    color: 'red',
                    radius: 'xs',
                });
            }
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
                <title>{`Add New Song to ${album.name}`}</title>
            </Head>
            <Card shadow="sm" p="sm" radius="md">
                <Card.Section p={'sm'}>
                    <Title sx={(theme) => ({ color: theme.colorScheme === 'dark' ? "white" : "black" })} order={3}>{`Add New Song to ${album.name}`}</Title>
                </Card.Section>
                <Card.Section sx={(theme)=> ({
                    borderTop: '1px solid',
                    borderBottom: '1px solid',
                    borderColor: theme.colorScheme==='dark'?theme.colors.gray[7]:theme.colors.gray[3]
                })} style={{ position:'relative', display: 'flex', flexDirection: 'column', gap: '0.5rem' }} px='md' py={'sm'}>
                    <LoadingOverlay loaderProps={{ size: 'md', color: 'blue', variant: 'oval' }} visible={submitting} overlayBlur={2} />
                    <Input.Wrapper id={'title'} label="Title">
                        <Input autoComplete="off" mt={'0.1rem'} required id={'title'} type='text' placeholder="Title" value={titleInput} onChange={(e:ChangeEvent<any>) => setTitleInput(e.target.value)}/>
                    </Input.Wrapper>
                    <Input.Wrapper id={'alt-title'} label="Alernative Title">
                        <Input autoComplete="off" mt={'0.1rem'} required id={'alt-title'} type='text' placeholder="Alernative (Secondary) Title - Optional" value={altTitleInput} onChange={(e:ChangeEvent<any>) => setAltTitleInput(e.target.value)}/>
                    </Input.Wrapper>
                    <Input.Wrapper description="Used for sorting in Album" id={'album-index'} label="Album Index">
                        <Input autoComplete="off" mt={'0.1rem'} required id={'album-index'} type='number' placeholder="Album Index (Track Number)" value={albumIndexInput} onChange={(e:ChangeEvent<any>) => setAlbumIndexInput(e.target.value)}/>
                    </Input.Wrapper>
                    <audio style={{ marginTop: '0.5rem' }} controls={!!file} src={base64File}></audio>
                    <Group mt={'0.5rem'}>
                        <FileButton onChange={setFile} accept="audio/*">
                            {(props) => <Button {...props}>Upload audio</Button>}
                        </FileButton>
                        <Text size="sm">{file?`Selected file: ${file.name}`:"No file selected"}</Text>
                    </Group>
                </Card.Section>
                <Card.Section style={{ display: 'flex', justifyContent: 'space-between' }} p={'sm'}>
                    <Link passHref href={`/albums/${album.id}`}>
                        <Button color={'gray'} variant='outline' component="a" type='submit'>Back</Button>
                    </Link>
                    <Button onClick={submitHadler}>Submit</Button>
                </Card.Section>
            </Card>
        </div>
    );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    return{
      props: {
        album: JSON.parse(JSON.stringify(await prisma.album.findFirst({
            where: {
                id: String(ctx.params.id)
            },
            include: {
                artist: {
                    select: {
                        id: true
                    }
                }
            }
        })))
      }
    }
  }