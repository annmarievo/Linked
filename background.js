// background.js

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.type === 'getSummary') {
      const summary = await fetchSummaryFromAI(message.url);
      sendResponse({ summary });
    }
    return true; // Indicates async response
  });
  
  // Fetch content and summarize using AI API
  async function fetchSummaryFromAI(url) {
    // Use a server endpoint that fetches the content and summarizes it
    const response = await fetch(`https://your-server.com/summarize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    const data = await response.json();
    return data.summary;
  }
  