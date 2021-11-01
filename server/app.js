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
const ical = new datebook.ICalendar({
    title: 'Happy Hour',
    location: 'The Bar, New York, NY',
    description: 'Let\'s blow off some steam with a tall cold one!',
    start: new Date('2022-07-08T19:00:00'),
    end: new Date('2022-07-08T23:30:00'),
    // an event that recurs every two weeks:
    recurrence: {
      frequency: 'WEEKLY',
      interval: 2
    }
})

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
    const link = new datebook.GoogleCalendar(ical).render();
    const result = {link:link};

    response.end(link);
})

// update

// delete



// starting our server...
app.listen(process.env.PORT, () => console.log('app is running'));
