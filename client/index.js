//
// call this when the document is loaded
//
document.addEventListener('DOMContentLoaded', function () {
    // a fetch api call from frontend
    fetch('http://localhost:5000/getAll')
    .then(response => response.json())
    .then(data => loadHTMLTable([]));
});

function loadHTMLTable(data) {
    const table = document.querySelector('.search.table.body');

    if (data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='3'>No Data</td></tr>";
        return;
    }

    let tableHtml = _helper(data,true);

    table.innerHTML = tableHtml;
}

function _helper(data,isAdd) {
    let tableHtml="";
    // get crn number and course name
    data.forEach(function ({CRN,crs,meetTimeHrs,meetTimeDate}) {

        let btnString=`<button class="add-course-btn" data-id="${CRN}">Add</button>`;
    
        if (!isAdd) {
            btnString=`<button class="rem-course-btn" data-id="${CRN}">Remove</button>`;
        }
        
        tableHtml += "<tr>";
        tableHtml += `<td>${CRN}</td>`;
        tableHtml += `<td>${crs}</td>`;
        tableHtml += `<td>${meetTimeHrs}</td>`;
        tableHtml += `<td>${meetTimeDate}</td>`;
        tableHtml += `<td>${btnString}</td>`;
        tableHtml += "</tr>";
    });
    return tableHtml;
}

//
// call this when the searchBtn is clicked
//
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

// 
// call this when any add-course-btn is clicked 
//
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

    let tableHtml = _helper(data,false);

    table.innerHTML += tableHtml;
    
}

//
// call this when the calendarBtn is clicked
//
const calendarBtn = document.querySelector('#calendar-btn');

calendarBtn.onclick = function() {
    
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
    let ical = null;

    data.forEach(
        function(option) {
            console.log(option);
            
            const opt = {
                title: option['title'],
                location: option['location'],
                description: option['description'],
                start: new Date(option['start']),
                end: new Date(option['end'])
            }
            
            console.log(opt);

            if (ical === null) {
                ical = new datebook.ICalendar(opt)
            } else {
                ical.addEvent(new datebook.ICalendar(opt));
            }
        }
    )
    // const options3 = {
    // }

    new ical.download();
}
