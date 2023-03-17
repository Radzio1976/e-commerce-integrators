const axios = require("axios");
const ProgressBar = require("progress");
const fs = require("fs");
const path = require("path");

module.exports = async function (urlResult, userIdResult, xmlIntegrator) {
  const url = urlResult;
  const userId = userIdResult;

  console.log("Connecting …");
  const { data, headers } = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });
  const totalLength = headers["content-length"];

  console.log("Starting download");
  const progressBar = new ProgressBar("-> downloading [:bar] :percent :etas", {
    width: 40,
    complete: "=",
    incomplete: " ",
    renderThrottle: 1,
    total: parseInt(totalLength),
  });

  const writer = fs.createWriteStream(
    path.resolve(__dirname, "../input", "ampproducts.xml")
  );

  data.on("data", (chunk) => {
    progressBar.tick(chunk.length);
  });
  data.pipe(writer);
  data.on("end", () => xmlIntegrator(userId));
};
