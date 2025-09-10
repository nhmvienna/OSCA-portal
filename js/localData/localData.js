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
        url: "./data/osca-data.tsv?v=5",
        dataType: "text",
        success: function (data) {
          processOSCAData(data);
          console.log(q, start, offset)
          let totalResults = oscaResults.filter((d) => d.scientific_name?.toLowerCase().includes(q.toLowerCase()))
          let results = {
            data: totalResults,
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
    let lines = [];
    let allTextLines = allText.split(/\r\n|\n/);
    let headers = allTextLines[1].split('\t');

    for (let i = 2; i < allTextLines.length; i++) { //start with 1 to avoid the table header
      let data = allTextLines[i].split('\t');

      if (data.length == headers.length && data[0].length > 0) {
        let result = {
          scientific_name: data[2], //dwc:scientificName
          osca_id: data[0], //osca:osca:uniqueId
          phisical_specimen_id: data[1],//dwc:occurrenceID
          organization: data[9], //dwc:institutionCode
          license: 'Creative Commons', 
          collection_number: data[12], //dwc:collectionNumber
          media: data[15], //dwc:associatedMedia
          original_object: arraysToObject(data,headers)
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
 * Converts two arrays of the same length into an object.
 * The first array provides the values, and the second provides the keys.
 *
 * @param {Array} values - The array containing the values.
 * @param {Array} keys - The array containing the keys.
 * @returns {Object} - An object where keys are taken from the second array and values from the first.
 * @throws {Error} If the arrays have different lengths.
 *
 * @example
 * const values = ['apple', 'banana', 'cherry'];
 * const keys = ['a', 'b', 'c'];
 * const obj = arraysToObject(values, keys);
 * console.log(obj); // { a: 'apple', b: 'banana', c: 'cherry' }
 */
function arraysToObject(values, keys) {
  if (values.length !== keys.length) {
    throw new Error("Arrays must have the same length");
  }

  const result = {};
  for (let i = 0; i < values.length; i++) {
    result[keys[i]] = values[i];
  }
  return result;
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