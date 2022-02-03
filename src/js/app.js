chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    switch (request.action) {
      case "startPomodoroTimer":
        setTimeout(() => {

          if (chrome.notifications) {
            var opt = {
              type: "basic",
              title: "Hey!",
              message: "Stop working and have a little break!",
              iconUrl: "../img/icon-128.png",
              requireInteraction: true
            };

            chrome.notifications.create('itemAdd', opt, () => {});
          }
        }, 2000);
        break;
      default:
        break;
    }

    sendResponse({});
  }
);