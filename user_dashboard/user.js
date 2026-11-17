
const movieList = document.getElementById("movieList");
const filterBox = document.getElementById("filterBox");
const detailsBox = document.getElementById("detailsBox");
const cartBox = document.getElementById("cartBox");
const pageTitle = document.getElementById("pageTitle");
const cartCount = document.getElementById("cartCount");

const searchBtn = document.getElementById("searchBtn");
const city = document.getElementById("city");
const slot = document.getElementById("slot");
const navButtons = document.querySelectorAll(".nav-btn");

let movies = [
    {
        id: 1,
        title: "Interstellar",
        language: "English",
        duration: 169,
        genre: ["Sci-Fi", "Drama"],
        rating: "U",
        image: "images/interstellar.jpg",
        city: "Dhaka",
        time: "afternoon",
        status: "now"
    },
    {
        id: 2,
        title: "Oppenheimer",
        language: "English",
        duration: 180,
        genre: ["Drama", "History"],
        rating: "A",
        image: "images/oppenheimer.jpg",
        city: "Dhaka",
        time: "evening",
        status: "now"
    },
    {
        id: 3,
        title: "Parasite",
        language: "Korean",
        duration: 132,
        genre: ["Thriller", "Drama"],
        rating: "A",
        image: "images/parasite.jpg",
        city: "Sylhet",
        time: "night",
        status: "now"
    },
    {
        id: 4,
        title: "Dune",
        language: "English",
        duration: 155,
        genre: ["Sci-Fi", "Adventure"],
        rating: "U",
        image: "images/dune.jpg",
        city: "Dhaka",
        time: "afternoon",
        status: "now"
    },
    {
        id: 5,
        title: "Inception",
        language: "English",
        duration: 148,
        genre: ["Sci-Fi", "Action"],
        rating: "A",
        image: "images/inception.jpg",
        city: "Chittagong",
        time: "morning",
        status: "now"
    },
    {
        id: 6,
        title: "The Dark Knight",
        language: "English",
        duration: 152,
        genre: ["Action", "Crime"],
        rating: "A",
        image: "images/dark-knight.jpg",
        city: "Dhaka",
        time: "night",
        status: "now"
    },
    {
        id: 7,
        title: "Avatar",
        language: "English",
        duration: 162,
        genre: ["Sci-Fi", "Adventure"],
        rating: "U",
        image: "images/avatar.jpg",
        city: "Sylhet",
        time: "evening",
        status: "now"
    },
    {
        id: 8,
        title: "Avengers Endgame",
        language: "English",
        duration: 181,
        genre: ["Action", "Superhero"],
        rating: "U",
        image: "images/endgame.jpg",
        city: "Chittagong",
        time: "afternoon",
        status: "now"
    },
    {
        id: 9,
        title: "Avengers: Doomsday",
        language: "English",
        duration: 140,
        genre: ["Action", "Adventure"],
        rating: "U",
        image: "images/doomsday.jpg",
        city: "Dhaka",
        time: "evening",
        status: "soon"
    },
    {
        id: 10,
        title: "God Valley",
        language: "Japanesse",
        duration: 150,
        genre: ["Action", "Crime"],
        rating: "A",
        image: "images/godValley.jpg",
        city: "Sylhet",
        time: "night",
        status: "soon"
    },
    {
        id: 11,
        title: "Dune: Part Three",
        language: "English",
        duration: 148,
        genre: ["Action", "Drama"],
        rating: "A",
        image: "images/dune3.jpg",
        city: "Dhaka",
        time: "afternoon",
        status: "soon"
    }
];

let cart = JSON.parse(localStorage.getItem("cinebookCart")) || [];
let currentPage = "now";

function renderMovies(list) {
    let output = "";

    for (let i = 0; i < list.length; i++) {
        let movie = list[i];
        let tags = "";

        for (let j = 0; j < movie.genre.length; j++) {
            tags += "<span>" + movie.genre[j] + "</span>";
        }

        output +=
            '<div class="movie-card">' +
                '<div class="poster">' +
                    '<img src="' + movie.image + '" alt="' + movie.title + '">' +
                    '<div class="badges">' +
                        '<span class="badge">' + movie.rating + '</span>' +
                        '<span class="badge red-badge">2D</span>' +
                    '</div>' +
                '</div>' +
                '<h3><a href="#" class="movie-link" data-id="' + movie.id + '">' + movie.title + '</a></h3>' +
                '<div class="tags">' + tags + '</div>' +
                '<p class="movie-info">' + movie.language + ' / ' + movie.duration + ' min</p>' +
            '</div>';
    }

    if (output === "") {
        movieList.innerHTML = "<p>No movies found.</p>";
    } else {
        movieList.innerHTML = output;
    }
}

function searchMovies() {
    let searchText = search.value.toLowerCase();
    let selectedCity = city.value;
    let selectedTime = slot.value;

    let filteredMovies = [];

    for (let i = 0; i < movies.length; i++) {
        let movie = movies[i];

        if (
            movie.status === currentPage &&
            movie.title.toLowerCase().indexOf(searchText) !== -1 &&
            (selectedCity === "" || movie.city === selectedCity) &&
            (selectedTime === "" || movie.time === selectedTime)
        ) {
            filteredMovies.push(movie);
        }
    }

    renderMovies(filteredMovies);
}

function showPage(page) {
    currentPage = page;

    detailsBox.style.display = "none";
    cartBox.style.display = "none";
    movieList.style.display = "none";
    filterBox.style.display = "none";

    for (let i = 0; i < navButtons.length; i++) {
        navButtons[i].classList.remove("active");
    }

    for (let i = 0; i < navButtons.length; i++) {
        if (navButtons[i].getAttribute("data-page") === page) {
            navButtons[i].classList.add("active");
        }
    }

    if (page === "now") {
        pageTitle.innerHTML = "Now Showing";
        movieList.style.display = "grid";
        filterBox.style.display = "flex";
        searchMovies();

    } else if (page === "soon") {
        pageTitle.innerHTML = "Coming Soon";
        movieList.style.display = "grid";

        let upcomingMovies = [];

        for (let i = 0; i < movies.length; i++) {
            if (movies[i].status === "soon") {
                upcomingMovies.push(movies[i]);
            }
        }

        renderMovies(upcomingMovies);

    } else if (page === "cart") {
        pageTitle.innerHTML = "My Cart";
        showCart();
    }
}

function showDetails(id) {
    let selectedMovie = null;

    for (let i = 0; i < movies.length; i++) {
        if (movies[i].id === id) {
            selectedMovie = movies[i];
            break;
        }
    }

    if (selectedMovie === null) {
        return;
    }

    movieList.style.display = "none";
    filterBox.style.display = "none";
    cartBox.style.display = "none";
    detailsBox.style.display = "block";

    pageTitle.innerHTML = selectedMovie.title;

    let genres = "";

    for (let i = 0; i < selectedMovie.genre.length; i++) {
        genres += selectedMovie.genre[i];

        if (i < selectedMovie.genre.length - 1) {
            genres += ", ";
        }
    }

    detailsBox.innerHTML =
        "<h2>" + selectedMovie.title + "</h2>" +
        '<img src="' + selectedMovie.image + '" alt="' + selectedMovie.title + '">' +
        "<p>Language: " + selectedMovie.language + "</p>" +
        "<p>Duration: " + selectedMovie.duration + " minutes</p>" +
        "<p>Genre: " + genres + "</p>" +
        "<p>Rating: " + selectedMovie.rating + "</p>" +
        '<button class="add-btn" data-action="add" data-id="' + selectedMovie.id + '">Add to Cart</button>' +
        '<button class="buy-btn" data-action="buy" data-id="' + selectedMovie.id + '">Buy Now</button>' +
        '<button class="back-btn" data-action="back">Back</button>';
}

function addToCart(id) {
    let selectedMovie = null;
    let exists = false;

    for (let i = 0; i < movies.length; i++) {
        if (movies[i].id === id) {
            selectedMovie = movies[i];
            break;
        }
    }

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === id) {
            exists = true;
            break;
        }
    }

    if (exists) {
        alert("This movie is already in your cart.");
    } else if (selectedMovie !== null) {
        cart.push(selectedMovie);
        saveCart();
        alert(selectedMovie.title + " added to cart.");
    }
}

function buyNow(id) {
    addToCart(id);
    showPage("cart");
}

function saveCart() {
    localStorage.setItem("cinebookCart", JSON.stringify(cart));
    cartCount.innerHTML = cart.length;
}


function showCart() {
    movieList.style.display = "none";
    filterBox.style.display = "none";
    detailsBox.style.display = "none";
    cartBox.style.display = "block";

    let output = "";

    if (cart.length === 0) {
        output = "<h3>Your cart is empty.</h3>";
    } else {
        for (let i = 0; i < cart.length; i++) {
            output +=
                '<div class="cart-item">' +
                    '<img src="' + cart[i].image + '" alt="' + cart[i].title + '">' +
                    '<div class="cart-details">' +
                        "<h3>" + cart[i].title + "</h3>" +
                        "<p>" + cart[i].language + "</p>" +
                        '<div class="cart-actions">' +
                            '<button class="remove-btn" data-id="' + cart[i].id + '">Remove</button>' +
                            '<button class="buy-btn" data-id="' + cart[i].id + '">Buy Now</button>' +
                        "</div>" +
                    "</div>" +
                "</div>";
        }
    }

    cartBox.innerHTML = output;
}


function removeFromCart(id) {
    let updatedCart = [];

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id !== id) {
            updatedCart.push(cart[i]);
        }
    }

    cart = updatedCart;

    saveCart();
    showCart();
}

search.addEventListener("input", function () {
    if (currentPage === "now") {
        searchMovies();
    }
});

city.addEventListener("change", function () {
    if (currentPage === "now") {
        searchMovies();
    }
});

slot.addEventListener("change", function () {
    if (currentPage === "now") {
        searchMovies();
    }
});

for (let i = 0; i < navButtons.length; i++) {
    navButtons[i].addEventListener("click", function () {
        let page = this.getAttribute("data-page");
        showPage(page);
    });
}

movieList.addEventListener("click", function (event) {
    let target = event.target.closest(".movie-link");

    if (target !== null) {
        event.preventDefault();

        let id = Number(target.getAttribute("data-id"));
        showDetails(id);
    }
});

detailsBox.addEventListener("click", function (event) {
    let target = event.target;

    if (target.getAttribute("data-action") === "add") {
        let id = Number(target.getAttribute("data-id"));
        addToCart(id);

    } else if (target.getAttribute("data-action") === "buy") {
        let id = Number(target.getAttribute("data-id"));
        buyNow(id);

    } else if (target.getAttribute("data-action") === "back") {
        showPage(currentPage);
    }
});


cartBox.addEventListener("click", function (event) {
    let target = event.target;

    if (target.classList.contains("remove-btn")) {
        let id = Number(target.getAttribute("data-id"));
        removeFromCart(id);

    } else if (target.classList.contains("buy-btn")) {
        let id = Number(target.getAttribute("data-id"));
        alert("Buying " + id + " - checkout will be added later.");
    }
});

searchBtn.addEventListener("click", function () {
    searchMovies();
});

saveCart();
showPage("now");
