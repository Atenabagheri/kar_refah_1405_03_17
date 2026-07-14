const { Schema, model } = require("mongoose");

const divisionSchema = new Schema(
  {
    _id: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    faName: { type: String, required: true, unique: true },
  },
  { _id: false, timestamps: true }
);

divisionSchema.pre("save", function (next) {
  if (!this.code) {
    this.code = this._id;
  }
  next();
});

const Division = model("Division", divisionSchema);

module.exports = Division;
