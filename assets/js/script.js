function showMenu() {
    let menuMobile = document.querySelector('.mobile-menu');
    if (menuMobile?.classList.contains('open')) {
        menuMobile.classList.remove('open');
        document.getElementById('menu-icon')?.classList.remove("fa-xmark");
        document.getElementById('menu-icon')?.classList.add("fa-bars");
    } else if (menuMobile) {
        menuMobile.classList.add('open');
        document.getElementById('menu-icon')?.classList.remove("fa-bars");
        document.getElementById('menu-icon')?.classList.add("fa-xmark");
    }
}

const modalLogin = document.querySelector('.box-login');
const modalCadastro = document.querySelector('.box-cadastro');

function showLogin() {
    modalLogin?.showModal();
}

function closeLogin() {
    modalLogin?.close();
}

function showCadastro() {
    modalCadastro?.showModal();
    modalLogin?.close();
}

function closeCadastro() {
    modalCadastro?.close();
}

const passwordIcons = document.querySelectorAll('.password-icon');

passwordIcons.forEach(icon => {
    icon.addEventListener('click', function () {
        const input = this.parentElement.querySelector('.form-control');
        if (input) {
            input.type = input.type === 'password' ? 'text' : 'password';
            this.classList.toggle('fa-eye');
        }
    });
});

const btnProfile = document.querySelector("#profile-btn");
const profileOptions = document.querySelector(".profile-options-list");

if (btnProfile && profileOptions) {
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
}

const btnFilter = document.querySelector(".btn-filter");
const filterContent = document.querySelector("#filter_content");
const btnSort = document.querySelector(".btn-sort");
const sortContent = document.querySelector("#sort_content");

if (btnFilter && filterContent && sortContent) {
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
}

if (btnSort && sortContent && filterContent) {
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
}

const createCards = Array.from({ length: 100 }).map((_, i) =>
    `<div class="card">
        <div class="card-image">
            <img src="assets/images/foto_restaurante.png" alt="Foto restaurante">
        </div>
        <div class="card-info">
            <h3>Restaurante ${i + 1}</h3>
            <div>Categoria</div>
            <div>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <span>5,0</span>
            </div>
            <div><i class="fa-solid fa-location-dot"></i> Cidade</div>
        </div>
    </div>`
);

let perPage = 12;
const statePage = {
    page: 1,
    perPage,
    totalPage: Math.ceil(createCards.length / perPage),
    maxVisibleButtons: 5,
}

const pageControls = {
    next() {
        statePage.page++;
        if (statePage.page > statePage.totalPage) statePage.page--;
    },
    preview() {
        statePage.page--;
        if (statePage.page < 1) statePage.page++;
    },
    goTo(page) {
        statePage.page = Math.max(1, Math.min(page, statePage.totalPage));
    },
    createListeners() {
        const first = document.querySelector("#first");
        const last = document.querySelector("#last");
        const next = document.querySelector("#next");
        const preview = document.querySelector("#preview");

        if (first) first.addEventListener("click", () => { pageControls.goTo(1); update(); });
        if (last) last.addEventListener("click", () => { pageControls.goTo(statePage.totalPage); update(); });
        if (next) next.addEventListener("click", () => { pageControls.next(); update(); });
        if (preview) preview.addEventListener("click", () => { pageControls.preview(); update(); });
    },
    disableButtons() {
        const preview = document.querySelector("#preview");
        const first = document.querySelector("#first");
        const next = document.querySelector("#next");
        const last = document.querySelector("#last");

        if (preview && first) {
            preview.disabled = statePage.page === 1;
            first.disabled = statePage.page === 1;
        }
        if (next && last) {
            next.disabled = statePage.page === statePage.totalPage;
            last.disabled = statePage.page === statePage.totalPage;
        }
    }
}

const pageCards = {
    create(cardHTML) {
        const container = document.createElement("a");
        container.innerHTML = cardHTML;
        document.querySelector("#cards_container")?.appendChild(container);
    },
    update() {
        const cardsContainer = document.querySelector("#cards_container");
        if (!cardsContainer) return;
        cardsContainer.innerHTML = "";

        let page = statePage.page - 1;
        let start = page * statePage.perPage;
        let end = start + statePage.perPage;
        const paginatedCards = createCards.slice(start, end);

        paginatedCards.forEach(pageCards.create);
    }
}

const numButtons = {
    create(number) {
        const button = document.createElement("li");
        button.innerHTML = `<a href="#">${number}</a>`;

        if (statePage.page === number) button.classList.add("active");

        button.addEventListener("click", (event) => {
            event.preventDefault();
            const page = Number(event.target.innerText);
            pageControls.goTo(page);
            update();
        });

        document.querySelector("#pagination_numbers")?.appendChild(button);
    },
    update() {
        const pagination = document.querySelector("#pagination_numbers");
        if (!pagination) return;

        pagination.innerHTML = "";
        const { maxLeft, maxRight } = numButtons.calculateMaxVisible();
        for (let page = maxLeft; page <= maxRight; page++) {
            numButtons.create(page);
        }
    },
    calculateMaxVisible() {
        const { maxVisibleButtons } = statePage;
        let maxLeft = statePage.page - Math.floor(maxVisibleButtons / 2);
        let maxRight = statePage.page + Math.floor(maxVisibleButtons / 2);

        if (maxLeft < 1) {
            maxLeft = 1;
            maxRight = maxVisibleButtons;
        }

        if (maxRight > statePage.totalPage) {
            maxLeft = statePage.totalPage - (maxVisibleButtons - 1);
            maxRight = statePage.totalPage;
            if (maxLeft < 1) maxLeft = 1;
        }

        return { maxLeft, maxRight };
    }
}

function update() {
    pageCards.update();
    numButtons.update();
    pageControls.disableButtons();
}

function init() {
    if (document.querySelector("#cards_container")) {
        update();
        pageControls.createListeners();
    }
}

init();
