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
    fetch('http://localhost:5000/getCalendar/')
    .then(response => response.text())
    .then(data => console.log(data))
}