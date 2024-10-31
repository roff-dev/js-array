const totalImages = 50; // Total number of images to fetch
let currentIndex = 0; // Current image index
const imageElement = document.getElementById('current-image');

// Function to fetch images
function fetchImages() {
    const images = [];
    for (let i = 0; i < totalImages; i++) {
        images.push(`https://picsum.photos/700/394?random=${i}`);
    }
    return images;
}

const images = fetchImages(); // Fetch images once

// Function to show the current image
function showImage(index) {
    imageElement.src = images[index];
}

// Function to show the next image
function showNextImage() {
    currentIndex = (currentIndex + 1) % totalImages; // Loop back to the first image
    showImage(currentIndex);
}

// Function to show the previous image
function showPreviousImage() {
    currentIndex = (currentIndex - 1 + totalImages) % totalImages; // Loop to the last image
    showImage(currentIndex);
}

// Initial display
showImage(currentIndex);