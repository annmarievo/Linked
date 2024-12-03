// document.addEventListener('DOMContentLoaded', () => {
//     const toggle = document.getElementById('hoverTextToggle');
  
//     // Load the saved state when the popup opens
//     chrome.storage.sync.get(['hoverTextEnabled'], (result) => {
//       // Ensure the default is false if no state is saved yet
//       const savedState = result.hoverTextEnabled !== undefined ? result.hoverTextEnabled : false;
//       toggle.checked = savedState;
//       console.log('Loaded state:', savedState); // Debugging
//     });
  
//     // Save state when toggled
//     toggle.addEventListener('change', () => {
//       const isEnabled = toggle.checked;
  
//       // Save the toggle state
//       chrome.storage.sync.set({ hoverTextEnabled: isEnabled }, () => {
//         console.log('State saved:', isEnabled); // Debugging
//       });
//     });
//   });

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('hoverTextToggle');
  
  // Load saved state of the toggle from chrome.storage
  chrome.storage.sync.get(['hoverTextEnabled'], (result) => {
    toggle.checked = result.hoverTextEnabled || false;
  });

  // Save state when the toggle is changed
  toggle.addEventListener('change', () => {
    const isEnabled = toggle.checked;
    chrome.storage.sync.set({ hoverTextEnabled: isEnabled });

    // Send the updated state to content.js to update the link preview size
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { hoverTextEnabled: isEnabled });
    });
  });
});
