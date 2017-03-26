


var http = require('http');
http.createServer(function (req, res) {
    console.log('Got request for ' + req.url);
    console.log('port ' +process.env.PORT);
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('<h1>Hello Code and Azure Web Apps!</h1>'+process.env.PORT);
}).listen(process.env.PORT);