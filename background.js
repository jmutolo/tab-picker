chrome.commands.onCommand.addListener((command) => {
    if (command === "open_tab_switcher") {
      chrome.action.openPopup(); // Triggers the popup UI
    }
  });
  