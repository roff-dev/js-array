document.addEventListener("DOMContentLoaded", function() {
    // CONST AND VARIABLES
    const totalImages = 50;
    let currentIndex = 0;
    const emailImages = {};
    let currentEmail = null;

    // DOM ELEMENTS
    const imageElement = document.getElementById('current-image');
    const emailForm = document.getElementById('email-form'); 
    const emailInput = document.getElementById('email');
    const myImagesContainer = document.getElementById('my-images-container');
    const emailDropdown = document.getElementById('email-dropdown');

    //email regex
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    //email validation rules
    const emailValidationRules = {
        minLength: 5,
        maxLength: 254,
        requireDomain: true,
        bannedDomains: ['test.com', 'example.com'],
        topLevelDomains: ['com', 'org', 'net', 'edu', 'gov', 'mil', 'io', 'co', 'uk', 'ca', 'au', 'de', 'fr']
    };

    function validateEmail(email) {
        if (!email || email.length < emailValidationRules.minLength || 
            email.length > emailValidationRules.maxLength) {
            return "Email must be between 5 and 254 characters";
        }

        if (!emailPattern.test(email)) {
            return "Please enter a valid email address";
        }

        const [localPart, domain] = email.split('@');
        const tld = domain.split('.').pop().toLowerCase();

        return null; //valid
    }

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

    //dropdown options
    function updateEmailDropdown(selectedEmail) {
        const emails = Object.keys(emailImages);
        
        //store current
        const currentSelection = emailDropdown.value;
        
        //clear existing except first default 
        while (emailDropdown.options.length > 1) {
            emailDropdown.remove(1);
        }
        
        //add new email
        emails.forEach(email => {
            const option = document.createElement('option');
            option.value = email;
            option.text = email;
            if (email === selectedEmail) {
                option.selected = true;
            }
            emailDropdown.appendChild(option);
        });
        
        //no email is selected failsafe
        if (!selectedEmail && emails.includes(currentSelection)) {
            emailDropdown.value = currentSelection;
        }
    }

    //show the current image
    function showImage(index) {
        imageElement.src = images[index];
    }

    //show next image
    function showNextImage() {
        currentIndex = (currentIndex + 1) % totalImages;
        showImage(currentIndex);
    }

    //show previous image
    function showPreviousImage() {
        currentIndex = (currentIndex - 1 + totalImages) % totalImages;
        showImage(currentIndex);
    }

    //attach an image to email and update display
    function attachImageToEmail(email, imageUrl) {
        if (!emailImages[email]) {
            emailImages[email] = [];
        }
           // Check if the image is already attached to the email
        if (emailImages[email].includes(imageUrl)) {
            showToast('This image is already attached to the email.', true);
            return;
        }
        emailImages[email].push(imageUrl);
        currentEmail = email;
    
        updateEmailDropdown(email);
        displayImagesByEmail(email);
        
        showToast('Image attached! Click My Images to see it');
    }

    // display images for given email
    function displayImagesByEmail(email) {
        const images = emailImages[email] || [];
        
        // Clear existing images first
        myImagesContainer.innerHTML = '';
    
        // Create new image elements for each image
        images.forEach((imageUrl) => {
            const imgContainer = document.createElement('div');
            imgContainer.style.position = 'relative';
            
            const imgElement = document.createElement('img');
            imgElement.src = imageUrl;
            imgElement.alt = 'User linked image';
            imgElement.style.width = '100%';
            imgElement.style.height = 'auto';
            imgElement.style.borderRadius = '8px';
            imgElement.style.objectFit = 'cover';
            
            //x for remove
            const removeButton = document.createElement('button');
            removeButton.textContent = 'X';
            
            
            // remove event click
            removeButton.addEventListener('click', () => {
                const index = emailImages[email].indexOf(imageUrl);
                if (index > -1) {
                    emailImages[email].splice(index, 1);
                    displayImagesByEmail(email); 
                }
            });

            imgContainer.appendChild(imgElement);
            imgContainer.appendChild(removeButton);
            myImagesContainer.appendChild(imgContainer);
        });
    }

    // successful attach notif
    function showToast(message, isError = false) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.style.display = 'block';
        toast.style.backgroundColor = isError ? '#ff4444' : '#4CAF50';
        toast.style.color = 'white';
        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);
    }

    // form submission
    emailForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const email = emailInput.value.trim();
        const validationError = validateEmail(email);

        if (validationError) {
            showToast(validationError, true);
            return;
        }

        attachImageToEmail(email, images[currentIndex]);
        
    });

    //email dropdown handler
    emailDropdown.addEventListener('change', function(event) {
        const selectedEmail = event.target.value;
        if (selectedEmail) {
            displayImagesByEmail(selectedEmail);
            emailInput.value = selectedEmail;
        } else {
            myImagesContainer.innerHTML = '';
        }
    });

    // button navigation
    window.showNextImage = showNextImage;
    window.showPreviousImage = showPreviousImage;
});