document.addEventListener("DOMContentLoaded", () => {

  var xss;
  document.getElementById('fileXSS').addEventListener('change', function selectedFileChanged() {
    if(this.files.length === 0) {
      console.log('No file selected.');
      return;
    }
    const reader = new FileReader();
    reader.onload = function fileReadCompleted() {
      xss = reader.result;
    };
    reader.readAsText(this.files[0]);
  });

  let form = document.querySelector("#XSS form");
  form.xss.addEventListener("click", () => {

    let out = document.querySelector("#XSS div output");

    let xssobj = JSON.parse(xss);
    if(!xssobj.length) {
      consle.log('no data');
      return;
    }

    let count = form.xssCount.value;
    if(count === "") {
      count = 10;
    } else if(count === "*") {
      count = xssobj.length;
    }

    let div = document.createElement("div");
    div.classList.add("table-responsive");


    let tbl = document.createElement("table");
    tbl.classList.add("table");
    tbl.classList.add("table-hover");
    tbl.classList.add("table-striped");
    //tbl.createCaption().innerText = "Filtered Results";
    let hdr = tbl.insertRow();
    for(let prop in xssobj[0]) {
      hdr.appendChild(document.createElement("th")).innerText = prop;
    }
    for(let i = 0; i < count; i++) {
      let x = xssobj[i];
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
    out.appendChild(div);
    div.appendChild(tbl);
  });

  form.clear.addEventListener("click", () => {
    form.out.innerHTML = "";
  });
});