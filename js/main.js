document.addEventListener("DOMContentLoaded", function() {
    // CONST AND VARIABLES
    const totalImages = 50;
    let currentIndex = 0;
    const emailImages = {};

    // DOM ELEMENTS
    const imageElement = document.getElementById('current-image');
    const emailForm = document.getElementById('email-form'); 
    const imageForm = document.getElementById('image-form'); 
    const emailInput = document.getElementById('email');
    const viewImagesButton = document.getElementById('view-images-button');
    const retrieveEmailInput = document.getElementById('retrieve-email');
    const myImagesContainer = document.getElementById('my-images-container');

    // regex
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    //store in array
    const images = fetchImages();

    // first image
    showImage(currentIndex);

    // fetch
    function fetchImages() {
        const imagesArray = [];
        for (let i = 0; i < totalImages; i++) {
            imagesArray.push(`https://picsum.photos/636/358?random=${i}`);
        }
        return imagesArray;
    }

    // show the current image
    function showImage(index) {
        imageElement.src = images[index];
    }

    // show next image
    function showNextImage() {
        currentIndex = (currentIndex + 1) % totalImages;
        showImage(currentIndex);
    }

    // show previous image
    function showPreviousImage() {
        currentIndex = (currentIndex - 1 + totalImages) % totalImages;
        showImage(currentIndex);
    }

    // attach an image to email
    function attachImageToEmail(email, imageUrl) {
        if (!emailImages[email]) {
            emailImages[email] = [];
        }
        emailImages[email].push(imageUrl);
        currentIndex = (currentIndex + 1) % totalImages;
        showImage(currentIndex);
        console.log(`Image added for ${email}: ${imageUrl}`);
        console.log(emailImages);
    }

    // retrieve images
    function getImagesByEmail(email) {
        return emailImages[email] || [];
    }

    // display images for given email
    function displayImagesByEmail(email) {
        myImagesContainer.innerHTML = '';
        const images = getImagesByEmail(email);
        console.log(`Images for ${email}:`, images);

        if (images.length === 0) {
            myImagesContainer.innerHTML = '<p>No images found for this email.</p>';
            return;
        }

        images.forEach(imageUrl => {
            const imgElement = document.createElement('img');
            imgElement.src = imageUrl;
            imgElement.alt = 'User linked image';
            imgElement.style.width = '70%';
            imgElement.style.margin = '10px';
            imgElement.style.borderRadius = '8px';
            myImagesContainer.appendChild(imgElement);
        });
    }

    // successful attatch notif
    function showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.style.display = 'block';
        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000); 
    }

    // form submission
    emailForm.addEventListener('submit', function(event) {
        event.preventDefault(); 
        let isValid = true;

        if (emailInput.value.trim() === "") {
            showError(emailInput, "Field required, Do not leave blank.");
            isValid = false;
        } else if (!emailPattern.test(emailInput.value)) {
            showError(emailInput, "Please enter a valid email.");
            isValid = false;
        }

        if (isValid) {
            const email = emailInput.value.trim();
            attachImageToEmail(email, images[currentIndex]);
            showToast('Image attached! Click "My Images" to view'); 
        }
    });

    // view images button
    imageForm.addEventListener('submit', function(event) {
        event.preventDefault();
        let isValid = true;

        if (retrieveEmailInput.value.trim() === "") {
            myImagesContainer.innerHTML = '<p>Do not leave blank.</p>';
            isValid = false;
        } else if(!emailPattern.test(retrieveEmailInput.value)) {
            showError(retrieveEmailInput, "Please enter a valid email.");
            isValid = false;
        }
        if (isValid) {
            const email = retrieveEmailInput.value.trim();
            displayImagesByEmail(email);
        }
    });

    // button navigation
    window.showNextImage = showNextImage;
    window.showPreviousImage = showPreviousImage;
});