function hideAiElements() {
    // Hide the main "AI Overview" section by finding its heading
    const aiOverviewHeading = [...document.querySelectorAll('h1, div[role="heading"], strong')]
        .find(el => el.textContent.trim().toLowerCase() === 'ai overview');

    if (aiOverviewHeading) {
        let container = aiOverviewHeading.closest('div[data-hveid]');
        if (container && container.style.display !== "none") {
            container.style.display = "none";
            console.log("AI Overview hidden.");
        }
    }

    // Hide the "AI Mode" element by finding its text content
    const aiModeTextElement = [...document.querySelectorAll('span, div')]
        .find(el => el.textContent.trim().toLowerCase() === 'ai mode');

    if (aiModeTextElement) {
        // The parent of "AI Mode" is a <div> with role="listitem"
        let aiModeContainer = aiModeTextElement.closest('div[role="listitem"]');
        if (aiModeContainer && aiModeContainer.style.display !== "none") {
            aiModeContainer.style.display = "none";
            console.log("AI Mode filter hidden.");
        }
    }
}

// Run initially to hide elements on page load
hideAiElements();

// Observe DOM changes for dynamically loaded content
const observer = new MutationObserver(hideAiElements);
observer.observe(document.body, { childList: true, subtree: true });