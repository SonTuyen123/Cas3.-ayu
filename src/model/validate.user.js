const isEmpty = require("is-empty");
const qs = require('qs');
const fs = require('fs')

class Validate {

    constructor(){
    }
    validate(req,res,name,email,password){
        return new Promise((reject, resolve)=>{
            let mailRegexp = /^\w+@gmail.com$/i;
            let validEmail = mailRegexp.test(email)
            let nameRegexp = /^[A-Za-z\s]+$/;
            let validName = nameRegexp.test(name)
            let passwordRegexp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,10}$/;
            let validPassword = passwordRegexp.test(password)
            let valid = true;
            fs.readFile('./views/template/register.html', 'utf-8', function(err, datahtml) {
                if (err) {
                    reject(err);
                }
                if(isEmpty(email) && isEmpty(name) && isEmpty(password)){
                    datahtml = datahtml.replace('<span hidden>{email}</span>','<p style="color:red ;">Email required</p>');
                    datahtml = datahtml.replace('<span hidden>{name}</span>','<p style="color:red ;">Name required</p>');
                    datahtml = datahtml.replace('<span hidden>{password}</span>','<p style="color:red ;">Password required</p>');
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write(datahtml);
                    res.end();
                    return reject(false)
                }
                if(!validEmail && !validPassword){
                    if(password.length < 6 || password.length > 10 ){
                        datahtml = datahtml.replace('<span hidden>{password}</span>','<p style="color:red ;">Password must be over 6 characters </p>');
                    }
                    if(!validName){
                        datahtml = datahtml.replace('<span hidden>{name}</span>','<p style="color:red ;">Name can not have number</p>');
                    }
                    datahtml = datahtml.replace('<span hidden>{email}</span>','<p style="color:red ;">Wrong type of Email.Please try again</p>');

                    res.setHeader('Cache-Control', 'no-store');
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write(datahtml);
                    res.end();
                    return reject(false)
                }
                reject(valid)
            });
        })
    }

}
module.exports = Validate