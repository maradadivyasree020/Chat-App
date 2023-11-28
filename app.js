const express=require('express')
const path=require('path')

const app=express()
const server=app.listen(3000,()=>{
    console.log("running on 3000")
})
app.use(express.static(path.join(__dirname,'public')))

let socketsConnected=new Set()
const io=require('socket.io')(server)
io.on('connection',onConnected)

//no of clients
function onConnected(socket){
    console.log(socket.id)
    socketsConnected.add(socket.id)

    io.emit('clients-total',socketsConnected.size)
    
    socket.on('disconnect',()=>{
        console.log('Socket disconnected',socket.id)
        socketsConnected.delete(socket.id)
        io.emit('clients-total',socketsConnected.size)
    })

    //recieving msg from client 
    socket.on('message',(data)=>{
        console.log(data)
        socket.broadcast.emit('chat-message',data)
    })

    //feedback 
    socket.on('feedback',(data)=>{
        socket.broadcast.emit('feedback',data)
    })
}