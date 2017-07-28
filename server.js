var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var fs = require('fs');
var Bot = require('./bot');

app.listen(8001);

function handler (req, res) {
    fs.readFile(__dirname + '/index.html',
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }

            res.writeHead(200);
            res.end(data);
        });
}

Bot.init(function() {

    io.on('connection', function (socket) {
        socket.emit('botReady', { hello: 'world' });

        var lastMove = {
            leftFwd: 0,
            rightFwd: 0,
            leftRev: 0,
            rightRev: 0
        };
        
        socket.on('botMove', function (thisMove) {
            Object.keys(thisMove).forEach(function(direction){
                if (thisMove[direction] !== lastMove[direction]) {
                    if (thisMove[direction]) {
                        Bot[direction](255);
                    } else {
                        Bot[direction](0);
                    }
                }
            });
            lastMove = thisMove;
        });
    });

});
