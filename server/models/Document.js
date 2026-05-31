const mongoose = require(
  "mongoose"
);

const documentSchema =
  new mongoose.Schema(
    {
      userId: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "User",
      },

      title: String,

      filename: String,

      content: String,

      type: String,
    },

    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Document",
    documentSchema
  );