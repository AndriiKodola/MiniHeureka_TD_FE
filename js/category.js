window.addEventListener('DOMContentLoaded', event => {
    const serverAddress = 'https://mini-heureka-internal-server.herokuapp.com';

    const query = new URLSearchParams(window.location.search);
    const globalCategoryId = query.get('id');
    let currPage = query.get('page');
    let numOfpages = 1;

    /*********************************************************************
    ************************* SIDE NAV FUNCTIONS *************************
    *********************************************************************/

    /**
    * Creates an HTML element for side navigation section
    * @param {object} data - object containing category data
    * @param {number} idx - id of a appropriate category for a link
    * @return {HTML element} - side nav link
    */
    const createSideNavLink = (data, idx) => {
        const sideNavLink = document.createElement('a');
    
        sideNavLink.classList.add('nav-link');
        sideNavLink.href = `./category.html?id=${idx}&page=1`;
        sideNavLink.innerText = data.title;

        if (globalCategoryId == idx) {
            sideNavLink.classList.add('active');
        }

        return sideNavLink;
    };

    /**
    * Appends side nav links to the layout
    * @param {array} data - parsed data from API
    * @return None
    */
    const appendSideNavLinks = categories => {
        const sideNav = document.getElementById('v-pills-tab');

        for ( let i = 0; i < categories.length; i++ ) {
            const categoryId = i + 1;
            sideNav.appendChild(createSideNavLink(categories[i], categoryId));
        }
    };

    /*********************************************************************
    *********************** PRODUCT CARD FUNCTIONS ***********************
    *********************************************************************/

    /**
    * Creates an HTML element for product card section according to boostrap layout
    * @param {object} data - object containing category data
    * @param {number} idx - id of a appropriate product for a link
    * @return {HTML element} - product card
    */
    const createProductCardNode = (data, idx) => {
        const bootstrapCard = document.createElement('div');
        const bootstrapRow = document.createElement('div');
        const bootstrapCol1 = document.createElement('div');
        const bootstrapCol2 = document.createElement('div');
        const bootstrapCol3 = document.createElement('div');
        const img = document.createElement('img');
        const bootstrapCardBody = document.createElement('div');
        const title = document.createElement('h5');
        const description = document.createElement('p');
        const priceRange = document.createElement('h6');
        const link = document.createElement('a');

        bootstrapCard.classList.add('card', 'w-100', 'mb-3', 'border-0');
        bootstrapRow.classList.add('row', 'no-gutters');
        bootstrapCol1.classList.add('col-md-3');
        bootstrapCol2.classList.add('col-md-7');
        bootstrapCol3.classList.add('col-md-2', 'pt-4');
        img.classList.add('card-img', 'p-5');
        bootstrapCardBody.classList.add('card-body');
        title.classList.add('card-title');
        description.classList.add('card-text');     
        link.classList.add('btn', 'btn-primary');

        img.style.width = '18rem';
        if (data.img_url != "") {
            img.src = data.img_url;
        } else {
            img.src = `./img/Image-Coming-Soon.png`;
        }
        img.alt = data.title;

        title.innerText = data.title;

        description.innerText = data.description;

        priceRange.innerText = `${data.minPrice} - ${data.maxPrice}`;

        link.href = `./product.html?id=${idx}`;
        link.innerText = 'Porovnat ceny';

        bootstrapCard.appendChild(bootstrapRow);
        bootstrapRow.appendChild(bootstrapCol1);
        bootstrapRow.appendChild(bootstrapCol2);
        bootstrapRow.appendChild(bootstrapCol3);
        bootstrapCol1.appendChild(img);
        bootstrapCol2.appendChild(bootstrapCardBody);
        bootstrapCardBody.appendChild(title);
        bootstrapCardBody.appendChild(description);
        bootstrapCol3.appendChild(priceRange);
        bootstrapCol3.appendChild(link);

        return bootstrapCard;
    };

    /**
    * Appends product cards to the layout
    * @param {array} data - parsed data from API
    * @return None
    */
    const appendProductCards = products => {
        const cardsContainer = document.getElementById('cards-container');

        for ( let i = 0; i < products.length; i++ ) {
            const product = products[i];
            const { productId } = product;
            cardsContainer.appendChild(createProductCardNode(product, productId));
        }
    };

    /*********************************************************************
    *********************** PAGINATION FUNCTIONS *************************
    *********************************************************************/

    /**
    * Creates an HTML element for pagination section according to boostrap layout
    * @param {string} name - name of a pagination link (will be visible on the page)
    * @param {string} link - url for a link
    * @param {boolean} active - indicator if this link corresponds to the current page
    * @return {HTML element} - pagination node
    */
    const createPaginationNode = (name, link, active) => {
        const paginationLI = document.createElement('li');
        const paginationA = document.createElement('a');
    
        paginationLI.classList.add('page-item');
        if (active) {
            paginationLI.classList.add('active');
        }
        paginationA.classList.add('page-link');
        
        paginationA.innerText = name;
        paginationA.href = link;

        paginationLI.appendChild(paginationA);

        return paginationLI;
    };

    /**
    * Appends pagination nodes to the layout
    * @param {array} data - parsed data from API
    * @return None
    */
    const appendPaginationNodes = data => {
        numOfpages = Math.ceil(data.prodCount / 5);
        const paginationContainer = document.getElementById('pagination-container');
        const prevPage = currPage == 1 ? currPage : parseInt(currPage) - 1;
        const nextPage = currPage == numOfpages ? currPage : parseInt(currPage) + 1;

        paginationContainer.appendChild(createPaginationNode('<<', `./category.html?id=${globalCategoryId}&page=${prevPage}`));
        for ( let i = 1; i <= numOfpages; i++ ) {
            paginationContainer.appendChild(createPaginationNode(i, `./category.html?id=${globalCategoryId}&page=${i}`, i == currPage));
        }
        paginationContainer.appendChild(createPaginationNode('>>', `./category.html?id=${globalCategoryId}&page=${nextPage}`));
    };

    /*********************************************************************
    ******************** FETCHING DATA FROM AN API ***********************
    *********************************************************************/

    /** Data request for side links and navigation */
    fetch(serverAddress)
        .then(response => response.json())
        .then(data => {
            appendSideNavLinks(data);   
            const currCategory = data.find(category => category.categoryId == globalCategoryId);
            appendPaginationNodes(currCategory);

            document.getElementById('pagination-container').addEventListener('click', event => {
                const paginationLink = event.target;
                const targetPage = paginationLink.textContent;
        
                if (targetPage == '<<' && currPage > 1) {
                    --currPage;
                } else if (targetPage == '>>' && currPage < numOfpages) {
                    ++currPage;
                } else if (targetPage !='<<' && targetPage !='>>') {
                    currPage = targetPage;
                }
            });
        });
        
    /** Data request for product cards */
    fetch(`${serverAddress}/categories/${globalCategoryId}/${currPage}`)
        .then(response => response.json())
        .then(data => {
            appendProductCards(data);
        });
});