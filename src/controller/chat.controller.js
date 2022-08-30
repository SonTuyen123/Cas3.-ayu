const connect = require("../model/chat.connect");
const fs = require("fs");

class ChatController{
    getMessage() {
        let connection = connect.createConnection();
        connection.connect((err) => {
            if (err) {
                console.log(err.message);
            } else {
                console.log('connected');
            }
        })
        return new Promise((resolve, reject) => {
            connection.query(`select name from chat`, (err, data) => {
                if (err) {
                    reject(err.message)
                } else {
                    resolve(data)
                }
            })
        })
    }
    createMessage(chat) {
        let connection = connect.createConnection();
        connection.connect((err) => {
            if (err) {
                throw new Error(err.message)
            }
            console.log('connection')
        });
        connection.query(`insert into chat(name,message)
                values('${chat.name}','${chat.message}')`, (err, data) => {
            if (err) {
                throw new Error(err.message)
            } else {
                console.log('insert success')
            }
        })
    }
    showChat(req,res){
        fs.readFile('./views/template/support.html', 'utf-8', async(err, data) => {
            if (err) {
                throw new Error(err.message);
            }
            let history='';
            let chatHistory = await this.getMessage();
            chatHistory.forEach((data1)=>{
                history += `<div>
                  ${data1.name}${data1.message}</div>`
            })
            data = data.replace('{history}',history)
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        });
    }
    showChatAdmin(req,res){
        fs.readFile('./views/template/adminsupport.html', 'utf-8', async(err, data) => {
            if (err) {
                throw new Error(err.message);
            }
            else {
                let historyAdmin='';
                let chatHistory =  await this.getMessage();
                chatHistory.forEach((data1)=>{
                    historyAdmin += `<div>
                  ${data1.name}${data1.message}</div>`
                })
                data = data.replace('{history}',historyAdmin)
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                res.end();
            }
        })
    }
}
module.exports = ChatController