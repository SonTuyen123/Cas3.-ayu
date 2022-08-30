const BaseModel = require("./base.model");

class ProductsModel extends BaseModel{

    async getAllProducts() {
        const sql = `SELECT * FROM products`;
        return await this.querySQL(sql);
    }
}
module.exports = ProductsModel;