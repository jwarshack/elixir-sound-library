import NextLink from 'next/link'
import { Box, Flex, Button, Link, Text} from "@chakra-ui/react"
import { shortAddress } from "../utils/helpers"
import dynamic from 'next/dynamic'



export default function SoundCard({ sound }) {

    const AudioPlayer = dynamic(
        () => import('./AudioPlayer'),
        {ssr: false}
    )

    return (

        <Flex rounded="xl" direction="column" bg="white" overflow="hidden" border="1px" borderColor="gray.200" >
            <AudioPlayer src={sound.tokenURI} />
            <Flex justify="space-between" p={4} bg="gray.100">
                <Box>
                    <Text fontWeight="semibold">{sound.name}</Text>
                    <NextLink href={`/${encodeURIComponent(sound.creator)}`}><Link _hover={{color: "pink.500"}}fontSize="xs">{shortAddress(sound.creator)}</Link></NextLink>
                </Box>
                <Box>
                <Text fontSize="xs" fontWeight="semibold">Samples</Text>
                <Text textAlign="center">{sound.licenseCount}</Text>
                </Box>
 
            </Flex>
            <Flex justify="space-between" p={4} bg="black">
                <Box color="white">
                    <Text fontSize="xs" fontWeight="semibold">Price:</Text>
                    <Text fontSize="xs">{sound.price} ETH</Text>
                </Box>
                <NextLink href={`/${encodeURIComponent(sound.creator)}/${encodeURIComponent(sound.tokenId)}`}><Button textColor="black" as="a">Sample</Button></NextLink>

            </Flex>

        </Flex>
    )
}


