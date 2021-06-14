const http = require("http");
const fs = require('fs').promises;

const host = 'localhost';
const port = '8080';

var Messages = [];
var NumOfMessages = 0;

const requestListener = function (req, res) {
    console.log(
        `Request: ${req.method}, ${req.url}`
    );
    let fileName;
    let contentType;

    if (req.url === "/") {
        fileName = "chat.html";
        contentType = "text/html";
    }
    else if (req.url === "http://localhost:8080/send") {
        res.writeHead(200);
        let data = "";
        req.on('data', chunk => {
            data += chunk;
        })
        req.on('end', () => {
            console.log(JSON.parse(data).todo);
            Messages[NumOfMessages++] = data;
            console.log(data);
            res.end();
        })
        console.log(
            `Request headers: ${JSON.stringify(req.headers)}`
        );
    }
    else if (req.url.endsWith(".css")) {
        fileName = req.url.substr(1);
        contentType = "text/css";
    } else {
        res.writeHead(500);
        res.end("Error, unsupported");
        return;
    }

    fs.readFile(`${__dirname}/${fileName}`)
        .then(contents => {
            res.setHeader("Content-Type", contentType);
            res.writeHead(200);
            res.end(contents);
        })
        .catch(err => {
            res.writeHead(500);
            res.end(err);
            return;
        });
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});