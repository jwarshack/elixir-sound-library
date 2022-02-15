import React from 'react'
import arbitrum from '../public/img/arbitrum-logo.svg'
import Image from 'next/image'
import { Alert, AlertTitle, Button, Flex, useToast } from '@chakra-ui/react'
import { useWeb3 } from '../context/useWeb3'

export default function ArbitrumAlert() {

    const { web3Provider } = useWeb3()

    const toast = useToast()


    async function addNetwork() {


        const params = {
            chainId: '0xa4b1',
            chainName: 'Arbitrum One',
            nativeCurrency: {
                name: 'Ether',
                symbol: "AETH",
                decimals: 18
            },
            rpcUrls: ['https://arb1.arbitrum.io/rpc'],
            blockExplorerUrls: ['https://arbiscan.io']
        }

        let accounts = await ethereum.request({ method: 'eth_requestAccounts' })

        window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [params, accounts[0]],
          })
    }

    return (
        <Alert position="absolute" top="0" bg="white" justifyContent="center" p="0">
            <Flex align="center">
                <Image src={arbitrum} width={25} height={25} alt="Arbitrum Logo"/>
                <AlertTitle ml="2">We are live on Arbitrum!</AlertTitle>
                <Button p="0" m="0" bg="none" fontWeight="regular" _hover={{color: "gray.500"}} onClick={addNetwork}>Add network to Metamask.</Button>
            </Flex>
        </Alert>
    )
}
