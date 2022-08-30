const BaseModel = require("./base.model");

class ProductsModel extends BaseModel{

    async getAllProducts() {
        const sql = `SELECT * FROM products`;
        return await this.querySQL(sql);
    }
    async getProductInCart(req, res, idProduct) {
        console.log(idProduct)
        const sql = `insert into order_details(product_id) VALUES '${idProduct}'`;
        return await this.querySQL(sql);
    }
}
module.exports = ProductsModel;