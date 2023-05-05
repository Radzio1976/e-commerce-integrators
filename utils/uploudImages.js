const download = require("image-downloader");

const uploadFileToFTP = require("./uploadFileToFTP");

module.exports = function (url, path) {
  download
    .image({
      url: url,
      dest: path,
    })
    .then((filename) => {
      console.log("Saved to", filename);
      /* Tutaj gdy zdjęcie zostało pobrane wysyłam je na serwer FTP */
      imageName = url.slice(url.lastIndexOf("/") + 1);
      uploadFileToFTP(
        `./downloadedImages/${imageName}`,
        `public_html/images/unibike/rowery/${imageName}`
      );
    })
    .catch((err) => console.error(err));
};
