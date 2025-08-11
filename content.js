function hideElements(settings) {
    // Hide the main "AI Overview" section
    if (settings.hideAiSummary) {
        const aiOverviewHeading = [...document.querySelectorAll('h1, div[role="heading"], strong')]
            .find(el => el.textContent.trim().toLowerCase() === 'ai overview');
        if (aiOverviewHeading) {
            const container = aiOverviewHeading.closest('div[data-hveid]');
            if (container) {
                container.style.display = "none";
            }
        }
    } else {
        const aiOverviewHeading = [...document.querySelectorAll('h1, div[role="heading"], strong')]
            .find(el => el.textContent.trim().toLowerCase() === 'ai overview');
        if (aiOverviewHeading) {
            const container = aiOverviewHeading.closest('div[data-hveid]');
            if (container) {
                container.style.display = "";
            }
        }
    }

    // Hide the "AI Mode" element
    if (settings.hideAiMode) {
        const aiModeTextElement = [...document.querySelectorAll('span, div')]
            .find(el => el.textContent.trim().toLowerCase() === 'ai mode');
        if (aiModeTextElement) {
            const aiModeContainer = aiModeTextElement.closest('div[role="listitem"]');
            if (aiModeContainer) {
                aiModeContainer.style.display = "none";
            }
        }
    } else {
        const aiModeTextElement = [...document.querySelectorAll('span, div')]
            .find(el => el.textContent.trim().toLowerCase() === 'ai mode');
        if (aiModeTextElement) {
            const aiModeContainer = aiModeTextElement.closest('div[role="listitem"]');
            if (aiModeContainer) {
                aiModeContainer.style.display = "";
            }
        }
    }

    // Hide the "Sponsored" section
    if (settings.hideSponsored) {
        const sponsoredAdBlock = document.getElementById('tads');
        if (sponsoredAdBlock) {
            sponsoredAdBlock.style.display = "none";
        }
    } else {
        const sponsoredAdBlock = document.getElementById('tads');
        if (sponsoredAdBlock) {
            sponsoredAdBlock.style.display = "";
        }
    }
}

// Gets and apply initial settings on page load
chrome.storage.local.get({
    hideAiSummary: true,
    hideAiMode: true,
    hideSponsored: true
}, (result) => {
    hideElements(result);
});

// Listener to run the function when a message is received from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'settings-update') {
        hideElements(request.settings);
    }
});

// MutationObserver for new content loaded without a page refresh
const observer = new MutationObserver(() => {
    chrome.storage.local.get({
        hideAiSummary: true,
        hideAiMode: true,
        hideSponsored: true
    }, (result) => {
        hideElements(result);
    });
});
observer.observe(document.body, { childList: true, subtree: true });