import { ApolloClient, InMemoryCache } from "@apollo/client"

const client = new ApolloClient({
    uri: " https://api.thegraph.com/subgraphs/name/jwarshack/arbitrum-rinkeby-elixir",
    cache: new InMemoryCache(),
})

export default client