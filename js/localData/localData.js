/**
 * Module for handling local data operations related to OSCA.
 * Provides functionality to initialize data, process data from TSV files,
 * and perform search operations.
 */

let localDataModule = (function () {
  // Array to store processed OSCA results
  let oscaResults = [];

  // Object to store processed OSCA statistics
  let oscaInNumbers = {};

  /**
   * Initializes the module by loading data from TSV files.
   * Sets up AJAX requests to fetch and process data on document ready.
   */
  function init() {
    $(document).ready(function () {
      // Fetch and process OSCA data
      $.ajax({
        type: "GET",
        url: "./data/osca-data.tsv?v=3",
        dataType: "text",
        success: function (data) {
          processOSCAData(data);
        }
      });

      // Fetch and process OSCA statistics
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

  /**
   * Performs a search operation on the OSCA data.
   * Filters results based on the query and returns paginated results.
   *
   * @param {string} q - The search query.
   * @param {string} sort - Sorting criteria (not implemented in this code).
   * @param {number} start - The starting page index for pagination.
   * @param {number} offset - The number of results per page.
   * @param {object} filters - Additional filters for the search (not implemented in this code).
   * @param {function} callback - Callback function to handle the search results.
   */
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


  /**
   * Processes OSCA data from a TSV file.
   * Parses the file, extracts relevant fields, and stores the results in `oscaResults`.
   *
   * @param {string} allText - The raw TSV data as a string.
   */
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

    // Sort results alphabetically by scientific name
    oscaResults = lines.sort(function (a, b) {
      if (a.scientific_name.toLowerCase() < b.scientific_name.toLowerCase()) { return -1; }
      if (a.scientific_name.toLowerCase() > b.scientific_name.toLowerCase()) { return 1; }
      return 0;
    })
  }

  /**
   * Processes OSCA statistics from a TSV file.
   * Extracts specific numerical data and organizes it into the `oscaInNumbers` object.
   *
   * @param {string} data - The raw TSV data as a string.
   */
  function processOSCAInNumbers(data) {
    var numbers = data.split(/\r\n|\n/)[2].split('\t');;
    // data is found in allDataLines[2]
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
  }

  
  // Expose only the necessary functions
  return {
    init: init,
    search: search
  };
})();