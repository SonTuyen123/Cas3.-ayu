const fs = require("fs");
const qs = require('qs');
const  UserModel = require('../model/user.model')
const cookie = require('cookie');

class  AuthController{
    UserModel;

    constructor(){
        this.UserModel = new UserModel();
    }

    showHomePage(req, res){
        fs.readFile('./views/template/index.html', 'utf8', (err, data) => {
            res.writeHead(200, { 'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        })
    }
    showFormAdmin(req, res) {
        fs.readFile('./views/template/admin.html', 'utf8', (err, data) => {
            res.writeHead(200, { 'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        })
    }
    showListAdmin(req, res) {
        const editButton = (obj) => {
            return `<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@getbootstrap" onclick='getData(${obj})'>Edit</button>`
        }

        fs.readFile('./views/template/table.html', 'utf8', async (err, data) => {
            if (err) {
                console.log(err.message);
            } else {
                let admin = await this.UserModel.getAdmin();
                let html = '';
                admin.map((element, index) => {
                    let id = element.id;
                    html += `<tr>`;
                    html += `<td>${index + 1}</td>`;
                    html += `<td>${element.name}</td>`;
                    html += `<td>${element.email}</td>`;
                    html += `<td>${element.password}</td>`;
                    html += `<td>${editButton(JSON.stringify(element))}</td>`;
                    html += `<td><a onclick="return confirm('Are you sure?')" href="/delete?index=${id}" class ="btn btn-danger">DELETE</a></td>`;
                  });
                data = data.replace('{list-users}', html);
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                res.end();
            }
        })
    };
    showFormCreateAdmin(req, res) {
        fs.readFile('./views/template/form.html', 'utf8', (err, data) => {
            res.writeHead(200, { 'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        })
    };

    editAdmin(req, res, idUpdate){
        console.log(99)
        let inputData = ''
        req.on('data', chunk => {
            inputData += chunk
        });
        req.on('end', async () => {
            let newAdmin = qs.parse(inputData);
            if (newAdmin.id) {
                console.log(newAdmin)
                await this.UserModel.insertAdmin(newAdmin);
                this.showListAdmin(req, res)
            }
        })
    }

    showFormLogin(req,res){
        //lay cookie tu header req
        let cookieUserLogin = {
            email: '',
            password: ''
        }
        if(req.headers.cookie){
            let cookies = cookie.parse(req.headers.cookie);
            if (cookies && cookies.user){
                cookieUserLogin = JSON.parse(cookies.user);
            }
        }
        fs.readFile('./views/template/login.html', 'utf8', (err, data) => {
            data = data.replace('{email}', cookieUserLogin.email);
            data = data.replace('{password}', cookieUserLogin.password);
            res.writeHead(200, { 'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        })
    }
    login(req, res){
        console.log(1)
        let data = '';
        req.on('data',chunk => data += chunk);
        req.on('end', async () => {
            let dataForm = qs.parse(data);
            let result = await this.UserModel.findUser(dataForm)
            console.log(dataForm)
            console.log(result)
            //tao cookie
            const setCookie = cookie.serialize('user',JSON.stringify(dataForm));
            //tao session
            let sessionLogin = {
                email: dataForm.email,
                password: dataForm.password
            }
            //ghi session vào file
            let nameFile = Date.now()
            let dataSession = JSON.stringify(sessionLogin)

            //gui cookie ve cho trinh duyet
            res.setHeader('Set-Cookie',setCookie);

            if (result.length > 0) {
                fs.writeFileSync('./session/' + nameFile + '.txt', dataSession)
                res.writeHead(301, {'Location': '/admin'});
                res.end()
            }else {
                res.writeHead(301, {'Location': '/login'});
                res.end();
            }

        })
    }


}
module.exports = AuthController;