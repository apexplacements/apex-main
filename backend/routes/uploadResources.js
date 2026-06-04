const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const s3 = require("../config/s3");
const db = require("../config/db");
const { PutObjectCommand } = require("@aws-sdk/client-s3");

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, title, resource_type, file_url FROM uploaded_resources ORDER BY id DESC`
    );

    res.json({
      success: true,
      data: rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch uploaded resources",
    });
  }
});

router.post(
  "/",
  upload.single("file"),
  async (req, res) => {
    try {
      const file = req.file;

      const key =
        Date.now() +
        "_" +
        file.originalname;

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.S3_BUCKET,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        })
      );

      const fileUrl =
        `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${key}`;

      await db.query(
        `
        INSERT INTO uploaded_resources
        (
          title,
          resource_type,
          file_url
        )
        VALUES (?, ?, ?)
      `,
        [
          req.body.title,
          req.body.resourceType,
          fileUrl,
        ]
      );

      res.json({
        success: true,
        fileUrl,
      });
    } catch (err) {
      console.error(err);

      res.status(500).json({
        success: false,
      });
    }
  }
);

module.exports = router;