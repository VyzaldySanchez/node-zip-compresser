var express = require('express'),
    archiver = require('archiver'),
    fs = require('fs'),
    path = require('path'),
    app = express(),
    zipFile = fs.createWriteStream('zip-files/files.zip');

//Define static files's folder
app.use(express.static(path.join(__dirname + '/public')));

app.get('/compress', function (req, res) {

  var compressor = archiver('zip');

  compressor.on('error', function (err) {
    console.log({ error: err.message });
  });

  res.on('close', function () {
    console.log('Archive wrote %d bytes', compressor.pointer());
  });

  //res.attachment('archive.zip');

  //Connect the response with the compressor via pipe-line
  compressor.pipe(zipFile);

  var filesToCompress = req.query.files;

  filesToCompress.forEach(function (current) {

    var dir = '/home/vizaldy/Pictures/',
        reader = null;

    try {

      reader = fs.createReadStream(path.join(dir, current));

      compressor.append(reader, { name: path.basename(current) });

    } catch(e) {
      console.log(e);
    }

  });

  compressor.finalize();

  res.send({ zipUrl: path.join(__dirname, '/zip-files/files.zip') });

});

app.listen(8000, function () {
  console.log('App running on port: 8000');
  console.log(path.join(__dirname, '/zip-files/files.zip'));
});
