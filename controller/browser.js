// import puppeteer from "puppeteer";
// import { aiPrompt, aiResponce } from "./human.js";
const puppeteer = require("puppeteer");
const { aiPrompt, aiResponce } = require("./human.js");

let browser;
let page;

const initBrowser = async () => {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: true,
      timeout: 120000, // Extended timeout
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    console.log("Browser initialized.");
    return browser;
  } else {
    throw new Error("Browser already initialized.");
  }
};

const initPage = async () => {
  if (browser) {
    page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto("https://deepai.org/chat", { timeout: 60000 });
    return page;
  } else {
    throw new Error("Browser not initialized. Call /init first.");
  }
};

const closePage = async () => {
  try {
    await page.close();
    console.log(`Page is closed.`);
  } catch (err) {
    throw new Error(`Page not found.`, err);
  }
};

const closeBrowser = async () => {
  if (browser) {
    await browser.close();
    browser = null;
    page = null;
    console.log("Browser closed.");
  } else {
    throw new Error("Browser not initialized.");
  }
};

const scrapData = async (prompt) => {
  try {
    if (page.url() !== "https://deepai.org/chat") {
      await page.goto("https://deepai.org/chat");
    }
    await aiPrompt(prompt, page);
    const data = await aiResponce(page);
    return data;
  } catch (err) {
    console.error("Error in scrapData:", err.message);
    throw err;
  }
};

const tempResponse = async (prompt) => {
  const preBrowser = browser;
  const prePage = page;
  await initBrowser();
  await initPage();
  const data = await scrapData(prompt);
  await closePage();
  await closeBrowser();
  browser = preBrowser;
  page = prePage;
  return data;
};

// export { initBrowser, closeBrowser, scrapData, initPage, closePage, tempResponce };
module.exports = {
  initBrowser,
  closeBrowser,
  scrapData,
  initPage,
  closePage,
  tempResponse,
};
