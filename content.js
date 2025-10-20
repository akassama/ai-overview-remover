function hideElements(settings) {
    // Hide the main "AI Overview" section with multiple selectors
    if (settings.hideAiSummary) {
        // Method 1: Look for various forms of AI Overview text
        const aiOverviewSelectors = [
            'h1', 'h2', 'h3', 'div[role="heading"]', 'strong', 'span', 'div'
        ];

        let aiOverviewContainer = null;

        // Try to find AI Overview by text content in various elements
        for (const selector of aiOverviewSelectors) {
            const elements = document.querySelectorAll(selector);
            for (const el of elements) {
                const text = el.textContent.trim().toLowerCase();
                if (text === 'ai overview' || text === 'ai overviews' ||
                    text.includes('ai overview') || text === 'overview') {
                    // Try to find a parent container that likely contains the entire AI Overview
                    let container = el.closest('div[data-hveid], .MjjYud, .ULSxyf, [jscontroller], .YzCcne');
                    if (container) {
                        aiOverviewContainer = container;
                        break;
                    }
                    // If no specific container found, try going up a few levels
                    let parent = el;
                    for (let i = 0; i < 5; i++) {
                        parent = parent.parentElement;
                        if (parent && (parent.classList.contains('MjjYud') ||
                            parent.classList.contains('ULSxyf') ||
                            parent.getAttribute('data-hveid') ||
                            parent.classList.contains('YzCcne'))) {
                            aiOverviewContainer = parent;
                            break;
                        }
                    }
                    if (aiOverviewContainer) break;
                }
            }
            if (aiOverviewContainer) break;
        }

        // Method 2: Look for specific classes that often contain AI Overview
        if (!aiOverviewContainer) {
            const knownAiContainers = document.querySelectorAll('.YzCcne, .ULSxyf, [data-mcp], [data-aim]');
            for (const container of knownAiContainers) {
                const containerText = container.textContent.toLowerCase();
                if (containerText.includes('ai overview') ||
                    containerText.includes('ai overviews') ||
                    container.getAttribute('data-aim') === '1') {
                    aiOverviewContainer = container;
                    break;
                }
            }
        }

        // Hide the found container
        if (aiOverviewContainer) {
            aiOverviewContainer.style.display = "none";
            console.log('AI Overview hidden');
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
    }

    // Hide the "Sponsored" section
    if (settings.hideSponsored) {
        const sponsoredAdBlock = document.getElementById('tads');
        if (sponsoredAdBlock) {
            sponsoredAdBlock.style.display = "none";
        }

        // Also look for other sponsored containers
        const sponsoredSelectors = [
            '[data-text-ad="1"]',
            '.commercial-unit',
            '.ads-ad',
            '[data-ads]'
        ];

        sponsoredSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                el.style.display = "none";
            });
        });
    }
}

// Enhanced function to specifically target the AI Overview structure from your sample
function enhanceAiOverviewDetection() {
    // Look for the specific structure from your sample
    const specificAiContainers = document.querySelectorAll('[data-aim="1"], [data-mcp="18"], .YzCcne');

    specificAiContainers.forEach(container => {
        // Check if this looks like an AI Overview container
        const hasAiOverviewText = container.textContent.toLowerCase().includes('ai overview');
        const hasAiSpecificAttributes = container.hasAttribute('data-aim') ||
            container.hasAttribute('data-mcp');

        if (hasAiOverviewText || hasAiSpecificAttributes) {
            container.style.display = "none";
            console.log('Enhanced AI Overview detection: Hidden specific container');
        }
    });
}

// Gets and apply initial settings on page load
chrome.storage.local.get({
    hideAiSummary: true,
    hideAiMode: true,
    hideSponsored: true
}, (result) => {
    hideElements(result);
    // Run enhanced detection after a short delay to ensure DOM is ready
    setTimeout(enhanceAiOverviewDetection, 100);
});

// Listener to run the function when a message is received from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'settings-update') {
        hideElements(request.settings);
        setTimeout(enhanceAiOverviewDetection, 100);
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
        setTimeout(enhanceAiOverviewDetection, 100);
    });
});

observer.observe(document.body, { childList: true, subtree: true });

// Also observe for specific AI Overview containers
const aiObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) { // Element node
                    if (node.matches && (
                        node.matches('[data-aim="1"]') ||
                        node.matches('[data-mcp="18"]') ||
                        node.matches('.YzCcne') ||
                        node.textContent.toLowerCase().includes('ai overview')
                    )) {
                        chrome.storage.local.get({
                            hideAiSummary: true
                        }, (result) => {
                            if (result.hideAiSummary) {
                                node.style.display = "none";
                            }
                        });
                    }
                }
            });
        }
    });
});

aiObserver.observe(document.body, {
    childList: true,
    subtree: true
});