function showMenu() {
    let menuMobile = document.querySelector('.mobile-menu');
    if (menuMobile.classList.contains('open')) {
        menuMobile.classList.remove('open');
        document.getElementById('menu-icon').classList.remove("fa-xmark");
        document.getElementById('menu-icon').classList.add("fa-bars");
    }
    else {
        menuMobile.classList.add('open');
        document.getElementById('menu-icon').classList.remove("fa-bars");
        document.getElementById('menu-icon').classList.add("fa-xmark");
    }
}

const modalLogin = document.querySelector('.box-login');
const modalCadastro = document.querySelector('.box-cadastro');

function showLogin() {
    modalLogin.showModal();
}

function closeLogin() {
    modalLogin.close();
}

function showCadastro() {
    modalCadastro.showModal();
    modalLogin.close();
}

function closeCadastro() {
    modalCadastro.close();
}

const passwordIcons = document.querySelectorAll('.password-icon');

passwordIcons.forEach(icon => {
    icon.addEventListener('click', function () {
        const input = this.parentElement.querySelector('.form-control');
        input.type = input.type === 'password' ? 'text' : 'password';
        this.classList.toggle('fa-eye');
    })
});

const btnProfile = document.querySelector(".profile-btn button");
const profileOptions = document.querySelector(".profile-options-list");

btnProfile.addEventListener("click", (event) => {
    event.stopPropagation();
    profileOptions.classList.toggle("active");
});

profileOptions.addEventListener("click", (event) => {
    event.stopPropagation();
});

window.addEventListener("click", () => {
    profileOptions.classList.remove("active");
});

const btnFilter = document.querySelector(".btn-filter");
const filterContent = document.querySelector("#filter_content");

btnFilter.addEventListener("click", (event) => {
    event.stopPropagation();
    sortContent.classList.remove("active");
    filterContent.classList.toggle("active");
});

filterContent.addEventListener("click", (event) => {
    event.stopPropagation();
});

window.addEventListener("click", () => {
    filterContent.classList.remove("active");
});

const btnSort = document.querySelector(".btn-sort");
const sortContent = document.querySelector("#sort_content");

btnSort.addEventListener("click", (event) => {
    event.stopPropagation();
    filterContent.classList.remove("active");
    sortContent.classList.toggle("active");
});

sortContent.addEventListener("click", (event) => {
    event.stopPropagation();
});

window.addEventListener("click", () => {
    sortContent.classList.remove("active");
});