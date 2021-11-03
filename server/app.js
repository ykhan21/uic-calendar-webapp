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

let crnsToCourses = new Map();

const datebook = require('datebook');

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

app.get('/search/:entry', (request, response) => {
    const { entry } = request.params;

    console.log("entry:",entry);
    const db = dbService.getDbServiceInstance();

    // this will return a promise, we have to wait
    const result = db.searchCourse(entry.toUpperCase());

    result
    .then(data => response.json({data: data})) //???
    .catch(err => console.log(err));
})

app.delete('/delete/:crn', (request,response) => {
    const { crn } = request.params;
    console.log("delete: ",request.params);

    let res = crnsToCourses.delete(crn);

    response.json({ 
        success: res
    })

    console.log("removed",crn,":",crnsToCourses.entries());
})

app.get('/addCourse/:crn', (request, response) => {
    const { crn } = request.params;

    console.log("adding... ",crn,"to: ",crnsToCourses.entries());
    // don't save it if crn was already save
    if(crnsToCourses.has(crn)) {
        return;
    }

    const db = dbService.getDbServiceInstance();
    const result = db.searchByCRN(crn)

    result
    .then(
        data => {
            crnsToCourses.set(crn,data[0]); // db query returns a promise; when we resolve it, then add it to the Map
            response.json({data: data});
        }
    )
    .catch(err => console.log(err));

})

app.get('/getCalendar', (request, response) => {
    console.log("sending calendar...");
    
    let calendarOptions = getCalendarOptions();

    result = JSON.stringify(calendarOptions);

    response.send(result);
    
})

function getCalendarOptions() {
    let options = [];
    let option;

    console.log(crnsToCourses);

    crnsToCourses.forEach(
        function ({CRN,crs,meetTimeDate,meetTimeHrs,meetTimeDays}) {

            console.log(CRN,crs);

            let startDate = getStartDate(meetTimeHrs,meetTimeDate)
            let endDate = getEndDate(meetTimeHrs,meetTimeDate)

            option = {
                title: crs,
                location: 'uic',
                description: 'placeholder',
                start: startDate,
                end: endDate,
                recurrence: {
                    frequency: 'WEEKLY',
                    interval: 1,
                    weekdays: getWeekdays(meetTimeDays),
                    end: getUntilDate(meetTimeDate)
                }
            };

            options.push(option)
        }
    );

    return options;
}
//      meetTimeHrs: '0800--0850',
//      meetTimeDate: '08/23/2021--12/03/2021'
function getStartDate(meetTimeHrs,meetTimeDate) {
    console.log(meetTimeDate,meetTimeHrs);

    meetTimeDate = meetTimeDate.substr(0,meetTimeDate.indexOf('-'));
    meetTimeHrs = meetTimeHrs.substr(0,meetTimeHrs.indexOf('-'));
    
    console.log(meetTimeDate,meetTimeHrs);

    let yr = meetTimeDate.slice(-4);
    let dy = meetTimeDate.substr(3,2);
    let mo = meetTimeDate.substr(0,2);

    console.log(yr,mo,dy);
    
    let hr = meetTimeHrs.substr(0,2);
    let mi = meetTimeHrs.slice(-2);
    
    console.log(hr,mi);

    var res = yr+"-"+mo+"-"+dy+"T"+hr+":"+mi+":"+"00";
    console.log("res:",res);
    return res;
}

function getEndDate(meetTimeHrs,meetTimeDate) {
    console.log(meetTimeDate,meetTimeHrs);

    meetTimeDate = meetTimeDate.substr(0,meetTimeDate.indexOf('-'));
    meetTimeHrs = meetTimeHrs.substr(meetTimeHrs.indexOf('-')+2);
    
    console.log(meetTimeDate,meetTimeHrs);

    let yr = meetTimeDate.slice(-4);
    let dy = meetTimeDate.substr(3,2);
    let mo = meetTimeDate.substr(0,2);

    console.log(yr,mo,dy);
    
    let hr = meetTimeHrs.substr(0,2);
    let mi = meetTimeHrs.slice(-2);
    
    console.log(hr,mi);

    var res = yr+"-"+mo+"-"+dy+"T"+hr+":"+mi+":"+"00";
    console.log("res:",res);

    return res;
    
}

function getUntilDate(meetTimeDate) {
    console.log(meetTimeDate);

    meetTimeDate = meetTimeDate.substr(meetTimeDate.indexOf('-')+2);
    
    console.log(meetTimeDate);
    let yr = meetTimeDate.slice(-4);
    let dy = meetTimeDate.substr(3,2);
    let mo = meetTimeDate.substr(0,2);

    console.log(yr,mo,dy);
    
    var res = yr+"-"+mo+"-"+formatInt((parseInt(dy)+1))+"T"+"00"+":"+"00"+":"+"00";
    
    console.log("res:",res);

    return res;
    
}

function formatInt(i) {
    if (i<10) return "0"+i;
    return ""+i;
}

function getWeekdays(meetDays) {
    let wkdays = [];

    if (meetDays.indexOf("M")>-1) wkdays.push("MO");
    if (meetDays.indexOf("T")>-1) wkdays.push("TU");
    if (meetDays.indexOf("W")>-1) wkdays.push("WE");
    if (meetDays.indexOf("R")>-1) wkdays.push("TH");
    if (meetDays.indexOf("F")>-1) wkdays.push("FR");

    return wkdays;
}
// update

// delete



// starting our server...
app.listen(process.env.PORT, () => console.log('app is running'));
