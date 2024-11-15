const { Builder, By, until } = require('selenium-webdriver');

(async function example() {
  // Set up the Chrome driver
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    // Open the webpage
    await driver.get('https://example.com');

    // Wait for the page to load (optional)
    await driver.wait(until.elementLocated(By.tagName('body')), 10000);

    // Get the HTML content of the body
    let body = await driver.findElement(By.tagName('body'));
    let htmlContent = await body.getAttribute('innerHTML');
    
    console.log(htmlContent);

    // Example of updating an element's text
    let element = await driver.findElement(By.id('element_id'));
    await driver.executeScript("arguments[0].textContent = 'New text content';", element);

    // Example of changing an attribute
    let imgElement = await driver.findElement(By.id('image_id'));
    await driver.executeScript("arguments[0].setAttribute('src', 'new_image_url.jpg');", imgElement);

  } finally {
    // Close the browser
    await driver.quit();
  }
})();
