// Define the searchModule as an Immediately Invoked Function Expression (IIFE)
let searchModule = (function () {

  // Function to initialize the search module
  function init() {
    // Attach a click event handler to the search button
    $('#searchButton').on('click', function () {
      searchQuery = $('#searchQuery').val(); // Get the search query from the input field
      searchPage = 1; // Reset the search page to the first page
      // $('input:checkbox').prop('checked', true); // Check all search sources
      $('.result-count').text(''); // Reset result counters
      filtersModule.clearFilters();

      search(searchQuery, searchSourceSelectedValue); // Perform the search
    });

    // Attach a keypress event handler to the search input field
    $('#searchQuery').on('keypress', function (event) {
      if (event.key === 'Enter') { // Check if the Enter key was pressed
        searchQuery = $('#searchQuery').val(); // Get the search query from the input field
        searchPage = 1; // Reset the search page to the first page
        // $('input:checkbox').prop('checked', true); // Check all search sources
        $('.result-count').text(''); // Reset result counters
        filtersModule.clearFilters();

        search(searchQuery, searchSourceSelectedValue); // Perform the search
      }
    });
  }


  /**
     * Performs a search across all sources
     * @param {string} query - The search words inputted by the user (can be scientific name or verbatim name).
     */
  function search(query) {
    currentResults = []; // Reset the current results array
    recordsPerPage = 300; // Set the number of records per page

    if (query) { // Check if a query is provided
      console.log('query', query);

      // Cancel all previous requests
      pendingSearchRequests.forEach(req => req.abort());
      pendingSearchRequests = [];

      $("#resultLoadingGBIF").hide(); // Hide the loading indicator for GBIF
      $("#resultLoadingGeocase").hide(); // Hide the loading indicator for Geocase
      $("#resultLoadingOSCA").hide(); // Hide the loading indicator for OSCA
      $("#resultLoadingEuropeana").hide(); // Hide the loading indicator for Europeana
      $("#resultLoadingDissco").hide(); // Hide the loading indicator for DiSSCo


      if ($('#search-source-osca').prop('checked')) { // Perform a search on the OSCA local data module
    
        $("#resultLoadingOSCA").show(); // Show the loading indicator for OSCA
        localDataModule.search(query, 'asc', searchPage - 1, recordsPerPage, '', function (results) {
          resultListModule.mergeResults(results, 3, query); // Merge the results into the result list module
          $("#resultLoadingOSCA").hide(); // Hide the loading indicator for OSCA
        });
        

      
        const jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhcGlfa2V5XzEiLCJpc3MiOiJkYXRhLm9zY2Euc2NpZW5jZSIsImF1ZCI6ImRhdGEub3NjYS5zY2llbmNlIiwiZXhwIjoxNzc2NTA3NzIzLCJpYXQiOjE3NzU2NDM3MjMsInNjb3BlIjoic2VhcmNoOnJlYWQiLCJhcGlfa2V5X2lkIjoxLCJkb21haW4iOiI0Ni4xMDEuMjE0LjI1In0.XLNMV8NlE01fi8hJeFBqQeX_zKB47WJcpQF5wON92mE';
       
        
        const cacheQuery = "SELECT * FROM data WHERE LOWER(scientificName) LIKE '%" + query + "%'"
        $.ajax({
          url: 'https://data.osca.science/api/search?q=' + encodeURIComponent(cacheQuery),
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + jwtToken
          },
          success: function (response) {
            console.log('Success:', response);
            resultListModule.mergeResults(response.data, 7, query); // Merge the results into the result list module
          },
          error: function (xhr, status, error) {
            console.error('Error:', error);
          }
        });


      }

      /*

      if ($('#search-source-gbif').prop('checked')) { // Perform a search on the GBIF API
        $("#resultLoadingGBIF").show(); // Show the loading indicator for GBIF
        const reqGBIF = $.get("https://api.gbif.org/v1/occurrence/search?advanced=1&basis_of_record=PRESERVED_SPECIMEN&publishing_country=AT&offset=0&limit=" + recordsPerPage + "&q=" + encodeURIComponent(query), function (data) {
          resultListModule.mergeResults(data, 1, query);

          // ask all the data
          if (data.count > recordsPerPage) {
            const steps = Math.floor(data.count / recordsPerPage);

            for (let i = 1; i <= steps; i++) {
              setTimeout(() => { //delay each API call with 0.1 seconds
                pendingSearchRequests.push($.get("https://api.gbif.org/v1/occurrence/search?advanced=1&basis_of_record=PRESERVED_SPECIMEN&publishing_country=AT&limit=" + recordsPerPage + "&offset=" + i * recordsPerPage + "&q=" + encodeURIComponent(query), function (data) {
                  resultListModule.pushResults(data, 1, query);
                  if (i == steps) $("#resultLoadingGBIF").hide();
                }));
              }, i * 300);
            }
          } else {
            $("#resultLoadingGBIF").hide(); // Hide the loading indicator for GBIF
          }
        }).fail(function () {
          $("#resultLoadingGBIF").hide(); // Hide the loading indicator for GBIF
          $('#resultCountGBIF').css('color', 'red');
        });

        pendingSearchRequests.push(reqGBIF);
      }


      if ($('#search-source-geocase').prop('checked')) { // Perform a search on the GeoCASE API
        $("#resultLoadingGeocase").show();
        const reqGeoCase = $.get("https://api.geocase.eu/v1/solr?sort=id%20asc&start=" + (searchPage - 1) * recordsPerPage + "&rows=" + recordsPerPage + "&q=" + encodeURIComponent(query), function (data) {
          resultListModule.mergeResults(data, 2, query); // Merge the results into the result list module
          $("#resultLoadingGeocase").hide(); // Hide the loading indicator for Geocase
        }).fail(function () {
          $("#resultLoadingGeocase").hide(); // Hide the loading indicator for Geocase
          $('#resultCountGeocase').css('color', 'red');
        });

        pendingSearchRequests.push(reqGeoCase);
      }


      if ($('#search-source-europeana').prop('checked')) { // Perform a search on the Europeana API
        $("#resultLoadingEuropeana").show(); // Show the loading indicator for Europeana
        const reqEuropeana = $.get("https://api.europeana.eu/record/v2/search.json?wskey=laniciri&theme=nature&qf=where:Austria&start=1&rows=" + (Math.floor(Math.random() * 21) + 80) + "&query=" + encodeURIComponent(query), function (data) {
          resultListModule.mergeResults(data, 5, query); // Merge the results into the result list module
          $("#resultLoadingEuropeana").hide(); // Hide the loading indicator for Europeana
        }).fail(function () {
          $("#resultLoadingEuropeana").hide(); // Hide the loading indicator for Europeana
          $('#resultCountEuropeana').css('color', 'red');
        });

        pendingSearchRequests.push(reqEuropeana);
      }

      if ($('#search-source-dissco').prop('checked')) { // Perform a search on the DiSSCo API
        $("#resultLoadingDissco").show(); // Show the loading indicator for DiSSCo https://sandbox.dissco.tech/api/digital-specimen/v1/search?q=
        //  https://disscover.dissco.eu/api/digital-specimen/v1/search?pageSize=100&pageNumber=1&q=
        const reqDissco = $.get("https://disscover.dissco.eu/api/digital-specimen/v1/search?pageSize=100&pageNumber=1&q=" + encodeURIComponent(query), function (data) {
          resultListModule.mergeResults(data, 6, query); // Merge the results into the result list module
          $("#resultLoadingDissco").hide(); // Hide the loading indicator for DiSSCo
        }).fail(function () {
          $("#resultLoadingDissco").hide(); // Hide the loading indicator for DiSSCo
          $('#resultCountDissco').css('color', 'red');
        });
        
        pendingSearchRequests.push(reqDissco);
      }

      */
    
    }
  }


  // Expose only the necessary functions
  return {
    init: init, // Expose the init function
    search: search // Expose the search function
  };
})();