document.addEventListener("DOMContentLoaded", () => {

  var sqli;
  document.getElementById('fileSQLi').addEventListener('change', function selectedFileChanged() {
    if(this.files.length === 0) {
      console.log('No file selected.');
      return;
    }
    const reader = new FileReader();
    reader.onload = function fileReadCompleted() {
      sqli = reader.result;
    };
    reader.readAsText(this.files[0]);
  });

  let form = document.querySelector("#SQLi form")
  form.sqli.addEventListener("click", () => {

    let out = document.querySelector("#SQLi div output");

    let count = form.sqliCount.value;
    console.log('count: ' + count);
    if(count === undefined) {
      count = 10;
    }
    let sqliobj = JSON.parse(sqli);
    if(!sqliobj.length) {
      consle.log('no data');
      return;
    }
    let tbl = document.createElement("table");
    //tbl.createCaption().innerText = "Filtered Results";
    let hdr = tbl.insertRow();
    for(let prop in sqliobj[0]) {
      hdr.appendChild(document.createElement("th")).innerText = prop;
    }
    for(let i = 0; i < count; i++) {
      let x = sqliobj[i];
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