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

const searchQuery =
"SELECT CRN,concat(`Crs Subj Cd`,`Crs Nbr`) AS crs,\
`Start Time -- End Time` AS `meetTimeHrs`, \
`Start Date -- End Date` AS `meetTimeDate`, \
`Meeting Days` AS `meetTimeDays` ";

// create class containing functions to CRUD data
class DbService {
    static getDbServiceInstance() {
        return instance ? instance : new DbService();
    }
    
    async getAllData() {
        try {
            // if query successful, resolve. otherwise reject
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT CRN,concat(`Crs Subj Cd`,' ',`Crs Nbr`) AS crs FROM course_data;";

                connection.query(query, (err, results) => {
                    if (err) reject (new Error(err.message)); // will be caught be catch block
                    resolve(results);
                })

            });

            console.log("getAllData query ran...");
            // console.log(response);
            return response;

        } catch (error) {
            console.log(error);
        }
    }

    async searchCourse(entry) {
        try {
            // if query successful, resolve. otherwise reject
            const response = await new Promise((resolve, reject) => {
                const query = 
                searchQuery +
                "FROM course_data HAVING crs = ? OR crn = ?;";

                connection.query(query, [entry, entry], (err, results) => {
                    if (err) reject (new Error(err.message)); // will be caught be catch block
                    resolve(results);
                })

            });

            console.log("crs query res:",response);
            return response;

        } catch (error) {
            console.log(error);
        }
    }

    async searchByCRN(crn) {
        try {
            // if query successful, resolve. otherwise reject
            const response = await new Promise((resolve, reject) => {
//                const query = "SELECT CRN,concat(`Crs Subj Cd`,`Crs Nbr`) AS crs FROM course_data WHERE crn = ?;";
            const query =                
                searchQuery+
                "FROM course_data WHERE crn = ?;";

                connection.query(query, [crn], (err, results) => {
                    if (err) reject (new Error(err.message)); // will be caught be catch block
                    resolve(results);
                })

            });

            console.log("crn query res:",response);
            return response;

        } catch (error) {
            console.log(error);
        }
    }
}

// export class?
module.exports = DbService;