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
import { Message, User } from "../types"

const socket = io("http://localhost:3001", { transports: ["websocket"] })



const Home = () => {
  const [username, setUsername] = useState("")
  const [message, setMessage] = useState("")
  const [messageText, setMessageText] = useState("")
  const [loggedIn, setLoggedIn] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState<User[]>([])
  const [chatHistory, setChatHistory] = useState<Message[]>([])

  useEffect(() => {
    socket.on("welcome", welcomeMessage => {
      console.log(welcomeMessage)
      socket.on("loggedin", onlineUsersList => {
        console.log(onlineUsersList)
        setLoggedIn(true)
        setOnlineUsers(onlineUsersList)

        socket.on("newConnection", onlineUsersList => {

          console.log("a new user just connected!")
          setOnlineUsers(onlineUsersList)
        })

        socket.on("newMessage", receivedMessage => {
          console.log(receivedMessage)

          setChatHistory(chatHistory => [
            ...chatHistory,
            receivedMessage.message,
          ])
        })
      })
    })
  })
  const handleUsernameSubmit = () => {
    socket.emit("setUsername", { username })

  }
  const sendMessage = () => {
    const newMessage: Message = {
      text: messageText,
      sender: username,
      createdAt: new Date().toLocaleString("en-US"),
    }
    socket.emit("sendmessage", { message: newMessage })

    setChatHistory([...chatHistory, newMessage])
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
              handleUsernameSubmit()
            }}
          >
            <FormControl
              placeholder="Set your username here"
              value={username}
              onChange={e => setUsername(e.target.value)}
              disabled={loggedIn}
            />
          </Form>
          {/* )} */}
          {/* MIDDLE AREA: CHAT HISTORY */}
          <ListGroup>
            {chatHistory.map((message, index) => (
              <ListGroup.Item key={index}>
                <strong>{message.sender}</strong> | {message.text} at{" "}
                {message.createdAt}
              </ListGroup.Item>
            ))}
          </ListGroup>
          {/* BOTTOM AREA: NEW MESSAGE */}
          <Form
            onSubmit={e => {
              e.preventDefault()
              sendMessage()
            }}
          >
            <FormControl
              placeholder="Write your message here"
              value={messageText}
              onChange={e => setMessageText(e.target.value)}
              disabled={!loggedIn}
            />
          </Form>
        </Col>
        <Col md={3}>
          {/* ONLINE USERS SECTION */}
          <div className="mb-3">Connected users:</div>
          {onlineUsers.length === 0 && (
            <ListGroup.Item>Log in to see who is online!</ListGroup.Item>
          )}
          <ListGroup>
            {onlineUsers.map(user => (
              <ListGroup.Item key={user.socketId}>
                {user.username}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  )
}

export default Home
