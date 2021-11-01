document.addEventListener('DOMContentLoaded', function () {
    // a fetch api call from frontend
    fetch('http://localhost:5000/getAll')
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
});

const searchBtn = document.querySelector('#search-btn');

searchBtn.onclick = function() {
    const searchValue = document.querySelector('#search-input').value;

    fetch('http://localhost:5000/search/' + searchValue)
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
}

// execute search with Enter key
// searchBtn.addEventListener("keyup", function(event) {
//     // 13 is the "Enter" key
//     if (event.keyCode === 13) {
//       event.preventDefault();
//       // Trigger the button element with a click
//       searchBtn.click();
//     }
// });

document.querySelector('table tbody').addEventListener
('click', function(event) {
    console.log(event.target);
    if(event.target.className === "add-course-btn") {
        addCourse(event.target.dataset.id);
    }
})

function addCourse(crn) {
    // const searchValue = document.querySelector('#search-input').crn;

    fetch('http://localhost:5000/addCourse/' + crn)
    .then(response => response.json())
    .then(data => insertRowIntoChosenTable(data['data']));
}

function insertRowIntoChosenTable(data) {
    console.log(data);
    const table = document.querySelector('.chosen.table.body');

    if (data.length === 0) {
        // table.innerHTML = "<tr><td class='no-data' colspan='2'>No Data</td></tr>";
        console.log("nothing to add to chosen table");
        return;
    }

    let tableHtml = "";
    
    // get crn number and course name
    data.forEach(function ({CRN,crs}) {
        tableHtml += "<tr>";
        tableHtml += `<td>${CRN}</td>`;
        tableHtml += `<td>${crs}</td>`;
        tableHtml += `<td><button class="remove-course-btn" data-id="${CRN}">Remove</button></td>`;
        tableHtml += "</tr>";
    });

    table.innerHTML += tableHtml;
    
}

function loadHTMLTable(data) {
    const table = document.querySelector('.search.table.body');

    if (data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='2'>No Data</td></tr>";
        return;
    }

    let tableHtml = "";
    
    // get crn number and course name
    data.forEach(function ({CRN,crs}) {
        tableHtml += "<tr>";
        tableHtml += `<td>${CRN}</td>`;
        tableHtml += `<td>${crs}</td>`;
        tableHtml += `<td><button class="add-course-btn" data-id="${CRN}">Add</button></td>`;
        tableHtml += "</tr>";
    });

    table.innerHTML = tableHtml;
}

const calendarBtn = document.querySelector('#calendar-btn');

calendarBtn.onclick = function() {
    
    // options0.addEvent(options);
    // options0.download();

    // const link = new datebook.GoogleCalendar(options0).render();
    // console.log(link);
    // // console.log(options);
    // // const ical = new datebook.ICalendar(options);

    // let global;


    fetch('http://localhost:5000/getCalendar/')
    .then(response => response.json())
    .then(data => loadCalendar(data))
    // .then(response => response.text())
    // .then(data => window.location.href = data)
    // .then(data => data[start]=new Date('2022-07-08T19:00:00'))
    // .then(data => data[end]=new Date('2022-07-08T23:00:00'))
    // .then(data => console.log(data))
    // .then(data => ( new datebook.ICalendar(data) ))
}

function loadCalendar(data) {
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

    let data1 = data[0]
    const options3 = {
        title: data1['title'],
        location: data1['location'],
        description: data1['description'],
        start: new Date(data1['start']),
        end: new Date(data1['end'])
    }

    let ical1 = (new datebook.ICalendar(options3));
    ical1.download();
}