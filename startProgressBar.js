/**
 * Initializes the progress bar and performs a task until completion.
 * @function startProgressBar
 */

document.getElementById('calculate').addEventListener('click', startProgressBar);

function startProgressBar() {
  const progressBar = elements.progressBar;
  const totalTime = 200; // Total time for progress to reach 100% in milliseconds
  const intervalDuration = 100; // Interval duration in milliseconds
  const increment = (intervalDuration / totalTime) * 100;

  let progress = 0;

  /**
   * Updates the progress bar at regular intervals and performs a task upon completion.
   * @function interval
   */
  const interval = setInterval(() => {
    progress += increment;
    progressBar.value = progress.toFixed(2); // Set the progress value with 2 decimal places

    if (progress >= 100) {
      clearInterval(interval);
      calculateImposition(); // Perform a task upon completion (in this case, calculate imposition)
    }
  }, intervalDuration);
}
