const stats = document.getElementById("stats");
const halls = document.getElementById("halls");
const admins = document.getElementById("admins");
const form = document.getElementById("hallForm");
const hallName = document.getElementById("hallName");
const city = document.getElementById("city");
const total = document.getElementById("total");
const vip = document.getElementById("vip");
const navButtons = document.querySelectorAll(".nav-btn");
const pageTitle = document.getElementById("pageTitle");
const backButton = document.getElementById("backButton");
const dashboardPage = document.getElementById("dashboardPage");
const hallsPage = document.getElementById("hallsPage");
const adminsPage = document.getElementById("adminsPage");

let data = JSON.parse(localStorage.getItem("cinebookSuperAdminData"));

if (data === null) {
    data = {
        users: [
            { id: 1, name: "Hall Admin", email: "admin@cinebook.com", phone: "01700000002", status: "Active" },
            { id: 2, name: "City Cinema Admin", email: "city@cinebook.com", phone: "01800000004", status: "Active" }
        ],
        halls: [
            { id: 1, name: "Star Cineplex", city: "Dhaka", total: 120, vip: 30, bookings: 12 },
            { id: 2, name: "Navana Hall", city: "Chittagong", total: 100, vip: 25, bookings: 0 },
            { id: 3, name: "Surma Cinema", city: "Sylhet", total: 75, vip: 15, bookings: 0 }
        ],
        movies: [
            { id: 1, title: "Interstellar" },
            { id: 2, title: "Oppenheimer" },
            { id: 3, title: "Parasite" }
        ],
        bookings: [
            { id: 1, amount: 1200, status: "Confirmed" },
            { id: 2, amount: 800, status: "Confirmed" },
            { id: 3, amount: 500, status: "Cancelled" }
        ]
    };

    saveData();
}

function saveData() {
    localStorage.setItem("cinebookSuperAdminData", JSON.stringify(data));
}

function renderStats() {
    let customers = data.users.length;
    let gross = 0;

    for (let i = 0; i < data.bookings.length; i++) {
        if (data.bookings[i].status !== "Cancelled") {
            gross += data.bookings[i].amount;
        }
    }

    stats.innerHTML =
        '<div class="stat"><div class="stat-top">Customers <span class="stat-icon">♙</span></div><b>' + customers + '</b></div>' +
        '<div class="stat"><div class="stat-top">Cinema Halls <span class="stat-icon">▣</span></div><b>' + data.halls.length + '</b></div>' +
        '<div class="stat"><div class="stat-top">Movies <span class="stat-icon">▧</span></div><b>' + data.movies.length + '</b></div>' +
        '<div class="stat"><div class="stat-top">Earnings (10%) <span class="stat-icon">৳</span></div><b>Tk ' + Math.round(gross * 0.1) + '</b></div>';
}

function renderHalls() {
    let rows = "";

    for (let i = 0; i < data.halls.length; i++) {
        let hall = data.halls[i];

        rows +=
            "<tr>" +
                "<td><strong>" + hall.name + "</strong></td>" +
                "<td>" + hall.city + "</td>" +
                "<td>" + hall.total + "</td>" +
                "<td>" + hall.vip + "</td>" +
                '<td><button class="small-btn delete-hall" data-id="' + hall.id + '">Delete</button></td>' +
            "</tr>";
    }

    if (rows === "") {
        rows = '<tr><td colspan="5" class="empty-row">No halls have been added yet.</td></tr>';
    }

    halls.innerHTML = rows;
    document.getElementById("hallTotal").innerHTML = data.halls.length + " halls";
}

function renderAdmins() {
    let rows = "";

    for (let i = 0; i < data.users.length; i++) {
        let admin = data.users[i];

        rows +=
            "<tr>" +
                "<td><strong>" + admin.name + "</strong></td>" +
                "<td>" + admin.email + "</td>" +
                "<td>" + admin.phone + "</td>" +
                '<td><span class="status">' + admin.status + "</span></td>" +
            "</tr>";
    }

    if (rows === "") {
        rows = '<tr><td colspan="4" class="empty-row">No administrators registered yet.</td></tr>';
    }

    admins.innerHTML = rows;
    document.getElementById("adminTotal").innerHTML = data.users.length + " admins";
}

function render() {
    renderStats();
    renderHalls();
    renderAdmins();
}

function showPage(page) {
    dashboardPage.hidden = true;
    hallsPage.hidden = true;
    adminsPage.hidden = true;

    for (let i = 0; i < navButtons.length; i++) {
        navButtons[i].classList.remove("active");
    }

    if (page === "dashboard") {
        dashboardPage.hidden = false;
        pageTitle.innerHTML = "Dashboard Overview";
    } else if (page === "halls") {
        hallsPage.hidden = false;
        pageTitle.innerHTML = "Cinema Halls";
        renderHalls();
    } else if (page === "admins") {
        adminsPage.hidden = false;
        pageTitle.innerHTML = "Administrators";
        renderAdmins();
    }

    for (let i = 0; i < navButtons.length; i++) {
        if (navButtons[i].getAttribute("data-page") === page) {
            navButtons[i].classList.add("active");
        }
    }
}

function clearErrors() {
    document.getElementById("hallNameError").innerHTML = "";
    document.getElementById("cityError").innerHTML = "";
    document.getElementById("totalError").innerHTML = "";
    document.getElementById("vipError").innerHTML = "";

    hallName.classList.remove("errorBorder");
    city.classList.remove("errorBorder");
    total.classList.remove("errorBorder");
    vip.classList.remove("errorBorder");

    document.getElementById("result").innerHTML = "";
}

function showError(input, errorId, message) {
    input.classList.add("errorBorder");
    document.getElementById(errorId).innerHTML = message;
}

function validateHall() {
    let totalValue = Number(total.value);
    let vipValue = Number(vip.value);
    let valid = true;

    clearErrors();

    if (hallName.value.trim() === "") {
        showError(hallName, "hallNameError", "Hall name is required.");
        valid = false;
    } else if (!/^[A-Za-z0-9 ]+$/.test(hallName.value.trim())) {
        showError(hallName, "hallNameError", "Use letters, numbers and spaces only.");
        valid = false;
    } else if (hallName.value.trim().length < 3) {
        showError(hallName, "hallNameError", "Hall name must be at least 3 characters.");
        valid = false;
    }

    if (city.value === "") {
        showError(city, "cityError", "Please select a city.");
        valid = false;
    }

    if (total.value.trim() === "") {
        showError(total, "totalError", "Total seats is required.");
        valid = false;
    } else if (!Number.isInteger(totalValue) || totalValue < 1 || totalValue > 500) {
        showError(total, "totalError", "Enter a whole number from 1 to 500.");
        valid = false;
    }

    if (vip.value.trim() === "") {
        showError(vip, "vipError", "VIP seats is required.");
        valid = false;
    } else if (!Number.isInteger(vipValue) || vipValue < 0) {
        showError(vip, "vipError", "Enter a whole number, 0 or more.");
        valid = false;
    } else if (vipValue > totalValue) {
        showError(vip, "vipError", "VIP seats cannot exceed total seats.");
        valid = false;
    }

    return valid;
}

function deleteHall(id) {
    let hallIndex = -1;

    for (let i = 0; i < data.halls.length; i++) {
        if (data.halls[i].id === id) {
            hallIndex = i;
        }
    }

    if (hallIndex === -1) {
        return;
    }

    if (data.halls[hallIndex].bookings > 0) {
        alert("This hall has bookings, so it cannot be deleted.");
        return;
    }

    if (confirm("Delete " + data.halls[hallIndex].name + "?")) {
        data.halls.splice(hallIndex, 1);
        saveData();
        render();
    }
}

for (let i = 0; i < navButtons.length; i++) {
    navButtons[i].addEventListener("click", function () {
        showPage(this.getAttribute("data-page"));
    });
}

document.querySelectorAll(".action-card").forEach(function (button) {
    button.addEventListener("click", function () {
        showPage(this.getAttribute("data-page"));
    });
});

form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (validateHall()) {
        data.halls.push({
            id: Date.now(),
            name: hallName.value.trim(),
            city: city.value,
            total: Number(total.value),
            vip: Number(vip.value),
            bookings: 0
        });

        saveData();
        form.reset();
        clearErrors();
        document.getElementById("result").innerHTML = "Hall added successfully.";
        render();
    }
});

halls.addEventListener("click", function (event) {
    let target = event.target;

    if (target.classList.contains("delete-hall")) {
        let id = Number(target.getAttribute("data-id"));
        deleteHall(id);
    }
});

render();
showPage("dashboard");


backButton.addEventListener("click", function () {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        showPage("dashboard");
    }
});
