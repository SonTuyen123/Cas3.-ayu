const http = require('http');
const url = require("url");
const fs = require("fs");
const qs = require("qs");

const AuthController = require("./src/controller/auth.controller");
const HomeController = require("./src/controller/home.controller");
const ProductsController = require("./src/controller/products.controller");
const CartController = require("./src/controller/cart.controller");
const {Server}= require("socket.io")
const ChatController = require("./src/controller/chat.controller");


const port = 9000;

let authController = new AuthController();
let homeController = new HomeController();
let productsController = new ProductsController();

let cartController = new CartController();

let chatController = new ChatController();
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
const httpServer = http.createServer((req, res) => {
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
            if (req.method === 'GET') {
                authController.showFormRegister(req, res);
            } else {
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
        case '/products':
            let idProduct = qs.parse(urlParse.query).id
            productsController.addProducttoCart(req, res, idProduct)
            break;

        case '/cart':
            cartController.showCart(req, res)
            break;
        case '/pay':
            homeController.showHomePage(req, res)
            break;
        case'/support':
            chatController.showChat(req,res);
            break;
        case'/adminsupport':
            chatController.showChatAdmin(req, res);
            break;
    }
});
let io = new Server(httpServer,{
    cors: {
        origin: 'http://localhost:9000/support',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    }
});
let users = [];
io.on('connection', socket => {
    socket.on('new-user', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-connected', name);
    })
    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnect', users[socket.id]);
        delete users[socket.id];
    })
    socket.on('send-chat-message', message => {
        let room = {
            name : users[socket.id],
            message : message
        }
        socket.broadcast.emit('chat-message', room)
        chatController.createMessage(room)
    })
})

httpServer.listen(port, () => {
    console.log(`http://localhost:${port}`);
});
