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

  let form = document.querySelector("#XSS form")
  form.xss.addEventListener("click", () => {

    let out = form.out;

    let count = form.xssCount.value;
    console.log('count: ' + count);
    if(count === undefined) {
      count = 10;
    }
    let xssobj = JSON.parse(xss);
    if(!xssobj.length) {
      consle.log('no data');
      return;
    }
    let tbl = document.createElement("table");
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
    out.appendChild(document.createElement("p"));
    out.appendChild(tbl);
  });

  form.clear.addEventListener("click", () => {
    form.out.innerHTML = "";
  });
});