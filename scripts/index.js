let bgCovered = true;

const contentWrapper = document.getElementById('content-wrapper');

const mainScreen = document.getElementById('home');
const aboutScreen = document.getElementById('about');
const projectsScreen = document.getElementById('projects');

var currentScreen = mainScreen;

function switchScreen(screen) {
    if (screen != mainScreen) {
        mainScreen.classList.add("fade-up");
        screen.classList.remove("fade-down");
    } else {
        mainScreen.classList.remove("fade-up");
        screen.classList.add("fade-down");
    }

    currentScreen = screen;
}

document.getElementById('toggle-bg-button').addEventListener('click', (event) => {
    if (bgCovered) contentWrapper.classList.add('invisible');
    else contentWrapper.classList.remove('invisible');

    bgCovered = !bgCovered;
});

document.getElementById('about-link').addEventListener('click', (event) => { switchScreen(aboutScreen) });
document.getElementById('projects-link').addEventListener('click', (event) => { switchScreen(projectsScreen) });