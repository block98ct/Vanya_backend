
import { Server } from "socket.io";
import { createServer } from "http";
import express from "express"

const app = express()
const server = createServer(app);
const io = new Server(server); 



// const socket = io("http://localhost:3000");

io.on("connection", () => {
  console.log("A user connected", socket);

});

io.on("error", (error)=>{
  console.log('error', error )
})

listen(3000, ()=>{
     console.log(`the server is running at port ${3000}`)
});
