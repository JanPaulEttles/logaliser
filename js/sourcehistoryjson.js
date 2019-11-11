document.addEventListener("DOMContentLoaded", () => {

  var data;

  document.getElementById('fileSourceHistory').addEventListener('change', function selectedFileChanged() {
    if(this.files.length === 0) {
      console.log('No file selected.');
      return;
    }

    var progress = document.getElementById('progressSourceHistory');

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

  let form = document.querySelector("#SourceHistory form");

  document.querySelector("#minuteSourceHistory").addEventListener("click", () => {
    generate('minute', data);
  })
  document.querySelector("#hourSourceHistory").addEventListener("click", () => {
    generate('hour', data);
  })
  document.querySelector("#daySourceHistory").addEventListener("click", () => {
    generate('day', data);
  })

  document.querySelector("#weekSourceHistory").addEventListener("click", () => {
    generate('week', data);
  })

  document.querySelector("#monthSourceHistory").addEventListener("click", () => {
    generate('month', data);
  })

  document.querySelector("#yearSourceHistory").addEventListener("click", () => {
    generate('year', data);
  })

  /*
    form.clear.addEventListener("click", () => {
      let out = document.querySelector("#SourceHistory div output");
      out.innerHTML = "";
    });
    */
});

function generate(period, data) {

  let sourcehistoryobj = JSON.parse(data);
  if(!sourcehistoryobj.length) {
    consle.log('no data');
    return;
  }

  let ctx = document.querySelector("#SourceHistory div canvas");
  //console.log(ctx);
  //ctx.canvas.width = 1000;
  //ctx.canvas.height = 300;

  //console.log(JSON.stringify(format(groupBy(sourcehistoryobj[0].entries, 'day')), null, 2));
  var timeFormat = 'YYYY-MM-DD hh:mm:ss';

  var cfg = {
    type: 'bar',
    data: {
      datasets: format(groupBy(sourcehistoryobj[0].entries, period))
    },
    options: {
      responsive: true,
      title: {
        display: true,
        text: "Chart.js Time Scale"
      },
      scales: {
        xAxes: [{
          barPercentage: 1,
          barThickness: 3,
          offset: true,
          type: "time",
          time: {
            format: timeFormat,
            tooltipFormat: 'll'
          },
          scaleLabel: {
            display: true,
            labelString: 'Date'
          }
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true,
            callback: function(value) { if(value % 1 === 0) { return value; } }
          },
          offset: true,
          scaleLabel: {
            display: true,
            labelString: 'Requests'
          }
        }]
      }
    }
  };

  var chart = new Chart(ctx, cfg);
  chart.update();
}

function getColour(status) {
  let colour = '';
  switch (true) {
    case (status >= 100 && status < 200):
      colour = 'rgba(0, 123, 255, 0.6)'; //primary
      break;
    case (status >= 200 && status < 300):
      colour = 'rgba(40, 167, 69, 0.6)'; //success
      break;
    case (status >= 300 && status < 400):
      colour = 'rgba(23, 162, 184, .6)'; //info
      break;
    case (status >= 400 && status < 500):
      colour = 'rgba(108, 117, 125, 0.6)'; //secondary
      break;
    case (status >= 500 && status < 600):
      colour = 'rgba(255, 193, 7, 0.6)'; //warning
      break;

    default:
      colour = 'rgba(220, 53, 69, 0.6)'; //danger
  }
  return colour;

}

function format(data) {
  const formatted = data.map(elem => {
    return {
      label: elem.status,
      data: formattimestamps(elem.timestamps),
      backgroundColor: getColour(elem.status),
      borderWidth: 2,
      fill: false
    }
  })

  return formatted.sort((a, b) => a.label - b.label);

}

function formattimestamps(data) {

  const formatted = [];
  Object.keys(data).forEach(function(key, index) {

    formatted.push({
      x: key,
      y: data[key]
    });
  });

  return formatted;

}

function groupBy(elements, duration) {
  var formatted = elements.map(elem => {
    let current_datetime = new Date(elem.timestamp)

    current_datetime = current_datetime.toISOString().replace('T', ' ');
    current_datetime = current_datetime.substring(0, current_datetime.indexOf('.'));
    return { timestamp: moment(current_datetime).startOf(duration).format('YYYY-MM-DD hh:mm:ss'), status: elem.status }

  })
  const grouped = [];
  formatted
    .map(elem => elem.status)
    .filter((status, index, self) => self.indexOf(status) === index).forEach(function(item) {
      const fin = formatted
        .filter(entry => entry.status === item)
        .map(filtered => filtered.timestamp)
        .reduce(function(accumulator, timestamp) {
          accumulator[timestamp] = ++accumulator[timestamp] || 1;
          return accumulator;
        }, {});
      grouped.push({ status: item, timestamps: fin });
    })
  return grouped;
}