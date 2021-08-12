import React from "react"
import Lolly from "../components/lolly"
import Header from "../components/header"
import { useQuery, gql } from "@apollo/client"

const GET_LOLLY_BY_PATH = gql`
  query getLollies($lollyPath: String!) {
    getLollyByPath(lollyPath: $lollyPath) {
      flavorBot
      flavorMid
      flavorTop
      lollyPath
      message
      recipientName
      sendersName
    }
  }
`

export default function NotFound({ location }) {
  var queryLollies = location.pathname.slice(0, 9)
  var queryPath = location.pathname.slice(9)

  const { loading, error, data } = useQuery(GET_LOLLY_BY_PATH, {
    variables: { lollyPath: queryPath },
  })

  return (
    <div>
      {loading ? (
        <div className="loading">Loading...</div>
      ) : !!data && queryLollies === "/lollies/" ? (
        <div>
          <Header />

          <div className="showlolly_main_div">
            <div>
              <Lolly
                lollyTop={data.getLollyByPath.flavorTop}
                lollyMid={data.getLollyByPath.flavorMid}
                lollyBot={data.getLollyByPath.flavorBot}
              />
            </div>
            <div className="message_div">
              <p className="show_recipient_name">
                For: {data.getLollyByPath.recipientName.toUpperCase()}
              </p>
              <p className="show_get_message">
                Message:{data.getLollyByPath.message}
              </p>
              <p className="show_sender_name">
                From:
                {data.getLollyByPath.sendersName}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="pageNotFound">404. Page not found.</div>
      )}
    </div>
  )
}
