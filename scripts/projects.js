const projects = {
    'wiss-casino': {
        name: "WISS Casino",
        content: `
        Casino Simulator created by me and a friend
        (<a class="text-link" href="https://github.com/m4rv1n33" target="_blank"> <i class="bi bi-github"></i> @m4rv1n33 </a>)

        `,
        images: [ "https://media.discordapp.net/attachments/986005577316573286/1411778980956082206/image.png" ]
    },
};

var selectorEntryCenters = {};

const defaultProject = 'wiss-casino';
const projectContents = document.getElementById('project-text');
const projectImages = document.getElementById('project-images');
const projectLinks = document.getElementById('project-links');
const projectSelector = document.getElementById('project-selector-contents');
const projectGap = parseInt(window.getComputedStyle(projectSelector).gap.slice(0, -2));

function selectProject(projectID) {
    let project = projects[projectID];

    projectSelector.style.translate = selectorEntryCenters[projectID] + "px";

    projectContents.innerHTML = project.content;

    project.images.forEach(image => {
        let img = document.createElement('img');
        img.setAttribute('source', image);

        projectImages.appendChild(img);
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