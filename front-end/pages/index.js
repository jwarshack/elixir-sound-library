
import { useEffect } from 'react'
import { Heading, VStack } from '@chakra-ui/layout'
import Hero from '../components/Hero'
import { useWeb3 } from '../context/useWeb3'

export default function Home() {

  const { web3Provider } = useWeb3()

  useEffect(() => {
    console.log(web3Provider)
  }, [])

  return (
    <VStack id="hero" p={10}>
      <Hero />
    </VStack>
  

  )
}
