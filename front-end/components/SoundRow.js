import { Tr, Td, Flex } from '@chakra-ui/react'
import { shortAddress } from '../utils/helpers'
import {BsDownload, BsPencilSquare } from 'react-icons/bs'
import { Button } from '@chakra-ui/button'
import { useDisclosure } from '@chakra-ui/react'
import UpdatePriceModal from './UpdatePriceModal'

export default function SoundRow({ sound, page }) {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            <UpdatePriceModal isOpen={isOpen} onClose={onClose} sound={sound}/>
            <Tr >
                <Td textAlign="center">{sound.name}</Td>
                <Td><Flex justify={"center"}><audio controls src={sound.tokenURI}></audio></Flex></Td>
                <Td textAlign="center">{shortAddress(sound.creator)}</Td>
                <Td textAlign="center">{sound.licenseCount}</Td>
                <Td textAlign="center">
                    {
                        page === 'my-licenses' 
                        ? <Button color="black" bg="gray.100" as="a" p={2} fontSize={25} href={sound.tokenURI} target="_blank" rel="noreferrer noopener"><BsDownload/></Button>
                        : <Button color="black" bg="gray.100" p={2} fontSize={25} fontSize={20} onClick={onOpen}><BsPencilSquare/></Button>
                        
                    }
                </Td>
            </Tr>
        </>
    )
}
