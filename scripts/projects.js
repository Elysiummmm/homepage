const projects = {
    project1: { name: "project 1", content: "hi" },
    project2: { name: "project 2", content: "hi" },
    'wiss-casino': { name: "WISS Casino", content: "hi" },
};

var selectorEntryCenters = {};

const defaultProject = 'wiss-casino';
const projectSelector = document.getElementById('project-selector-contents');
const projectGap = parseInt(window.getComputedStyle(projectSelector).gap.slice(0, -2));

function selectProject(projectID) {
    projectSelector.style.translate = selectorEntryCenters[projectID] + "px";
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