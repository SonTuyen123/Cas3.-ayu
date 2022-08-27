const BaseModel = require("./base.model");

class UserModel extends BaseModel {
    async findUser(data) {
        const sql = `SELECT * FROM users
                                WHERE email = '${data.email}' 
                                AND password = '${data.password}'`;
        return await this.querySQL(sql);
    }

    async getAdmin() {
        const sql = 'select * from users';
        return await this.querySQL(sql);
    }

    async insertAdmin(newAdmin) {
        let sqlInsert = `INSERT INTO users (name, email, password) VALUES ('${newAdmin.name}', '${newAdmin.email}', '${newAdmin.password}');`;

        return await this.querySQL(sqlInsert);

    }
}
module.exports = UserModel;