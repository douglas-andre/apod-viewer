const dateInput        = document.querySelector('#date');
const welcome          = document.querySelector('#welcome');
const content          = document.querySelector('#content');
const title            = document.querySelector('#title');
const image            = document.querySelector('#image');
const video            = document.querySelector('#video');
const videoUnavailable = document.querySelector('#video-unavailable');
const videoLink        = document.querySelector('#video-link');
const description      = document.querySelector('#description');
const loadingMsg       = document.querySelector('#loading');
const errorMsg         = document.querySelector('#error');

// DEMO_KEY is NASA's public key for demos and portfolios.
// For higher rate limits, replace with a personal key from https://api.nasa.gov
const API_KEY  = 'DEMO_KEY'; // or your personal key
const BASE_URL = 'https://api.nasa.gov/planetary/apod';

resetUI(true);



dateInput.addEventListener('change', handleDateChange);

// Main flow triggered when user selects a date:
// 1. Reset UI
// 2. Validate input
// 3. Fetch data from API
// 4. Render result or error

async function handleDateChange() {
    const selectedDate = dateInput.value;

    // Initialize UI with welcome screen visible
    resetUI(false);

    if (!selectedDate) {
        showError('Please select a date.');
        return;
    }

    if (isFutureDate(selectedDate)) {
        showError('The date cannot be in the future.');
        return;
    }

    if (isPastMinDate(selectedDate)) {
        showError('The minimum available date is June 16, 1995.');
        return;
    }

    try {
        setLoading(true);
        const data = await fetchApod(selectedDate);
        showResult(data);
    } catch (error) {
        console.error(error);
        showError(error?.message || 'Error fetching data from NASA.');
    } finally {
        setLoading(false);
    }
}

// Parses "YYYY-MM-DD" as a local date (midnight, local timezone).
// Avoids a known browser bug where new Date("YYYY-MM-DD") is parsed as UTC,
// which can shift the date by one day depending on the user's timezone offset.
function parseLocalDate(dateStr) {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d); // month is 0-indexed in JS
}

// Returns true if the selected date is in the future
function isFutureDate(dateStr) {
    const selected = parseLocalDate(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selected > today;
}

// Returns true if the selected date is before APOD minimum date (June 16, 1995)
function isPastMinDate(dateStr) {
    const selected = parseLocalDate(dateStr);
    const minDate  = parseLocalDate('1995-06-16');
    return selected < minDate;
}

// Fetches APOD data from NASA API for a given date
// Throws an error if the request fails
async function fetchApod(date) {
    const params = new URLSearchParams({ api_key: API_KEY, date });
    const response = await fetch(`${BASE_URL}?${params}`);

    if (!response.ok) {
        throw new Error('Error fetching data from NASA.');
    }

    return response.json();
}

// Clears all displayed media and text content from the UI
function clearResult() {
    // Prevent onerror from firing when clearing the image source
    image.onerror = null;

    image.src = '';
    image.alt = '';
    image.classList.add('hidden');

    video.src = ''; 
    video.classList.add('hidden');

    videoUnavailable.classList.add('hidden');
    videoLink.href = '';

    title.textContent = '';
    title.classList.add('hidden');

    description.textContent = '';
    description.classList.add('hidden');
}

// Clears any visible error message from the UI
function clearError() {
    errorMsg.textContent = '';
    errorMsg.classList.add('hidden');
}

function setLoading(isLoading) {
    if (isLoading) {
        clearResult();
        clearError();

        welcome.classList.add('hidden');
        content.classList.remove('hidden');

        loadingMsg.classList.remove('hidden');
        dateInput.disabled = true;
    } else {
        loadingMsg.classList.add('hidden');
        dateInput.disabled = false;
    }
}

// Some APOD entries return direct NASA URLs that block iframe embedding
// via X-Frame-Options: sameorigin. In those cases, a fallback with a
// direct link is shown instead of failing silently.

// Displays fallback UI when video cannot be embedded
function showVideoUnavailable(url) {
    clearResult();
    clearError();

    welcome.classList.add('hidden');
    content.classList.remove('hidden');

    videoLink.href = url;
    videoUnavailable.classList.remove('hidden');
}


// Renders APOD data into the UI:
// - Displays image or video
// - Handles non-embeddable videos
// - Updates title and description
function showResult(data) {
    clearError();
    clearResult();

    welcome.classList.add('hidden');
    content.classList.remove('hidden');

    if (data.media_type === 'image' && data.url) {
        // Register onerror before setting src to handle cached image failures
        image.onerror = () => showError('Unable to load the image.');

        image.src = data.url;
        image.alt = data.title || 'NASA image';
        image.classList.remove('hidden');

    } else if (data.media_type === 'video' && data.url) {
        // Some URLs cannot be embedded due to X-Frame-Options restrictions
        const isEmbeddable =
            data.url.includes('youtube.com/embed') ||
            data.url.includes('vimeo.com/video');

        if (!isEmbeddable) {
            showVideoUnavailable(data.url);
            return;
        }

        video.src = data.url;
        video.classList.remove('hidden');

    } else {
        showError('Media not available for this date.');
        return;
    }

    title.textContent = data.title || 'No title available';
    title.classList.remove('hidden');

    description.textContent = data.explanation || 'No description available';
    description.classList.remove('hidden');
}

// Displays an error message and hides other UI sections
function showError(message) {
    welcome.classList.add('hidden');
    content.classList.add('hidden');

    errorMsg.textContent = message;
    errorMsg.classList.remove('hidden');
}

// Resets UI to initial state
// Optionally shows the welcome screen
function resetUI(showWelcome = false) {
    clearError();
    clearResult();

    loadingMsg.classList.add('hidden');
    dateInput.disabled = false;

    content.classList.add('hidden');

    if (showWelcome) {
        welcome.classList.remove('hidden');
    } else {
        welcome.classList.add('hidden');
    }
}
