document.getElementById('run').addEventListener('click', () => {
    // Open the extensions page in a new tab
    chrome.tabs.create({ url: "brave://extensions/" });

    // Close the popup window
    window.close();
});