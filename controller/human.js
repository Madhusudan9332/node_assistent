async function aiPrompt(prompt, page) {
  await page.waitForSelector(".chatbox", { timeout: 10000 });
  const chatboxes = await page.$$(".chatbox");
  const lastChatbox = chatboxes[chatboxes.length - 1];

  if (lastChatbox) {
    await lastChatbox.click();
    await lastChatbox.type(prompt);
    await lastChatbox.press("Enter");
  } else {
    throw new Error("Chatbox not found.");
  }
}

async function aiResponce(page) {
  await page.waitForSelector(".outputBox", { timeout: 10000 });
  const outputBoxes = await page.$$(".outputBox");
  const lastOutputBox = outputBoxes[outputBoxes.length - 1];

  if (lastOutputBox) {
    const outputText = await page.evaluate((el) => el.innerText, lastOutputBox);
    return outputText;
  } else {
    throw new Error("Output box not found.");
  }
}

module.exports = { aiPrompt, aiResponce };

