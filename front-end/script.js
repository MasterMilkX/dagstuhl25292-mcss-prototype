// Dynamic image loading from game_vecs.json
let images = [];
let gameData = {};

// Function to get URL parameter
function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Fetch game data from server
async function fetchGameData() {
    try {
        const response = await fetch('/api/images');
        gameData = await response.json();
    } catch (error) {
        console.error('Error fetching games:', error);
        // Fallback to empty object if fetch fails
        gameData = {};
    }
}

// Fetch nearest neighbors for a given game ID
async function fetchNearestNeighbors(gameId) {
    try {
        const response = await fetch(`/api/nearest-neighbors?id=${encodeURIComponent(gameId)}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const neighbors = await response.json();
        return neighbors.map(neighbor => neighbor.id);
    } catch (error) {
        console.error('Error fetching nearest neighbors:', error);
        return [];
    }
}

// Function to load images from game data
async function loadImagesFromGameData() {
    const gameIds = Object.keys(gameData);
    if (gameIds.length === 0) {
        console.warn('No game data available');
        images = [];
        return;
    }
    
    const selectedGameId = getURLParameter('game');
    let gameIdsToShow;
    
    if (selectedGameId && gameData[selectedGameId]) {
        // Use nearest neighbors logic
        console.log('Loading nearest neighbors for game:', selectedGameId);
        const neighborIds = await fetchNearestNeighbors(selectedGameId);
        gameIdsToShow = neighborIds.filter(id => gameData[id]); // Only include games that exist in our data
        
        // If we don't have enough neighbors, fall back to random
        if (gameIdsToShow.length < 9) {
            console.warn('Not enough neighbors found, supplementing with random games');
            const remainingIds = gameIds.filter(id => id !== selectedGameId && !gameIdsToShow.includes(id));
            const additionalNeeded = 9 - gameIdsToShow.length;
            const randomAdditional = remainingIds.sort(() => 0.5 - Math.random()).slice(0, additionalNeeded);
            gameIdsToShow = [...gameIdsToShow, ...randomAdditional];
        }
    } else {
        // Use random subset logic (original behavior)
        console.log('Loading random subset of games');
        const randomSubsetSize = 9;
        gameIdsToShow = gameIds.sort(() => 0.5 - Math.random()).slice(0, randomSubsetSize);
    }
    
    images = gameIdsToShow.map((gameId, index) => {
        const game = gameData[gameId];
        return {
            src: game.img,
            thumb: game.img,
            alt: game.name || `Game ${index + 1}`,
            gameId: gameId,
            gameName: game.name
        };
    });
}

// Function to create a single gallery item
function createGalleryItem(image, index) {
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    galleryItem.setAttribute('data-src', image.src);
    
    const img = document.createElement('img');
    img.src = image.thumb;
    img.alt = image.alt;

    // Add click event to reload the page with game ID in URL
    galleryItem.addEventListener('click', () => {
        const gameId = image.gameId;
        window.location.href = window.location.pathname + '?game=' + encodeURIComponent(gameId);
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
async function initializeGallery() {
    await fetchGameData();
    await loadImagesFromGameData();
    createGalleryItems();
    initializeLightGallery();
}

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', initializeGallery);