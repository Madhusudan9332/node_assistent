const {
  initBrowser,
  closeBrowser,
  scrapData,
  initPage,
  closePage,
  tempResponse,
} = require("./browser.js");

const init = async () => {
  try {
    await initBrowser();
    await initPage();
  } catch (err) {
    console.log(err);
  }
};
const response = async (prompt) => {
  try {
    const data = await scrapData(prompt);
    return data;
  } catch (err) {
    console.log(err);
  }
};

const newPage = initPage;

const close = async () => {
  try {
    await closePage();
    await closeBrowser();
  } catch (err) {
    console.log(err);
  }
};

module.exports = { init, response, newPage,tempResponse, close };
