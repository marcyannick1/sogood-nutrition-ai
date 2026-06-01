import express from "express"
import axios from "axios"

const router = express.Router()

const ML_API_URL = process.env.ML_API_URL || "http://localhost:8001"

router.post("/", async (req, res) => {
  try {
    const response = await axios.post(
      `${ML_API_URL}/predict`,
      req.body
    )

    res.json(response.data)

  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: "Prediction failed", details: err.message })
  }
})

export default router