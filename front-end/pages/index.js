
import { useEffect } from 'react'
import Head from 'next/head'
import { Heading, VStack } from '@chakra-ui/layout'
import Hero from '../components/Hero'
import { useWeb3 } from '../context/useWeb3'

export default function Home() {

  const { web3Provider } = useWeb3()

  return (
    <>
      <Head>
        <title>Elixir Sound Library</title>
      </Head>
      <VStack id="hero" p={10}>
        <Hero />
      </VStack>
    </>
  

  )
}
