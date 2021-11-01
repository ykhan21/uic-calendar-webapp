const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config(); //so that we can access it when we need to

const dbService = require('./dbService');
const { request, response } = require('express');

app.use(cors()); //so that if we have an incoming api call, it wont block it and we'll be able to send data to our backend
app.use(express.json()); //so we'll be able to send in json format
app.use(express.urlencoded({ extended : false })); //we wont be sending in any form data

let chosenCRNs = [];

const datebook = require('datebook');

const options1 = {
    title: 'Happy Hour1',
    location: 'The Bar, New York, NY',
    description: 'Let\'s blow off some steam with a tall cold one!',
    start: new Date('2021-11-05T19:00:00'),
    end: new Date('2021-11-05T20:00:00')
};
const options2 = {
    title: 'Happy Hour2',
    location: 'The Bar, New York, NY',
    description: 'Hello!!',
    start: new Date('2021-11-05T17:00:00'),
    end: new Date('2021-11-05T18:00:00')
};

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

app.get('/search/:crn', (request, response) => {
    const { crn } = request.params;
    console.log("crn:",crn);
    const db = dbService.getDbServiceInstance();

    // this will return a promise, we have to wait
    const result = db.searchByCRN(crn);

    result
    .then(data => response.json({data: data})) //???
    .catch(err => console.log(err));
})

app.get('/addCourse/:crn', (request, response) => {
    const { crn } = request.params;

    if(chosenCRNs.indexOf(crn) != -1) {
        return;
    }

    chosenCRNs.push(crn);
    console.log(chosenCRNs);

    const db = dbService.getDbServiceInstance();
    const result = db.searchByCRN(crn)

    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));

})

app.get('/getCalendar', (request, response) => {
    console.log("sending calendar...");
    // const link = new datebook.GoogleCalendar(options0).render();
    // // const result = {link:link};

    // console.log(link);
    response.send(JSON.stringify([options1,options2]));
    
    // console.log(options);
    // console.log(JSON.stringify(options));
    // response.end(JSON.stringify(options));
})

// update

// delete



// starting our server...
app.listen(process.env.PORT, () => console.log('app is running'));
