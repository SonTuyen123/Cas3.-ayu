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

    async UpdateAdmin(newAdmin) {
        let sqlInsert = `UPDATE users SET name ='${newAdmin.name}', email= '${newAdmin.email}',password = '${newAdmin.password}',role = '${newAdmin.role}' WHERE id=${Number(newAdmin.id)}`;
        return await this.querySQL(sqlInsert);

    }
    async deleteAdminById(idDelete) {
        let sql = `delete from users where id = ${idDelete}`;
        return await this.querySQL(sql);
    }
    async createNewAdmin(admin) {
        let sql = `insert into users(name, email, password,role) VALUES ('${admin.name}', '${admin.email}', '${admin.password}','${admin.role}')`;
        return await this.querySQL(sql);
    }
    async findByName(name) {
        const sql = `SELECT * FROM users WHERE name LIKE '%${name}%'`;
        return await this.querySQL(sql)
    }
    async addUsers(users) {
        const sql = `INSERT INTO users(name, email, password, role) VALUES ('${users.name}', '${users.email}', '${users.password}', 'user')`;
        return await this.querySQL(sql);
    }
    async findUsers(data) {
        const sql = `SELECT * FROM users
                                WHERE email = '${data.email}'`;
        return await this.querySQL(sql);
    }

}
module.exports = UserModel;