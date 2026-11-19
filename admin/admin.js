const movieForm = document.getElementById("movieForm");
const movieList = document.getElementById("movieList");
const title = document.getElementById("title");
const language = document.getElementById("language");
const editId = document.getElementById("editId");

let movies = [
    {id: "m1", title: "Interstellar", language: "English", showtimes: 2},
    {id: "m2", title: "Oppenheimer", language: "English", showtimes: 2},
    {id: "m3", title: "Parasite", language: "Korean", showtimes: 2}
];

let showtimes = [
    ["Interstellar", "Star Cineplex", "Nov 20, 2026", "5:00 PM", "Tk 500"],
    ["Interstellar", "Navana Hall", "Nov 20, 2026", "8:00 PM", "Tk 450"],
    ["Oppenheimer", "Star Cineplex", "Nov 21, 2026", "5:00 PM", "Tk 600"],
    ["Oppenheimer", "Surma Cinema", "Nov 21, 2026", "11:00 AM", "Tk 400"],
    ["Parasite", "Navana Hall", "Nov 22, 2026", "10:00 PM", "Tk 450"],
    ["Parasite", "Surma Cinema", "Nov 22, 2026", "5:00 PM", "Tk 400"]
];

let bookings = [
    ["CB-1001", "Istiak", "Interstellar", "2", "Tk 1,000", "Confirmed"],
    ["CB-1002", "Nayem", "Oppenheimer", "3", "Tk 1,800", "Confirmed"],
    ["CB-1003", "Abida", "Parasite", "1", "Tk 450", "Cancelled"],
];

function renderMovies() {
    let rows = "";
    for (let i = 0; i < movies.length; i++) {
        rows += "<tr><td>" + movies[i].title + "</td><td>" + movies[i].language + "</td><td>" + movies[i].showtimes + "</td>" +
        '<td><button class="edit-btn" data-id="' + movies[i].id + '">Edit</button><button class="delete-btn" data-id="' + movies[i].id + '">Delete</button></td></tr>';
    }
    if (rows === "") {
        rows = '<tr><td colspan="4">No movies available.</td></tr>';
    }
    movieList.innerHTML = rows;
}

function renderShowtimes() {
    let rows = "";
    for (let i = 0; i < showtimes.length; i++) {
        rows += "<tr><td>" + showtimes[i][0] + "</td><td>" + showtimes[i][1] + "</td><td>" + showtimes[i][2] + "</td><td>" + showtimes[i][3] + "</td><td>" + showtimes[i][4] + "</td></tr>";
    }
    document.getElementById("showtimeList").innerHTML = rows;
}

function renderBookings() {
    let rows = "";
    for (let i = 0; i < bookings.length; i++) {
        rows += "<tr><td>" + bookings[i][0] + "</td><td>" + bookings[i][1] + "</td><td>" + bookings[i][2] + "</td><td>" + bookings[i][3] + "</td><td>" + bookings[i][4] + "</td><td>" + bookings[i][5] + "</td></tr>";
    }
    document.getElementById("bookingList").innerHTML = rows;
}

function showPage(pageName) {
    let pages = document.querySelectorAll(".page");
    let buttons = document.querySelectorAll(".nav-btn");
    for (let i = 0; i < pages.length; i++) {
        pages[i].classList.add("hidden");
    }
    document.getElementById(pageName + "Page").classList.remove("hidden");
    for (let j = 0; j < buttons.length; j++) {
        buttons[j].classList.remove("active");
        if (buttons[j].getAttribute("data-page") === pageName) {
            buttons[j].classList.add("active");
        }
    }
}

function clearErrors() {
    document.getElementById("titleError").innerHTML = "";
    document.getElementById("languageError").innerHTML = "";
    title.classList.remove("errorBorder");
    language.classList.remove("errorBorder");
}

function resetForm() {
    movieForm.reset();
    editId.value = "";
    document.getElementById("formHeading").innerHTML = "Add a Movie";
    document.getElementById("submitBtn").innerHTML = "Add Movie";
    document.getElementById("cancelEdit").classList.add("hidden");
}

function editMovie(id) {
    for (let i = 0; i < movies.length; i++) {
        if (movies[i].id === id) {
            title.value = movies[i].title;
            language.value = movies[i].language;
            editId.value = id;
            document.getElementById("formHeading").innerHTML = "Edit Movie";
            document.getElementById("submitBtn").innerHTML = "Update Movie";
            document.getElementById("cancelEdit").classList.remove("hidden");
            showPage("movies");
            title.focus();
        }
    }
}

function deleteMovie(id) {
    let hasBooking = false;
    for (let i = 0; i < bookings.length; i++) {
        if (bookings[i][2] === getMovieTitle(id) && bookings[i][5] !== "Cancelled") {
            hasBooking = true;
        }
    }
    if (hasBooking) {
        alert("This movie has bookings, so it cannot be deleted.");
        return;
    }
    if (confirm("Delete this movie and its showtimes?")) {
        let updated = [];
        for (let i = 0; i < movies.length; i++) {
            if (movies[i].id !== id) {
                updated.push(movies[i]);
            }
        }
        movies = updated;
        renderMovies();
        alert("Movie removed from this temporary demo. Refreshing will restore the sample records.");
    }
}

function getMovieTitle(id) {
    for (let i = 0; i < movies.length; i++) {
        if (movies[i].id === id) {
            return movies[i].title;
        }
    }
    return "";
}

movieList.addEventListener("click", function(event) {
    let id = event.target.getAttribute("data-id");
    if (event.target.classList.contains("edit-btn")) {
        editMovie(id);
    }
    if (event.target.classList.contains("delete-btn")) {
        deleteMovie(id);
    }
});

movieForm.addEventListener("submit", function(event) {
    event.preventDefault();
    clearErrors();
    let valid = true;

    if (title.value.trim() === "") {
        document.getElementById("titleError").innerHTML = "Movie title is required.";
        title.classList.add("errorBorder");
        valid = false;
    } else if (!/^[A-Za-z0-9:' ]+$/.test(title.value.trim())) {
        document.getElementById("titleError").innerHTML = "Only letters, digits, spaces, : and ' are allowed.";
        title.classList.add("errorBorder");
        valid = false;
    } else if (title.value.trim().length < 2 || title.value.trim().length > 60) {
        document.getElementById("titleError").innerHTML = "Title must be 2 to 60 characters.";
        title.classList.add("errorBorder");
        valid = false;
    }

    if (language.value.trim() === "") {
        document.getElementById("languageError").innerHTML = "Language is required.";
        language.classList.add("errorBorder");
        valid = false;
    } else if (!/^[A-Za-z ]+$/.test(language.value.trim())) {
        document.getElementById("languageError").innerHTML = "Only letters and spaces are allowed.";
        language.classList.add("errorBorder");
        valid = false;
    }

    if (valid) {
        alert("Form submitted. Since this is a standalone demo without a backend, the page will refresh and the sample data will remain unchanged.");
        window.location.reload();
    }
});

document.getElementById("cancelEdit").addEventListener("click", function() {
    resetForm();
});

let navButtons = document.querySelectorAll(".nav-btn");
for (let i = 0; i < navButtons.length; i++) {
    navButtons[i].addEventListener("click", function() {
        showPage(navButtons[i].getAttribute("data-page"));
    });
}

let jumps = document.querySelectorAll(".page-jump");
for (let i = 0; i < jumps.length; i++) {
    jumps[i].addEventListener("click", function() {
        showPage(jumps[i].getAttribute("data-page"));
    });
}

document.getElementById("backBtn").addEventListener("click", function() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        showPage("dashboard");
    }
});

renderMovies();
renderShowtimes();
renderBookings();

const backgroundPicker = document.getElementById("backgroundPicker");
const optionCards = document.querySelectorAll(".option-card");
const removeBackground = document.getElementById("removeBackground");

backgroundPicker.addEventListener("change", function() {
    if (backgroundPicker.files.length > 0) {
        let imageURL = URL.createObjectURL(backgroundPicker.files[0]);
        for (let i = 0; i < optionCards.length; i++) {
            optionCards[i].style.backgroundImage = "linear-gradient(135deg,rgba(20,20,25,.35),rgba(20,20,25,.6)),url('" + imageURL + "')";
        }
    }
});

removeBackground.addEventListener("click", function() {
    for (let i = 0; i < optionCards.length; i++) {
        optionCards[i].style.backgroundImage = "";
    }
    backgroundPicker.value = "";
});
