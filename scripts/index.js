let bgCovered = true;

const contentWrapper = document.getElementById('content-wrapper');

const mainScreen = document.getElementById('home');
const aboutScreen = document.getElementById('about');
const projectsScreen = document.getElementById('projects');

const orientationWarning = document.getElementById('orientation-warning');

var currentScreen = mainScreen;

function switchScreen(screen) {
    if (screen != mainScreen) {
        mainScreen.classList.add("fade-up");
        screen.classList.remove("fade-down");
    } else if (currentScreen != mainScreen) {
        mainScreen.classList.remove("fade-up");
        currentScreen.classList.add("fade-down");
    }

    currentScreen = screen;
}

function checkWindowAspectRatio() {
    let ratio = window.innerWidth / window.innerHeight;
    
    if (ratio < 1) {
        document.getElementById('toggle-bg-button').classList.add('invisible');
        contentWrapper.classList.add('invisible');
        orientationWarning.classList.remove('invisible');
    } else {
        document.getElementById('toggle-bg-button').classList.remove('invisible');
        contentWrapper.classList.remove('invisible');
        orientationWarning.classList.add('invisible');
    }
}

document.getElementById('toggle-bg-button').addEventListener('click', (event) => {
    if (bgCovered) contentWrapper.classList.add('invisible');
    else contentWrapper.classList.remove('invisible');

    bgCovered = !bgCovered;
});

document.getElementById('about-link').addEventListener('click', (event) => { switchScreen(aboutScreen) });
document.getElementById('projects-link').addEventListener('click', (event) => { switchScreen(projectsScreen) });

let backLinks = document.getElementsByClassName('back-link');
Array.from(backLinks).forEach(element => {
    element.addEventListener('click', (event) => { switchScreen(mainScreen) });
});

window.addEventListener('keydown', (event) => {
    if (event.code === "Escape") switchScreen(mainScreen);
});

window.addEventListener('resize', checkWindowAspectRatio);
checkWindowAspectRatio();