import NextLink from 'next/link'
import { useState, useEffect } from 'react'
import { Box, Flex, Button, Link, Text} from "@chakra-ui/react"
import { getAddressOrENS } from "../utils/helpers"
import dynamic from 'next/dynamic'
import Davatar from '@davatar/react'
import { ethers } from 'ethers'

export default function SoundCard({ sound }) {

    const AudioPlayer = dynamic(
        () => import('./AudioPlayer'),
        {ssr: false}
    )

    const [user, setUser] = useState('')

    useEffect(() => {
        getEns()
    }, [])

    async function getEns() {
        const provider = ethers.getDefaultProvider("homestead", {
            alchemy: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
            infura: process.env.NEXT_PUBLIC_INFURA_API_KEY
        })
        let ens = await getAddressOrENS(sound.creator, provider)
        setUser(ens)
    }

    return (

        <Flex rounded="xl" direction="column" bg="white" overflow="hidden" border="1px" borderColor="gray.200" >
            <AudioPlayer src={sound.tokenURI} />
            <Flex justify="space-between" p={4} bg="gray.100">
                <Box w="75%">
                    <Text fontSize="16px" whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden" fontWeight="semibold">{sound.name}</Text>
                    <NextLink href={`/${encodeURIComponent(sound.creator)}`}><Flex align="center"><Davatar address={ethers.utils.getAddress(sound.creator)} size={15} /><Link _hover={{color: "pink.500"}} fontSize="16px" ml={2}>{user}</Link></Flex></NextLink>
                </Box>
                <Box>
                <Text fontSize="xs" fontWeight="semibold">Samples</Text>
                <Text textAlign="center">{sound.licenseCount}</Text>
                </Box>
 
            </Flex>
            <Flex justify="space-between" p={4} bg="black">
                <Box color="white">
                    <Text fontSize="16px" fontWeight="semibold">Price:</Text>
                    <Text fontSize="xs">{sound.price} ETH</Text>
                </Box>
                <NextLink href={`/${encodeURIComponent(sound.creator)}/${encodeURIComponent(sound.tokenId)}`}><Button textColor="black" as="a">Sample</Button></NextLink>

            </Flex>

        </Flex>
    )
}


