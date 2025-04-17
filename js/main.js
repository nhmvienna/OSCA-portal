
let searchSourceSelectedValue = 1
let searchQuery = 'Cochlostoma';
let searchPage = 1;
let showProjectStats = false;

let currentResults = [];
let recordsPerPage = 1000;


// Read a page's GET URL variables and return them as an associative array.
function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

// Function to get the 'view' parameter from local storage
function getViewParameter() {
    return localStorage.getItem('view');
  }

// Function to set the 'view' parameter in local storage
function setViewParameter(view) {
    localStorage.setItem('view', view);
  }

function hideProjectStats() {
    let projectStatsModal = $("#project-stats-modal");
    projectStatsModal.addClass('hidden'); //hide modal
};

function toggleResultCards(searchSource, value){
    switch(searchSource){
        case '1': 
            value? $('.gbifResultCard').show(): $('.gbifResultCard').hide() 
            break;
        case '2': 
            value? $('.geocaseResultCard').show(): $('.geocaseResultCard').hide()
             break;
        case '3': 
            value? $('.oscaResultCard').show(): $('.oscaResultCard').hide()
         break;

        case '5': 
            value? $('.europeanaResultCard').show(): $('.europeanaResultCard').hide()
         break;

        case '6': 
         value? $('.disscoResultCard').show(): $('.disscoResultCard').hide()
        break;

         case 'hm': 
            !value? $('.hideMedia').show(): $('.hideMedia').hide()
         break;
    }
}

$(document).ready(function () {
    // Initialize modules
    localDataModule.init();
    searchModule.init();
    resultListModule.init();
    filtersModule.init();
    resultDetailsModule.init();

    // Attach a click event handler to the radio buttons
    $('input[name="search-source"]').on('click', function () {
        // Get the value of the selected radio button
        searchSourceSelectedValue = parseInt($('input[name="search-source"]:checked').val());
    });

    // Get URL parameters
    searchQuery = decodeURIComponent(getUrlVars()['q']?getUrlVars()['q']: searchQuery);
    searchPage = parseInt(getUrlVars()['page']?getUrlVars()['page']: searchPage);
    searchSourceSelectedValue = parseInt(getUrlVars()['source']?getUrlVars()['source']: searchSourceSelectedValue);

    // Set initial source selection
    $('input[name="search-source"][value="'+ searchSourceSelectedValue +'"]').prop('checked', true);
    $('#searchQuery').val(searchQuery);

    // Search for the Default Value
    searchModule.search(searchQuery, searchSourceSelectedValue);
    resultListModule.showResults();

    //OSCA in Numbers
    if(showProjectStats) {
        loadProjectStatus()
    }

    
});

// handle links with @href started with '#' only
$(document).on('click', 'a[href^="#"]', function (e) {
    // target element id
    var id = $(this).attr('href');

    // target element
    var $id = $(id);
    if ($id.length === 0) {
        return;
    }

    // prevent standard hash navigation (avoid blinking in IE)
    e.preventDefault();

    // top position relative to the document
    var pos = $id.offset().top;

    // animated top scrolling
    $('body, html').animate({ scrollTop: pos });
});

function loadProjectStatus() {
    showOSCAInNumbers();
    $("#project-stats-modal").removeClass('hidden');
}

function showOSCAInNumbers(){
    $.ajax({
        type: "GET",
        url: "./data/osca-in-numbers.tsv?v=3",
        dataType: "text",
        success: function (data) {
          processOSCAInNumbers(data);
        }
      });
}

function processOSCAInNumbers(data) {
    var numbers = data.split(/\r\n|\n/)[2].split('\t');;
    // data is found in data[2]
    if(numbers) {
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
          osca_portal:{
            total: numbers[16],
            endemics: numbers[17],
            mollusks: numbers[18],
            others: numbers[19]
          },
          integration: {
            total: numbers[20],
            overview: numbers[21]
          }
      }

      $('#oscaInNumbersPopup').html(`
                <div class="w-full text-center text-sm p-4">
                    Das OSCA-Konsortium besteht derzeit aus 12 Institutionen aus ganz Österreich, die bio- und geowissenschaftliche Sammlungen bewahren, entwickeln, erforschen und für die Öffentlichkeit sichtbar machen. Diese Statistiken veranschaulichen unseren Prozess und unsere Aufwandsverteilung
                </div>
                <div class="w-full grid grid-cols-5 gap-4 p-4">
                    <div class="bg-gray-50 shadow rounded-lg text-center text-sm p-2 flex flex-col">
                        <span class="font-semibold"> 1. Vorbereitung <br> <br> </span>
                        <div class="w-full bg-p-green-100 text-center p-2 rounded-lg mb-2 mt-4">
                            <p class="text-3xl my-3 text-gray-800">${oscaInNumbers.preparation.total}</p>
                            <p>Vorbereitete Objekte</p>
                        </div>
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
                    <div class="bg-gray-50 shadow rounded-lg text-center text-sm p-2 flex flex-col">
                        <span class="font-semibold"> 2. Katalogisierung von Metadaten <br> </span>
                        <div class="w-full bg-p-green-100 text-center p-2 rounded-lg mb-2 mt-4">
                            <p class="text-3xl my-3 text-gray-800">${oscaInNumbers.cataloging.total}</p>
                            <p> Katalogisierte Objekte </p>
                        </div>
                        <div class="w-full bg-p-green-100 rounded-lg text-center grid grid-cols-2 gap-2 mb-2">
                            <div class="text-center px-2">
                                <p class="text-lg my-3 text-gray-800">${oscaInNumbers.cataloging.mids0}</p>
                            </div>
                            <div class="text-center px-2">
                                <p class="text-xs my-3">MIDS <br> Stufe 0 </p>
                            </div>
                        </div>
                        <div class="w-full bg-p-green-100 rounded-lg text-center grid grid-cols-2 gap-2 mb-2">
                            <div class="text-center px-2">
                                <p class="text-lg my-3 text-gray-800">${oscaInNumbers.cataloging.mids1}</p>
                            </div>
                            <div class="text-center px-2">
                                <p class="text-xs my-3">MIDS <br> Stufe 1 </p>
                            </div>
                        </div>
                        <div class="w-full bg-p-green-100 rounded-lg text-center grid grid-cols-2 gap-2 mb-2">
                            <div class="text-center px-2">
                                <p class="text-lg my-3 text-gray-800">${oscaInNumbers.cataloging.mids2}</p>
                            </div>
                            <div class="text-center px-2">
                                <p class="text-xs my-3">MIDS <br> Stufe 2 </p>
                            </div>
                        </div>
                        <div class="w-full bg-p-green-100 rounded-lg text-center grid grid-cols-2 gap-2 mb-2">
                            <div class="text-center px-2">
                                <p class="text-lg my-3 text-gray-800">${oscaInNumbers.cataloging.mids3}</p>
                            </div>
                            <div class="text-center px-2">
                                <p class="text-xs my-3">MIDS <br> Stufe 3 </p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-50 shadow rounded-lg text-center text-sm p-2 flex flex-col">
                        <span class="font-semibold"> 3. Digitalisierung <br> <br> </span>
                        <div class="w-full bg-p-green-100 text-center p-2 rounded-lg mb-2 mt-4">
                            <p class="text-3xl my-3 text-gray-800">${oscaInNumbers.digitization.total}</p>
                            <p> Digitalisierte Objekte </p>
                        </div>
                        <div class="w-full bg-p-green-100 rounded-lg text-center grid grid-cols-2 gap-2 mb-3 py-2">
                            <div class="text-center px-2">
                                 <p class="text-xl my-3 text-gray-800">${oscaInNumbers.digitization.one_pic}</p>
                            </div>
                            <div class="text-center px-2">
                                <p class="text-xs my-3">Min. ein <br> Bild </p>
                            </div>
                        </div>
                        <div class="w-full bg-p-green-100 rounded-lg text-center grid grid-cols-2 gap-2 mb-3 py-2">
                            <div class="text-center px-2">
                                 <p class="text-xl my-3 text-gray-800">${oscaInNumbers.digitization.pic_gallery}</p>
                            </div>
                            <div class="text-center px-2">
                                <p class="text-xs my-3"> Bilder <br> Galerie </p>
                            </div>
                        </div>
                        <div class="w-full bg-p-green-100 rounded-lg text-center grid grid-cols-2 gap-2 mb-3 py-2">
                            <div class="text-center px-2">
                                 <p class="text-xl my-3 text-gray-800">${oscaInNumbers.digitization.multimedia}</p>
                            </div>
                            <div class="text-center px-2">
                                <p class="text-xs my-3"> Multimedia <br> Verfügbar </p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-50 shadow rounded-lg text-center text-sm p-2 flex flex-col">
                        <span class="font-semibold"> 4. Ausgestellt im OSCA-Portal <br> </span>
                        <div class="w-full bg-p-orange-100 text-center p-2 rounded-lg mb-2 mt-4">
                             <p class="text-3xl my-3 text-gray-800">${oscaInNumbers.osca_portal.total}</p>
                            <p>Ausgestellte Objekte</p>
                        </div>

                        <!-- 
                        <div class="w-full bg-p-orange-100 text-center p-2 rounded-lg mb-2">
                            <canvas id="oscaDigitizationTrend"></canvas>
                        </div>
                        -->
                        
                        <div class="w-full bg-p-orange-100 rounded-lg text-center grid grid-cols-2 gap-2 mb-2">
                            <div class="text-center p-2">
                                <p class="text-xl my-4 text-gray-800">${oscaInNumbers.osca_portal.endemics}</p>
                            </div>
                            <div class="text-center p-2">
                                <p class="text-base my-4">Endemiten </p>
                            </div>
                        </div>
                        <div class="w-full bg-p-orange-100 rounded-lg text-center grid grid-cols-2 gap-2 mb-2">
                            <div class="text-center p-2">
                                <p class="text-xl my-4 text-gray-800">${oscaInNumbers.osca_portal.mollusks}</p>
                            </div>
                            <div class="text-center p-2">
                                <p class="text-base my-4"> Mollusken </p>
                            </div>
                        </div>
                        <div class="w-full bg-p-orange-100 rounded-lg text-center grid grid-cols-2 gap-2 mb-2">
                            <div class="text-center p-2">
                                <p class="text-xl my-4 text-gray-800">${oscaInNumbers.osca_portal.others}</p>
                            </div>
                            <div class="text-center p-2">
                                <p class="text-base my-4"> Sonstige </p>
                            </div>
                        </div>
                        
                    </div>
                    <div class="bg-gray-50 shadow rounded-lg text-center text-sm p-2 flex flex-col">
                        <span class="font-semibold"> 5.Integration/Dissemination in International Portals  </span>
                        <div class="w-full bg-p-blue-100 text-center p-2 rounded-lg mb-2 mt-4">
                            <p class="text-3xl my-3 text-gray-800">${oscaInNumbers.integration.total}</p>
                            <p>Ausgestellte Objekte</p>
                        </div>
                        
                        <div class="w-full bg-p-blue-100 rounded-lg text-left text-md leading-relaxed mb-3 py-5 pl-3">
                            <p class="text-lg my-3 leading-relaxed text-gray-800">${oscaInNumbers.integration.overview.replaceAll(',', '<br>')}</p>
                        </div>
                        
                    </div>
                </div>
        
        `);

        //OSCA Digitization Trend
        const trendLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul'];
        const trendData = {
            labels: trendLabels,
            datasets: [{
                label: 'Monthly Exposure Trend ',
                data: [65, 59, 80, 81, 56, 55, 40],
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            }] 
        }

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

