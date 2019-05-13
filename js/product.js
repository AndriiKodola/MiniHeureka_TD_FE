window.addEventListener('DOMContentLoaded', event => {
    const serverAddress = 'https://mini-heureka-internal-server.herokuapp.com';

    const query = new URLSearchParams(window.location.search);
    const pageProductId = query.get('id');

    /*********************************************************************
    ************************* SIDE NAV FUNCTIONS *************************
    *********************************************************************/

    /**
    * Creates an array of photos of a product from given data from an API
    * @param {array} data - parsed data from an API
    * @return {array} - array of photos urls
    */
    const createGalleryArray = data => {
        const offers = data[1];
        const titleImg = data[0].img_url
        const gallery = [ titleImg ];
        const gallerySize = Math.min(offers.length, 10);

        for (let i = 1; i < gallerySize; i++) {
            let currImg = offers[i].img_url;
            if (!currImg) {
                currImg = './img/Image-Coming-Soon.png';
            }
            
            if ( currImg != titleImg ) {
                gallery.push(currImg);
            }
        }

        return gallery;
    } 

    /**
    * Creates an HTML element for side navigation section
    * @param {object} data - object containing category data
    * @param {number} idx - id of a appropriate category for a link
    * @return {HTML element} - side nav link
    */
    const createTitleImgsNode = url => {
        const img = document.createElement('img');

        img.classList.add('img-fluid');
        img.src = url;

        return img;
    };

    /**
    * Appends title imgs to the layout
    * @param {array} data - parsed data from API
    * @return None
    */
    const appendTitlePhotos = data => {
        const mainTitleImg = document.getElementById('main-title-image');
        const secondaryTitleImgContainer = document.getElementById('secondary-title-images');
        const secondaryTitleImgs = secondaryTitleImgContainer.children;
        const galleryUrls = createGalleryArray(data);

        mainTitleImg.appendChild(createTitleImgsNode(galleryUrls[0]));

        for (let i = 0; i < secondaryTitleImgs.length; i++) {
            secondaryTitleImgs[i].appendChild(createTitleImgsNode(galleryUrls[i+1]));
        }
    };

    /**
    * Creates a carousel HTML element for photo gallery according to the boostrap layout
    * @param {string} url - url of an img
    * @return {HTML element} - carousel img node
    */
    const createCarouselImgNode = url => {
        const img = document.createElement('img');

        img.classList.add('d-block', 'w-100');
        img.src = url;

        return img;
    };

    /**
    * Appends carousel imgs to the layout
    * @param {array} data - parsed data from API
    * @return None
    */
    const appendCarouselPhotos = data => {
        const carouselImgContainer = document.getElementById('modal-photos-container');
        const carouselImgs = carouselImgContainer.children;
        const galleryUrls = createGalleryArray(data);

        for (let i = 0; i < carouselImgs.length; i++) {
            carouselImgs[i].appendChild(createCarouselImgNode(galleryUrls[i]));
        }
    };

    /**
    * Sets details and parts of layout and it's visibility for main product section
    * @param {array} data - parsed data from API
    * @return None
    */
    const setProductDetails = data => {
        const productData = data[0];
        const name = document.getElementById('product-name');
        const breadcrumbCategory = document.getElementById('breadcrumb-category');
        const breadcrumbProduct = document.getElementById('breadcrumb-product');
        const description = document.getElementById('description');
        const shortDescription = document.getElementById('short-description');
        const breadcrumbCategoryLink = document.createElement('a');

        breadcrumbCategory.appendChild(breadcrumbCategoryLink);

        breadcrumbCategoryLink.href = `./category.html?id=${productData.categoryId}&page=1`;

        name.innerText = productData.title;
        breadcrumbCategoryLink.innerText = productData.categoryTitle;
        breadcrumbProduct.innerText = productData.title;
        description.innerText = productData.description;
        shortDescription.innerText = `${productData.description.slice(0, 200)}...`;

        description.style.display = 'none';
    };

    /**
    * Creates an offer HTML element for offer cards section according to the boostrap layout
    * @param {string} url - an appropriate part of parsed data from an API
    * @return {HTML element} - offer card node
    */
    const createOfferNode = offerData => {
        const bootstrapList = document.createElement('ul');
        const bootstrapListItem = document.createElement('li');
        const offerDataContainer = document.createElement('div');
        const storeName = document.createElement('h5');
        const offerInfo = document.createElement('div');
        const offerStoreLink = document.createElement('a');
        const offerPrice = document.createElement('span');
        const shopRegex = /http:\/\/randomEshop(\d+).cz[\w\/]+/;
        const name = `Obchod #${offerData.url.replace(shopRegex, '$1')}`;
    
        bootstrapList.classList.add('list-group', 'w-100');
        bootstrapListItem.classList.add('list-group-item', 'border-0');
        offerDataContainer.classList.add('d-flex', 'justify-content-between');
        storeName.classList.add('mb-1');
        offerStoreLink.classList.add('btn', 'btn-primary');
        
        offerStoreLink.href = offerData.url;

        storeName.innerText = name;
        offerStoreLink.innerText = 'Koupit';
        offerPrice.innerText = offerData.price;

        bootstrapList.appendChild(bootstrapListItem);
        bootstrapListItem.appendChild(offerDataContainer);
        offerDataContainer.appendChild(storeName);
        offerDataContainer.appendChild(offerInfo);
        offerInfo.appendChild(offerStoreLink);
        offerInfo.appendChild(offerPrice);

        return bootstrapList;
    };

    /**
    * Appends offer cards to the layout
    * @param {array} data - parsed data from API
    * @return None
    */
    const appendOffers = data => {
        const offersData = data[1];
        const offersContainer = document.getElementById('offers-container');
        const visibilitySwitch = document.createElement('a');

        visibilitySwitch.id = 'offers-visibility';
        visibilitySwitch.innerText = 'Zobrazit další nabídky';

        for ( let i = 0; i < offersData.length; i++ ) {
            offersContainer.appendChild(createOfferNode(offersData[i]));
        }

        offersContainer.appendChild(visibilitySwitch);
    };

    /**
    * Sets offer cards visibility to show limited amount of cards
    * @param {number} offersToShow - an amount of offers that have to be visible
    * @return None
    */
    const showOffers = offersToShow => {
        const offersContainer = document.getElementById('offers-container');
        const offerCards = offersContainer.children;

        for ( let offerCard of offerCards) {
            offerCard.style.display = 'initial';
        }

        if (offersToShow) {
            const firstInvisibleIdx = offersToShow;
            
            for (let i = firstInvisibleIdx; i < offerCards.length - 1; i++) {
                offerCards[i].style.display = 'none';
            }
        }
    };

    /*********************************************************************
    ******************** FETCHING DATA FROM AN API ***********************
    *********************************************************************/
    fetch(`${serverAddress}/product/${pageProductId}`)
        .then(response => response.json())
        .then(data => {
            /** Appending HTML elements */
            appendTitlePhotos(data);
            appendCarouselPhotos(data);
            setProductDetails(data);
            appendOffers(data);
            showOffers(3);

            /** Event listeners */

            document.getElementById('description-visibility').addEventListener('click', event => {
                const descriptionSwitch = event.target;
                const description = document.getElementById('description');
                const shortDescription = document.getElementById('short-description');
        
                if (descriptionSwitch.innerText === 'Zobrazit celý popis') {
                    description.style.display = 'initial';
                    shortDescription.style.display = 'none';
                    descriptionSwitch.innerText = 'Skrýt popis';
                } else {
                    description.style.display = 'none';
                    shortDescription.style.display = 'initial';
                    descriptionSwitch.innerText = 'Zobrazit celý popis';
                }
            });
        
            document.getElementById('offers-visibility').addEventListener('click', event => {
                const offersSwitch = event.target;
        
                if (offersSwitch.innerText === 'Zobrazit další nabídky') {
                    showOffers();
                    offersSwitch.innerText = 'Skrýt nabídky';
                } else {
                    showOffers(3);
                    offersSwitch.innerText = 'Zobrazit další nabídky';
                }
            });
        });
});