var localDataModule = (function () {
  let oscaResults = [];
  let oscaInNumbers = {};

  function init() {
    // Initialization code for the result list module
    $(document).ready(function () {
      $.ajax({
        type: "GET",
        url: "./data/osca-data.tsv?v=3",
        dataType: "text",
        success: function (data) {
          processOSCAData(data);
        }
      });

      $.ajax({
        type: "GET",
        url: "./data/osca-in-numbers.tsv?v=3",
        dataType: "text",
        success: function (data) {
          processOSCAInNumbers(data);
        }
      });


    });

  }

  function search(q, sort, start, offset, filters, callback) {
    let searchResults = [];
    if (q) {
      $.ajax({
        type: "GET",
        url: "./data/osca-data.tsv?v=3",
        dataType: "text",
        success: function (data) {
          processOSCAData(data);
          console.log(q, start, offset)
          var totalResults = oscaResults.filter((d) => d.scientific_name.toLowerCase().includes(q.toLowerCase()))
          var results = {
            data: totalResults.slice(start * offset, (start + 1) * offset),
            dataSize: totalResults.length
          }
          callback(results);
        }
      });
    }
  }

  function processOSCAData(allText) {
    var lines = [];
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split('\t');

    for (var i = 1; i < allTextLines.length; i++) { //start with 1 to avoid the table header
      var data = allTextLines[i].split('\t');

      if (data.length == headers.length && data[0].length > 0) {
        var result = {
          scientific_name: data[0],
          phisical_specimen_id: data[1],
          organization: data[2],
          specimen_type: data[3],
          modified_date: data[4],
          license: data[5],
          location: data[6],
          geological_age: data[7],
          collection_number: data[8],
          collecting_agent: data[9],
          data_collected: data[10],
          type_status: data[11],
          media: data[12],
          object_type: data[13]
        };

        lines.push(result);
      }

    }

    oscaResults = lines.sort(function (a, b) {
      if (a.scientific_name.toLowerCase() < b.scientific_name.toLowerCase()) { return -1; }
      if (a.scientific_name.toLowerCase() > b.scientific_name.toLowerCase()) { return 1; }
      return 0;
    })
  }

  function processOSCAInNumbers(data) {
    var numbers = data.split(/\r\n|\n/)[2].split('\t');;
    // data is found in allDataLines[2]
    console.log(numbers);
    if(numbers) {
      oscaInNumbers = {
        preparation: {
          total: numbers[1],
          endemics: numbers[2],
          mollusks: numbers[3],
          dry_specs: numbers[4],
          wet_sepcs: numbers[5]
        },
        cataloging: {
          total: numbers[6],
          mids0: numbers[7],
          mids1: numbers[8],
          mids2: numbers[9],
          mids3: numbers[10]
        },
        digitization: {
          total: numbers[11],
          one_pic: numbers[12],
          pic_gallery: numbers[13],
          multimedia: numbers[14]
        },
        osca_portal:{
          total: numbers[15],
          endemics: numbers[16],
          mollusks: numbers[17]
        },
        integration: {
          total: numbers[18],
          overview: numbers[19]
        }
      }


    }
    console.log(oscaInNumbers);

  }
  // Expose only the necessary functions
  return {
    init: init,
    search: search
  };
})();