import React, { useEffect } from 'react'
import Head from 'next/head'
import SoundGrid from '../components/SoundGrid'
import { ethers } from 'ethers'
import { gql } from '@apollo/client'
import client from '../apollo-client'
import axios from 'axios'

export default function Browse(props) {

    return (
        <>
            <Head>
                <title>Browse | Elixir Sound Library</title>
            </Head>
            <SoundGrid sounds={props.sounds}/>
        </>
    )
}

export async function getStaticProps() {

    const { data } = await client.query({
        query: gql`
            query {
                sounds {
                  id
                  tokenID
                  tokenURI
                  price
                  owner {
                    id
                  }
                  licenseCount
                }
              }     
        `
    })

    let theseSounds = await Promise.all(data.sounds.map(async i => {
        let price = ethers.utils.formatUnits(i.price, 'ether')
        let metadata = await axios.get(`https://ipfs.infura.io/${i.tokenURI}`)

        let sound = {
            name: metadata.data.name,
            tokenId: i.tokenID.toString(),
            price,
            tokenURI: `https://ipfs.infura.io/${metadata.data.audio}`,
            creator: i.owner.id.toString(),
            licenseCount: i.licenseCount.toString()
        }
        return sound
    }))

    
    return {
        props: {
            sounds: theseSounds
        }
    }
  }