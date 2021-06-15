const http = require("http");
const fs = require('fs').promises;

const port = '8080';

var Message = "";
var allMessages = [];
var Num = 0;

const requestListener = function (req, res) {
    console.log(
        `Request: ${req.method}, ${req.url}`
    );
    let fileName;
    let contentType;
    let IsMsg = false;


    if (req.url === "/") {
        fileName = "chat.html";
        contentType = "text/html";
    }
    else if (req.url === "/newMessage") {
        IsMsg = true;
        res.writeHead(200);
        let data = "";
        req.on('data', (chunk) => {
            data += chunk.toString();
        })
        req.on('end', () => {
            console.log(`Reseived message: ${data}`);
            if (data !== "") {
                Message = data;
                allMessages[Num++] = data;
            }
            res.end();
        })
        console.log(
            `Request headers: ${JSON.stringify(req.headers)}`
        );
        return;
    }
    else if (req.url === "/getMessage") {
        IsMsg = true;
        res.writeHead(200);
        res.end(JSON.stringify(allMessages));
        console.log("Getting messages from user...");
    }
    else if (req.url === "/getMessage") {
        IsMsg = true;
        res.writeHead(200);
        res.end(JSON.stringify(Messages));
        console.log("Getting messages from user...");
    }
    else if (req.url.endsWith(".css")) {
        fileName = req.url.substr(1);
        contentType = "text/css";
    } else {
        res.writeHead(500);
        res.end("Error, unsupported");
        return;
    }

    if (!IsMsg) {
        fs.readFile(`${__dirname}/${fileName}`)
            .then(contents => {
                res.setHeader("Content-Type", contentType);
                res.writeHead(200);
                res.end(contents.toString());
            })
            .catch(err => {
                res.writeHead(500);
                res.end(err.message);
                return;
            });
    }
};

const server = http.createServer(requestListener);
server.listen(port);