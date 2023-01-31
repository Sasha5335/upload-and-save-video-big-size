const express = require("express");
const busboy = require("connect-busboy");
const mongoose = require("mongoose");

const path = require("path");
const fs = require("fs-extra");
const config = require("config");
const File = require("./models/File");

const app = express();
const PORT = config.get("serverPort");

app.use(busboy({ highWaterMark: 400 * 1024 * 1024 }));

const uploadPath = path.join(__dirname, "files/");
fs.ensureDir(uploadPath);

app.route("/upload").post((req, res, next) => {
  req.pipe(req.busboy);

  req.busboy.on("file", async (fieldname, file, filename, encoding, type) => {
    const dataFile = new File({ filename, type, dateUpload: new Date() });

    console.log(dataFile);
    await dataFile.save();

    fs.ensureDir(`${uploadPath}${dataFile.id}`);

    const fstream = fs.createWriteStream(
      path.join(`${uploadPath}${dataFile.id}`, filename)
    );
    file.pipe(fstream);

    fstream.on("close", () => {
      console.log(`Upload of '${filename}' finished`);
      res.redirect("back");
    });
  });
});

app.route("/").get((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write(
    '<form action="upload" method="post" enctype="multipart/form-data">'
  );
  res.write('<input type="file" accept="video/*" name="fileToUpload"><br>');
  res.write('<input type="submit">');
  res.write("</form>");
  return res.end();
});

const start = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(config.get("dbUrl"));

    app.listen(PORT, () => {
      console.log("Server started on port ", PORT);
    });
  } catch (e) {}
};

start();
