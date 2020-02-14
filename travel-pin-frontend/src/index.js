// unsplash api links
let API_BASE_URL = "https://api.unsplash.com/search/photos?&client_id=28dcfd24d5d678c88e38fcb751323ba6bae6b9eec6d3d514f24f645deb90b2b4&query="
let SEARCH = {};

// track current user
let currentUser = null

document.addEventListener('DOMContentLoaded', () => {
    loginForm()
    listenForSignup()
    listenForExplore()
    fetchBoards()
    listenForProfile()
})

// signup 
function listenForSignup() {
    const signupButton = document.getElementById("signup-button")
    signupButton.addEventListener("click", () => {
        signupForm()
    })
}

function signupForm() {
    const loginDiv = document.getElementById("login-div")
    loginDiv.style.display = "none"
    const signupDiv = document.getElementById("signup-div")
    const signupForm = document.getElementById("signup-form")
    signupDiv.style.display = "block"
    signupForm.addEventListener("submit", event => {
        event.preventDefault()
        let user = { name: event.target.name.value }
        postUser(user)
    })
}

function postUser(user) {
    fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify(user)
    })
        .then(res => {
            clearPhotos()
            const forms_div = document.getElementById("forms-div");
            forms_div.innerHTML = "";
            fetchRandomPhotos();
            return res.json()
        })
        .then(data => {
            console.log(data)
            currentUser = data
            showNavOptions()
            filloutDropDown() //adds event listener on dropdown menu
            createBoard();
            hideBg()
        })
        .catch(err => console.log(`ERROR:${err}`))
}

// login
function loginForm() {
    let loginForm = document.getElementById("login-form")
    loginForm.addEventListener("submit", event => {
        event.preventDefault()
        let user = { name: event.target.name.value }
        loginUser(user)
    })
}

function loginUser(user) {
    fetch('http://localhost:3000/users')
        .then(res => res.json())
        .then(data => validLogin(data, user))
        .catch(err => console.log(`ERROR:${err}`))
}

function validLogin(data, user) {
    let userExists = data.find(userObj => userObj.name == user.name)
    if (userExists) {
        console.log("valid user")
        currentUser = userExists
        showNavOptions()
        fetchRandomPhotos()
        filloutDropDown() //adds event listener on dropdown menu
        createBoard()
        hideBg()
    } else {
        alert("User Does Not Exist")
    }
}

// delete user
function listenForDeleteUser() {
    const deleteUser = document.getElementById("delete-user")
    deleteUser.addEventListener("click", () => {
        console.log("deleting user")
        deleteUser()
    })
}

function deleteUser(currentUser) {
    fetch(`http://localhost:3000/users/${currentUser.id}`, {
        method: "DELETE"
    }).then(res => {
        if (res.status == 200) {
            console.log("user deleted")
            document.location.reload(true);
        }
    })
}

// edit user
function updateUser(currentUser, newName) {
    fetch(`http://localhost:3000/users/${currentUser.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({ name: newName })
    })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            editedUser = data
            let currentUserElement = document.getElementById("current-user")
            currentUserElement.textContent = editedUser.name
        })
        .catch(err => console.log(`ERROR: ${err}`))
}

function listenForEditUser() {
    const editUserForm = document.getElementById("edit-user-form")
    editUserForm.addEventListener("submit", event => {
        event.preventDefault()
        console.log("editing user")
        const newName = document.getElementById("user-name");
        // updateUser(currentUser, newName);

        // hideModal()
    })
}

// profile
function listenForProfile() {
    const profile = document.getElementById("user-profile")
    profile.addEventListener("click", () => {
        clearPhotos()
        showProfile()
    })
}

function showProfile() {
    const profileDiv = document.getElementById("profile-div")
    profileDiv.innerHTML = ''
    const userNameH2 = document.createElement("h2")
    userNameH2.textContent = currentUser.name
    const editButton = document.createElement("button")
    editButton.type = "button"
    editButton.className = "btn btn-link"
    editButton.setAttribute("data-toggle", "modal")
    editButton.setAttribute("data-target", "#edit-user-modal")
    editButton.textContent = "Edit"
    userNameH2.appendChild(editButton)
    profileDiv.appendChild(userNameH2)
}

// nav bar
function showNavOptions() {
    const formsDiv = document.getElementById("forms-div")
    formsDiv.style.display = "none"
    const navOptions = document.getElementById("nav-options")
    navOptions.style.display = "block"
}

// hide bg image
function hideBg() {
    console.log('hide bg!!')
    const landing = document.getElementById("landing")
    landing.innerHTML = ''
    const bg = document.getElementById("bg")
    bg.style = ''
}

// clear main div items
function clearPhotos() {
    console.log("hiding dom")
    const photos = document.getElementById("photos")
    photos.innerHTML = ''
}

function clearProfile() {
    console.log("hiding profile")
    const profile = document.getElementById("profile-div")
    profile.innerHTML = ''
}

// photos from Unsplash API
function fetchPhotos() {
    event.preventDefault();
    clearPhotos()
    const search_input = document.querySelector('input[type="search"]');
    const search = search_input.value;
    fetch(`${API_BASE_URL}${search}`)
        .then(res => res.json())
        .then(jsonData => showPhotos(jsonData))
        .catch(error => {
            console.error("Fetch pictures Error", error);
        });
}

function fetchRandomPhotos() {
    const rand = Math.floor((Math.random() * 5) + 10);
    fetch(`${API_BASE_URL}random?count=${rand}`)
        .then(res => res.json())
        .then(jsonData => {
            clearProfile()
            showPhotos(jsonData)
        })
        .catch(error => {
            console.error("Fetch pictures Error", error);
        });
}

function showPhotos(photosArray) {
    const photos = photosArray.results
    photos.map(photo => addPhoto(photo))
}

function addPhoto(photo) {
    const photos = document.getElementById("photos");
    const photoCard = makePhotoCard(photo);
    photos.appendChild(photoCard);
}

function makePhotoCard(photo) {
    console.log(photo)
    const div = document.createElement("div")
    div.className = "card mb-3"
    // div.style.width = "26rem"

    const img = document.createElement("img")
    img.className = "card-img-top"
    img.src = photo.urls.regular

    const divCardBody = document.createElement("div")
    divCardBody.className = "card-body"

    // photographer name
    const h5 = document.createElement("h5")
    h5.class = "card-title"
    h5.textContent = photo.user.name
    divCardBody.appendChild(h5)

    // photographer instagram
    const userInstagram = photo.user.instagram_username
    if (userInstagram != null) {
        const h6 = document.createElement("h6")
        h6.className = "card-text"
        h6.textContent = ` @${userInstagram}`
        h5.appendChild(h6)
    }

    // board dropdown
    const dropdownDiv = document.createElement("div")
    dropdownDiv.className = "dropdown"

    const dropdownButton = document.createElement("button")
    dropdownButton.className = "dropbtn"
    dropdownButton.textContent = "Add to Board"
    dropdownDiv.appendChild(dropdownButton)

    const dropdownContentDiv = document.createElement("div")
    dropdownContentDiv.className = "dropdown-content"



    const a1 = document.createElement("a")
    a1.textContent = "New Board"
    a1.style.color = "green"

    fetchBoards(dropdownContentDiv, a1, photo)


    dropdownDiv.appendChild(dropdownContentDiv)
    divCardBody.appendChild(dropdownDiv)

    div.appendChild(img)
    div.appendChild(divCardBody)

    return div;
}

function listenForExplore() {
    const explore = document.getElementById("exploreA")
    explore.addEventListener("click", () => {
        clearPhotos()
        fetchRandomPhotos()
    })
}

// board dropdown
function fetchBoards(dropdownContentDiv, a1, photo) {
    fetch("http://localhost:3000/boards")
        .then((res) => {
            return res.json();
        })
        .then((jsonData) => {
            console.log(jsonData);
            getUserBoards(jsonData, dropdownContentDiv, photo)

        }).catch((error) => {
            console.error("Fetch pictures Error", error);
        });
}

function getUserBoards(jsonData, dropdownContentDiv, photo) {
    console.log("Boards", jsonData);
    const boards = []
    jsonData.forEach(board => {
        if (board.user_id == currentUser.id) {
            boards.push(board)
        }
    });
    console.log(boards)
    boards.forEach(board => {
        const a = document.createElement("a")
        a.innerText = board.title
        a.id = board.id
        a.addEventListener("click", () => {
            postPhotos(a.id, photo)
        })
        dropdownContentDiv.appendChild(a)
    });
}

// function clickableBoardDropdown(link) {
//     link.addEventListener("click", () => {
//         postPhotos(link.id)
//     })
// }

function postPhotos(boardId, photo) {
    console.log(boardId)
    fetch('http://localhost:3000/photos', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({ board_id: boardId, url: photo.urls.regular })
    })
        .then(res => {
            return res.json()
        })
        .then(data => {
            console.log(data)
        })
        .catch(err => console.log(`ERROR:${err}`))
}

function hideModal() {
    const modal = document.getElementById("board-modal")
    modal.classList.add("hide")
    modal.classList.remove("show")
}

//<----------------------------------------------------------------------------->

// ERICS EDITS

function filloutDropDown() {
    const navBar = document.getElementById("navbarDropdownMenuLink");
    navBar.innerText = currentUser.name;

    const profile = document.getElementById("user-profile");

    profile.addEventListener("click", () => {
        console.log("Clicked on Profile");
    });

    const logout = document.getElementById("user-logout");

    logout.addEventListener("click", () => {
        console.log("Clicked on logout");
        document.location.reload(true);
    });
}

function logout() {
    document.location.reload(true);
}

// new board
function createBoard() {
    const newBoardForm = document.getElementById("new-board-form")
    newBoardForm.addEventListener("submit", event => {
        event.preventDefault()
        console.log("making new board")
        console.log(newBoardForm.value)
        const titleText = document.getElementById("title-name");
        console.log(titleText.value);
        const noteText = document.getElementById("note-text");
        console.log(noteText.value);
        postBoard(titleText.value, noteText.value);

        hideModal()
    })
}


function postBoard(title, note) {
    console.log("TITLE", title)
    console.log("NOTe", note)

    fetch('http://localhost:3000/boards', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({
            title: title,
            user_id: currentUser.id,
            note: note
        })
    })
        .then(res => {
            console.log(res)
            return res.json()
        })
        .then(data => console.log(data))
        .catch(err => console.log(`ERROR:${err}`))
}