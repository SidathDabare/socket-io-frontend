export type User = {
  username: string
  id: string
  room: "blue" | "red"
}

export type Message = {
  sender: string
  text: string
  createdAt: string
}
