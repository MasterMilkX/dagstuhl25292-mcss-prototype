// Dynamic image loading from images/placeholder_cat folder
let images = [];


// REPLACE WITH FETCHED IMAGES

// Known filenames from the folder (you can update this list as needed)
const knownFilenames = [
    'AP1GczMtPsjVq30hbp2b54XFcuTsZZ2sh9PU-M6RO69DhqWU9sVV_39fyW0wlgw1360-h1806-s-no.png',
    'AP1GczMxS-_x9yEiEndkaLrCcqjIaicnE4UcVHKiEBpodgyQUagJQx26S9vYRQw2398-h1806-s-no.png',
    'AP1GczNyTSfcUV8vBPz0YCajNTht27U7Fobz0mlvI0AOYKdvFLrHA8Zg7_wm2Aw1016-h1806-s-no.png',
    'AP1GczOIE0Y5ncQHt0oXUAlUzONsMTxeC76jp3lsClkwY66EoNMigdsPqDulaQw1016-h1806-s-no.png',
    'AP1GczPHx4rU2urliDBrFGhY31xJE5GLKjDPAvuyNUfgofRuSl-5oV-9oSzo3Qw3134-h1762-s-no.png',
    'IMG_5897.jpg', 'IMG_5899.jpg', 'IMG_5901.jpg', 'IMG_5903.jpg', 'IMG_5921.jpg',
    'IMG_5931.jpg', 'IMG_5932.jpg', 'IMG_6344.jpg', 'IMG_6727.jpg', 'IMG_6836.jpg', 'IMG_6914.jpg',
    'image.png', 'image0.jpg', 'image1.jpg', 'image2.jpg', 'image3.jpg', 'z.png', 'zz.png'
];

// get random subset of 5 images from knownFilenames
const randomSubsetSize = 9;
const randomSubset = knownFilenames.sort(() => 0.5 - Math.random()).slice(0, randomSubsetSize);

// Function to load images from the folder
function loadImagesFromFolder() {
    images = randomSubset.map((filename, index) => ({
        src: `images/placeholder_cat/${filename}`,
        thumb: `images/placeholder_cat/${filename}`,
        alt: `Cat Photo ${index + 1}`
    }));
}

// ^^ REMOVE THIS PLACEHOLDER ^^

// Function to create a single gallery item
function createGalleryItem(image, index) {
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    galleryItem.setAttribute('data-src', image.src);
    
    const img = document.createElement('img');
    img.src = image.thumb;
    img.alt = image.alt;

    // Add click event to reload the page
    galleryItem.addEventListener('click', () => {
        location.reload();
    });

    galleryItem.appendChild(img);
    return galleryItem;
}

// Function to create all gallery items
function createGalleryItems() {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';
    
    images.forEach((image, index) => {
        const galleryItem = createGalleryItem(image, index);
        gallery.appendChild(galleryItem);
    });
}

// Function to initialize LightGallery
function initializeLightGallery() {
    const galleryElement = document.getElementById('gallery');
    lightGallery(galleryElement, {
        speed: 500,
        thumbnail: true,
        download: false,
        selector: '.no-lightbox'
    });
}

// Function to handle page load
function initializeGallery() {
    loadImagesFromFolder();
    createGalleryItems();
    initializeLightGallery();
}

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', initializeGallery);