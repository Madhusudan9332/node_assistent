const {
  init,
  response,
  newPage,
  close,
  tempResponse,
} = require("../controller/ai");
const router = require("express").Router();
router.post("/init", async (req, res) => {
  try {
    await init();
    res.status(200).json({ message: "Init successful" });
  } catch (error) {
    res.status(500).json({ error: "Error initializing" });
  }
});

router.post("/response", async (req, res) => {
  try {
    console.log(req.body);
    const result = await response(req.body.input);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error generating response" });
  }
});

router.post("/newPage", async (req, res) => {
  try {
    const result = await newPage();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error creating new page" });
  }
});

router.post("/close", async (req, res) => {
  try {
    const result = await close();
    res.status(200).json({ message: "Closed successfully", result });
  } catch (error) {
    res.status(500).json({ error: "Error closing" });
  }
});

router.get("/tempResponse", async (req, res) => {
  try {
    const result = await tempResponse();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching tempResponse" });
  }
});

module.exports = router;
