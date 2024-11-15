document.querySelectorAll('a').forEach((link) => {
  // Add event listener for hover
  link.addEventListener('mouseover', async (event) => {
    const linkUrl = link.href;

    // Avoid duplicate previews
    if (document.getElementById('link-preview')) return;

    try {
      const summary = await getLinkSummary(linkUrl);

      if (summary) {
        showLinkPreview(event, summary, linkUrl);
      } else {
        showLinkPreview(event, "No summary available", linkUrl);
      }
    } catch (error) {
      console.error("Error fetching summary:", error);
      showLinkPreview(event, "Failed to fetch summary", linkUrl);
    }
  });

  // Remove preview on mouseout
  link.addEventListener('mouseout', hideLinkPreview);
});

// Function to display link preview
function showLinkPreview(event, summary, url) {
  // Create the preview container
  const previewDiv = document.createElement('div');
  previewDiv.id = 'link-preview';
  previewDiv.innerHTML = `
    <strong>Summary:</strong> ${summary}
    <br>
    <strong>URL:</strong> <a href="${url}" target="_blank">${url}</a>
  `;

  // Style the preview
  Object.assign(previewDiv.style, {
    position: 'absolute',
    top: `${event.clientY + 10}px`,
    left: `${event.clientX + 10}px`,
    backgroundColor: 'rgba(240, 240, 240, 0.9)',
    padding: '10px',
    borderRadius: '6px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    zIndex: 1000,
    fontFamily: 'Arial, sans-serif',
    fontSize: '12px',
  });

  document.body.appendChild(previewDiv);
}

// Function to hide the link preview
function hideLinkPreview() {
  const previewDiv = document.getElementById('link-preview');
  if (previewDiv) previewDiv.remove();
}

// Function to request a link summary from the background script
async function getLinkSummary(url) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ type: 'getSummary', url }, (response) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else if (response && response.summary) {
        resolve(response.summary);
      } else {
        resolve(null);
      }
    });
  });
}
