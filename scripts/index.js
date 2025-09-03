let bgCovered = true;

const contentWrapper = document.getElementById('content-wrapper');

document.getElementById('toggle-bg-button').addEventListener('click', (event) => {
    if (bgCovered) contentWrapper.classList.add('invisible');
    else contentWrapper.classList.remove('invisible');

    bgCovered = !bgCovered;
});