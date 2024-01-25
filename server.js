const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json()); // Add this line to parse JSON requests

app.post("/api/gpt-3.5-turbo/completions", async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/text-davinci-003/completions",
      req.body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer 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`,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
