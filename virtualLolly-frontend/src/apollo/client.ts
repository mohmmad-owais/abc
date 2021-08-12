import fetch from "cross-fetch"
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client"

export const client = new ApolloClient({
  link: new HttpLink({
    uri:
      "https://7yevmmgykned7b465tloz2rchm.appsync-api.us-east-2.amazonaws.com/graphql",
    fetch,
    headers: {
      "x-api-key": "da2-mmz72wztdjhbtgvknwsgztdijy",
    },
  }),
  cache: new InMemoryCache(),
})
