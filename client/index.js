let sessionID;

//
// call this when the document is loaded
//
document.addEventListener("DOMContentLoaded", function () {
  // // a fetch api call from frontend
  // fetch('http://localhost:5000/getAll')
  // .then(response => response.json())
  // .then(data => loadHTMLTable([]));

  fetch("http://localhost:5000/getSessionID")
    .then((response) => response.json())
    .then((data) => (sessionID = data["id"]));
  // .then(data => console.log("sesh:",data['id']))
});

function loadHTMLTable(data) {
  const table = document.querySelector(".search.table.body");

  if (data.length === 0) {
    table.innerHTML = "<tr><td class='no-data' colspan='3'>No Data</td></tr>";
    return;
  }

  let tableHtml = _helper(data, true);

  table.innerHTML = tableHtml;
}

function _helper(data, isAdd) {
  let tableHtml = "";
  // get crn number and course name
  data.forEach(function ({ crn, crs, title, time, meetTimeDate, room, days }) {
    let btnString = `<button class="btn add-course-btn" data-id="${crn}">Add</button>`;

    if (!isAdd) {
      btnString = `<button class="btn rem-course-btn" onclick="del_tr(this)" data-id="${crn}">Remove</button>`;
    }

    tableHtml += "<tr>";
    tableHtml += `<td>${crn}</td>`;
    tableHtml += `<td>${crs}</td>`;
    tableHtml += `<td>${title}</td>`;
    tableHtml += `<td>${time}</td>`;
    tableHtml += `<td>${days}</td>`;
    tableHtml += `<td>${btnString}</td>`;
    tableHtml += "</tr>";
  });
  return tableHtml;
}

//
// call this when the searchBtn is clicked
//
const searchBtn = document.querySelector("#search-btn");
searchBtn.onclick = function () {
  const searchValue = document.querySelector("#search-input").value;

  fetch("http://localhost:5000/search/" + searchValue)
    .then((response) => response.json())
    .then((data) => loadHTMLTable(data["data"]));
};

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
// when any rem-course-btn is clicked
//
document.querySelector(".chosen.table.body").addEventListener("click", function (event) {
  console.log(event.target);
  if (event.target.className === "btn rem-course-btn") {
    removeCourse(event.target.dataset.id);
  }
});

function removeCourse(crn) {
  fetch("http://localhost:5000/delete/" + sessionID + "/" + crn, {
    method: "DELETE",
  }).then((response) => response.json());
  // .then(data => );
  // .then(data => console.log(data))

  enableBtn(crn);
}

function enableBtn(crn) {
  // for (i=0; i<arr.length; i++) {
  //     if (arr[i].getAttribute("data-id"))
  // }
  console.log("enabling btn");
  document.querySelectorAll(".add-course-btn").forEach(function (btn) {
    if (btn.firstChild.getAttribute("data-id") === crn) {
      btn.disabled = false;
      return;
    }
  });
}

function del_tr(remtr) {
  // console.log("deeleet");
  while (remtr.nodeName.toLowerCase() != "tr") remtr = remtr.parentNode;

  remtr.parentNode.removeChild(remtr);
}

//
// call this when any add-course-btn is clicked
//
document.querySelector(".search.table.body").addEventListener("click", function (event) {
  console.log(event.target);
  if (event.target.className === "btn add-course-btn") {
    event.target.disabled = true;
    addCourse(event.target.dataset.id);
  }
});

function addCourse(crn) {
  // const searchValue = document.querySelector('#search-input').crn;

  fetch("http://localhost:5000/addCourse/" + sessionID + "/" + crn)
    .then((response) => response.json())
    .then((data) => insertRowIntoChosenTable(data["data"]));
}

function insertRowIntoChosenTable(data) {
  console.log(data);
  const table = document.querySelector(".chosen.table.body");

  if (data.length === 0) {
    // table.innerHTML = "<tr><td class='no-data' colspan='2'>No Data</td></tr>";
    console.log("nothing to add to chosen table");
    return;
  }

  let tableHtml = _helper(data, false);

  table.innerHTML += tableHtml;
}

//
// call this when the calendarBtn is clicked
//
const calendarBtn = document.querySelector("#calendar-btn");

calendarBtn.onclick = function () {
  // var opt =
  //     {
  //         "title": "cs301",
  //         "description": "placeholder",
  //         "start": new Date("2021-11-03T16:00:00.000Z"),
  //         "end": new Date("2021-11-03T17:00:00.000Z"),
  //         "recurrence": {
  //             "frequency": "DAILY",
  //             "interval": 1,
  //             "end": new Date("2021-11-16T00:00:00Z")
  //         },
  //         "location": "uic"
  //     }

  // let ical = (new datebook.ICalendar(opt));
  // ical.download();

  fetch("http://localhost:5000/getCalendar/" + sessionID)
    .then((response) => response.json())
    .then((data) => loadCalendar(data));
  // .then(response => response.text())
  // .then(data => window.location.href = data)
  // .then(data => data[start]=new Date('2022-07-08T19:00:00'))
  // .then(data => data[end]=new Date('2022-07-08T23:00:00'))
  // .then(data => console.log(data))
  // .then(data => ( new datebook.ICalendar(data) ))
};

function loadCalendar(data) {
  let ical = null;

  data.forEach(function (option) {
    console.log(option);

    const opt = {
      title: option["title"],
      location: option["location"],
      description: option["description"],
      start: new Date(option["start"]),
      end: new Date(option["end"]),
      recurrence: {
        frequency: option["recurrence"]["frequency"],
        interval: option["recurrence"]["interval"],
        weekdays: option["recurrence"]["weekdays"],
        end: new Date(option["recurrence"]["end"]),
      },
    };

    console.log("opt:", opt);

    if (ical === null) {
      ical = new datebook.ICalendar(opt);
    } else {
      ical.addEvent(new datebook.ICalendar(opt));
    }
  });

  new ical.download();
}
