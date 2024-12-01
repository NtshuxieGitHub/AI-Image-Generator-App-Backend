import express from "express";
import * as dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.route("/").get((req, res) => {
  res.status(200).json({ message: "Hello from DALL.E!" });
});

router.route("/").post(async (req, res) => {
  try {
    const { prompt } = req.body;

    console.log("Received prompt:", prompt);

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const aiResponse = await openai.images.generate({
      prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });

    console.log("AI Response:", JSON.stringify(aiResponse, null, 2));

    // Check if the response contains the expected data structure
    if (
      !aiResponse ||
      !aiResponse.data ||
      !aiResponse.data[0] ||
      !aiResponse.data[0].b64_json
    ) {
      return res
        .status(500)
        .json({ error: "Invalid response from OpenAI: Missing image data." });
    }

    const image = aiResponse.data[0].b64_json;

    res.status(200).json({ photo: image });
  } catch (error) {
    console.error("Error generating image:", error.message);
    res
      .status(500)
      .json({ error: "Error generating image", details: error.message });
  }
});

export default router;
