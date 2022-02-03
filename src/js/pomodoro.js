const STATUS_CHECK_INTERVAL = 1000; // 1 секунда

const POMODORO_ACTIONS = {
  start: 'pomodoro_start',
  getStatus: 'pomodoro_getStatus',
  stop: 'pomodoro_stop',
};

class Pomodoro {
  constructor() {
    this.state = {
      started: false,
      countdown: 0,
      workTime: 0,
    };

    this.timer = null;
  }

  tick = () => {
    if (this.state.countdown > 0) {
      this.state.countdown -= 1000;
    } else {
      this.showNotification();
      this.stop();
    }
  };

  start = (workTime) => {
    this.state = {
      started: true,
      countdown: workTime,
      workTime: workTime,
    };

    this.timer = setInterval(this.tick, STATUS_CHECK_INTERVAL);
  }

  stop = () => {
    clearInterval(this.timer);
    this.timer = null;
    this.state.started = false;
  }

  getState = () => {
    return this.state;
  }

  showNotification = () => {
    if (chrome.notifications) {
      const options = {
        type: 'basic',
        title: 'Hey!',
        message: 'Stop working and have a little break!',
        iconUrl: '../img/icon-128.png',
        requireInteraction: true
      };

      chrome.notifications.create('itemAdd', options);
    }
  }
}

const pomodoro = new Pomodoro();

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    switch (request.action) {
      case POMODORO_ACTIONS.start:
        pomodoro.start(request.workTime);
        break;
      case POMODORO_ACTIONS.stop:
        pomodoro.stop();

        break;
      case POMODORO_ACTIONS.getStatus:
      default:
        break;
    }

    sendResponse(pomodoro.getState());
  }
);