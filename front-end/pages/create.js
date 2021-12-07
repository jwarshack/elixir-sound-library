import { useState } from 'react'
import {VStack, Button, Input, Text} from '@chakra-ui/react'
import { ethers } from 'ethers'
import { useWeb3 } from '../context/useWeb3'
import { contractAddress, contractAbi } from '../config'
import axios from 'axios'


export default function Create() {

    const [formInput, setFormInput] = useState({ name: null, price: null, file: null})



    // async function createSound() {
    //     const { price, name } = formInput
    //     if (!name || !price || !fileUrl) return

    //     const { web3Provider } = useWeb3()

        

    //     if (web3Provider) {
    //         const signer = web3Provider.getSigner()
    //         const contract = new ethers.Contract(contractAddress, contractAbi, signer);
            
    //         let txn = await contract.mintSound(fileUrl)


    //     }
    // }

    function pinFileToIPFS() {
        const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
        return axios.post(url,
            data,
            {
                maxContentLength: 'Infinity', //this is needed to prevent axios from erroring out with large files
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                    'pinata_api_key': pinataApiKey,
                    'pinata_secret_api_key': pinataSecretApiKey
                }
            }
        ).then(function (response) {
            //handle response here
        }).catch(function (error) {
            //handle error here
        });

    }


    return (
        <VStack py={20} px={10} spacing={8}maxWidth={700} mx="auto"> 
            <VStack width="100%">
                <Input py={6} placeholder="Sound Name" onChange={e => setFormInput({ ...formInput, name: e.target.value})}/>
                <Input py={6} placeholder="Price in ETH" onChange={e => setFormInput({ ...formInput, price: e.target.value})}/>
            </VStack>

            <input type="file" onChange={e => setFormInput({ ...formInput, name: e.target.files[0]})}/>
            <Button  py={6} width="100%" color="white" bg="pink.500" _hover={{bg: "pink.300"}}>Upload</Button>
            <Text fontSize="sm">Elixir Sound Library takes a 2% licensing fee</Text>
        </VStack>
    )
}
