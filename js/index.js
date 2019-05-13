window.addEventListener('DOMContentLoaded', event => {
    const serverAddress = 'https://mini-heureka-internal-server.herokuapp.com';

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

        return sideNavLink;
    };

    /**
    * Appends side nav links to the layout
    * @param {array} data - parsed data from API
    * @return None
    */
    const appendSideNavLinks = categories => {
        const sideNav = document.getElementById('side-nav');

        for ( let i = 0; i < categories.length; i++ ) {
            const categoryId = i + 1;
            sideNav.appendChild(createSideNavLink(categories[i], categoryId));
        }
    };

    /*********************************************************************
    ************************* SIDE NAV FUNCTIONS *************************
    *********************************************************************/

    /**
    * Creates an HTML element for tile section view
    * @param {object} data - object containing category data
    * @param {number} idx - id of a appropriate category for a link
    * @return {HTML element} - section tile
    */
    const createSectionTileNode = (data, idx) => {
        const bootstrapCol = document.createElement('div');
        const bootstrapCard = document.createElement('div');
        const img = document.createElement('img');
        const bootstrapCardBody = document.createElement('div');
        const link = document.createElement('a');

        bootstrapCol.classList.add('col-md-6', 'col-lg-4', 'p-2', 'bd-highlight');
        bootstrapCard.classList.add('card', 'border-0', 'rectangle');
        img.classList.add('img-fluid', 'card-img-top', 'tile-img');
        bootstrapCardBody.classList.add('card-body', 'mx-auto');
        link.classList.add('card-link');
        
        bootstrapCard.style.width = '18rem';

        img.src = data.img_url;
        img.alt = data.title;

        link.href = `./category.html?id=${idx}&page=1`;
        link.innerText = data.title;

        bootstrapCol.appendChild(bootstrapCard);
        bootstrapCard.appendChild(img);
        bootstrapCard.appendChild(bootstrapCardBody);
        bootstrapCardBody.appendChild(link);

        return bootstrapCol;
    };

    /**
    * Appends side nav links to the layout
    * @param {array} data - parsed data from API
    * @return None
    */
    const appendSectionTiles = categories => {
        const tilesContainer = document.getElementById('tiles-container');

        for ( let i = 0; i < categories.length; i++ ) {
            const categoryId = i + 1;
            tilesContainer.appendChild(createSectionTileNode(categories[i], categoryId));
        }
    };


    /*********************************************************************
    ******************** FETCHING DATA FROM AN API ***********************
    *********************************************************************/
   
    fetch(serverAddress)
        .then(response => response.json())
        .then(data => {
            appendSideNavLinks(data);
            appendSectionTiles(data);
        });

});