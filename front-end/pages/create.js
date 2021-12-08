import { useState, useRef } from 'react'
import Head from 'next/head'
import {VStack, Button, Input, Text} from '@chakra-ui/react'
import { ethers } from 'ethers'
import { useWeb3 } from '../context/useWeb3'
import { contractAddress, contractAbi } from '../config'
import { create as ipfsClient}  from 'ipfs-http-client'

const id = process.env.NEXT_PUBLIC_INFURA_IPFS_ID
const secret = process.env.NEXT_PUBLIC_INFURA_IPFS_SECRET

const auth =
  'Basic ' + Buffer.from(id + ':' + secret).toString('base64')

const client = ipfsClient({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth
    }
})


export default function Create() {


    const [formInput, setFormInput] = useState({ name: null, price: null, file: null })
    const audioRef = useRef()

    async function upload() {

        const { name, price, file } = formInput
        

        if (!name || !price || !file) {
            alert('Please fill out all fields.')
            return
        } 

        const fileHash = await uploadAudioFile(file)

        let metadata = {
            "name": name,
            "audio": fileHash,
            "type": file.type
        }

        const json = JSON.stringify(metadata)

        try {
            const added = await client.add(
                json,
                {
                    progress: (prog) => console.log(`received: ${prog}`)
                }
            )
            const url = `ipfs://ipfs/${added.path}`
            console.log(url)

        } catch(error) {
            console.log(error)
        }
    }

    async function uploadAudioFile(file) {
        console.log(file)
        try {
            const added = await client.add(
                file,
                {
                    progress: (prog) => console.log(`received: ${prog}`)
                }
            )
            const url = `ipfs://ipfs/${added.path}`
            console.log(url)
            return url

        } catch (error) {
            console.log("Error uploading audio file: ", error)
        }

    }

    function handleFile(e) {
        const file = e.target.files[0]
        setFormInput({... formInput, file: file})
        try {
            const url = window.URL.createObjectURL(file)
            audioRef.current.style.display = "block"
            audioRef.current?.src = URL.createObjectURL(file)
            audioRef.current?.load()
        } catch(error) {
            console.log(error)
        }
    }





    return (
        <>
            <Head>
                <title>Create | Elixir Sound Library</title>
            </Head>
            <VStack py={20} px={10} spacing={8}maxWidth={700} mx="auto"> 
                <VStack width="100%">
                    <Input py={6} placeholder="Sound Name" onChange={e => setFormInput({ ...formInput, name: e.target.value})}/>
                    <Input py={6} placeholder="Price in ETH" onChange={e => setFormInput({ ...formInput, price: e.target.value})}/>
                </VStack>

                <input type="file" accept="audio/*" onChange={handleFile}/>
                <Button  py={6} width="100%" color="white" bg="pink.500" _hover={{bg: "pink.300"}} onClick={upload}>Upload</Button>
                <Text fontSize="sm">Elixir Sound Library takes a 2% licensing fee</Text>
                <audio ref={audioRef} controls style={{display: "none"}}></audio>
            </VStack>
        </>
    )
}
