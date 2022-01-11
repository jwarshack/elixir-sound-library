import { Flex, Box, Link, VStack, useToast, Button} from "@chakra-ui/react"
import NextLink from 'next/link'
import Image from "next/image"
import { useState } from "react"
import { ethers } from "ethers"
import { shortAddress } from '../utils/helpers'
import { useWeb3 } from "../context/useWeb3"
import { FiMenu, FiX } from 'react-icons/fi'
import MobileNav from "../components/MobileNav"
import logo from "../public/img/logo.png"

export default function Navbar() {


    const [isLoading, setIsLoading] = useState(false)
    const [walletAddress, setWalletAddress] = useState()
    const [showMobileNav, setShowMobileNav] = useState(false)

    const { setWeb3Provider, web3Provider } = useWeb3()
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
                if (chainId !== '0xa4b1') {
                    toast({
                        position: "top",
                        title: "Wrong Network",
                        description: "Please connect to Arbitrum.",
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

                ethereum.on('accountsChanged', () => {
                    window.location.reload()
                  });
                  
                  ethereum.on('chainChanged', (chainId) => {
                    window.location.reload();
    
                  });
            } catch(error) {
                console.log(error)

            }
            setIsLoading(false)
        }
    }

    return (
    <>
        <VStack as="nav" p={8} bg="black">
            <Flex align="center" justify="space-between" w="100%" >

                <NextLink href="/" passHref><a><Image src={logo} alt="Elixir Sound Library Logo"/></a></NextLink>

                <Button cursor="pointer" color="white" bg="black"  fontSize="3xl" onClick={toggleMobileNav} display={{base: "block", md: "none"}}>{!showMobileNav ? <FiMenu/> : <FiX/>}</Button>
                <Box display={{base:"none", md:"block"}}>
                    <NextLink href="/create" passHref><Button mr={4} bg="white" textColor="black">Create</Button></NextLink>
                    {
                        !walletAddress ?
                        <Button bg="white" textColor="black" onClick={connectWallet} isLoading={isLoading}>Connect</Button>
                        : 
                        <Button bg="white" textColor="black" onClick={connectWallet}>{shortAddress(walletAddress)}</Button>
                    }
                </Box>
            </Flex>
            <Flex display={{base: "none", md:"block"}} w="100%" spacing="3">
                <NextLink href="/"><Link  mr={6} color="pink.500" _hover="none" >Home</Link></NextLink>
                <NextLink href="/browse" ><Link mr={6} color="pink.500" _hover="none">Browse</Link></NextLink>
                <NextLink href="/popular" ><Link mr={6} color="pink.500" _hover="none">Popular</Link></NextLink>
                <NextLink href="/my-sounds" ><Link mr={6} color="pink.500" _hover="none">My Sounds</Link></NextLink>
                <NextLink href="/my-licenses" ><Link mr={6} color="pink.500" _hover="none">My Licenses</Link></NextLink>
            </Flex>
        </VStack>
        {showMobileNav ? <MobileNav toggleMobileNav={toggleMobileNav}/> : null}
    </>
    )
}