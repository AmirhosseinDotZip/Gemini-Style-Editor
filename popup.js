document.addEventListener("DOMContentLoaded", () => {
  const fontCheckbox = document.getElementById("setFont");
  const widthCheckbox = document.getElementById("expandedMode");
  const editFontIcon = document.getElementById("editFontIcon");
  const fontUrlInput = document.getElementById("fontUrlInput");

  const defaultFontFamilies = "'Segoe UI', Tahoma, sans-serif";

  chrome.storage.sync.get(
    ["setFont", "expandedMode", "customFontUrl"],
    (result) => {
      fontCheckbox.checked = result.setFont !== false;
      widthCheckbox.checked = result.expandedMode || false;

      if (result.customFontUrl) {
        fontUrlInput.value = result.customFontUrl;
      }
    }
  );
  // Developer: https://github.com/amirhosseindotzip
  fontCheckbox.addEventListener("change", () => {
    chrome.storage.sync.set({ setFont: fontCheckbox.checked });
    notifyContentScript();
  });

  widthCheckbox.addEventListener("change", () => {
    chrome.storage.sync.set({ expandedMode: widthCheckbox.checked });
    notifyContentScript();
  });

  editFontIcon.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    const isHidden =
      fontUrlInput.style.display === "none" ||
      fontUrlInput.style.display === "";
    fontUrlInput.style.display = isHidden ? "block" : "none";

    if (isHidden) {
      fontUrlInput.focus();
    }
  });

  fontUrlInput.addEventListener("change", () => {
    const url = fontUrlInput.value.trim();
    chrome.storage.sync.set({ customFontUrl: url }, () => {
      fontUrlInput.style.display = "none";
      notifyContentScript();
    });
  });

  function notifyContentScript() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0].url && tabs[0].url.includes("gemini.google.com")) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "update_styles" });
      }
    });
  }
});
