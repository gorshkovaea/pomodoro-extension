(function () {
  const DEFAULT_TIMER_DURATION = 5 * 60 * 1000; // 300000 мс = 5 мин
  const STATUS_CHECK_INTERVAL = 1000; // 1 секунда

  class Popup {
    timer = null;

    constructor() {
      this.startButton = document.getElementById('start-button');
      this.stopButton = document.getElementById('stop-button');

      this.getPomodoroState()
        .then(pomodoro => {
          if (pomodoro.started) {
            this.displayStartedView(pomodoro.countdown);
            this.connectPomodoro();
          } else {
            this.displayDefaultView();
          }
        });
    }

    displayDefaultView = () => {
      this.stopButton.style.display = 'none';
      this.startButton.style.display = 'block';
      this.updateTime(DEFAULT_TIMER_DURATION);

      this.stopButton.removeEventListener('click', this.stopPomodoro);
      this.startButton.addEventListener('click', this.startPomodoro);
    };

    displayStartedView = (countdown) => {
      this.startButton.style.display = 'none';
      this.stopButton.style.display = 'block';
      this.updateTime(countdown);

      this.startButton.removeEventListener('click', this.startPomodoro);
      this.stopButton.addEventListener('click', this.stopPomodoro);
    };

    connectPomodoro = () => {
      this.timer = setInterval(() => {
        this.getPomodoroState()
          .then(pomodoro => {
            if (pomodoro.countdown === 0) {
              this.stopPomodoro(false);
            } else {
              this.updateTime(pomodoro.countdown);
            }
          });
      }, STATUS_CHECK_INTERVAL);
    };

    startPomodoro = () => {
      this.sendMessage({action: 'pomodoro_start', workTime: DEFAULT_TIMER_DURATION}, () => {
        this.connectPomodoro();

        this.displayStartedView(DEFAULT_TIMER_DURATION);
      });
    }

    stopPomodoro = (sendStopMessage = true) => {
      this.displayDefaultView();

      clearInterval(this.timer);
      this.timer = null;

      if (sendStopMessage) {
        this.sendMessage({action: 'pomodoro_stop'});
      }
    }

    updateTime = (countdown) => {
      const minutes = Math.floor(countdown / 60000);
      const seconds = countdown / 1000 % 60;
      const timeStr = (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds  < 10 ? '0' + seconds : seconds);

      document.getElementById('timer').textContent = timeStr;
    }

    sendMessage = (options, callback = () => {}) => {
      chrome.runtime.sendMessage(options, callback);
    }

    getPomodoroState = () => {
      return new Promise(resolve => {
        this.sendMessage({action: 'pomodoro_getState'}, pomodoro => {
          resolve(pomodoro);
        });
      })
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    new Popup();
  });
})();
