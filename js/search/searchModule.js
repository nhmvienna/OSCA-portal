// Define the searchModule as an Immediately Invoked Function Expression (IIFE)
let searchModule = (function () {

  // Function to initialize the search module
  function init() {
    // Attach a click event handler to the search button
    $('#searchButton').on('click', function () {
      searchQuery = $('#searchQuery').val(); // Get the search query from the input field
      searchPage = 1; // Reset the search page to the first page
      $('input:checkbox').prop('checked', true); // Check all search sources
      $('.result-count').text(''); // Reset result counters
      search(searchQuery, searchSourceSelectedValue); // Perform the search
    });

    // Attach a keypress event handler to the search input field
    $('#searchQuery').on('keypress', function (event) {
      if (event.key === 'Enter') { // Check if the Enter key was pressed
        searchQuery = $('#searchQuery').val(); // Get the search query from the input field
        searchPage = 1; // Reset the search page to the first page
        $('input:checkbox').prop('checked', true); // Check all search sources
        $('.result-count').text(''); // Reset result counters
        search(searchQuery, searchSourceSelectedValue); // Perform the search
      }
    });
  }

  /**
     * Performs a search across multiple sources
     * @param {string} query - The data returned from the search.
     * @param {number} searchSource - The source of the search (e.g., GBIF, GeoCase).
     */
  function search(query, searchSource) {
    currentResults = []; // Reset the current results array
    recordsPerPage = 300; // Set the number of records per page

    if (query) { // Check if a query is provided
      // Perform a search on the GBIF API
      $("#resultLoadingGBIF").show(); // Show the loading indicator for GBIF
      $.get("https://api.gbif.org/v1/occurrence/search?advanced=1&basis_of_record=PRESERVED_SPECIMEN&country=AT&limit=" + recordsPerPage + "&offset=0&q=" + encodeURIComponent(query), function (data) {
        resultListModule.mergeResults(data, 1);

            // ask all the data
            if(data.count > recordsPerPage) {
              const steps = Math.floor(data.count/recordsPerPage);

              for(let i=1; i<= steps; i++) {
                setTimeout(() => { //delay each API call with 0.1 seconds
                  $.get("https://api.gbif.org/v1/occurrence/search?advanced=1&basis_of_record=PRESERVED_SPECIMEN&publishing_country=AT&limit=" + recordsPerPage + "&offset=" + i * recordsPerPage + "&scientificName=" + encodeURIComponent(query), function (data) {
                    resultListModule.pushResults(data, 1);
                    
                    if(i == steps) $("#resultLoadingGBIF").hide();
                  });
                }, i*100);
              }
            } 
             
            $("#resultLoadingGBIF").hide(); //remove this
          });

       
          $("#resultLoadingGeocase").show();
      $.get("https://api.geocase.eu/v1/solr?sort=id%20asc&start=" + (searchPage - 1) * recordsPerPage + "&rows=" + recordsPerPage + "&q=" + encodeURIComponent(query), function (data) {
        resultListModule.mergeResults(data, 2); // Merge the results into the result list module
        $("#resultLoadingGeocase").hide(); // Hide the loading indicator for Geocase
      });

      // Perform a search on the OSCA local data module
      $("#resultLoadingOSCA").show(); // Show the loading indicator for OSCA
      localDataModule.search(query, 'asc', searchPage - 1, recordsPerPage, '', function (results) {
        resultListModule.mergeResults(results, 3); // Merge the results into the result list module
        $("#resultLoadingOSCA").hide(); // Hide the loading indicator for OSCA
      });

      // Perform a search on the Europeana API
      $("#resultLoadingEuropeana").show(); // Show the loading indicator for Europeana
      $.get("https://api.europeana.eu/record/v2/search.json?start=1&rows=" + (Math.floor(Math.random() * 21) + 80) + "&wskey=laniciri&query=" + encodeURIComponent(query), function (data) {
        resultListModule.mergeResults(data, 5); // Merge the results into the result list module
        $("#resultLoadingEuropeana").hide(); // Hide the loading indicator for Europeana
      });

      // Perform a search on the DiSSCo API
      $("#resultLoadingDissco").show(); // Show the loading indicator for DiSSCo
      $.get("https://sandbox.dissco.tech/api/digital-specimen/v1/search?pageSize=25&pageNumber=1&q=" + encodeURIComponent(query), function (data) {
        resultListModule.mergeResults(data, 6); // Merge the results into the result list module
        $("#resultLoadingDissco").hide(); // Hide the loading indicator for DiSSCo
      });
    }
  }

  // Expose only the necessary functions
  return {
    init: init, // Expose the init function
    search: search // Expose the search function
  };
})();