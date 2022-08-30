const http = require('http');
const url = require("url");
const fs = require("fs");
const qs = require("qs");

const AuthController = require("./src/controller/auth.controller");
const HomeController = require("./src/controller/home.controller");
const port = 9000;

let authController = new AuthController();
let homeController = new HomeController();

const mimeTypes = {
    "html": "text/html",
    "js": "text/javascript",
    "min.js": "text/javascript",
    "css": "text/css",
    "min.css": "text/css",
    "jpg": "image/jpg",
    "png": "image/png",
    "gif": "image/gif",
    "woff": "text/html",
    "ttf": "text/html",
    "woff2": "text/html",
    "eot": "text/html",
    "svg": "image/svg+xml",
    "ico": "image/vnd.microsoft.icon"
};
const server = http.createServer((req, res) => {
    let urlParse = url.parse(req.url)
    let urlPath = urlParse.pathname;
    let method = req.method;
    const filesDefences = req.url.match(/\.js|\.css|\.jpg|\.png|\.gif|\.min.js|\.min.css|\.svg|\.ico/);
    if (filesDefences) {
        let filePath = filesDefences[0].toString()
        let extension = mimeTypes[filesDefences[0].toString().split('.')[1]];
        if (filePath.includes('min.css')) {
            extension = mimeTypes[filesDefences[0].toString().slice(1, filesDefences[0].toString().length)]
        }
        if (filePath.includes('min.js')) {
            extension = mimeTypes[filesDefences[0].toString().slice(1, filesDefences[0].toString().length)]
        }
        if (filePath.includes('.ico')) {
            extension = mimeTypes[filesDefences[0].toString().slice(1, filesDefences[0].toString().length)]
        }
        res.writeHead(200, {'Content-Type': extension});
        fs.createReadStream(__dirname + "/views/template/" + req.url).pipe(res);
    }

    switch (urlPath) {
        case '/':
            homeController.showHomePage(req, res)
            break;
        case '/login':
            if (method === 'GET') {
                authController.showFormLogin(req, res)
            } else {
                authController.login(req, res)
            }
            break;

        case '/register':
            if(req.method === 'GET') {
                authController.showFormRegister(req, res) ;
            }else {
                authController.register(req, res)
            }
                break;

        case '/admin':
            authController.showFormAdmin(req, res);
            break;
        case '/table':
            authController.showListAdmin(req, res);
            break;
        case '/createAdmin':
            if (method === 'GET') {
                authController.showFormCreateAdmin(req, res);
            } else {
                authController.createAdmin(req, res);
            }
            break;
        case '/edit':
            console.log(1)
            authController.editAdmin(req, res);
            break
        case '/admin/delete':
            let id = qs.parse(urlParse.query);
            let idDelete = id.index
            console.log(idDelete)
            authController.deleteAdmin(req, res, idDelete).catch();
            break;
        case '/search':
            authController.searchAdmin(req, res).catch();
            break;
    }
});
server.listen(port, () => {
    console.log(`http://localhost:${port}`);
});

