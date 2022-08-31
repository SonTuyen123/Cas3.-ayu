const BaseModel = require("./base.model");
const fs = require("fs");
const cookie = require("cookie");
class CartModel extends BaseModel {
    async showListCart(req, res) {
        let html = '';
        let cookieUserLogin = {
            email: '',
            password: ''
        }
        if (req.headers.cookie) {
            let cookies = cookie.parse(req.headers.cookie);
            if (cookies && cookies.user) {
                cookieUserLogin = JSON.parse(cookies.user);
                let data = fs.readFileSync('./token/' + cookieUserLogin.email + '.txt', 'utf-8');
                let dataCart = JSON.parse(data).cart;

                for (let i = 0; i < dataCart.length; i++) {
                    let product = await this.getCartProdcuts(dataCart[i]);
                    // console.log(product)
                    html +=`<tr class="inner-box border-bottom-0">
                        <th scope="row">
                            <input type="checkbox" value="${product[0].name}">
                            <p>${product[0].name}</p>
                        </th>
                        <td>
                          <div class="event-img">
                            <img src="${product[0].image}" />
                          </div>
                        </td>
                        <th>
                          <div class="event-wrap">
                            <h3><a>${product[0].description}</a></h3>
                          </div>
                        </th>
                        <th>
                            <span>${product[0].price}</span>
                        </th>
                      </tr>`
                }
                fs.readFile('./views/template/a.html', 'utf8', (err, data) => {
                    data = data.replace('{list-cart}', html);
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write(data);
                    res.end();
                })
            }
        }
    }
    async getCartProdcuts( idProduct) {
        const sql = `SELECT * FROM products WHERE id = ${idProduct}`;
        return await this.querySQL(sql);
    }

}
module.exports = CartModel;