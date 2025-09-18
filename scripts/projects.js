const projects = {
    'rafflike': {
        name: "Rafflike",
        content: `
        Roguelike with combat inspired by turn-based RPGs. The game was created as part of an inside joke in
        my friend group, so there's a lot of jokes and other things that probably won't make much sense to most
        people. I worked on it for about 6 months before abandoning it because I felt I was going too far for an
        inside joke (though I would like to revisit the gameplay sometime, it's very enjoyable).
        The game is playable with a decent chunk of content, but there's things missing and some
        imbalances here and there.`,
        images: [ "./assets/rafflike/title.png", "./assets/rafflike/team.png", "./assets/rafflike/collection.png", "./assets/rafflike/boss.png", "./assets/rafflike/detailed.png" ],
        links: [
            { icon: "bi-github", href: "https://github.com/Elysiummmm/rafflike", alt: "GitHub" },
        ]
    },
    'yt-dlp-wrapper': {
        name: "yt-dlp Wrapper",
        content: `
        Super simple GUI for yt-dlp. Mostly made as a coding exercise - I was disappointed that there weren't
        any dead easy paste-and-go yt-dlp GUI clients, so I decided to make my own.
        `,
        images: [ "./assets/yt-dlp-wrapper.png" ],
        links: [
            { icon: "bi-github", href: "https://github.com/Elysiummmm/ely-yt-dlp-wrapper", alt: "GitHub" },
        ]
    },
};

const smallImageSize = [ 250, 140 ];

var selectorEntryCenters = {};

const defaultProject = 'rafflike';
const projectContents = document.getElementById('project-text');
const projectImages = document.getElementById('project-images');
const projectLinks = document.getElementById('project-links');
const projectSelector = document.getElementById('project-selector-contents');
const fullscreenImage = document.getElementById('project-image-fullscreen');
const fullscreenImageWrapper = document.getElementById('project-image-fullscreen-wrapper');
const projectGap = parseInt(window.getComputedStyle(projectSelector).gap.slice(0, -2)); // evil code (slice to remove "px" off the end)

function openFullscreenImage(image) {
    fullscreenImage.setAttribute('src', image);
    fullscreenImageWrapper.classList.remove('invisible');
}

function selectProject(projectID) {
    let project = projects[projectID];

    projectSelector.style.translate = selectorEntryCenters[projectID] + "px";

    projectContents.innerHTML = project.content;
    projectImages.innerHTML = "";
    projectLinks.innerHTML = "";

    project.images.forEach(image => {
        let img = document.createElement('img');
        img.setAttribute('src', image);
        img.setAttribute('width', smallImageSize[0]);
        img.setAttribute('height', smallImageSize[1]);
        img.classList.add('project-image-small');

        img.addEventListener('click', (event) => {
            openFullscreenImage(image);
        });

        projectImages.appendChild(img);
    });

    project.links.forEach(link => {
        let linkElement = document.createElement('a');
        let icon = document.createElement('i');

        linkElement.setAttribute('target', "_blank");
        linkElement.setAttribute('href', link.href);
        linkElement.setAttribute('title', link.alt);
        linkElement.classList.add('icon-link');

        icon.className = `bi ${link.icon}`;

        linkElement.appendChild(icon);
        projectLinks.appendChild(linkElement);
    });
}

function computeSelectorEntryCenters() {
    selectorEntryCenters = {};

    let totalWidth = projectSelector.getBoundingClientRect().width;
    let currentWidth = totalWidth / -2;
    
    Array.from(projectSelector.children).forEach(entry => {
        selectorEntryCenters[entry.id] = -(currentWidth + entry.getBoundingClientRect().width / 2);
        currentWidth += entry.getBoundingClientRect().width + projectGap;
    });
}

document.getElementById('project-image-close').addEventListener('click', (event) => {
    fullscreenImageWrapper.classList.add('invisible');
});

var selectedProject;

for (const [id, project] of Object.entries(projects)) {
    let entry = document.createElement('a');
    entry.setAttribute('class', "text-link");
    entry.setAttribute('id', id);

    entry.appendChild(document.createTextNode(project.name));
    entry.addEventListener('click', (event) => { selectProject(id); });

    projectSelector.appendChild(entry);
}

computeSelectorEntryCenters();
selectProject(defaultProject);