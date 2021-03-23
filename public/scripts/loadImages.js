var rateLimit = 0;

function getAllImageDocuments() {
  $.ajax({
      url: cloudantURL.origin + "/" + imageDatabase + "/_all_docs",
      type: "GET",
      headers: {
        "Authorization": "Basic " + btoa(cloudantURL.username + ":" + cloudantURL.password)
      },
      success: function (data) {
        for (var index in data.rows) {
          getImage(data.rows[index].id)
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
        console.log(textStatus);
        console.log(jqXHR);
      }
  });
}

function getImage(id) {
  var image = new Image();

  var imageSection = document.createElement('div');
  var imageHolder = document.createElement('div');
  image.className = "uploadedImage";
  loadAttachment(id,image);
  imageSection.id = id
  imageSection.className = "imageSection";
  imageHolder.className = "imageHolder";
  imageHolder.appendChild(image);
  imageSection.appendChild(imageHolder);
  uploadedImages.prepend(imageSection);
  getDocumentWithId(id, imageSection, 0);
}

function loadAttachment(id, dom) {
  if (rateLimit >= 5) {
    setTimeout(function() {
      loadAttachment(id,dom);
    }, 1000);
  } else {
    rateLimit++;

    console.log(rateLimit);
    $.ajax({
        url: cloudantURL.origin + "/" + imageDatabase + "/" + id + "/image",
        type: "GET",
        headers: {
          "Authorization": "Basic " + btoa(cloudantURL.username + ":" + cloudantURL.password)
        },
        xhr:function(){
          var xhr = new XMLHttpRequest();
          xhr.responseType= 'blob'
          return xhr;
        },
        success: function (data) {
          let url = window.URL || window.webkitURL;
          dom.src = url.createObjectURL(data);
          rateLimit--;
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log(errorThrown);
          console.log(textStatus);
          console.log(jqXHR);
          rateLimit--;
        }
    });
  }
}

getAllImageDocuments();

