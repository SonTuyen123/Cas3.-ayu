const BaseModel = require('../model/base.model');
const ProductsModel = require("../model/products.model");
const cookie = require('cookie');
const fs = require('fs');

class ProductsController {
    productModel;
    constructor() {
        this.productModel = new ProductsModel();
    }

    async addProducttoCart(req, res, idProduct) {
        console.log(idProduct);
        let cookieUserLogin = {
            email: '',
            password: ''
        }
        let session = {
            email:cookieUserLogin.email,
            cart:[]
        }

        console.log(req.headers.cookie)
        if(req.headers.cookie){
            let cookies = cookie.parse(req.headers.cookie);
            if (cookies && cookies.user){
                cookieUserLogin = JSON.parse(cookies.user);
                console.log(cookieUserLogin.email)

                session.cart.push(idProduct);
                let data = JSON.stringify(session)
                fs.writeFileSync('./token/'+ cookieUserLogin.email + '.txt',data)
            }
        }
    }

}
module.exports = ProductsController;