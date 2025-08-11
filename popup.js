document.addEventListener('DOMContentLoaded', () => {
    const aiSummaryCheckbox = document.getElementById('hideAiSummary');
    const aiModeCheckbox = document.getElementById('hideAiMode');
    const sponsoredCheckbox = document.getElementById('hideSponsored');
    const saveButton = document.getElementById('saveSettings');

    // Load settings from chrome.storage.local with a default state
    chrome.storage.local.get({
        hideAiSummary: true,
        hideAiMode: true,
        hideSponsored: true
    }, (result) => {
        aiSummaryCheckbox.checked = result.hideAiSummary;
        aiModeCheckbox.checked = result.hideAiMode;
        sponsoredCheckbox.checked = result.hideSponsored;
    });

    // Save settings when the Save button is clicked
    saveButton.addEventListener('click', () => {
        const settings = {
            hideAiSummary: aiSummaryCheckbox.checked,
            hideAiMode: aiModeCheckbox.checked,
            hideSponsored: sponsoredCheckbox.checked
        };

        chrome.storage.local.set(settings, () => {
            // After saving, send a message to the content script to update
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs[0]) {
                    chrome.tabs.sendMessage(tabs[0].id, { type: 'settings-update', settings: settings });
                }
            });
            // Close the popup after saving
            window.close();
        });
    });
});