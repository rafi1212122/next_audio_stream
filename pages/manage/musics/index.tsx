import { ActionIcon, Card, Group, Pagination, Select, Table } from "@mantine/core"
import axios from "axios"
import Head from "next/head"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function ManageMusics() {
    const [musics, setMusics] = useState([])
    const [musicsCount, setMusicsCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [isApprovedInput, setIsApprovedInput] = useState("")

    useEffect(()=> {
        getMusics()
    }, [currentPage, isApprovedInput])
    
    const getMusics = async () => {
        await axios.get(`/api/manage/musics?p=${currentPage-1}${isApprovedInput&&`&approved=${isApprovedInput}`}`).then((data)=> {
            setMusics(data.data.musics)
            setMusicsCount(data.data.count)
        }).catch((err)=>console.log(err))
    }

    return(
        <div style={{ margin: '1rem' }}>
            <Head>
                <title>Manage Musics</title>
            </Head>
            <Group>
                <Select
                    label="Is Approved"
                    dropdownPosition="bottom"
                    styles={{ input: { marginTop: '0.1rem' } }}
                    value={isApprovedInput}
                    onChange={setIsApprovedInput}
                    placeholder="Select Approved Status"
                    clearable
                    data={[
                        { value: "1", label: 'Approved' },
                        { value: "0", label: 'Not Approved' },
                    ]}
                />
            </Group>
            <Table mt={'1rem'} highlightOnHover>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Alternative Title</th>
                        <th>Artists</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {musics.map((i: any)=> {
                        return(
                            <tr key={i.id}>
                                <td>{i.title}</td>
                                <td>{i.altTitle}</td>
                                <td>{i.artists.map((a:any)=>`${a.name}(${a.altName}) `)}</td>
                                <td>
                                    {!i.approved&&<Link passHref href={`/manage/musics/${i.id}`}>
                                        <ActionIcon component="a" color={'blue'} variant="filled">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={18}><path d="M12 15a3 3 0 100-6 3 3 0 000 6z" /><path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" /></svg>
                                        </ActionIcon>
                                    </Link>}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
            {musicsCount>15&&<Pagination page={currentPage} onChange={setCurrentPage} pt={'1rem'} total={Math.ceil(musicsCount/15)} withEdges/>}
        </div>
    );
}
