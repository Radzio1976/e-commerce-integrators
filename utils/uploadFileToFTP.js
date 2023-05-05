const ftp = require("basic-ftp");

module.exports = async function (localFile, remotePath) {
  const client = new ftp.Client();

  try {
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
      secure: false,
    });

    // download the remote file located to remotePath
    // and store it to localFile
    await client.uploadFrom(localFile, remotePath);
  } catch (err) {
    console.log(err);
  }
  client.close();
};
