const fs = require('fs');
const CartModel = require("../model/cart.model");

class CartController{
    cartModel;
    constructor(){
        this.cartModel = new CartModel();
    }
    showCart(req, res){

        //lay dc casrt sesion

        this.cartModel.showListCart(req, res);


    }
}
module.exports = CartController;
