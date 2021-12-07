import React from 'react'
import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/table'
import SoundRow from './SoundRow'

export default function SoundTable({ sounds }) {
    return (
        <Table>
            <Thead >
                <Tr>
                    <Th textAlign="center">Name</Th>
                    <Th textAlign="center">Track</Th>
                    <Th textAlign="center">Artist</Th>
                    <Th textAlign="center">Samples</Th>
                    <Th textAlign="center">Download</Th>
                </Tr>
            </Thead>
            <Tbody>
                {
                    sounds.map((sound, key) => {
                        return (
                            <SoundRow key={key} sound={sound}/>
                        )
                    })
                }
            </Tbody>

        </Table>
    )
}
