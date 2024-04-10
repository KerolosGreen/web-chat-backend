const io = require('socket.io')(3002,{
    cors:{
        origin:['http://localhost:3000']
    }
})
io.on('connection',(socket)=>{

    console.log(socket.id)

    socket.on("join_room",(username,room,message)=>{
            socket.join(room)
            socket.room=room
            socket.name=username
            message('You joined Room : '+room)
            socket.to(room).emit('recieve-message', username+" has joined The Room")
            console.log(socket.id +" Joined Room : "+room)
        })

    socket.on("send-message",(username,message , room,res)=>{
        if(room==""){
            socket.broadcast.emit('recieve-message',message)
            console.log("Message : "+message+" Sent In Public By "+username)
            res(message)
        }
        else{
            socket.to(room).emit('recieve-message',username+" : "+message,username)
            console.log("Message : "+message+" Sent In Room :"+room +" By "+username)
            res(message)
        }
    })

    

    socket.on("disconnect",()=>{
        console.log("User "+socket.id+" Disconnected")
        if(socket.room!=undefined){
            socket.to(socket.room).emit('recieve-message',socket.name+" Disconnected")
        }
    })

})