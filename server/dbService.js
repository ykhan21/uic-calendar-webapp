const mysql = require('mysql');
const dotenv = require('dotenv');
let instance = null;
dotenv.config();

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
});

// takes a callback, parameter to check err?
connection.connect((err) => {
    if (err) {
        console.log(err.message);
    }
    console.log('db ' + connection.state);
});

// create class containing functions to CRUD data
class DbService {
    static getDbServiceInstance() {
        return instance ? instance : new DbService();
    }
    
    async getAllData() {
        try {
            // if query successful, resolve. otherwise reject
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM course_ids;";

                connection.query(query, (err, results) => {
                    if (err) reject (new Error(err.message)); // will be caught be catch block
                    resolve(results);
                })

            });

            console.log(response);
            return response;

        } catch (error) {
            console.log(error);
        }
    }
}

// export class?
module.exports = DbService;