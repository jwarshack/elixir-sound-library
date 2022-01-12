import { Flex, Link, HStack } from "@chakra-ui/react"
import { FaDiscord, FaTwitter } from 'react-icons/fa'

export default function Footer() {

    return (
        <Flex bg="black" color="white" justify="center" align="center" p={5}>
            <HStack fontSize="4xl" spacing={4}>
                <Link href="https://twitter.com/ElixirSoundLib" target="_blank" rel="noopener noreferrer"><FaTwitter/></Link>
                <Link href="https://discord.gg/XjE3bzKNcT" target="_blank" rel="noopener noreferrer"><FaDiscord/></Link>
            </HStack>    
        </Flex>
    )
}