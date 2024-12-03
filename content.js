
let hoverTextEnabled = false; // Default state (can be changed based on saved setting)

// Listen for the state of the toggle from popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.hoverTextEnabled !== undefined) {
    hoverTextEnabled = message.hoverTextEnabled;
  }
});

document.querySelectorAll('a').forEach((link) => {
  link.addEventListener('mouseover', async () => {
    const linkUrl = link.href;

    // Avoid duplicate previews
    if (document.getElementById('link-preview')) return;

    try {
      const summary = await getLinkSummary(linkUrl);

      if (summary) {
        showLinkPreview(summary, linkUrl);
      } else {
        showLinkPreview("No summary available", linkUrl);
      }
    } catch (error) {
      console.error("Error fetching summary:", error);
      showLinkPreview("Failed to fetch summary", linkUrl);
    }
  });

  link.addEventListener('mouseout', hideLinkPreview);
});

// Function to display link preview in the top-right corner
function showLinkPreview(summary, url) {
  const existingPreview = document.getElementById('link-preview');
  if (existingPreview) existingPreview.remove();

  const previewDiv = document.createElement('div');
  previewDiv.id = 'link-preview';
  previewDiv.innerHTML = `
    <strong>Summary:</strong> ${summary}
    <br>
    <strong>URL:</strong> <a href="${url}" target="_blank">${url}</a>
  `;

  // Adjust font size based on the toggle state
  previewDiv.style.fontSize = hoverTextEnabled ? '30px' : '12px'; // Larger font size when enabled

  // Style the preview
  Object.assign(previewDiv.style, {
    position: 'fixed',
    top: '10px',
    right: '10px',
    backgroundColor: 'rgba(240, 240, 240, 0.9)',
    padding: '10px',
    borderRadius: '6px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    zIndex: '1000',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '600px',
    wordWrap: 'break-word',
  });

  document.body.appendChild(previewDiv);
}

// Function to hide the link preview
function hideLinkPreview() {
  const previewDiv = document.getElementById('link-preview');
  if (previewDiv) previewDiv.remove();
}

// Function to request a link summary from the Perplexity API
async function getLinkSummary(url) {
  const options = {
    method: 'POST',
    headers: {
      Authorization: 'Bearer API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: "llama-3.1-sonar-huge-128k-online",
      messages: [
        {
          role: "user",
          content: `Summarize this page in one sentence: ${url}`
        }
      ]
    })
  };

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', options);
    const data = await response.json();

    if (data && data.choices && data.choices.length > 0) {
      return data.choices[0].message.content;
    } else {
      throw new Error('No summary available.');
    }
  } catch (error) {
    console.error('Error fetching summary:', error);
    return null;
  }
}

