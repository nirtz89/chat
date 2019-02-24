var app = require('express')();
var http = require('http').Server(app);
var io = require("socket.io")(http);

var msgs = [];

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    console.log('a user connected');

    // Broadcasts to sender
    socket.emit('all messages', msgs);

    // Broadcasts to all
    socket.on('chat message', function(msg){
        msgs.push(msg);        
        io.emit('chat message', `<strong>${JSON.parse(msg).username}</strong>: ${JSON.parse(msg).msg}`);
    });    

    // User is typing
    socket.on('user typing', function(user){
        socket.broadcast.emit('user typing', `${user}`);
    });    
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});

const port = process.env.PORT || 5000;

http.listen(port, function(){
  console.log('listening on *:3000');
});