const { response } = require("express");
const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    data: [
      {
        prompt: { type: String, required: true },
        aiResponse: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Data = mongoose.model("your_assistent_data", dataSchema);

module.exports = Data;
