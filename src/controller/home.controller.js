const fs = require('fs');
const ProductsModel = require("../model/products.model");


class HomeController{
    products;
    constructor() {
        this.products = new ProductsModel();
    }

    async showHomePage(req, res) {
        let getAllProducts = await this.products.getAllProducts();
        let html = '';
        getAllProducts.forEach((products, index) => {
                html += ` <div class="col-md-6 col-lg-4 col-xl-3">
                                <div id="product-${products.id}" class="single-product" >
                                    <div class="part-1" style="background: url(${products.image}) no-repeat center;background-size: cover;">
                                        <ul>
                                            <li><a href=""><i class="fas fa-shopping-cart"></i></a></li>
                                            <li><a href="#"><i class="fas fa-heart"></i></a></li>
                                            <li><a href="#"><i class="fas fa-plus"></i></a></li>
                                            <li><a href="#"><i class="fas fa-expand"></i></a></li>
                                        </ul>
                                    </div>
                                    <div class="part-2">
                                        <h3 class="product-title">${products.name}</h3>
                                        <h4 class="product-old-price">$79.99</h4>
                                        <h4 class="product-price">$${products.price}</h4>
                                    </div>
                                </div>
                            </div>`
        })
        fs.readFile('./views/template/index.html', 'utf8', (err, data) => {
            res.setHeader('Cache-Control', 'no-store');
            res.writeHead(200, {'Content-Type': 'text/html'});
            data = data.replace(' {list-product}',html)
            res.write(data);
            res.end();
        })
    }
 }
 module.exports = HomeController;