const fs = require("fs");
const qs = require('qs');
const cookie = require('cookie');
const url = require('url')
const  UserModel = require('../model/user.model')
const  validate = require('../model/validate.user')

class  AuthController{
    UserModel;
    validate;

    constructor(){
        this.UserModel = new UserModel();
        this.validate = new validate();
    }

    showHomePage(req, res){
        fs.readFile('./views/template/index.html', 'utf8', (err, data) => {
            res.setHeader('Cache-Control', 'no-store');
            res.writeHead(200, { 'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        })
    }
    showFormAdmin(req, res) {
        fs.readFile('./views/template/admin.html', 'utf8', (err, data) => {
            res.setHeader('Cache-Control', 'no-store');
            res.writeHead(200, { 'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        })
    }
    showListAdmin(req, res) {
        const editButton = this.editBtn();

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
                    html += `<td>${element.role}</td>`;
                    html += `<td>${editButton(JSON.stringify(element))}</td>`;
                    html += `<td><a onclick="return confirm('Are you sure?')" href="/admin/delete?index=${element.id}" class ="btn btn-danger">DELETE</a></td>`;
                  });
                data = data.replace('{list-users}', html);
                res.setHeader('Cache-Control', 'no-store');
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                res.end();
            }
        })
    };

    editBtn() {
        const editButton = (obj) => {
            return `<button style="background-color: rgba(52,124,255,0.93);border: #007bff" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@getbootstrap" onclick='getData(${obj})'>EDIT</button>`;
        }
        return editButton;
    }

    showFormCreateAdmin(req, res) {
        fs.readFile('./views/template/form.html', 'utf8', (err, data) => {
            res.setHeader('Cache-Control', 'no-store');
            res.writeHead(200, { 'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        })
    };

    createAdmin(req, res){
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        });
        req.on('end', async () => {
            let admin = qs.parse(data);
            let findUser = await this.UserModel.findUsers(admin)
            if(findUser.length >0){
                console.log('Tài khoản đã tồn tại !');
                this.showFormCreateAdmin(req,res);
            }else {
                await this.UserModel.createNewAdmin(admin);
                res.setHeader('Cache-Control', 'no-store');
                res.writeHead(301, {'location': '/table'});
                return res.end();
            }
        });
     }

    editAdmin(req, res){
        console.log(99)
        let inputData = ''
        req.on('data', chunk => {
            inputData += chunk
        });
        req.on('end', async () => {
            let newAdmin = qs.parse(inputData);
            if (newAdmin.id) {
                console.log(newAdmin)
                await this.UserModel.UpdateAdmin(newAdmin);
                this.showListAdmin(req, res)
            }
        })
    };
    async deleteAdmin(req, res, idDelete) {
        await this.UserModel.deleteAdminById(idDelete);
        res.setHeader('Cache-Control', 'no-store');
        res.writeHead(301,{Location: '/table'});
        res.end();
    }

    async searchAdmin(req, res) {
        let keyword = qs.parse(url.parse(req.url).query).keyword;
        let admin = await this.UserModel.findByName(keyword);
        // console.log(admin)
        const editButton = this.editBtn();
        let html = '';
        if (admin.length > 0) {
            admin.map((element, index) => {
                let id = element.id;
                html += `<tr>`;
                html += `<td>${index + 1}</td>`;
                html += `<td>${element.name}</td>`;
                html += `<td>${element.email}</td>`;
                html += `<td>${element.password}</td>`;
                html += `<td>${element.password}</td>`;
                html += `<td>${editButton(JSON.stringify(element))}</td>`;
                html += `<td><a onclick="return confirm('Are you sure?')" href="/admin/delete?index=${element.id}" class ="btn btn-danger">Delete</a></td>`;
            });
        }
        else {
            html += "<tr>";
            html += `<td colspan="4" class="text-center">Không có dữ liệu</td>`;
            html += "</tr>";
        }
        fs.readFile('./views/template/table.html', 'utf8', ((err, data) =>  {
            if (err) {
                console.log(err.message);
            }
            data = data.replace('{list-users}', html)
            data = data.replace('<input style="background: white"; type="text" name="keyword" placeholder="Enter your name" class="form-control">', `<input style="background: white"; type="text" name="keyword" value="${keyword}" placeholder="Enter your name" class="form-control">`)
            res.setHeader('Cache-Control', 'no-store');
            res.writeHead(200, {'Content-Type': 'text/html'})
            res.write(data);
            res.end();
        }))
    };
    showFormLogin(req,res){
        //lay cookie tu header req
        let cookieUserLogin = {
            email: '',
            password: ''
        }
        console.log(req.headers.cookie)
        if(req.headers.cookie){
            let cookies = cookie.parse(req.headers.cookie);
            if (cookies && cookies.user){
                cookieUserLogin = JSON.parse(cookies.user);
            }
        }
        fs.readFile('./views/template/login.html', 'utf8', (err, data) => {
            data = data.replace('{email}', cookieUserLogin.email);
            data = data.replace('{password}', cookieUserLogin.password);
            res.setHeader('Cache-Control', 'no-store');
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
            // console.log(dataForm)
            // console.log(result)
            //tao session
            let sessionLogin = {
                email: dataForm.email,
                password: dataForm.password
            }
            //ghi session vào file
            let nameFile = Date.now();
            let dataSession = JSON.stringify(sessionLogin);

            if (result.length > 0) {
                //tao cookie
                let dataCookie = {
                    email: dataForm.email,
                    password: dataForm.password,
                    sessionId: nameFile
                }
                const setCookie = cookie.serialize('user',JSON.stringify(dataCookie));

                //gui cookie ve cho trinh duyet
                res.setHeader('Set-Cookie',setCookie);

                fs.writeFileSync('./session/' + nameFile + '.txt', dataSession);
                res.setHeader('Cache-Control', 'no-store');
                console.log(result[0].role)
                if(result[0].role === 'admin'){
                    console.log(1)
                    res.writeHead(301, {'Location': '/admin'});
                    res.end()
                }else {
                    console.log(2)
                    res.writeHead(301, {'Location': '/'});
                    res.end()
                }

            }else {
                let dataCookie = {
                    email: dataForm.email,
                    password: dataForm.password
                }
                const setCookie = cookie.serialize('user',JSON.stringify(dataCookie));
                res.setHeader('Set-Cookie',setCookie);
                res.setHeader('Cache-Control', 'no-store');
                res.writeHead(301, {'Location': '/login'});
                res.end();
            }
        })
    }
    showFormRegister(req,res){
        fs.readFile('./views/template/register.html', 'utf8', (err, data) => {
            res.setHeader('Cache-Control', 'no-store');
            res.writeHead(200, { 'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        })
    }
    register(req,res){
        let data = '';
        req.on('data',chunk => data += chunk);
        req.on('end',async () => {
            let dataForm = qs.parse(data);
            console.log(dataForm)
            let validate = await this.validate.validate(req, res,dataForm.name,dataForm.email,dataForm.password);
            console.log(validate)
            if(validate){
                let findUser = await this.UserModel.findUsers(dataForm)
                if(findUser.length > 0){
                    this.showFormRegister(req,res);
                }else {
                    console.log('add')
                    let result = await this.UserModel.addUsers(dataForm);
                    res.setHeader('Cache-Control', 'no-store');
                    res.writeHead(301, {'Location': '/login'});
                    res.end();
                }
            }
        })
    }
}
module.exports = AuthController;