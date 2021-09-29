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

function loadHTMLTable(data) {
    const table = document.querySelector('table tbody');

    if (data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='2'>No Data</td></tr>";
        return;
    }

    let tableHtml = "";

    data.forEach(function ({id,name}) {
        tableHtml += "<tr>";
        tableHtml += `<td>${name}</td>`;
        tableHtml += `<td>unknown</td>`;
        tableHtml += "</tr>";
    });

    table.innerHTML = tableHtml;
}