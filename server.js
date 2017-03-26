var http = require('http');
var express = require('express');
var path = require('path');
var app = express();
var azure = require('azure');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// middle setup
app.use('/public',express.static(path.join(__dirname, 'public')));


//route setup
var index = require('./routes/index');
var chat = require('./routes/chat');
app.use('/', index);
app.use('/chat', chat);

//port setup
var port = process.env.PORT || 3000;


var server = http.createServer(app);
server.listen(port);

//Notificationhub setup
var hubName = 'tt';
var connectionString = 'Endpoint=sb://tettt555.servicebus.windows.net/;SharedAccessKeyName=DefaultFullSharedAccessSignature;SharedAccessKey=rTveSY3YUfovGjLjkSl5e5DxJEXCulyBWH5k6RoiaTk=';
var notificationHubService = azure.createNotificationHubService(hubName,connectionString);


var io = require('socket.io').listen(server);
io.sockets.on('connection',function(socket){
    socket.emit('toclient',{msg:'Welcome!'});
    //xnull으 트겅이마가ㅡㅇ
    notificationHubService.gcm.send(null, {data:{id:socket.id, message:'Welcome'}},function(error){
        if(!error){
            console.log('send');
        }
    });

    socket.on('fromclient',function(data){
        socket.broadcast.emit('toclient',data); // 자신을 제외하고 다른 클라이언트에게 보냄
        socket.emit('toclient',data); // 해당 클라이언트에게만 보냄. 다른 클라이언트에 보낼려면?
        console.log('Message from client :'+data.msg);
       
       //burg 수엉
        if(!data.msg==""){
            notificationHubService.gcm.send(null, {data:{id:socket.id, message:data.msg}}, function(error){
                if(!error){
                    //notification sent
                        console.log('send');
                }
            });
        }
    })
});
