let searchModule = (function () {
  function init() {
    // Initialization code for the search module
    $('#searchButton').on('click', function () {
      searchQuery = $('#searchQuery').val();
      searchPage = 1;
      $('input:checkbox').prop('checked', true); //check all search-sources
      $('.result-count').text(''); //reset result counters
      search(searchQuery, searchSourceSelectedValue);
    });

    $('#searchQuery').on('keypress', function (event) {
      if (event.key === 'Enter') {
        searchQuery = $('#searchQuery').val();
        searchPage = 1;
        $('input:checkbox').prop('checked', true); //check all search-sources
        $('.result-count').text(''); //reset result counters
        search(searchQuery, searchSourceSelectedValue);
      }
    });
  }


  //search microservice
  function search(query, searchSource) {
    currentResults = [];
    recordsPerPage = 300;
    
    if (query) { 
          $("#resultLoadingGBIF").show();        //&publishing_country=AT
          $.get("https://api.gbif.org/v1/occurrence/search?advanced=1&basis_of_record=PRESERVED_SPECIMEN&country=AT&limit=" + recordsPerPage + "&offset=0&q=" + encodeURIComponent(query), function (data) {
            resultListModule.mergeResults(data, 1);

            // ask all the data
            /*
            if(data.count > recordsPerPage) {
              const steps = Math.floor(data.count/recordsPerPage);

              for(let i=1; i<= steps; i++) {
                setTimeout(() => { //delay each API call with 0.1 seconds
                  $.get("https://api.gbif.org/v1/occurrence/search?advanced=1&basis_of_record=PRESERVED_SPECIMEN&publishing_country=AT&limit=" + recordsPerPage + "&offset=" + i * recordsPerPage + "&scientificName=" + encodeURIComponent(query), function (data) {
                    resultListModule.mergeResults(data, 1);
                    
                    if(i == steps) $("#resultLoadingGBIF").hide();
                  });
                }, i*100);
              }
            } 
            */ 
           
            $("#resultLoadingGBIF").hide(); //remove this
          });

       
          $("#resultLoadingGeocase").show();
          $.get("https://api.geocase.eu/v1/solr?sort=id%20asc&start=" + (searchPage - 1) * recordsPerPage + "&rows=" + recordsPerPage + "&q=" + encodeURIComponent(query), function (data) {
            resultListModule.mergeResults(data, 2);
            $("#resultLoadingGeocase").hide();
          });
         
          $("#resultLoadingOSCA").show();
          localDataModule.search(query, 'asc', searchPage-1, recordsPerPage,'', function (results) {
            resultListModule.mergeResults(results, 3);
            $("#resultLoadingOSCA").hide();
          });

          $("#resultLoadingEuropeana").show();
          $.get("https://api.europeana.eu/record/v2/search.json?start=1&rows="+ (Math.floor(Math.random() * 21) + 80) +"&wskey=laniciri&query=" + encodeURIComponent(query), function (data) {
            resultListModule.mergeResults(data, 5);
            $("#resultLoadingEuropeana").hide();
          });

          
          $("#resultLoadingDissco").show();      //https://sandbox.dissco.tech/api/v1/specimens/search
          $.get("https://sandbox.dissco.tech/api/digital-specimen/v1/search?pageSize=25&pageNumber=1&q=" + encodeURIComponent(query), function(data) {
            resultListModule.mergeResults(data, 6);
            $("#resultLoadingDissco").hide();
          });
    }

  };

  // Expose only the necessary functions
  return {
    init: init,
    search: search
  };
})();