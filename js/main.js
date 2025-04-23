// Global variables
let searchSourceSelectedValue = 1; // Default search source value
let searchQuery = 'Cochlostoma'; // Default search query
let searchPage = 1; // Default search page
let showProjectStats = false; // Flag to show project statistics modal

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

// Function to set the 'view' parameter in local storage
function setViewParameter(view) {
    localStorage.setItem('view', view);
}

// Function to hide the project statistics modal
function hideProjectStats() {
    let projectStatsModal = $("#project-stats-modal");
    projectStatsModal.addClass('hidden'); // Add 'hidden' class to hide the modal
}

// Function to toggle the visibility of result cards based on the search source and value
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

    // Retrieve URL parameters and set default values if not present
    searchQuery = decodeURIComponent(getUrlVars()['q'] ? getUrlVars()['q'] : searchQuery);
    searchPage = parseInt(getUrlVars()['page'] ? getUrlVars()['page'] : searchPage);
    searchSourceSelectedValue = parseInt(getUrlVars()['source'] ? getUrlVars()['source'] : searchSourceSelectedValue);

    // Set the initial search source selection
    $('input[name="search-source"][value="' + searchSourceSelectedValue + '"]').prop('checked', true);
    $('#searchQuery').val(searchQuery);

    // Perform the initial search and display results
    searchModule.search(searchQuery, searchSourceSelectedValue);
    resultListModule.showResults();

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
        url: "./data/osca-in-numbers.tsv?v=3", // URL of the TSV file
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
            <div class="w-full text-center text-sm p-4">
                Das OSCA-Konsortium besteht derzeit aus 12 Institutionen aus ganz Österreich, die bio- und geowissenschaftliche Sammlungen bewahren, entwickeln, erforschen und für die Öffentlichkeit sichtbar machen. Diese Statistiken veranschaulichen unseren Prozess und unsere Aufwandsverteilung
            </div>
            <div class="w-full grid grid-cols-5 gap-4 p-4">
                <!-- Preparation statistics -->
                <div class="bg-gray-50 shadow rounded-lg text-center text-sm p-2 flex flex-col">
                    <span class="font-semibold"> 1. Vorbereitung <br> <br> </span>
                    <div class="w-full bg-p-green-100 text-center p-2 rounded-lg mb-2 mt-4">
                        <p class="text-3xl my-3 text-gray-800">${oscaInNumbers.preparation.total}</p>
                        <p>Vorbereitete Objekte</p>
                    </div>
                    <!-- Additional preparation statistics -->
                    <div class="w-full text-center grid grid-cols-3 gap-2 mb-2 text-xs">
                        <div class="bg-p-green-100 text-center py-4 rounded-lg">
                            <p class="text-lg my-3 text-gray-800">${oscaInNumbers.preparation.mollusks}</p>
                            <p>Mollusken </p>
                        </div>
                        <div class="bg-p-green-100 text-center py-4 rounded-lg">
                            <p class="text-lg my-3 text-gray-800">${oscaInNumbers.preparation.endemics}</p>
                            <p>Endemiten </p>
                        </div>
                        <div class="bg-p-green-100 text-center py-4 rounded-lg">
                            <p class="text-lg my-3 text-gray-800">${oscaInNumbers.preparation.others}</p>
                            <p>Sonstige </p>
                        </div>
                    </div>
                    <!-- Dry and wet specimen statistics -->
                    <div class="w-full text-center grid grid-cols-2 gap-2 mb-2 text-xs">
                        <div class="bg-p-green-100 text-center py-4 rounded-lg">
                            <p class="text-2xl my-3 text-gray-800">${oscaInNumbers.preparation.dry_specs}</p>
                            <p>Trockene Probe </p>
                        </div>
                        <div class="bg-p-green-100 text-center py-4 rounded-lg">
                            <p class="text-2xl my-3 text-gray-800">${oscaInNumbers.preparation.wet_sepcs}</p>
                            <p>Feuchte Probe </p>
                        </div>
                    </div>
                </div>
                <!-- Additional sections for cataloging, digitization, OSCA portal, and integration -->
                <!-- (Similar structure as above, omitted for brevity) -->
            </div>
        `);

        // Create a chart for OSCA digitization trends
        const trendLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul'];
        const trendData = {
            labels: trendLabels,
            datasets: [{
                label: 'Monthly Exposure Trend',
                data: [65, 59, 80, 81, 56, 55, 40],
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            }]
        };

        const ctx = document.getElementById('oscaDigitizationTrend').getContext('2d');
        const myChart = new Chart(ctx, {
            type: 'line',
            data: trendData,
            options: {
                plugins: {
                    showLines: false,
                    legend: {
                        display: false,
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

