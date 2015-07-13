var express = require('express'),
  archiver = require('archiver'),
  fs = require('fs'),
  path = require('path'),
  bodyParser = require('body-parser'),
  multer = require('multer'),
  app = express(),
  date = new Date(),
  tmpName = 'zip-files/' + date.toUTCString() +
  '.zip',
  zipFile = fs.createWriteStream(tmpName);

//Define static files's folder
app.use(express.static(path.join(__dirname + '/public/')));
app.use(multer());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: true
}));
// parse application/json
app.use(bodyParser.json());

function compressFiles(files, compressor) {

  var reader = null;

  if (files.length < 1) return false;

  if (files.length > 1) {

    files.forEach(function(file) {

      if (typeof file !== 'object') return false;

      try {

        reader = fs.createReadStream(file.path);

        compressor.append(reader, {
          name: file.originalname
        });

      } catch (e) {
        console.log('Error:', e);
      }

    });

  } else {
    try {

      var file = files;

      reader = fs.createReadStream(file.path);

      compressor.append(reader, {
        name: file.originalname
      });

    } catch (e) {
      console.log('Error:', e);
    }

  }

}

app.post('/compress', function(req, res) {

  var compressor = archiver('zip'),
    host = req.headers.host;

  compressor.on('error', function(err) {
    console.log({
      error: err.message
    });
  });

  res.on('close', function() {
    console.log('Archive wrote %d bytes', compressor.pointer());
  });

  //do this if you want to download the file as
  //soon as the compressing function is done
  //res.attachment('archive_name.zip');
  //compressor.pipe(res);

  var length = 0;

  try {
    //res.attachment('/zip-files/files.zip');
    var filesToCompress = req.files.files;

    //Connect the response with the compressor via pipe-line
    compressor.pipe(zipFile);

    length = filesToCompress.length;

    compressFiles(filesToCompress, compressor);
    compressor.finalize();

  } catch (e) {
    console.log('e:', e);
  }

  res.send({
    zipUrl: '/' + tmpName,
    length: length
  });

});

//Here we set the download functionality
app.get('/zip-files/:file', function(req, res) {

  try {
    var file = req.params.file;

    var reader = fs.createReadStream('./zip-files/' + file);

    res.attachment('./zip-files/' + file);
    reader.pipe(res);

  } catch (e) {
    console.log(e);
  }

});

app.listen(8000, function() {
  console.log('App running on port: 8000');
});
