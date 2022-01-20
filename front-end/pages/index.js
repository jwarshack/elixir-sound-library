
import { useEffect } from 'react'
import Head from 'next/head'
import { VStack } from '@chakra-ui/layout'
import Hero from '../components/Hero'

export default function Home() {

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
