const express = require("express");
const proxyexpress = require("express-http-proxy");

const app = express();
app.use("/user", proxyexpress("http://localhost:3001"));
app.use("/captain", proxyexpress("http://localhost:3002"));

app.listen(3000, () => {
  console.log("API Gateway running on port 3000");
});
