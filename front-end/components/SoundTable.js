import React from 'react'
import { Table, Thead, Tbody, Tr, Th } from '@chakra-ui/table'
import SoundRow from './SoundRow'

export default function SoundTable({ sounds, page}) {
    return (
        <Table>
            <Thead >
                <Tr>
                    <Th textAlign="center">Name</Th>
                    <Th textAlign="center">Track</Th>
                    <Th textAlign="center">Artist</Th>
                    <Th textAlign="center">Samples</Th>
                    {
                        page === "my-licenses"
                        ? <Th textAlign="center">Download</Th>
                        : <Th textAlign="center">Price</Th>
                    }
                </Tr>
            </Thead>
            <Tbody>
                {
                    sounds.map((sound, key) => {
                        return (
                            <SoundRow key={key} sound={sound} page={page}/>
                        )
                    })
                }
            </Tbody>

        </Table>
    )
}
