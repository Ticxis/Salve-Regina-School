function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

const categoriesBtn = document.getElementById('categoriesBtn');
const showAllBtn = document.getElementById('showAllBtn');
const categoriesView = document.getElementById('categoriesView');
const allImagesView = document.getElementById('allImagesView');
const galleryItems = document.querySelectorAll('.gallery-item');
const modal = document.getElementById('galleryModal');
const modalImage = document.getElementById('modalImage');
const modalCaption = document.getElementById('modalCaption');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let currentImages = [];
let currentIndex = 0;
const slideshowInterval = 3000; // 3 seconds per slide

// Slideshow functionality
function startSlideshow(item) {
    try {
        const images = JSON.parse(item.getAttribute('data-images'));
        if (!Array.isArray(images) || images.length === 0) {
            console.warn('No valid images for slideshow:', item.getAttribute('data-caption'));
            return;
        }
        let index = 0;
        const imgElement = item.querySelector('.slideshow-img');
        if (!imgElement) return;

        setInterval(() => {
            imgElement.style.opacity = 0;
            setTimeout(() => {
                index = (index + 1) % images.length;
                imgElement.src = images[index];
                imgElement.style.opacity = 1;
            }, 500); // Match CSS transition duration
        }, slideshowInterval);
    } catch (error) {
        console.error('Error in slideshow for', item.getAttribute('data-caption'), ':', error);
    }
}

// Start slideshow for each gallery item
galleryItems.forEach(item => {
    startSlideshow(item);
    item.querySelector('.slideshow-img').addEventListener('error', () => {
        item.querySelector('.caption').textContent = 'Error: Image failed to load';
        item.querySelector('.caption').style.color = 'red';
    });

    item.addEventListener('click', () => {
        try {
            currentImages = JSON.parse(item.getAttribute('data-images'));
            if (!Array.isArray(currentImages) || currentImages.length === 0) {
                throw new Error('No valid images found');
            }
            currentIndex = 0;
            modalCaption.textContent = item.getAttribute('data-caption') || 'Gallery';
            updateModalImage();
            modal.style.display = 'flex';
        } catch (error) {
            modalImage.src = '';
            modalCaption.textContent = 'Error: Unable to load images. Check image paths or JSON format.';
            modal.style.display = 'flex';
        }
    });
});

function updateModalImage() {
    if (currentImages.length > 0) {
        modalImage.src = currentImages[currentIndex];
        prevBtn.disabled = currentImages.length <= 1;
        nextBtn.disabled = currentImages.length <= 1;
    }
}

function prevImage() {
    if (currentImages.length > 1) {
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        updateModalImage();
    }
}

function nextImage() {
    if (currentImages.length > 1) {
        currentIndex = (currentIndex + 1) % currentImages.length;
        updateModalImage();
    }
}

function closeModal() {
    modal.style.display = 'none';
    currentImages = [];
    currentIndex = 0;
    modalImage.src = '';
    modalCaption.textContent = '';
}

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Toggle between views
function showCategories() {
    categoriesView.style.display = 'block';
    allImagesView.style.display = 'none';
    categoriesBtn.classList.add('active');
    showAllBtn.classList.remove('active');
}

function showAllImages() {
    categoriesView.style.display = 'none';
    allImagesView.style.display = 'grid';
    categoriesBtn.classList.remove('active');
    showAllBtn.classList.add('active');

    // Clear previous content
    allImagesView.innerHTML = '';

    // Collect all images
    galleryItems.forEach(item => {
        try {
            const images = JSON.parse(item.getAttribute('data-images'));
            const caption = item.getAttribute('data-caption');
            if (!Array.isArray(images)) return;

            images.forEach(image => {
                const imageItem = document.createElement('div');
                imageItem.className = 'image-item';
                imageItem.innerHTML = `
                    <img src="${image}" alt="${caption}">
                    <div class="caption">${caption}</div>
                `;
                allImagesView.appendChild(imageItem);

                // Handle image load errors
                const img = imageItem.querySelector('img');
                img.addEventListener('error', () => {
                    imageItem.innerHTML = `<div class="error-message">Error: Image failed to load</div>`;
                });
            });
        } catch (error) {
            console.error('Error parsing images for', item.getAttribute('data-caption'), ':', error);
            const errorItem = document.createElement('div');
            errorItem.className = 'image-item';
            errorItem.innerHTML = `<div class="error-message">Error: Invalid image data for ${item.getAttribute('data-caption')}</div>`;
            allImagesView.appendChild(errorItem);
        }
    });
}

// Button event listeners
categoriesBtn.addEventListener('click', showCategories);
showAllBtn.addEventListener('click', showAllImages);

// Initial view
showCategories();

// Scroll animation for gallery items
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeIn 0.6s ease-in forwards';
            entry.target.style.opacity = 1;
        }
    });
}, { threshold: 0.2 });

galleryItems.forEach(item => {
    item.style.opacity = 0;
    observer.observe(item);
});

 // Handle image loading errors
modalImage.addEventListener('error', () => {
    modalImage.src = '';
    modalCaption.textContent = 'Error: Image failed to load. Check the file path.';
});
