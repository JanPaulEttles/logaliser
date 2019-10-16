document.addEventListener("DOMContentLoaded", () => {


  var aggressors;
  document.getElementById('fileAggressors').addEventListener('change',
    function selectedFileChanged() {
      if(this.files.length === 0) {
        console.log('No file selected.');
        return;
      }
      const reader = new FileReader();
      reader.onload = function fileReadCompleted() {
        aggressors = reader.result;
      };
      reader.readAsText(this.files[0]);
    });


  let form = document.querySelector("form")

  form.aggressors.addEventListener("click", () => {

    let out = form.out;

    let count = form.aggressorsCount.value;
    let aggressorsobj = JSON.parse(aggressors);
    if(!aggressorsobj.length) {
      consle.log('no data');
      return;
    }
    let tbl = document.createElement("table");
    //tbl.createCaption().innerText = "Filtered Results";
    let hdr = tbl.insertRow();
    for(let prop in aggressorsobj[0]) {
      hdr.appendChild(document.createElement("th")).innerText = prop;
    }
    for(let i = 0; i < count; i++) {
      let x = aggressorsobj[i];
      let row = tbl.insertRow();
      for(let prop in x) {
        row.insertCell().innerText = x[prop];
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