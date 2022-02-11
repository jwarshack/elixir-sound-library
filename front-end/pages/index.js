
import { useEffect } from 'react'
import Head from 'next/head'
import { VStack } from '@chakra-ui/layout'
import Hero from '../components/Hero'
import ArbitrumAlert from '../components/ArbitrumAlert'
import { useDisclosure } from '@chakra-ui/react'

export default function Home() {

  const { isOpen, onOpen, onClose } = useDisclosure()


  return (
    <>
      <Head>
        <title>Elixir Sound Library</title>
      </Head>
      <VStack id="hero" p={10} position="relative">
        <ArbitrumAlert isOpen={isOpen} onClose={onClose} />
        <Hero />
      </VStack>
    </>
  
  )
}
