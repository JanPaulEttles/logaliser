document.addEventListener("DOMContentLoaded", () => {

  var data;
  document.getElementById('fileScanners').addEventListener('change', function selectedFileChanged() {
    if(this.files.length === 0) {
      console.log('No file selected.');
      return;
    }

    var progress = document.getElementById('progressScanners');

    var file = this.files[0];
    var reader = new FileReader();
    var size = file.size;
    var chunk_size = Math.pow(2, 13);
    var chunks = [];
    var offset = 0;
    var bytes = 0;
    var total = 0;
    reader.onloadend = function(e) {
      if(e.target.readyState == FileReader.DONE) {
        var chunk = e.target.result;
        bytes += chunk.length;
        chunks.push(chunk);

        total += chunk.length;
        var percentage = ((total / size) * 100);

        progress.setAttribute("style", "width:" + percentage + "%");
        progress.setAttribute("aria-valuenow", percentage);

        if((offset < size)) {
          offset += chunk_size;
          var blob = file.slice(offset, offset + chunk_size);

          reader.readAsText(blob);
        } else {
          data = chunks.join("");
        };
      }
    };
    var blob = this.files[0].slice(offset, offset + chunk_size);
    reader.readAsText(blob);

    var fileName = $(this).val().split("\\").pop();
    $(this).siblings(".custom-file-label").addClass("selected").html(fileName);

  });

  let form = document.querySelector("#Scanners form");
  form.scanners.addEventListener("click", () => {

    let out = document.querySelector("#Scanners div output");

    let scannersobj = JSON.parse(data);
    if(!scannersobj.length) {
      consle.log('no data');
      return;
    }

    let count = form.scannersCount.value;
    if(count === "") {
      count = 10;
    } else if(count === "*") {
      count = scannersobj.length;
    }

    let div = document.createElement("div");
    div.classList.add("table-responsive");


    let tbl = document.createElement("table");
    tbl.classList.add("table");
    tbl.classList.add("table-hover");
    tbl.classList.add("table-striped");
    //tbl.createCaption().innerText = "Filtered Results";
    let hdr = tbl.insertRow();
    for(let prop in scannersobj[0]) {
      hdr.appendChild(document.createElement("th")).innerText = prop;
    }
    for(let i = 0; i < count; i++) {
      let x = scannersobj[i];
      let row = tbl.insertRow();
      for(let prop in x) {
        if(Array.isArray(x[prop])) {
          let nestedDiv = document.createElement("div");
          nestedDiv.classList.add("table-responsive");

          let nestedTable = document.createElement("table");
          nestedTable.classList.add("table");
          nestedTable.classList.add("table-hover");
          nestedTable.classList.add("table-striped");
          nestedDiv.appendChild(nestedTable);

          for(item of x[prop]) {
            let nestedRow = nestedTable.insertRow();
            for(let p in item) {
              nestedRow.insertCell().innerText = item[p];
            }
          }
          row.insertCell().appendChild(nestedDiv);
        } else {
          row.insertCell().innerText = x[prop];
        }
      }
    }
    while(out.firstChild) {
      out.removeChild(out.firstChild);
    }
    out.appendChild(div);
    div.appendChild(tbl);
  });

  form.clear.addEventListener("click", () => {
    let out = document.querySelector("#Scanners div output");
    out.innerHTML = "";
  });
});