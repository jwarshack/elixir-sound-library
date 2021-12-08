import { Button } from '@chakra-ui/button'
import { Flex, Grid, Link } from '@chakra-ui/layout'
import NextLink from 'next/link'
import React from 'react'

export default function Hero() {
    return (
        <Grid bgImage="../public/hero.png"
            templateColumns={{sm:"repeat(1, 1fr)", md: "repeat(2, 1fr)"}}
            p={10}
            gap={10}
            color="white"
            w="100%"
            maxW="600px"
        >
            <NextLink href="/browse"><Button as="a"  w="100%" h={{base: "100px", md: "200px"}} cursor="pointer" rounded="xl" fontSize="xl" bgGradient="linear(to-r, pink.400, pink.500)"  _hover={{bg: "pink.300"}}>Browse</Button></NextLink>
            <NextLink href="/"><Button as="a" w="100%" h="200px" h={{base: "100px", md: "200px"}} cursor="pointer" rounded="xl" fontSize="xl" bgGradient="linear(to-r, pink.400, pink.500)" _hover={{bg: "pink.300"}}>Popular</Button></NextLink>
            <NextLink href="/my-sounds"><Button as="a" w="100%" h={{base: "100px", md: "200px"}} cursor="pointer"  rounded="xl" fontSize="xl" bgGradient="linear(to-r, pink.400, pink.500)" _hover={{bg: "pink.300"}}>My Sounds</Button></NextLink>
            <NextLink href="/create"><Button as="a" w="100%" h={{base: "100px", md: "200px"}}  cursor="pointer"  rounded="xl" fontSize="xl" bgGradient="linear(to-r, pink.400, pink.500)" _hover={{bg: "pink.300"}}>Create</Button></NextLink>


        </Grid>
    )
}

