import express from "express";
import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

import PostSchema from "../mongodb/models/post.js";

dotenv.config();

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Get all posts
router.route("/").get(async (req, res) => {
  try {
    const posts = await PostSchema.find({});
    console.log("Fetched posts:", posts);

    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
});

// Create a post
router.route("/").post(async (req, res) => {
  try {
    const { name, prompt, photo } = req.body;

    // console.log("Photo received");
    console.log("Received Data:", { name, prompt, photo });
    const photoUrl = await cloudinary.uploader.upload(photo);
    console.log("Cloudinary URL:", photoUrl.url);

    const newPost = await PostSchema.create({
      name,
      prompt,
      photo: photoUrl.url,
    });
    console.log("New Post Created:", newPost);

    res.status(201).json({ sucess: true, data: newPost });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
});

export default router;
