

/**
========================================================
                    Classes
========================================================
 */



class Post {
    constructor(id, title, info, content) {
        this.id = id;
        this.title = title;
        this.info = info;
        this.content = content;

        this.postHolder = q('.all-posts');

        this.postDiv = document.createElement('div');
        this.postDiv.classList.add('post');

        this.postDiv.innerHTML = `

            <h3 onclick="openPost(${this.id});" class="post-title" style="cursor: pointer;">${this.title}</h3>
            <div class="post-meta">
                <p class="meta">${this.info.date}</p>
                <p class="dot less">.</p>
                <p class="meta">${this.info.author}</p>
                <p class="dot less">.</p>
                <p class="meta">#${this.info.category}</p>
            </div>
            <div class="post-content">
                ${this.content}
            </div>
            <div class="post-meta" style="margin-bottom: 15px;">
                <p class="meta">50 Comments</p>
            </div>
            <button onclick="openPost(${this.id});" class="profile-button post">Read More</button>

        `;

    }

    add() {
        this.postHolder.appendChild(this.postDiv);
    }
}


/**
========================================================
                    Core Funtions
========================================================
 */

 /**
  * A function to open the posts (page)
  * @param {Number} postId 
  */

const openPost = (postId) => {

    
    const content = showPostStructure.children[2];
    const title = showPostStructure.children[1].children[0];
    
    // our intention is to hide the right sidebar and expand the post holder; let's do it :>
    showBigContainer('.posts');

    showLoader('sidebar-loader');

    // post got successfully

    setTimeout(() => {

        // simple success 
        hideLoader('sidebar-loader');
        display(q('.show-post-structure'), 'block');

        // show the post

        const post = ALL_POSTS.find(post => post.id == postId);
        
        showPostTitle.innerText = post.title;
        showPostCotentElem.innerText = post.content;

    }, 2000);



}

 /**
  * A function to apply css on any element
  * @param {Element} el 
  * @param {Array} styles 
  * @param {Array} values 
  * @param {String} type 
  */

 const applyCss = (el, styles, values, type) => {
    if (typeof type == 'undefined') type = 'style';
    if (typeof styles == 'object' && typeof values == 'object') {
        for (let i = 0; i < styles.length; i++) {
            el[type][styles[i]] = values[i]; 
        }
    } else {
        return el[type][styles] = values;
    }
}

const makeScrollLoader = (className, holderClass) => {
    const elem = q(`.${className}`);
    const loader = `<div style="display: none; justify-content: center; align-items: center; flex-direction: column;" class="${className}-loader">
                        <svg id="svg" class="spinner" width="40px" height="40px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                        <circle class="circle" 
                        fill="none" 
                        stroke-width="6" 
                        stroke-linecap="round" 
                        cx="33" 
                        cy="33" 
                        r="25">
                        </circle>
                        </svg>
                        <p style="margin: 10px 0;">Loading...</p>
                    </div>`;

    const holder = q(`.${holderClass}`);

    holder.innerHTML += loader;

    const loaderElem = q(`.${className}-loader`);

    const scrollHeight = elem.scrollHeight;
    //console.log(scrollHeight)

    elem.onscroll = () => {
        if (elem.scrollTop > scrollHeight) {
            display(loaderElem, 'flex');
        }
        else {
            displayNone(loaderElem);
        }
        //console.log(elem.scrollTop, elem.scrollHeight - elem.scrollTop)
    }
}

/**
 * 
 * @param {String} seletor 
 */

const showBigContainer = (seletor) => {
    applyCss(rightSidebar, 'transform', 'translateX(100%)');
    applyCss(subSidebar, 'width', `calc(100vw - ${sideBarWidth})`);
    displayNone(q(seletor));
}

/**
 * 
 * @param {String} selector 
 */

const hideBigContainer = (selector) => {

    if (getValue(sidebar, 'width') === `${innerWidth}px`) {
        applyCss(subSidebar, 'width', '100vw');
    } else {
        applyCss(subSidebar, 'width', subSidebarWidth);
    }
    
    applyCss(rightSidebar, 'transform', 'translateX(0)');
    selector && display(q(selector), 'block');
}

/**
 * A function to set the click functionality of menu item
 * @param {String} className 
 * The class name of the menu item
 * Eg mainMenu - see usage
 * @param {Array} pages 
 * An array of pages eg ['.blog', '.projects']
 * @param {String} type 
 * Page display type
 */

const setActive = (className, pages, loaderClass, type) => {
    const items = qa(className); // all menu items
    if (typeof type == 'undefined') type = 'block';

    // to prevent duble clicking
    let clicked = false;
    // current active menu
    let current = 0;

    // iterate through all the items

    for (let i = 0; i < items.length; i++) {

        items[i].addEventListener('click', () => {

            if ((!clicked || !loaderClass) && i != current) {
                const page = pages && q(pages[i]);
                items[i].classList.add('active'); // add the active class to the clicked item
                //pages && display(page, type);

                // disable dubble click
                clicked = true;
                // set current
                current = i;

                // make a simple loader 

                if (loaderClass) {
                    showLoader(loaderClass);

                    // hide the post structure 
                    displayNone(showPostStructure);

                    // simple async anime with settimeout

                    setTimeout(() => {
                        loaderClass && hideLoader(loaderClass);
                        pages && display(page, type);
                        pages && hideBigContainer(pages[i]);

                        // clear dubble click
                        clicked = false;

                    }, 2000);


                } else {
                    pages && display(page, type);
                }
                
                for (let j = 0; j < items.length; j++) {
                    if (i != j) {
                        items[j].classList.remove('active'); // remove all other active items;
                        const openPage = pages && q(pages[j]);
                        pages && displayNone(openPage); // hide the opened page
                    }
                }
            }

        });
    }
}

/**
 * A function to toggle stuff
 * @param {Element} button 
 * The function to execute for the first click
 * @param {Function} trueExec 
 * The function to execute for the second click
 * @param {Function} falseExec 
 */

const toggle = (button, trueExec, falseExec) => {

    // tgl class
    let tgl = false;

    // add a click event to the button
    button.addEventListener('click', () => {
        if (!tgl) {
            tgl = true;
            trueExec();
        } else {
            tgl = false;
            falseExec();
        }
    });

}

/**
 * Get element by id shorter version
 * 
 * @param {Element} el 
 * The element's id
 */

const id = (el) => document.getElementById(el);

/**
 * 
 * @param {String} selector 
 * Enter the selector
 */

const q = (selector) => document.querySelector(selector);

/**
 * 
 * @param {string} selector 
 * Enter the selector
 */

const qa = (selector) => document.querySelectorAll(selector);

/**
 * A function to fetch the value of any element
 * @param {Element} el 
 * The element to get value of
 * 
 * @param {Object} type 
 * The object that you want eg . height, width
 */

const getValue = (el, type) => getComputedStyle(el)[type];

/**
 * 
 * @param {Element} el 
 */

const displayNone = (el) => applyCss(el, 'display', 'none');

/**
 * 
 * @param {Element} el 
 * @param {String} type 
 */

const display = (el, type) => applyCss(el, 'display', type);

/* Show loader */

const showLoader = (className) => display(q(`.${className}`), 'flex');

/* hide loader */

const hideLoader = (className) => displayNone(q(`.${className}`));



/**
========================================================
                    Core Variables
========================================================
 */

const ALL_POSTS = [];


/**
========================================================
                    Select Elements
========================================================
 */

/* Show Post Structure */

const showPostCotentElem = q('.show-post-content');
const showPostMeta = qa('.meta.show-post');
const showPostTitle = q('.show-post-title');


const subSidebar = q('.sub-sidebar');
const rightSidebar = q('.sub-content');
const subSidebarWidth = getValue(subSidebar, 'width');


const content = id('content');
const sidebar = id('sidebar');

const search_holder = q('.search-holder');
const searchBtn = q('#searchBtn');

const sideBarWidth = getValue(id('sidebar'), 'width');
const sideBarContentHeight = getValue(q('.sidebar-main-content'), 'height');

const mainMenuPages = ['.posts', '.projects', '.stories', '.drawings', '.skills', '.contact'];
const rightSidebarPages = ['.gallery', '.books', '.reviews', '.links'];
const profileMenuItems = ['.about-me', '.quote', '.plan'];
const blogItems = ['.all-posts', '.categories'];
const socialItems = ['.personal', '.professional'];
const skillLangPages = ['.frontend', '.backend', '.database'];

const refreshBtn = id('refresh');
const profileBtn = id('profile');
const backBtn = id('back');

const copyRightDiv = q('.copyright-text');

const removeGalleryBoxIcon = q('.remove-icon');

const galleryBox = q('.picture-box');
const galleryPictur = q('.big-picture');
const galleryPictureName = q('.picture-name');
const galleryPictureTakenFrom = q('.taken-from');
const galleryImages = qa('.gallery-image-holder');
const galleryImage = qa('.gallery-image');
const galleryImageName = qa('.gallery-image-name');
const takenBy = qa('.taken-by');

const profileMenuItemForTablet = q('.tabletMenu');

const moreChipBtn = q('.more-chip');
const moreChip = q('.projects-menu.hide');
const moreText = q('.more-text');
const upIcon = q('.up-icon');
const downIcon = q('.down-icon');

const backToPost = q('.back-to-post');
const showPostStructure = q('.show-post-structure');

const messageButton = id('messageButton');


/**
========================================================
                        Apply Css
========================================================
*/

//applyCss(copyRightDiv, 'height', `calc(100vh - ${sideBarContentHeight})`);

/**
========================================================
                        Events
========================================================
*/

// init menu item clicked functionality

setActive('.menuItem', mainMenuPages, 'sidebar-loader'); // main menu items
setActive('.profile-menu-item', profileMenuItems); // profile menu items
setActive('.sub-content-menu-item', rightSidebarPages, 'right-sidebar-loader'); // gallery items
setActive('.post-menu-item', blogItems, 'inside-post-loader'); // post menu items
setActive('.sub-gallery-menu-item'); // sub gallery menu items
setActive('.chip'); // chips
setActive('.social-media-menu-item', socialItems, undefined, 'flex'); // social media menu items
setActive('.skill-language-menu-item', skillLangPages);

// gallery image show off

[...galleryImages].forEach((image, i) => {
    image.addEventListener('click', () => {
        //display(galleryBox, 'block');
        applyCss(galleryBox, 'transform', 'translate(0)');
        galleryPictur.src = galleryImage[i].src; // set picture in show off box
        galleryPictureName.innerText = galleryImageName[i].innerText; // set name
        galleryPictureTakenFrom.innerText = takenBy[i].innerText; // set taken by/from
    });
});

searchBtn.addEventListener('click', () => {
    search_holder.classList.toggle('show');
});

refreshBtn.addEventListener('click', () => {
    document.location.reload(true);
});

profileBtn.addEventListener('click', () => {
    applyCss(content, 'transform', `translateX(calc(100vw - ${sideBarWidth}))`);
    applyCss(sidebar, 'width', '100vw');
    applyCss(search_holder, 'left', 'calc(100vw - 185px)');
});

profileMenuItemForTablet.addEventListener('click', () => {
    applyCss(content, 'transform', `translateX(${sideBarWidth})`);
    applyCss(sidebar, 'transform', 'translateX(0)');
});

backBtn.addEventListener('click', () => {
    applyCss(content, 'transform', `translateX(0)`);
    applyCss(sidebar, 'width', sideBarWidth);
    applyCss(search_holder, 'left', `calc(${sideBarWidth} - 185px)`);
});

removeGalleryBoxIcon.addEventListener('click', () => {
    //displayNone(galleryBox);
    applyCss(galleryBox, 'transform', 'translate(100vw)');
});

backToPost.addEventListener('click', () => {
    hideBigContainer();
    display(q('.posts'), 'block');
    displayNone(showPostStructure);
});

toggle(moreChipBtn, () => {
    display(moreChip, 'grid');
    moreText.innerText = 'Show less';
    displayNone(downIcon);
    display(upIcon, 'inline');
}, () => {
    displayNone(moreChip);
    moreText.innerText = 'Show more';
    displayNone(upIcon);
    display(downIcon, 'inline');
});

// make scroll loader 

//makeScrollLoader('sub-sidebar-container', 'posts');
//makeScrollLoader('sub-content-holder', 'gallery-image-container');


// init post 

[...new Array(5)].forEach((_, id) => {
    const postInfo = {date: '26th June, 2010', author: 'Arb Rahim Badsa', category: 'JavaScript'};
    const content = 'It is a new operator in JS introduced in ES2020. It is expressed by two questions mark together (??). It has the same syntax as the conditional (ternary) operator does....';


    const post = new Post(id, `${id + 1} Nullish Coalesching - Js`, postInfo, content);

    ALL_POSTS.push(post); // save the post to the array 

    post.add();
});

messageButton.addEventListener('click', () => {
    axios.get('http://localhost:5000/category').then(res => console.log(res));
})