// Global variables
let searchSourceSelectedValue = 1; // Default search source value
let searchQuery = 'braya'; // Default search query e.g: 'Braya'
let searchPage = 1; // Default search page
let showProjectStats = false; // Flag to show project statistics modal

let pendingSearchRequests = []; // Array of promisses for search requests
let currentResults = []; // Array to store current search results
let recordsPerPage = 1000; // Number of records to display per page

// Function to parse URL query parameters and return them as an associative array
function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

// Function to retrieve the 'view' parameter from local storage
function getViewParameter() {
    return localStorage.getItem('view');
}
/**
* Function to set the 'view' parameter in local storage
* @param {string} view - The value to set for the 'view' parameter
*/
function setViewParameter(view) {
    localStorage.setItem('view', view);
}

// Function to hide the project statistics modal
function hideProjectStats() {
    let projectStatsModal = $("#project-stats-modal");
    projectStatsModal.addClass('hidden'); // Add 'hidden' class to hide the modal
}

/** 
* Function to toggle the visibility of result cards based on the search source and value
* @param {string} searchSource - The source of the search (e.g., '1', '2', etc.)
* @param {boolean} value - Whether to show (true) or hide (false) the result cards
*/
function toggleResultCards(searchSource, value) {
    switch (searchSource) {
        case '1': 
            value ? $('.gbifResultCard').show() : $('.gbifResultCard').hide();
            break;
        case '2': 
            value ? $('.geocaseResultCard').show() : $('.geocaseResultCard').hide();
            break;
        case '3': 
            value ? $('.oscaResultCard').show() : $('.oscaResultCard').hide();
            break;
        case '5': 
            value ? $('.europeanaResultCard').show() : $('.europeanaResultCard').hide();
            break;
        case '6': 
            value ? $('.disscoResultCard').show() : $('.disscoResultCard').hide();
            break;
        case 'hm': 
            !value ? $('.hideMedia').show() : $('.hideMedia').hide();
            break;
    }
}

// Document ready function to initialize modules and set up event handlers
$(document).ready(function () {
    // Initialize various modules
    localDataModule.init();
    searchModule.init();
    resultListModule.init();
    filtersModule.init();
    resultDetailsModule.init();

    // Attach a click event handler to the search source radio buttons
    $('input[name="search-source"]').on('click', function () {
        searchSourceSelectedValue = parseInt($('input[name="search-source"]:checked').val());
    });

    // Set the initial search source selection
    $('input[name="search-source"][value="' + searchSourceSelectedValue + '"]').prop('checked', true);
    $('#searchQuery').val(searchQuery);

    // Perform the initial search and display results
    searchModule.search(searchQuery, searchSourceSelectedValue);
    
    // Load project statistics if the flag is set
    if (showProjectStats) {
        loadProjectStatus();
    }
});

// Event handler for links with href starting with '#'
$(document).on('click', 'a[href^="#"]', function (e) {
    var id = $(this).attr('href'); // Get the target element ID
    var $id = $(id); // Get the target element
    if ($id.length === 0) {
        return; // Exit if the target element does not exist
    }
    e.preventDefault(); // Prevent default hash navigation
    var pos = $id.offset().top; // Get the top position of the target element
    $('body, html').animate({ scrollTop: pos }); // Smooth scroll to the target element
});

// Function to load project statistics and display the modal
function loadProjectStatus() {
    showOSCAInNumbers();
    $("#project-stats-modal").removeClass('hidden'); // Remove 'hidden' class to show the modal
}

// Function to fetch and process OSCA statistics from a TSV file
function showOSCAInNumbers() {
    $.ajax({
        type: "GET",
        url: "./data/osca-in-numbers.tsv?v=4", // URL of the TSV file
        dataType: "text",
        success: function (data) {
            processOSCAInNumbers(data); // Process the fetched data
        }
    });
}

// Function to process OSCA statistics and update the UI
function processOSCAInNumbers(data) {
    var numbers = data.split(/\r\n|\n/)[2].split('\t'); // Parse the TSV data
    if (numbers) {
        // Create an object to store OSCA statistics
        oscaInNumbers = {
            preparation: {
                total: numbers[1],
                endemics: numbers[2],
                mollusks: numbers[3],
                others: numbers[4],
                dry_specs: numbers[5],
                wet_sepcs: numbers[6]
            },
            cataloging: {
                total: numbers[7],
                mids0: numbers[8],
                mids1: numbers[9],
                mids2: numbers[10],
                mids3: numbers[11]
            },
            digitization: {
                total: numbers[12],
                one_pic: numbers[13],
                pic_gallery: numbers[14],
                multimedia: numbers[15]
            },
            osca_portal: {
                total: numbers[16],
                endemics: numbers[17],
                mollusks: numbers[18],
                others: numbers[19]
            },
            integration: {
                total: numbers[20],
                overview: numbers[21]
            }
        };

        // Update the UI with the processed statistics
        $('#oscaInNumbersPopup').html(`
            <div class="w-full text-center text-sm p-4" data-i18n="app.inNumbers.subtitle">
                    Das OSCA-Konsortium besteht derzeit aus 15 Institutionen aus ganz Österreich, die bio- und geowissenschaftliche Sammlungen bewahren, entwickeln, erforschen und für die Öffentlichkeit sichtbar machen. Diese Statistiken veranschaulichen unseren Prozess und unsere Aufwandsverteilung
                </div>
                <div class="w-full grid grid-cols-5 gap-4 p-4">
                    <div class="bg-gray-50 shadow rounded-lg text-center text-sm p-2 flex flex-col">
                        <span class="font-semibold"> <span data-i18n="app.inNumbers.preparation.title">1. Vorbereitung</span> <br> <br> </span>
                        <div class="w-full bg-p-green-100 text-center p-2 rounded-lg mb-2 mt-4">
                            <p class="text-3xl my-3 text-gray-800">${oscaInNumbers.preparation.total}</p>
                            <p data-i18n="app.inNumbers.preparation.totalObjects"> Vorbereitete Objekte </p>
                        </div>
                        <div class="w-full text-center grid grid-cols-2 gap-2 mb-4">
                            <div class="bg-p-green-100 text-center py-4 rounded-lg">
                                <p class="text-2xl my-3 text-gray-800">${oscaInNumbers.preparation.mollusks}</p>
                                <p data-i18n="app.inNumbers.preparation.mollusks"> Molluska </p>
                            </div>
                            <div class="bg-p-green-100 text-center py-4 rounded-lg">
                                <p class="text-2xl my-3 text-gray-800">${oscaInNumbers.preparation.endemics}</p>
                                <p data-i18n="app.inNumbers.preparation.endemics"> Endemiten </p>
                            </div>
                        </div>
                        <div class="w-full text-center grid grid-cols-2 gap-2 mb-2">
                            <div class="bg-p-green-100 text-center py-4 rounded-lg">
                                <p class="text-2xl my-3 text-gray-800">${oscaInNumbers.preparation.dry_specs}</p>
                                <p data-i18n="app.inNumbers.preparation.drySpecimen"> Trockenprobe </p>
                            </div>
                            <div class="bg-p-green-100 text-center py-4 rounded-lg">
                                <p class="text-2xl my-3 text-gray-800">${oscaInNumbers.preparation.wet_sepcs}</p>
                                <p data-i18n="app.inNumbers.preparation.wetSpecimen"> Nassprobe </p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-50 shadow rounded-lg text-center text-sm p-2 flex flex-col">
                        <span class="font-semibold"> <span data-i18n="app.inNumbers.cataloging.title">2. Metadaten Katalogierung</span> <br> <br> </span>
                        <div class="w-full bg-p-green-100 text-center p-2 rounded-lg mb-2 mt-4">
                            <p class="text-3xl my-3 text-gray-800">${oscaInNumbers.cataloging.total}</p>
                            <p data-i18n="app.inNumbers.cataloging.totalObjects"> Katalogisierte Objekte </p>
                        </div>
                        <div class="w-full bg-p-green-100 rounded-lg text-center grid grid-cols-2 gap-2 mb-2">
                            <div class="text-center px-2">
                                <p class="text-lg my-3 text-gray-800">${oscaInNumbers.cataloging.mids0}</p>
                            </div>
                            <div class="text-center px-2">
                                <p class="text-xs my-3" data-i18n="app.inNumbers.cataloging.mids0"> MIDS Stufe 0 </p>
                            </div>
                        </div>
                        <div class="w-full bg-p-green-100 rounded-lg text-center grid grid-cols-2 gap-2 mb-2">
                            <div class="text-center px-2">
                                <p class="text-lg my-3 text-gray-800">${oscaInNumbers.cataloging.mids1}</p>
                            </div>
                            <div class="text-center px-2">
                                <p class="text-xs my-3" data-i18n="app.inNumbers.cataloging.mids1"> MIDS Stufe 1 </p>
                            </div>
                        </div>
                        <div class="w-full bg-p-green-100 rounded-lg text-center grid grid-cols-2 gap-2 mb-2">
                            <div class="text-center px-2">
                                <p class="text-lg my-3 text-gray-800">${oscaInNumbers.cataloging.mids2}</p>
                            </div>
                            <div class="text-center px-2">
                                <p class="text-xs my-3" data-i18n="app.inNumbers.cataloging.mids2"> MIDS Stufe 2 </p>
                            </div>
                        </div>
                        <div class="w-full bg-p-green-100 rounded-lg text-center grid grid-cols-2 gap-2 mb-2">
                            <div class="text-center px-2">
                                <p class="text-lg my-3 text-gray-800">${oscaInNumbers.cataloging.mids3}</p>
                            </div>
                            <div class="text-center px-2">
                                <p class="text-xs my-3" data-i18n="app.inNumbers.cataloging.mids3"> MIDS Stufe 3 </p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-50 shadow rounded-lg text-center text-sm p-2 flex flex-col">
                        <span class="font-semibold"> <span data-i18n="app.inNumbers.digitizing.title">3. Digitalisierung</span> <br> <br> </span>
                        <div class="w-full bg-p-green-100 text-center p-2 rounded-lg mb-2 mt-4">
                            <p class="text-3xl my-3 text-gray-800">${oscaInNumbers.digitization.total}</p>
                            <p data-i18n="app.inNumbers.digitizing.totalObjects"> Digitalisierte Objekte </p>
                        </div>
                        <div class="w-full bg-p-green-100 rounded-lg text-center grid grid-cols-2 gap-2 mb-3 py-2">
                            <div class="text-center px-2">
                                 <p class="text-xl my-3 text-gray-800">${oscaInNumbers.digitization.one_pic}</p>
                            </div>
                            <div class="text-center px-2">
                                <p class="text-xs my-3" data-i18n="app.inNumbers.digitizing.onePic"> Mindestens ein Bild </p>
                            </div>
                        </div>
                        <div class="w-full bg-p-green-100 rounded-lg text-center grid grid-cols-2 gap-2 mb-3 py-2">
                            <div class="text-center px-2">
                                 <p class="text-xl my-3 text-gray-800">${oscaInNumbers.digitization.pic_gallery}</p>
                            </div>
                            <div class="text-center px-2">
                                <p class="text-xs my-3" data-i18n="app.inNumbers.digitizing.picGallery"> Mit Bildergalerie </p>
                            </div>
                        </div>
                        <div class="w-full bg-p-green-100 rounded-lg text-center grid grid-cols-2 gap-2 mb-3 py-2">
                            <div class="text-center px-2">
                                 <p class="text-xl my-3 text-gray-800">${oscaInNumbers.digitization.multimedia}</p>
                            </div>
                            <div class="text-center px-2">
                                <p class="text-xs my-3" data-i18n="app.inNumbers.digitizing.multimedia"> Multimedia verfügbar </p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-50 shadow rounded-lg text-center text-sm p-2 flex flex-col">
                        <span class="font-semibold"> <span data-i18n="app.inNumbers.exposing.title">4. Verfügbar im OSCA-Portal</span> <br> <br> </span>
                        <div class="w-full bg-p-orange-100 text-center p-2 rounded-lg mb-2 mt-4">
                             <p class="text-3xl my-3 text-gray-800">${oscaInNumbers.osca_portal.total}</p>
                            <p data-i18n="app.inNumbers.exposing.totalObjects">Verfügbare Objekte</p>
                        </div>
                        
                        <div class="w-full bg-p-orange-100 rounded-lg text-center grid grid-cols-2 gap-2 mb-2">
                            <div class="text-center p-2">
                                <p class="text-2xl my-6 text-gray-800">${oscaInNumbers.osca_portal.endemics}</p>
                            </div>
                            <div class="text-center p-2">
                                <p class="text-base my-6" data-i18n="app.inNumbers.exposing.endemics"> Endemiten </p>
                            </div>
                        </div>
                        <div class="w-full bg-p-orange-100 rounded-lg text-center grid grid-cols-2 gap-2 mb-2">
                            <div class="text-center p-2">
                                <p class="text-2xl my-6 text-gray-800">${oscaInNumbers.osca_portal.mollusks}</p>
                            </div>
                            <div class="text-center p-2">
                                <p class="text-base my-6" data-i18n="app.inNumbers.exposing.mollusks"> Molluska </p>
                            </div>
                        </div>
                        
                    </div>
                    <div class="bg-gray-50 shadow rounded-lg text-center text-sm p-2 flex flex-col">
                        <span class="font-semibold" data-i18n="app.inNumbers.publishing.title"> 5. Integration/Verbreitung in internationalen Portalen  </span>
                        <div class="w-full bg-p-blue-100 text-center p-2 rounded-lg mb-2 mt-4">
                            <p class="text-3xl my-3 text-gray-800">${oscaInNumbers.integration.total}</p>
                            <p data-i18n="app.inNumbers.publishing.totalObjects">Veröffentlichte Objekte</p>
                        </div>
                        
                        <div class="w-full bg-p-blue-100 rounded-lg text-left text-md leading-relaxed mb-3 py-5 pl-3">
                            <p class="text-xl my-3 text-gray-800">${oscaInNumbers.integration.overview.replaceAll(',', '<br>')}</p>
                        </div>
                        
                    </div>
                </div>
            </div>
        `);

    }
    
    $('.app').localize();
}

