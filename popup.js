document.addEventListener("DOMContentLoaded", () => {
  const fontCheckbox = document.getElementById("setFont");
  const widthCheckbox = document.getElementById("expandedMode");

  // 1. Load the current settings from storage
  chrome.storage.sync.get(["setFont", "expandedMode"], (result) => {
    fontCheckbox.checked = result.setFont !== false; // Default to true if not set
    widthCheckbox.checked = result.expandedMode || false; // Default to false
  });

  // 2. Add listeners to save changes when a checkbox is clicked
  fontCheckbox.addEventListener("change", () => {
    chrome.storage.sync.set({ setFont: fontCheckbox.checked });
    notifyContentScript();
  });

  widthCheckbox.addEventListener("change", () => {
    chrome.storage.sync.set({ expandedMode: widthCheckbox.checked });
    notifyContentScript();
  });

  // Optional: Notify the content script to apply changes immediately without a full reload
  function notifyContentScript() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0].url.includes("gemini.google.com")) {
        // Send a message to the content script on the active tab
        chrome.tabs.sendMessage(tabs[0].id, { action: "update_styles" });
      }
    });
  }
});
