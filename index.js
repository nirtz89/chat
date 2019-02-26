var app = require('express')();
var http = require('http').Server(app);
var io = require("socket.io")(http);

var msgs = [];
var connected_users = [];

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.get('/chat', function(req, res){
    res.sendFile(__dirname + '/chat.html');
});

io.on('connection', function(socket){
    console.log('a user connected');
    connected_users.push("test");
    socket.emit('users connected', connected_users);

    // Broadcasts to sender
    socket.emit('all messages', msgs);

    // Broadcasts to all
    socket.on('chat message', function(msg){
        msgs.push(msg);
        msg = JSON.parse(msg);
        if (msg.msg.indexOf("::delete")>-1) {
            msgs = [];
            msg.msg = "<span style='color:red;'>ALL MESSAGES DELETED</span>";
            msg.username = "Admin";
        }
        io.emit('chat message', `<strong>${msg.username}</strong>: ${msg.msg}`);
    });    

    // User is typing
    socket.on('user typing', function(user){
        socket.broadcast.emit('user typing', `${user}`);
    });    
    socket.on('disconnect', function(user){
        console.log('user disconnected');
        console.log(user);
    });
});

const port = process.env.PORT || 5000;

http.listen(port, function(){
  console.log(`listening on port ${port}`);
});