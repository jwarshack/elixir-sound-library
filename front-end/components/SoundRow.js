import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/table'
import { shortAddress } from '../utils/helpers'
import {BsDownload} from 'react-icons/bs'
import { Button } from '@chakra-ui/button'
import axios from 'axios'




export default function SoundRow({ sound }) {

    async function download() {
        console.log(sound.tokenURI)
        // await axios.post(`https://ipfs.infura.io:5001/api/v0/get?arg=${sound.tokenURI}`)
        // `https://ipfs.infura.io:5001/api/v0/get?arg=${sound.tokenURI}&output=<value>&archive=<value>&compress=<value>&compression-level=<value>`

    }
    return (
        <Tr >
            <Td textAlign="center">{sound.name}</Td>
            <Td textAlign="center"><audio controls src={sound.tokenURI}></audio></Td>
            <Td textAlign="center">{shortAddress(sound.creator)}</Td>
            <Td textAlign="center">{sound.licenseCount}</Td>
            <Td textAlign="center"><Button color="black" bg="gray.100" p={2} fontSize={25} onClick={download}><BsDownload/></Button></Td>
        </Tr>
    )
}
