/**
 * A module for managing filters in the application. It provides functionality to toggle filters,
 * apply specific filters, and reset them.
 */

let filtersModule = (function () {
  let originalResults = [];

  // Toggles the visibility of the filters section and adjusts the grid layout accordingly.
  function init() {
    // Initialization code for the filters module
    $('#filter-toggle-button').show()
  }

  
  //Toggles the visibility of the filters section and adjusts the grid layout accordingly.
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

  /**
   * Renders the filters based on the selected search source.
   * @param {number} searchSource - The selected search source (1 for GBIF, 2 for GeoCase).
   */
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

  /**
   * Filters the results based on a strict search string.
   * @param {string} strictSerachString - The string to filter results by.
   */
  function filterByStrictSearch(strictSerachString) {
    if(originalResults.length < 1) {
      originalResults = currentResults;
    }
    
    if(currentResults.length > 1) {
      filteredResults = currentResults.filter(result => result.scientificName.toLowerCase().includes(strictSerachString.toLowerCase()));
      currentResults = filteredResults;
    }
  }

  /**
   * Filters the results based on the institute name.
   * @param {string} instituteString - The string to filter results by.
   */
  function filterByInstitute(instituteString) {
    if(currentResults.length > 1) {
      filteredResults = currentResults.filter(result => result.owner.toLowerCase().includes(instituteString.toLowerCase()));
      currentResults = filteredResults;
    }
  }

  /**
   * Filters the results based on the specimen type.
   * @param {string} specimenTypeString - The string to filter results by.
   */
  function filterBySpecimenType(specimenTypeString) {
    if(currentResults.length > 1) {
      filteredResults = currentResults.filter(result => result.owner.toLowerCase().includes(specimenTypeString.toLowerCase()));
      currentResults = filteredResults;
    }
  }

  /**
   * Filters the results based on the specimen ID.
   * @param {string} specimenIDString - The string to filter results by.
   */
  function filterBySpecimenID(specimenIDString) {
    if(currentResults.length > 1) {
      filteredResults = currentResults.filter(result => result.specimenID.toLowerCase().includes(specimenIDString.toLowerCase()));
      currentResults = filteredResults;
    }
  }

  /**
   * Applies multiple filters to the results based on the provided filter object.
   * @param {Object} filterObject - An object containing filter criteria.
   * @param {string} filterObject.instituteString - Filter by institute name.
   * @param {string} filterObject.specimenIDString - Filter by specimen ID.
   */
  function applyFilters(filterObject) {
    // Save the original results if not already saved
    if(originalResults.length < 1) {
      originalResults = currentResults;
    }

    // Apply individual filters
    filterByInstitute(filterObject.instituteString);
    filterBySpecimenID(filterObject.specimenIDString);
  }


  // Resets the filters and restores the original results.
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