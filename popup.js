document.addEventListener("DOMContentLoaded", () => {
  const fontCheckbox = document.getElementById("setFont");
  const widthCheckbox = document.getElementById("expandedMode");

  // New elements for font customization
  const editFontIcon = document.getElementById("editFontIcon");
  const fontUrlInput = document.getElementById("fontUrlInput");

  // Default font families for fallback when using the custom URL
  const defaultFontFamilies = "'Segoe UI', Tahoma, sans-serif";

  // 1. Load the current settings from storage and initialize UI
  chrome.storage.sync.get(
    ["setFont", "expandedMode", "customFontUrl"],
    (result) => {
      fontCheckbox.checked = result.setFont !== false; // Default to true
      widthCheckbox.checked = result.expandedMode || false; // Default to false

      // Set the saved URL if it exists
      if (result.customFontUrl) {
        fontUrlInput.value = result.customFontUrl;
      }
    }
  );

  // 2. Event Listeners for Checkboxes
  fontCheckbox.addEventListener("change", () => {
    chrome.storage.sync.set({ setFont: fontCheckbox.checked });
    notifyContentScript();
  });

  widthCheckbox.addEventListener("change", () => {
    chrome.storage.sync.set({ expandedMode: widthCheckbox.checked });
    notifyContentScript();
  });

  // 3. Event Listener for Edit Icon
  editFontIcon.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent checkbox from toggling when clicking the icon
    event.stopPropagation(); // Stop event from propagating to the parent label

    // Toggle the visibility of the input field
    const isHidden =
      fontUrlInput.style.display === "none" ||
      fontUrlInput.style.display === "";
    fontUrlInput.style.display = isHidden ? "block" : "none";

    // If showing, focus the input
    if (isHidden) {
      fontUrlInput.focus();
    }
  });

  // 4. Event Listener to Save URL when user hits Enter or clicks away
  fontUrlInput.addEventListener("change", () => {
    const url = fontUrlInput.value.trim();
    chrome.storage.sync.set({ customFontUrl: url }, () => {
      // After saving, hide the input and apply changes
      fontUrlInput.style.display = "none";
      notifyContentScript();
    });
  });

  // Helper function to notify content script
  function notifyContentScript() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0].url && tabs[0].url.includes("gemini.google.com")) {
        // Send a message to the content script on the active tab
        chrome.tabs.sendMessage(tabs[0].id, { action: "update_styles" });
      }
    });
  }
});
