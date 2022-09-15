import { useEffect, useState } from "react"
import {
  Container,
  Row,
  Col,
  Form,
  FormControl,
  ListGroup,
  Button,
} from "react-bootstrap"
import { io } from "socket.io-client"

const socket = io("http://localhost:3001", { transports: ["websocket"] })



const Home = () => {
  const [username, setUsername] = useState("")
  const [message, setMessage] = useState("")

  useEffect(() => {
    socket.on("welcome", welcomeMessage => {
      console.log(welcomeMessage)
    })
  })
  const handleUsernameSubmit = () => {
    socket.emit("setUsername", { username })

  }

  return (
    <Container fluid>
      <Row style={{ height: "95vh" }} className="my-3">
        <Col md={9} className="d-flex flex-column justify-content-between">
          {/* LEFT COLUMN */}
          {/* TOP AREA: USERNAME INPUT FIELD */}
          {/* {!loggedIn && ( */}
          <Form
            onSubmit={e => {
              e.preventDefault()
            }}
          >
            <FormControl
              placeholder="Set your username here"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </Form>
          {/* )} */}
          {/* MIDDLE AREA: CHAT HISTORY */}
          <ListGroup></ListGroup>
          {/* BOTTOM AREA: NEW MESSAGE */}
          <Form
            onSubmit={e => {
              e.preventDefault()
            }}
          >
            <FormControl
              placeholder="Write your message here"
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
          </Form>
        </Col>
        <Col md={3}>
          {/* ONLINE USERS SECTION */}
          <div className="mb-3">Connected users:</div>
        </Col>
      </Row>
    </Container>
  )
}

export default Home
