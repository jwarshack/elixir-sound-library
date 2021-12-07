import { Container, Box, Flex } from "@chakra-ui/layout";
import Navbar from './Navbar'
import Footer from './Footer'


export default function Layout({children}) {
    return (
        <Flex minH="100vh" direction="column">
            <Navbar />
                <Box flexGrow="1">{children}</Box>
            <Footer/>
        </Flex>
    )

}