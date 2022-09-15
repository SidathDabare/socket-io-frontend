export type User = {
  username: string
  socketId: string
  room: "blue" | "red"
}

export type Message = {
  sender: string
  text: string
  createdAt: string
}
