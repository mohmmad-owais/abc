import React from "react"
import Lolly from "../components/lolly"
import Header from "../components/header"
import { navigate } from "gatsby"

export default function Home() {
  return (
    <div className="container">
      <div>
        <Header />
      </div>
      <div className="lolly_main_div">
        <div>
          <Lolly lollyTop="#e97393" lollyBot="#d23a61" lollyMid="#ba1260" />
        </div>
        <div>
          <Lolly lollyTop="#ed275c" lollyBot="#f47048" lollyMid="#f4c64e" />
        </div>
        <div>
          <Lolly lollyTop="#97e666" lollyBot="#8dcb4c" lollyMid="#a8d039" />
        </div>
      </div>
      
      <div className="send_lolly_btn_div">
        <button
          className="send_lolly_btn"
          onClick={() => {
            navigate("/createNew")
          }}
        >
          Make a new lolly to send to a friend
        </button>
      </div>
    </div>
  )
}
