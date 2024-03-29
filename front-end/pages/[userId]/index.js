import Head from 'next/head'
import { VStack, Heading } from '@chakra-ui/react'
import SoundGrid from '../../components/SoundGrid'
import { ethers } from 'ethers'
import { getAddressOrENS } from '../../utils/helpers'
import axios from 'axios'
import Davatar from '@davatar/react'
import { gql } from '@apollo/client'
import client from '../../apollo-client'


export default function Index(props) {

    return (
        <>
            <Head>
                <title>Profile - {props.userId} | Elixir Sound Library</title>
            </Head>
            <VStack pt={10}>
                <Davatar size={75} address={ethers.utils.getAddress(props.userId)}/>
                <Heading>{props.tokens[0].ens}</Heading>
            </VStack>
            <SoundGrid sounds={props.tokens}/>
        </>
    )
}

export async function getStaticPaths() {
    const { data } = await client.query({
        query: gql`
            query {
                users {
                  id
                }
              }     
        `
    })


    let paths = data.users.map((user) => {
        return {
            params: {
                userId: user.id
            }
        }
    })

    return {
        paths,
        fallback: false
    }
}

export async function getStaticProps(context) {
    const userId = context.params.userId
    const { data } = await client.query({
        query: gql`
            query {
                users(where: {id: "${userId}"}) {
                    id
                    sounds {
                        tokenID
                        tokenURI
                        price
                        licenseCount
                    }
                }
              }     
        `
    })

    let theseSounds = await Promise.all(data.users[0].sounds.map(async i => {
        let price = ethers.utils.formatUnits(i.price, 'ether')
        let metadata = await axios.get(`https://ipfs.infura.io/${i.tokenURI}`)


        const provider = ethers.getDefaultProvider("homestead", {
            alchemy: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
            infura: process.env.NEXT_PUBLIC_INFURA_API_KEY
        })
        let ens = await getAddressOrENS(userId, provider)

        let sound = {
            name: metadata.data.name,
            tokenId: i.tokenID.toString(),
            price,
            tokenURI: `https://ipfs.infura.io/${metadata.data.audio}`,
            creator: userId,
            ens,
            licenseCount: i.licenseCount.toString()
        }
        return sound
    }))

    return {
        props: {
            userId: userId,
            tokens: theseSounds
        }
    }
}
