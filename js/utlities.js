module.exports = {
	renderTable: function(data, count) {

		let div = this.createDiv();
		let table = this.createTable();
		div.appendChild(table);

		let header = table.insertRow();
		for(let prop in data[0]) {
			header.appendChild(document.createElement("th")).innerText = prop;
		}
		for(let i = 0; i < count; i++) {
			let x = data[i];
			let row = table.insertRow();
			for(let prop in x) {
				if(Array.isArray(x[prop])) {
					let nestedDiv = this.createDiv();
					let nestedTable = this.createTable();
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

		return div;
	},
	createDiv: function() {

		let div = document.createElement("div");
		div.classList.add("table-responsive");

		return div;
	},
	createTable: function(title) {

		let table = document.createElement("table");
		table.classList.add("table");
		table.classList.add("table-hover");
		table.classList.add("table-striped");
		//table.createCaption().innerText = "Filtered Results";

		return div;
	}
}