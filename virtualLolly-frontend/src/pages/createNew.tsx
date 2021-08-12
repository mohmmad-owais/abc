import React, { useState, useRef } from "react"
import Lolly from "../components/lolly"
import Header from "../components/header"
import { navigate } from "gatsby"
import { useQuery, useMutation, gql } from "@apollo/client"
import { useFormik } from "formik"
import * as Yup from "yup"
import shortid from "shortid"
import { TextField } from "@material-ui/core"

const createLollyMutation = gql`
  mutation createLolly($lolly: createLollyInput!) {
    createLolly(lolly: $lolly) {
      message
      lollyPath
    }
  }
`

export default function CreateNew() {
  const [colorTop, setcolorTop] = useState("#d52368")
  const [colorBot, setcolorBot] = useState("#deaa43")
  const [colorMid, setcolorMid] = useState("#e95946")

  const formik = useFormik({
    initialValues: {
      recName: "",
      sendersName: "",
      message: "",
    },
    validationSchema: Yup.object({
      recName: Yup.string()
        .required("Required")
        .max(15, "Must be 15 characters or less"),
      sendersName: Yup.string()
        .required("Required")
        .max(15, "Must be 15 characters or less"),
      message: Yup.string().required("Required"),
    }),
    onSubmit: values => {
      const id = shortid.generate()

      const submitLollyForm = async () => {
        const lolly = {
          lollyPath: id,
          recipientName: values.recName,
          sendersName: values.sendersName,
          message: values.message,
          flavorTop: colorTop,
          flavorMid: colorMid,
          flavorBot: colorBot,
        }

        const result = await createLolly({
          variables: {
            lolly,
          },
        })
      }

      submitLollyForm()

      navigate(`/lollies/${id}`)
    },
  })

  const [createLolly] = useMutation(createLollyMutation)

  return (
    <div className="container">
      <Header />

      <div className="create_lolly_div">
        <div className="lolly_input_div">
          <div className="lolly">
            <Lolly
              lollyTop={colorTop}
              lollyBot={colorBot}
              lollyMid={colorMid}
            />
          </div>

          <div className="input_div">
            <label htmlFor="topFlavor" className="colorPickerLabel">
              <input
                className="colorPicker"
                value={colorTop}
                type="color"
                name="topFlavor"
                id="topFlavor"
                onChange={e => {
                  setcolorTop(e.target.value)
                }}
              ></input>
            </label>

            <label htmlFor="midFlavor" className="colorPickerLabel">
              <input
                className="colorPicker"
                value={colorMid}
                type="color"
                name="midFlavor"
                id="midFlavor"
                onChange={e => {
                  setcolorMid(e.target.value)
                }}
              ></input>
            </label>

            <label htmlFor="botFlavor" className="colorPickerLabel">
              <input
                className="colorPicker"
                value={colorBot}
                type="color"
                name="botFlavor"
                id="botFlavor"
                onChange={e => {
                  setcolorBot(e.target.value)
                }}
              ></input>
            </label>
          </div>
        </div>

        <form className="message_input_div" onSubmit={formik.handleSubmit}>
          <label className="formLabel" htmlFor="sendName">
            To:
          </label>
          <div className="formErrors">
            {formik.errors.recName && formik.touched.recName
              ? formik.errors.recName
              : null}
          </div>
          <input
            className="to_input"
            type="text"
            name="recName"
            id="recName"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          <label className="formLabel" htmlFor="msg">
            Say something nice
          </label>
          <div className="formErrors">
            {formik.errors.message && formik.touched.message
              ? formik.errors.message
              : null}
          </div>
          <textarea
            id="message"
            name="message"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            className="to_message"
            cols={30}
            rows={15}
          />

          <label className="formLabel" htmlFor="Recname">
            From:
          </label>
          <div className="formErrors">
            {formik.errors.sendersName && formik.touched.sendersName
              ? formik.errors.sendersName
              : null}
          </div>
          <input
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            className="to_from"
            type="text"
            name="sendersName"
            id="sendersName"
          />
          <div className="send_lolly_btn_div2">
            <button className="send_lolly_btn2" type="submit">
              Freeze this lolly
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
