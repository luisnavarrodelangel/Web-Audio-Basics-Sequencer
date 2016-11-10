var http = require('http');
var express = require('express');
var WebSocket = require('ws');

var httpServer = http.createServer();
var wss = new WebSocket.Server({server: httpServer});


var expressServer = express();
expressServer.use(express.static(__dirname));
httpServer.on('request', expressServer);

httpServer.listen(2300); //wsPort use high number so dont conflict

wss.broadcast = function(m) {
  for(var i in this.clients) {
    this.clients[i].send(m);
  }
}


var freq, amp;
freq = 440;
amp = 0.1;

wss.on('connection', function(conn) {
  console.log("new connection");
  //send current freq and amp to new participant
  var response = {request: "setResponse", freq: freq, amp: amp, msg: "hi there"};
  var t = JSON.stringify (response);
  conn.send(t);
//s
conn.on('message', function(m) {
   var o = JSON.parse(m);
   if (o.request = 'set') {
    console.log(o.freq + " " + o.amp);
    var response = {request: "setResponse", freq:o.freq, amp: o.amp};
    var t = JSON.stringify(response);
    wss.broadcast(t); 

   //conn.send(t);
   }
   else {
    console.log("unrecognized request type");
   }
  });
}); //call back and anonimouus function, asynchronize function, not direct control.


//node firstjs.js

// npm 

