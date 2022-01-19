import Image from "next/image"
import { Flex, Link, HStack, Text, List, ListItem, Divider, VStack } from "@chakra-ui/react"
import { FaDiscord, FaTwitter, FaYoutube } from 'react-icons/fa'
import footerLogo from '../public/img/footerlogo.png'

export default function Footer() {

    return (
        <Flex bg="black" color="white" direction="column" p={5}>
            <HStack fontSize="4xl" spacing={4} mx="auto">
                <Link href="https://twitter.com/ElixirSoundLib" target="_blank" rel="noopener noreferrer"><FaTwitter/></Link>
                <Link href="https://discord.gg/XjE3bzKNcT" target="_blank" rel="noopener noreferrer"><FaDiscord/></Link>
                <Link href="https://www.youtube.com/channel/UCzmRYhE7fOsfz7ef1CcSDOA" target="_blank" rel="noopener noreferrer"><FaYoutube></FaYoutube></Link>
            </HStack>
            {/* <Divider borderColor="#575656"></Divider>
            <Flex pt={5} direction={{base: "column", md: "row"}}>
                <Flex direction="column" pe="20" textAlign="center">
                    <Image src={footerLogo} alt="Footer Logo" layout="fixed" width={28} height={40}/>
                    <Text color="#575656">The first decentralized music sample marketplace</Text>
                </Flex>
                <List flex="1">
                    <ListItem color="#575656" fontWeight="bold">About</ListItem>
                    <ListItem color="#575656">FAQ</ListItem>
                    <ListItem color="#575656">Blog</ListItem>
                </List>
                <List flex="1">
                    <ListItem color="#575656" fontWeight="bold">Community</ListItem>
                    <HStack fontSize="xl" color="#575656" spacing={4} mx="auto" pb={5}>
                    <Link href="https://twitter.com/ElixirSoundLib" target="_blank" rel="noopener noreferrer"><FaTwitter/></Link>
                    <Link href="https://discord.gg/XjE3bzKNcT" target="_blank" rel="noopener noreferrer"><FaDiscord/></Link>
                    <Link href="https://www.youtube.com/channel/UCzmRYhE7fOsfz7ef1CcSDOA" target="_blank" rel="noopener noreferrer"><FaYoutube></FaYoutube></Link>
                    </HStack>
                </List>
            </Flex> */}
        </Flex>
    )
}