import '../styles/globals.css'
import { ChakraProvider } from "@chakra-ui/react"
import Layout from '../components/Layout'
import theme from "../styles/theme"
import { Web3ContextProvider } from '../context/useWeb3'





function MyApp({ Component, pageProps }) {


  return (
      <ChakraProvider theme={theme}>
        <Web3ContextProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Web3ContextProvider>
      </ChakraProvider>
  )
}

export default MyApp
