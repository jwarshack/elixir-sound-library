import { Flex, Heading, Box, Link, VStack, Text, useToast, Button, IconButton} from "@chakra-ui/react"
import NextLink from 'next/link'
import Image from "next/image"
import { useState } from "react"
import { ethers } from "ethers"
import { shortAddress } from '../utils/helpers'
import { useWeb3 } from "../context/useWeb3"
import { FiMenu, FiX } from 'react-icons/fi'
import MobileNav from "../components/MobileNav"
import logo from "../public/img/elixir.png"

export default function Navbar() {

    const [isLoading, setIsLoading] = useState(false)
    const [walletAddress, setWalletAddress] = useState()
    const [showMobileNav, setShowMobileNav] = useState(false)

    const { setWeb3Provider } = useWeb3()
    const toast = useToast()

    function toggleMobileNav() {
        const prevValue = showMobileNav
        setShowMobileNav(!prevValue)
    }


    async function connectWallet() {
        if(!window.ethereum) {
            toast({
                position: "top",
                title: "No wallet detected",
                description: "Please install Metamask.",
                status: "error",
                duration: 9000,
                isClosable: true,
            })
        } else {
            setIsLoading(true)
            try {
                const chainId = await ethereum.request({ method: 'eth_chainId' });
                if (chainId !== '0x4') {
                    toast({
                        position: "top",
                        title: "Wrong Network",
                        description: "Please connect to mainnet.",
                        status: "error",
                        duration: 9000,
                        isClosable: true,
                    })
                    
                } else {
                    await ethereum.request({ method: 'eth_requestAccounts' })
                    const provider = new ethers.providers.Web3Provider(window.ethereum)
                    const signer = provider.getSigner()
                    const address = await signer.getAddress()
                    setWalletAddress(address) 
                    setWeb3Provider(provider)
                }
            } catch(error) {
                console.log(error)

            }
            setIsLoading(false)
        }
    }

    async function blahh() {
        const permissions = await window.ethereum.request({
            method: 'wallet_requestPermissions',
            params: [{
              eth_accounts: {},
            }]
          });

    }
    return (
    <>
        <VStack as="nav" p={8} bg="black">
            <Flex align="center" justify="space-between" w="100%" >
                {/* <NextLink href="/"><Heading color="white"><Text as="span" color="green.600">Elixir</Text> Sound Library</Heading></NextLink> */}
                {/* <NextLink href="/"><Image src={logo}/></NextLink> */}
                {/* <NextLink href="/"><Link p={0} m={0}><Image src={logo} /></Link></NextLink> */}
                <NextLink href="/"><Image src={logo} alt="Elixir Sound Library Logo"/></NextLink>

                <IconButton cursor="pointer" color="white" bg="black" as={!showMobileNav ? FiMenu : FiX} onClick={toggleMobileNav} display={{base: "block", md: "none"}}/>
                <Box display={{base:"none", md:"block"}}>
                    <NextLink href="create"><Button mr={4} bg="white" textColor="black">Create</Button></NextLink>
                    {
                        !walletAddress ?
                        <Button bg="white" textColor="black" onClick={connectWallet} isLoading={isLoading}>Connect</Button>
                        : 
                        <Button bg="white" textColor="black" onClick={connectWallet}>{shortAddress(walletAddress)}</Button>
                    }
                </Box>
            </Flex>
            <Flex display={{base: "none", md:"block"}} w="100%" spacing="3">
                <NextLink href="/"><Link  mr={6} color="pink.500" _hover="none">Home</Link></NextLink>
                <NextLink href="/browse"><Link mr={6} color="pink.500" _hover="none">Browse</Link></NextLink>
                <NextLink href="/"><Link mr={6} color="pink.500" _hover="none">Popular</Link></NextLink>
                <NextLink href="/my-sounds"><Link mr={6} color="pink.500" _hover="none">My Sounds</Link></NextLink>
                <NextLink href="/my-licenses"><Link mr={6} color="pink.500" _hover="none">My Licenses</Link></NextLink>
            </Flex>
        </VStack>
        {showMobileNav ? <MobileNav toggleMobileNav={toggleMobileNav}/> : null}
    </>
    )
}