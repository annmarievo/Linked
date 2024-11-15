// content.js

document.querySelectorAll('a').forEach(link => {
    link.addEventListener('mouseover', async (event) => {
      const linkUrl = link.href;
      const summary = await getLinkSummary(linkUrl);
  
      if (summary) {
        showLinkPreview(event, summary, linkUrl);
      }
    });
  
    link.addEventListener('mouseout', hideLinkPreview);
  });
  
  // Function to display link preview
  function showLinkPreview(event, summary, url) {
    const previewDiv = document.createElement('div');
    previewDiv.id = 'link-preview';
    previewDiv.innerHTML = `
      <strong>Summary:</strong> ${summary}
      <br>
      <strong>URL:</strong> ${url}
    `;
    previewDiv.style.position = 'absolute';
    previewDiv.style.top = `${event.clientY + 10}px`;
    previewDiv.style.left = `${event.clientX + 10}px`;
    previewDiv.style.backgroundColor = 'lightgray';
    previewDiv.style.padding = '8px';
    previewDiv.style.borderRadius = '4px';
    previewDiv.style.zIndex = 1000;
    document.body.appendChild(previewDiv);
  }
  
  function hideLinkPreview() {
    const previewDiv = document.getElementById('link-preview');
    if (previewDiv) previewDiv.remove();
  }
  
  // Function to send a message to the background script to get summary
  async function getLinkSummary(url) {
    const response = await chrome.runtime.sendMessage({ type: 'getSummary', url });
    return response.summary;
  }
  