const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config(); //so that we can access it when we need to

const dbService = require('./dbService');

app.use(cors()); //so that if we have an incoming api call, it wont block it and we'll be able to send data to our backend
app.use(express.json()); //so we'll be able to send in json format
app.use(express.urlencoded({ extended : false })); //we wont be sending in any form data


//our routes: CRUD

// create
app.post('/insert', (request, response) => {

});

// read
app.get('/getAll', (request, response) => {
    const db = dbService.getDbServiceInstance();

    // this will return a promise, we have to wait
    const result = db.getAllData();

    result
    .then(data => response.json({data: data})) //???
    .catch(err => console.log(err));

})

// update


// delete



// starting our server...
app.listen(process.env.PORT, () => console.log('app is running'));
