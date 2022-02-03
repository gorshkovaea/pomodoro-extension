(function () {
  // const DEFAULT_TIMER_DURATION = 5 * 60 * 1000; // 300000 мс = 5 мин

  let startButton,
    stopButton,
    pauseButton,
    resumeButton;

  const handleStart = () => {
    startButton.removeEventListener('click', handleStart);
    startButton.style.display = 'none';
    stopButton.style.display = 'block';
    pauseButton.style.display = 'block';

    chrome.runtime.sendMessage({action: "startPomodoroTimer"}, function(response) {});
  };

  document.addEventListener('DOMContentLoaded', () => {
    startButton = document.getElementById('start-button');
    stopButton = document.getElementById('stop-button');
    pauseButton = document.getElementById('pause-button');
    resumeButton = document.getElementById('resume-button');

    startButton.addEventListener('click', handleStart);
  });
})();