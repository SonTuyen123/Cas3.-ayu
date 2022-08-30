const mysql = require('mysql');
class connect{
    static createConnection(){
        let configToMySQL ={
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: '22122000',
            database: 'case3',
        }
        return mysql.createConnection(configToMySQL);
    }
}
module.exports = connect