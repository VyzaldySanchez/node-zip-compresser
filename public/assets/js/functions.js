$(document).ready(function () {

  function compressFiles(filesUrl) {

    $.ajax({
      method: 'GET',
      url: '/compress',
      data: filesUrl,
      contentType: 'multipart/form-data',
      beforeSend: function () {
        console.log('Sending request');
      },
      success: function (data) {
        console.log(data);
      },
      error: function (xhr, status, errorThrown) {
        console.log('xhr', xhr);
        console.log('xhr', status);
        console.log('xhr', errorThrown);
      }
    });

  }

  console.log('asdad');
  $('#compressButton').on('click', function () {

    console.log('aaaaa');

  });

});
