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

    //grid styling for container
    myImagesContainer.style.display = 'grid';
    myImagesContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(250px, 1fr))';
    myImagesContainer.style.gap = '1rem';
    myImagesContainer.style.padding = '1rem';

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

        if (emailValidationRules.bannedDomains.includes(domain.toLowerCase())) {
            return "Please use a valid email domain";
        }

        if (!emailValidationRules.topLevelDomains.includes(tld)) {
            return "Please use a valid top-level domain";
        }

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
        emailImages[email].push(imageUrl);
        currentEmail = email;
    
        updateEmailDropdown(email);
        displayImagesByEmail(email);
        
        //next image
        currentIndex = (currentIndex + 1) % totalImages;
        showImage(currentIndex);
    }

    // display images for given email
    function displayImagesByEmail(email) {
        const images = emailImages[email] || [];
        
        if (images.length === 0) {
            myImagesContainer.innerHTML = '<p>No images found for this email.</p>';
            return;
        }

        //update images in container
        images.forEach((imageUrl, index) => {
            let imgElement = document.getElementById(`img-${index}`);
            
            if (!imgElement) {
                const imgContainer = document.createElement('div');
                imgContainer.style.position = 'relative';
                
                imgElement = document.createElement('img');
                imgElement.id = `img-${index}`;
                imgElement.alt = 'User linked image';
                imgElement.style.width = '100%';
                imgElement.style.height = 'auto';
                imgElement.style.borderRadius = '8px';
                imgElement.style.objectFit = 'cover';
                
                imgContainer.appendChild(imgElement);
                myImagesContainer.appendChild(imgContainer);
            }
            
            imgElement.src = imageUrl;
        });

        //remove extra images
        const existingImages = myImagesContainer.getElementsByTagName('img');
        while (existingImages.length > images.length) {
            existingImages[existingImages.length - 1].parentElement.remove();
        }
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
        showToast('Image attached successfully!');
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