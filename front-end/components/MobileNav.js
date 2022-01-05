import { Box, Button, VStack } from '@chakra-ui/react'
import NextLink from 'next/link'

export default function MobileNav({ toggleMobileNav }) {

  return (
    <Box 
      w="100%"
      display={{base: "block", md:"none"}}
      bgColor="black"
      zIndex={20}
      h="100vh"
      pos="absolute"
      top="100"
      left="0"
      py={10}
    >
      <VStack w="50%" spacing="1rem" mx="auto">
          <NextLink href="/"><Button onClick={toggleMobileNav} as="a" w="100%"bgGradient="linear(to-r, pink.400, pink.500)" color="white">Home</Button></NextLink>
          <NextLink href="/browse"><Button onClick={toggleMobileNav} w="100%" as="a" bgGradient="linear(to-r, pink.400, pink.500)" color="white">Browse</Button></NextLink>
          <NextLink href="/popular"><Button onClick={toggleMobileNav} w="100%" as="a" bgGradient="linear(to-r, pink.400, pink.500)" color="white">Popular</Button></NextLink>
          <NextLink href="/my-sounds"><Button onClick={toggleMobileNav}  w="100%" as="a" bgGradient="linear(to-r, pink.400, pink.500)" color="white">My Sounds</Button></NextLink>
          <NextLink href="/my-licenses"><Button onClick={toggleMobileNav} w="100%" as="a" bgGradient="linear(to-r, pink.400, pink.500)" color="white">My Licenses</Button></NextLink>
          <NextLink href="/create"><Button onClick={toggleMobileNav} w="100%" as="a" bgGradient="linear(to-r, pink.400, pink.500)" color="white">Create</Button></NextLink>

      </VStack>

    </Box>
  )
}
