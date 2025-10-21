function applyStyles(settings) {
  const isFontActive = settings.setFont !== false;
  const isExpandedActive = settings.expandedMode || false;

  const customUrl = settings.customFontUrl || "";

  const fontStylesId = "gemini-vazirmatn-font-styles";
  let fontStyleElement = document.getElementById(fontStylesId);

  if (isFontActive) {
    if (!fontStyleElement) {
      fontStyleElement = document.createElement("style");
      fontStyleElement.id = fontStylesId;
      document.head.appendChild(fontStyleElement);
    }

    let fontImport = "";
    let fontName = "'Vazirmatn', 'Segoe UI', Tahoma, sans-serif";

    if (customUrl.startsWith("https://fonts.googleapis.com/css2")) {
      try {
        const urlParams = new URLSearchParams(customUrl.split("?")[1]);
        const familiesParam = urlParams.get("family");
        if (familiesParam) {
          const mainFamily = familiesParam.split(":")[0].replace(/\+/g, " ");
          fontName = `'${mainFamily}', 'Segoe UI', Tahoma, sans-serif`;
        }
      } catch (e) {
        console.error("Could not parse custom font URL:", e);
      }
      fontImport = `@import url('${customUrl}');\n`;
    } else {
      fontImport = `
                @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;700&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap');
            `;
    }
    // Developer: https://github.com/amirhosseindotzip
    fontStyleElement.textContent = `
            /* Import Custom or Default Fonts */
            ${fontImport}

            /* Apply the font to all common text elements on the page */
            body, p, h1, h2, h3, h4, h5, h6, div, span, a, li, td, th, input, textarea, button {
                font-family: ${fontName} !important;
            }

            /* Specifically target elements with the 'fa' language attribute */
            *:lang(fa) {
                font-family: ${fontName} !important;
            }
        `;
  } else {
    if (fontStyleElement) {
      fontStyleElement.remove();
    }
  }
  const widthStylesId = "gemini-expanded-width-styles";
  let widthStyleElement = document.getElementById(widthStylesId);

  if (isExpandedActive) {
    if (!widthStyleElement) {
      widthStyleElement = document.createElement("style");
      widthStyleElement.id = widthStylesId;
      document.head.appendChild(widthStyleElement);
    }
    widthStyleElement.textContent = `
            /* Target the main conversation container and set a new max-width */
            .conversation-container {
                max-width: 90% !important;
                width: 90% !important;
            }

            /* Target the input area container to match the width of the conversation */
            .input-area-container {
                max-width: 90% !important;
                width: 90% !important;
            }
            
            /* Optional: To make the input box (user query bubble) full width inside its container */
            user-query {
                max-width: 100% !important;
            }

            /* Optional: To make the response and user bubbles use the full width of the container */
            .user-query-bubble-with-background,
            .response-container .response-text-container {
                max-width: 100% !important;
            }
        `;
  } else {
    if (widthStyleElement) {
      widthStyleElement.remove();
    }
  }
}

chrome.storage.sync.get(
  ["setFont", "expandedMode", "customFontUrl"],
  (settings) => {
    applyStyles(settings);
  }
);
// Developer: https://github.com/amirhosseindotzip

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "update_styles") {
    chrome.storage.sync.get(
      ["setFont", "expandedMode", "customFontUrl"],
      (settings) => {
        applyStyles(settings);
      }
    );
  }
});
