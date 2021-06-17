const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = 8080;

let names = [];
let ips = [];

function newName(name, ip) {
    for (let i = 0; i < names.length; i++) {
        if (names[i] === name) {
            return false;
        }
    }
    names.push(name);
    ips.push(ip);
    return true;
}

function isUser(msg) {
    for (let i = 0; i < msg.length; i++) {
        if (msg[i] === ":") {
            return true;
        }
    }
    return false;
}

function getUser(msg) {
    let res = msg.split(":");

    return res[0];
}

function noLiers(usn, ip) {
    let num;
    for (let i = 0; i < names.length; i++) {
        if (names[i] === usn) {
            num = i;
            break;
        }
    }
    if (ips[num] !== ip)
        return false;
    return true;
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/chat.html');
});

app.get('/favicon.ico', (req, res) => {
    res.sendFile(__dirname + '/favicon.ico');
});

app.get('/styles.css', (req, res) => {
    res.sendFile(__dirname + '/styles.css');
});

io.on('connection', (socket) => {
    var ip = socket.handshake.address, uname;

    socket.on('chat message', msg => {
        if (isUser(msg)) {
            uname = getUser(msg).toString();

            if (noLiers(uname, ip))
                io.emit('chat message', msg);
            else
                console.log("INCORRECT ID!!!");
        }
    });
    socket.on('username', usn => {
        if (newName(usn, ip))
            io.emit('username', usn), console.log("Connected user " + usn);
        else
            io.emit('username', 'Обманщик'), console.log("Attempt to hack user " + usn);
    });
});

http.listen(port);