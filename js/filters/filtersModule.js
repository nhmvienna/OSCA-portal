var filtersModule = (function () {
  let originalResults = [];

  function init() {
    // Initialization code for the filters module
    $('#filter-toggle-button').show()
  }

  function switchFilters() {
    $('#filters').toggle(1, function() {
      if($(this).is(':visible')) {
        $('#result-grid').removeClass('md:grid-cols-3');
        $('#result-grid').addClass('md:grid-cols-2');
  
        renderFilters(searchSourceSelectedValue);
      } else {
        $('#result-grid').removeClass('md:grid-cols-2');
        $('#result-grid').addClass('md:grid-cols-3');
      } 
    });
  }

  function renderFilters(searchSource) {
    switch (searchSource) {
      case 1: // search on GBIF 
        $('#filterSource').html('GBIF');
        break;

      case 2: // search on GeoCase
        $('#filterSource').html('GeoCase');
        break;
    }
  }

  function filterByStrictSearch(strictSerachString) {
    if(originalResults.length < 1) {
      originalResults = currentResults;
    }
    
    if(currentResults.length > 1) {
      filteredResults = currentResults.filter(result => result.scientificName.toLowerCase().includes(strictSerachString.toLowerCase()));
      currentResults = filteredResults;
    }
  }

  function filterByInstitute(instituteString) {
    if(currentResults.length > 1) {
      filteredResults = currentResults.filter(result => result.owner.toLowerCase().includes(instituteString.toLowerCase()));
      currentResults = filteredResults;
    }
  }

  function filterBySpecimenType(specimenTypeString) {
    if(currentResults.length > 1) {
      filteredResults = currentResults.filter(result => result.owner.toLowerCase().includes(specimenTypeString.toLowerCase()));
      currentResults = filteredResults;
    }
  }

  function filterBySpecimenID(specimenIDString) {
    if(currentResults.length > 1) {
      filteredResults = currentResults.filter(result => result.specimenID.toLowerCase().includes(specimenIDString.toLowerCase()));
      currentResults = filteredResults;
    }
  }
  function applyFilters(filterObject) {

    if(originalResults.length < 1) {
      originalResults = currentResults;
    }

    console.log('Filter Object');
    console.dir(filterObject);

    filterByInstitute(filterObject.instituteString);
    filterBySpecimenID(filterObject.specimenIDString);
  }

  function resetFilters() {
    if(originalResults.length>0) {
      currentResults = originalResults;
    }
  }

  // Expose only the necessary functions
  return {
    init: init,
    switchFilters: switchFilters,
    filterByStrictSearch: filterByStrictSearch,
    applyFilters: applyFilters,
    resetFilters: resetFilters

  };
})();