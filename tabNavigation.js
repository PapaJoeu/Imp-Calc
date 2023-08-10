/**
 * Tab functionality
 *
 * This code facilitates tab navigation by hiding and showing tab panels based on user interaction.
 */

// Select tabs and panels
const tabs = document.querySelectorAll('[role="tab"]');
const panels = document.querySelectorAll('[role="tabpanel"]');

/**
 * hideAllPanels()
 *
 * Hides all tab panels.
 */
function hideAllPanels() {
  panels.forEach(panel => {
    panel.hidden = true;
  });
}

/**
 * unselectAllTabs()
 *
 * Marks all tabs as unselected.
 */
function unselectAllTabs() {
  tabs.forEach(tab => {
    tab.setAttribute('aria-selected', false);
  });
}

/**
 * showSelectedTabPanel(event)
 *
 * Shows the tab panel associated with the clicked tab.
 *
 * @param {Event} event - The click event object.
 */
function showSelectedTabPanel(event) {
  const id = event.currentTarget.id;
  const panel = document.querySelector(`[aria-labelledby="${id}"]`);
  panel.hidden = false;
}

/**
 * handleTabClick(event)
 *
 * Event handler for the tab click events.
 * Hides all tab panels, marks all tabs as unselected,
 * marks the clicked tab as selected, and shows the associated tab panel.
 *
 * @param {Event} event - The click event object.
 */
function handleTabClick(event) {
  hideAllPanels();
  unselectAllTabs();
  event.currentTarget.setAttribute('aria-selected', true);
  showSelectedTabPanel(event);
}

// Attach the tab click event listeners
tabs.forEach(tab => {
  tab.addEventListener('click', handleTabClick);
});