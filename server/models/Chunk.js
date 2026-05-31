const mongoose = require(
  "mongoose"
);

const chunkSchema =
  new mongoose.Schema(
    {
      userId: {
        type:
          mongoose.Schema.Types
            .ObjectId,
      },

      documentId: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "Document",
      },

      text: String,

      embedding: [Number],
    },

    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Chunk",
    chunkSchema
  );