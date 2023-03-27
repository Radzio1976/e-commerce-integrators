const axios = require("axios");
const ProgressBar = require("progress");
const fs = require("fs");
const path = require("path");

module.exports = async function (
  urlResult,
  userIdResult,
  xmlIntegrator,
  inputFileName
) {
  const url = urlResult;
  const userId = userIdResult;

  console.log("Connecting …");
  const { data, headers } = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });
  console.log("Zaczynam pobieranie pliku");

  let word = "Poczekaj chwilę ";
  let interval = setInterval(() => {
    word += ".";
    console.log(word);
  }, 500);

  const writer = fs.createWriteStream(
    path.resolve(__dirname, "../input", inputFileName)
  );

  data.pipe(writer);
  data.on("end", () => {
    clearInterval(interval);
    xmlIntegrator(userId);
  });
};
