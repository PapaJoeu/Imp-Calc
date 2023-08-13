// DOM Elements
const tabs = document.querySelectorAll('[role="tab"]');
const panels = document.querySelectorAll('[role="tabpanel"]');

// Hide all tab panels
const hideAllPanels = () => {
  panels.forEach(panel => panel.hidden = true);
};

// Deselect all tabs
const unselectAllTabs = () => {
  tabs.forEach(tab => tab.setAttribute('aria-selected', false));
};

// Display the panel associated with the clicked tab
const showSelectedTabPanel = (event) => {
  const id = event.currentTarget.id;
  const panel = document.querySelector(`[aria-labelledby="${id}"]`);
  panel.hidden = false;
};

// Handle the tab click event
const handleTabClick = (event) => {
  hideAllPanels();
  unselectAllTabs();
  event.currentTarget.setAttribute('aria-selected', true);
  showSelectedTabPanel(event);
};

// Attach event listeners
tabs.forEach(tab => tab.addEventListener('click', handleTabClick));

function loadTabContent(tabID) {
    let tabContentID = tabID.split('-')[1];
    let tabContentElement = document.getElementById(tabContentID);

    // Use the fetch API to dynamically load content
    fetch(tabContentID + ".html")
        .then(response => response.text())
        .then(data => {
            tabContentElement.innerHTML = data;
        })
        .catch(error => {
            tabContentElement.innerHTML = "Error loading content: " + error;
        });
}

document.addEventListener("DOMContentLoaded", function() {
    loadTabContent("tabButton-A");  // Preload content for tab-A

    let tabButtons = document.querySelectorAll("[role='tab']");
    tabButtons.forEach(button => {
        button.addEventListener("click", function(event) {
            let tabID = event.target.id;
            loadTabContent(tabID);
        });
    });
});
