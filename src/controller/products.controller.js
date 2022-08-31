const BaseModel = require('../model/base.model');
const ProductsModel = require("../model/products.model");
const cookie = require('cookie');
const fs = require('fs');
const HomeController = require("./home.controller");

class ProductsController {
    productModel;
    homepage;
    constructor() {
        this.productModel = new ProductsModel();
        this.homepage = new HomeController()
    }
    async addProducttoCart(req, res, idProduct) {
        // console.log(idProduct);
        let cookieUserLogin = {
            email: '',
            password: ''
        }
        // console.log(req.headers.cookie)
        if(req.headers.cookie){
            let cookies = cookie.parse(req.headers.cookie);
            if (cookies && cookies.user){
                cookieUserLogin = JSON.parse(cookies.user);
                // console.log(cookieUserLogin.email);
                console.log(cookieUserLogin.email)
                let data = fs.readFileSync('./token/' +cookieUserLogin.email+ '.txt','utf-8');
                console.log(data)
                let cart = JSON.parse(data).cart
                cart.push(idProduct)
                let session = {
                    email:cookieUserLogin.email,
                    cart:cart
                }
                console.log(cart)
                console.log(session)
                let newData = JSON.stringify(session)
                fs.writeFileSync('./token/'+ cookieUserLogin.email + '.txt',newData);

                this.homepage.showHomePage(req, res)
            }
        }
    }

}
module.exports = ProductsController;