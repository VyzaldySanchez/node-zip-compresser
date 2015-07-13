$(document).ready(function() {

  function compressFiles(filesUrl) {

    var formData = new FormData();

    for (var f in filesUrl) {
      if (filesUrl.hasOwnProperty(f)) {
        formData.append('files', filesUrl[f]);
      }
    }

    $.ajax({
      type: 'POST',
      url: '/compress',
      data: formData,
      contentType: false,
      processData: false,
      cache: false,
      beforeSend: function() {
        $('#response').html(
          'Compressing your files, wait a moment...');
      },
      success: function(data) {
        var html = '';
        html += '<a id="link" download="" target="_blank" href="' +
          data.zipUrl + '">Download</a>';

        $('#response').html(html);
      },
      error: function(xhr, status, errorThrown) {
        console.log('xhr', xhr);
        console.log('status', status);
        console.log('error', errorThrown);
      }
    });

  }

  $('#compressButton').on('click', function() {

    var files = $('#files')[0].files;

    compressFiles(files);

  });

});
