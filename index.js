const express = require("express");
const { ConvertNormalJsonObject } = require("./service");
const jsonData = require("./data.json");
const app = express();
const port = 3000;

app.get("/", async (req, res) => {
  const result = ConvertNormalJsonObject(jsonData);
  console.log("🚀 ~ file: index.js:9 ~ app.get ~ result:", result);
  res.status(200).send({ ststus: true, data: result });
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
