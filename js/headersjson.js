document.addEventListener("DOMContentLoaded", () => {

  var headers;
  document.getElementById('fileHeaders').addEventListener('change', function selectedFileChanged() {
    if(this.files.length === 0) {
      console.log('No file selected.');
      return;
    }
    const reader = new FileReader();
    reader.onload = function fileReadCompleted() {
      headers = reader.result;
    };
    reader.readAsText(this.files[0]);
  });

  let form = document.querySelector("#Headers form");
  form.headers.addEventListener("click", () => {

    let out = document.querySelector("#Headers div output");

    let count = form.headersCount.value;
    console.log('count: ' + count);
    if(count === "") {
      count = 10;
    }
    let headersobj = JSON.parse(headers);
    if(!headersobj.length) {
      consle.log('no data');
      return;
    }
    let tbl = document.createElement("table");
    tbl.classList.add("table");
    tbl.classList.add("table-responsive");
    tbl.classList.add("table-hover");
    tbl.classList.add("table-striped");
    //tbl.createCaption().innerText = "Filtered Results";
    let hdr = tbl.insertRow();
    for(let prop in headersobj[0]) {
      hdr.appendChild(document.createElement("th")).innerText = prop;
    }
    for(let i = 0; i < count; i++) {
      let x = headersobj[i];
      let row = tbl.insertRow();
      for(let prop in x) {


        if(Array.isArray(x[prop])) {
          let nestedTable = document.createElement("table");
          for(item of x[prop]) {
            let nestedRow = nestedTable.insertRow();
            for(let p in item) {
              nestedRow.insertCell().innerText = item[p];
            }
          }
          //row.insertCell().innerText = nestedTable;
          row.insertCell().appendChild(nestedTable);

        } else {
          row.insertCell().innerText = x[prop];
        }
      }
    }
    while(out.firstChild) {
      out.removeChild(out.firstChild);
    }
    out.appendChild(document.createElement("p"));
    out.appendChild(tbl);
  });

  form.clear.addEventListener("click", () => {
    form.out.innerHTML = "";
  });
});