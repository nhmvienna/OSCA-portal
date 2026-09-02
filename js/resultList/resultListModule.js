// Define the resultListModule as an Immediately Invoked Function Expression (IIFE)
let resultListModule = (function () {
    // Variables to store result counts for different sources
    let resultCountGBIF;
    let resultCountGeocase;
    let resultCountOSCA;
    let resultCountBOLD;
    let resultCountEuropeana;
    let resultCountDissco;

    // Function to initialize the module
    function init() {
        // Initialize result counts to zero
        resultCountGBIF = 0;
        resultCountGeocase = 0;
        resultCountOSCA = 0;
        resultCountBOLD = 0;
        resultCountEuropeana = 0;
        resultCountDissco = 0;
    }

    /**
     * Merges results from different sources into the current results.
     * @param {Object} data - The data returned from the search.
     * @param {number} searchSource - The source of the search (e.g., GBIF, GeoCase).
     * @param {string} query - The search words inputted by the user (can be scientific name or verbatim name).
     */
    function mergeResults(data, searchSource, query) {
        switch (searchSource) {
            case 1: // results from GBIF 
                resultCountGBIF = data?.count;
                currentResults = currentResults.concat(data.results.map(res => {
                    return {
                        sourceOfSearch: searchSource,
                        scientificName: res.scientificName,
                        occurenceSourceLink: "https://www.gbif.org/occurrence/" + res.gbifID,
                        occurrenceOriginalLink: res.occurrenceID,
                        owner: (res.rightsHolder ? res.rightsHolder + ' ' : '') + (res.institutionCode ? res.institutionCode + ' ' : '') + (res.collectionCode ? res.collectionCode + ' ' : ''),
                        license: res.license,
                        media: res.media,
                        specimenID: ' <span class="font-semibold">GBIF ID:</span>' + res.gbifID + ' | <span class="font-semibold">Katalog ID:</span>' + (res.catalogNumber ? res.catalogNumber : 'nicht verfügbar'),
                        originalOject: res
                    }
                }));

                currentResults = currentResults.filter(specimen => containsAllWordsInsensitive(specimen.scientificName, query.split(' ')));
                currentResults = shuffleArray(currentResults);

                $("#resultCountGBIF").html(resultCountGBIF);

                renderResultGrid(currentResults);
                break;

            case 2: // results from GeoCase
                resultCountGeocase = data?.response?.numFound;
                currentResults = currentResults.concat(data.response.docs.map(res => {
                    return {
                        sourceOfSearch: searchSource,
                        scientificName: res.fullscientificname,
                        occurenceSourceLink: "https://geocase.eu/specimen/" + res.geocase_id,
                        occurrenceOriginalLink: res.datasourceurl,
                        owner: (res.providername ? res.providername : 'Unbekannter Anbieter'),
                        license: res.license,
                        media: res.images,
                        specimenID: '<span class="font-semibold">GeoCASE ID:</span>' + res.id + ' | <span class="font-semibold">Katalog ID:</span>' + (res.unitid ? res.unitid : "nicht verfügbar"),
                        originalOject: res
                    }
                }));

                currentResults = shuffleArray(currentResults);

                $("#resultCountGeocase").html(resultCountGeocase);

                renderResultGrid(currentResults);
                break;

            case 3: // results from OSCA
                resultCountOSCA = data.dataSize;
                currentResults = currentResults.concat(data.data.map(res => {
                    return {
                        sourceOfSearch: searchSource,
                        scientificName: res.scientific_name,
                        occurenceSourceLink: '',
                        occurrenceOriginalLink: '',
                        owner: (res.organization ? res.organization : 'Unbekannter Anbieter'),
                        license: res.license,
                        media: res.media,
                        specimenID: '<span class="font-semibold">DWC:RECORD NUMBER:</span>' + res.osca_id + ' | <span class="font-semibold">DWC:OCCURRENCE ID:</span>' + res.phisical_specimen_id + (res.collection_number ? ' | <span class="font-semibold">Katalog ID:</span>' + res.collection_number : ''),
                        originalOject: res
                    }
                }));

                currentResults = currentResults.filter(specimen => containsAllWordsInsensitive(specimen.scientificName, query.split(' ')));
                currentResults = shuffleArray(currentResults);

                $("#resultCountOSCA").html(resultCountOSCA);

                renderResultGrid(currentResults);
                break;

            case 4: // results from BOLD
                resultCountBOLD = 0;

                $("#resultStatistics").html('BOLD data under construction');
                displayError(`Access to XMLHttpRequest at '<a class="hover:text-blue-500" target="_blank" href="https://www.boldsystems.org/">https://www.boldsystems.org/index.php/API_Public/specimen?format=json&taxon=Cochlostoma</a>' from origin '${window.location.origin}' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.`, 4)

                break;

            case 5: // results from Europeana
                resultCountEuropeana = data.itemsCount;
                currentResults = currentResults.concat(data.items.map(res => {
                    return {
                        sourceOfSearch: searchSource,
                        scientificName: res.title[0],
                        occurenceSourceLink: res.guid,
                        occurrenceOriginalLink: '',
                        owner: (res?.dataProvider ? res.dataProvider[0] : 'Unbekannter Anbieter'),
                        license: (res?.rights ? res.rights[0] : null),
                        media: (res?.edmPreview ? res.edmPreview[0] : null),
                        specimenID: '<span class="font-semibold">Europeana ID:</span>' + res.id,
                        originalOject: res
                    }
                }));

                currentResults = currentResults.filter(specimen => containsAllWordsInsensitive(specimen.scientificName, query?.split(' ')));
                currentResults = shuffleArray(currentResults);

                $("#resultCountEuropeana").html(resultCountEuropeana);

                renderResultGrid(currentResults);
                break;

            case 6: // results from DiSSCO
                resultCountDissco = data.data.length;
                currentResults = currentResults.concat(data.data.map(res => {
                    return {
                        sourceOfSearch: searchSource,
                        scientificName: res.attributes['ods:specimenName'],
                        occurenceSourceLink: res.attributes['dcterms:identifier'],
                        occurrenceOriginalLink: res.attributes['ods:physicalSpecimenID'],
                        owner: (res.attributes['ods:organisationName'] ? res.attributes['ods:organisationName'] : 'Unbekannter Anbieter'),
                        license: res.attributes['dcterms:license'],
                        media: "",
                        specimenID: '<span class="font-semibold">DiSSCO ID:</span>' + res.attributes['@id'],
                        originalOject: res
                    }
                }));

                //currentResults = currentResults.filter(specimen => containsAllWordsInsensitive(specimen.scientificName, query.split(' ')));
                currentResults = shuffleArray(currentResults);

                $("#resultCountDissco").html(resultCountDissco);

                renderResultGrid(currentResults);
                break;

            case 7: // results from OSCA CACHE
                resultCountOSCA = data.length;
                $("#resultCountOSCA").html(resultCountOSCA);

                currentResults = currentResults.concat(data.map(res => {
                    return {
                        sourceOfSearch: searchSource,
                        scientificName: res.scientificName ? res.scientificName : " ",
                        occurenceSourceLink: '',
                        occurrenceOriginalLink: '',
                        owner: res.institutionCode ? res.institutionCode : " ",
                        license: res.license? res.license : 'https://creativecommons.org/public-domain/#cc0',
                        media: res.associatedMedia ? res.associatedMedia : "",
                        specimenID: '<span class="font-semibold">DWC:RECORD NUMBER:</span>' + res.recordNumber + ' | <span class="font-semibold">DWC:OCCURRENCE ID:</span>' + res.occurrenceId + (res.collectionNumber ? ' <br> <span class="font-semibold">Sammlungs-ID:</span>' + res.collectionNumber : ''),
                        originalOject: res
                    }
                }));

                currentResults = currentResults.filter(specimen => containsAllWordsInsensitive(specimen.scientificName, query.split(' ')));
                currentResults = shuffleArray(currentResults);

                $("#resultCountOSCA").html(resultCountOSCA);

                renderResultGrid(currentResults);
                break;
            default: break;

        }
    }

    /**
    * Pushed results from different sources at the end of results list.
    * @param {Object} data - The data returned from the search.
    * @param {number} searchSource - The source of the search (e.g., GBIF, GeoCase).
    * @param {string} query - The search words inputted by the user (can be scientific name or verbatim name).
    */
    function pushResults(data, searchSource, query) {
        switch (searchSource) {
            case 1: // results from GBIF 
                const moreGBIFResults = data.results.map(res => {
                    return {
                        sourceOfSearch: searchSource,
                        scientificName: res.scientificName,
                        occurenceSourceLink: "https://www.gbif.org/occurrence/" + res.gbifID,
                        occurrenceOriginalLink: res.occurrenceID,
                        owner: (res.collectionCode ? res.collectionCode : 'Unbekannter Anbieter') + (res.institutionCode ? '-' + res.institutionCode : ''),
                        license: res.license,
                        media: res.media,
                        specimenID: ' <span class="font-semibold">GBIF ID:</span>' + res.gbifID + ' | <span class="font-semibold">Katalog ID:</span>' + (res.catalogNumber ? res.catalogNumber : 'nicht verfügbar'),
                        originalOject: res
                    }
                });

                currentResults = currentResults.concat(moreGBIFResults);

                appendResultGrid(moreGBIFResults);
                break;

            case 2: // results from GeoCase
                const moreGeoCaseResults = data.response.docs.map(res => {
                    return {
                        sourceOfSearch: searchSource,
                        scientificName: res.fullscientificname,
                        occurenceSourceLink: "https://geocase.eu/specimen/" + res.geocase_id,
                        occurrenceOriginalLink: res.datasourceurl,
                        owner: (res.providername ? res.providername : 'Unbekannter Anbieter'),
                        license: res.license,
                        media: res.images,
                        specimenID: '<span class="font-semibold">GeoCASE ID:</span>' + res.id + ' | <span class="font-semibold">Katalog ID:</span>' + (res.unitid ? res.unitid : "nicht verfügbar"),
                        originalOject: res
                    }
                });

                currentResults = currentResults.concat(moreGeoCaseResults);

                appendResultGrid(moreGeoCaseResults);
                break;

            case 3: // results from OSCA
                const moreOSCAResults = data.data.map(res => {
                    return {
                        sourceOfSearch: searchSource,
                        scientificName: res.scientific_name,
                        occurenceSourceLink: '',
                        occurrenceOriginalLink: '',
                        owner: (res.organization ? res.organization : 'Unbekannter Anbieter'),
                        license: res.license,
                        media: res.media,
                        specimenID: '<span class="font-semibold">OSCA ID:</span>' + res.phisical_specimen_id + ' | <span class="font-semibold">Sammlungs-ID:</span>' + (res.collection_number ? res.collection_number : 'nicht verfügbar'),
                        originalOject: res
                    }
                });

                currentResults = currentResults.concat(moreOSCAResults);

                appendResultGrid(moreOSCAResults);
                break;

            case 4: // results from BOLD
                resultCountBOLD = 0;

                $("#resultStatistics").html('BOLD data under construction');
                displayError(`Access to XMLHttpRequest at '<a class="hover:text-blue-500" target="_blank" href="https://www.boldsystems.org/">https://www.boldsystems.org/index.php/API_Public/specimen?format=json&taxon=Cochlostoma</a>' from origin '${window.location.origin}' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.`, 4)

                break;

            case 5: // results from Europeana
                const moreEuropeanaResults = data.items.map(res => {
                    return {
                        sourceOfSearch: searchSource,
                        scientificName: res.title[0],
                        occurenceSourceLink: res.guid,
                        occurrenceOriginalLink: '',
                        owner: (res.dataProvider ? res.dataProvider[0] : 'Unbekannter Anbieter'),
                        license: res.rights[0],
                        media: res.edmPreview[0],
                        specimenID: '<span class="font-semibold">Europeana ID:</span>' + res.id,
                        originalOject: res
                    }
                });

                currentResults = currentResults.concat(moreEuropeanaResults);

                appendResultGrid(moreEuropeanaResults);
                break;

            case 6: // results from DiSSCO

                const moreDiSSCoResults = data.data.map(res => {
                    return {
                        sourceOfSearch: searchSource,
                        scientificName: res.attributes['ods:specimenName'],
                        occurenceSourceLink: '',
                        occurrenceOriginalLink: res.attributes['ods:physicalSpecimenID'],
                        owner: (res.attributes['ods:organisationName'] ? res.attributes['ods:organisationName'] : 'Unbekannter Anbieter'),
                        license: res.attributes['dcterms:license'],
                        media: "",
                        specimenID: '<span class="font-semibold">DiSSCO ID:</span>' + res.attributes['@id'],
                        originalOject: res
                    }
                });

                currentResults = currentResults.concat(moreDiSSCoResults);

                appendResultGrid(moreDiSSCoResults);
                break;
            default: break;

        }
    }

    // Function to render the result grid (merged results)
    function renderResultGrid(currentResults) {
        let resultItems = '';
        currentResults.map((res, i) => {

            if (res?.scientificName) {
                resultItems += `
    <div class="${markSource(res.sourceOfSearch)} ${markMedia(res.media)}  flex flex-col justify-between shadow rounded-lg bg-white hover:bg-gray-50 text-left py-2">
        <div class="w-full flex flex-row">
            <div class="flex-grow flex flex-col w-full pb-2">
                <div class="border-t-0 px-3 pt-1 pb-2 align-middle text-xs font-semibold flex flex-row items-center justify-start">
                    <img src="${getIcon(res.sourceOfSearch)}" class="object-center object-contain w-8 h-8 inline-block rounded-sm p-1" />
                    <div> ${res.scientificName} </div>
                </div>
            
                <div class="flex flex-col text-center px-4 w-full gap-2">
                    ${displayLinks(res, res.sourceOfSearch)}
                </div>
            </div>

            <div class="w-2/6 flex-shrink border-t-0 align-middle border-l-0 border-r-0 text-xs pr-4 py-2">
                ${displayMedia(res.media, res.sourceOfSearch)}
            </div>
        </div>
    
        <div class="w-full flex border-t flex-col text-center px-4 py-2 w-full">
            ${displayIDs(res, res.sourceOfSearch)}
        </div>  
    </div>
        `
            }
        });


        $("#result-grid").html(resultItems);

        $('.app').localize();
    }

    // Function to render the result grid (merged results)
    function appendResultGrid(moreResults) {
        let resultItems = '';
        moreResults.map((res, i) => {

            if (res?.scientificName) {
                resultItems += `
    <div class="${markSource(res.sourceOfSearch)} ${markMedia(res.media)}  flex flex-col justify-between shadow rounded-lg bg-white hover:bg-gray-50 text-left py-2">
        <div class="w-full flex flex-row">
            <div class="flex-grow flex flex-col w-full pb-2">
                <div class="border-t-0 px-3 pt-1 pb-2 align-middle text-xs font-semibold flex flex-row items-center justify-start">
                    <img src="${getIcon(res.sourceOfSearch)}" class="object-center object-contain w-8 h-8 inline-block rounded-sm p-1" />
                    <div> ${res.scientificName} </div>
                </div>
            
                <div class="flex flex-col text-center px-4 w-full gap-2">
                    ${displayLinks(res, res.sourceOfSearch)}
                </div>
            </div>

            <div class="w-2/6 flex-shrink border-t-0 align-middle border-l-0 border-r-0 text-xs p-4">
                ${displayMedia(res.media, res.sourceOfSearch)}
            </div>
        </div>
    
        <div class="w-full flex border-t flex-col text-center px-4 py-2 w-full">
            ${displayIDs(res, res.sourceOfSearch)}
        </div>  
    </div>
        `
            }
        });


        $("#result-grid").append(resultItems);
        $('.app').localize();
    }

    // Utility functions for displaying media, links, and IDs
    function displayIDs(res, searchSource) {
        return `
                <div class="w-full px-3 align-middle border-l-0 border-r-0 text-xs overflow-x-hidden">
                    ${res.specimenID} 
                </div>
            `
        /*
                switch (searchSource) {
                    case 1: // search on GBIF 
                    return `
                        <div class="w-full px-3 align-middle border-l-0 border-r-0 text-xs ">
                            ${res.specimenID} 
                        </div>
                    `
                    case 2: // search on GeoCase
                    return `
                        <div class="w-full px-3 align-middle border-l-0 border-r-0 text-xs ">
                            ${res.specimenID} 
                        </div>
                    `
                    case 3: // search on OSCA
                    return `
                        <div class="w-full px-3 align-middle border-l-0 border-r-0 text-xs ">
                          ${res.specimenID} 
                        </div>
                    `
                    case 5: // search on Europeana
                    return `
                        <div class="w-full px-3 align-middle border-l-0 border-r-0 text-xs overflow-x-hidden">
                            ${res.specimenID} 
                        </div>
                    `
                    case 6: // search on DiSSCO
                    return `
                        <div class="w-full px-3 align-middle border-l-0 border-r-0 text-xs ">
                            ${res.specimenID} 
                        </div>
                    `
                    default: break;
                }
                    */
    }

    function displayLinks(res, searchSource) {
        switch (searchSource) {
            case 1: // search on GBIF 
                if (res.occurrenceOriginalLink && res.occurrenceOriginalLink.startsWith('http')) { //render Original Link only if it's actually a link
                    return `
                    <a data-i18n="app.resultCard.dataDetails" href="${res.occurenceSourceLink}" target="_blank" class="mx-1 px-2 py-1 rounded-full bg-green-500 text-white text-xs">Suche-Details Anzeigen</a> 
                    <a data-i18n="app.resultCard.originalDetail" href="${res.occurrenceOriginalLink}" target="_blank" class="mx-1 px-2 py-1 rounded-full bg-green-700 text-white text-xs">Originalquelle Anzeigen</a> 

                    <div class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs ">
                        <span data-i18n="app.resultCard.dataOwner"> Inhaber: </span> ${res.owner}  - ${res.license ? '<a href="' + res.license + '" target="_blank" onclick="event.stopPropagation();" class="text-blue-700 underline" data-i18n="app.resultCard.license"> Lizenz </a>' : 'Lizenz: Unbekannt'}
                    </div>
                `
                }
                return `
                    <a data-i18n="app.resultCard.dataDetails" href="${res.occurenceSourceLink}" target="_blank" class="mx-1 px-2 py-1 rounded-full bg-green-500 text-white text-xs">Suche-Details Anzeigen</a> 
                    
                    <div class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs ">
                        <span data-i18n="app.resultCard.dataOwner"> Inhaber: </span> ${res.owner}  - ${res.license ? '<a href="' + res.license + '" target="_blank" onclick="event.stopPropagation();" class="text-blue-700 underline" data-i18n="app.resultCard.license"> Lizenz </a>' : 'Lizenz: Unbekannt'}
                    </div>
                `


            case 2: // search on GeoCase
                return `
                <a data-i18n="app.resultCard.dataDetails" href="${res.occurenceSourceLink}" target="_blank" class="mx-1 px-2 py-1 rounded-full bg-blue-400 text-white text-xs">Suche-Details Anzeigen</a> 
                
                <div class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs ">
                    <span data-i18n="app.resultCard.dataOwner"> Inhaber: </span> ${res.owner}  - ${res.license ? '<a href="' + res.license + '" target="_blank" onclick="event.stopPropagation();" class="text-blue-700 underline" data-i18n="app.resultCard.license"> Lizenz </a>' : 'Lizenz: Unbekannt'}
                </div>
            `

            case 3: // search on OSCA
                return `
                <div class="w-full flex flex-row items-center">
                
                <a data-i18n="app.resultCard.dataDetails" href="./occurrence.html?id=${res.originalOject.osca_id}"  target="_blank" onclick="event.stopPropagation();"  class="flex flex-grow mx-1 px-2 py-1 rounded-full bg-p-orange-300 text-white text-xs text-center justify-center">Suche-Details Anzeigen <i class="ml-3 fas fa-external-link-alt text-white"></i></a> 
                ${res.originalOject.original_object['dwc:associatedSequences'] ? '<a href="' + res.originalOject.original_object['dwc:associatedSequences'] + '"  target="_blank" onclick="event.stopPropagation();" class="bg-white text-xs px-2 py-1 shadow border rounded-full text-yellow-600"><i class="fas fa-dna"></i> </a>' : ''}
                </div>

                <div class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs ">
                    <span data-i18n="app.resultCard.dataOwner"> Inhaber: </span> ${res.owner}  - ${res.license ? '<a href="' + res.license + '" target="_blank" onclick="event.stopPropagation();" class="text-blue-700 underline" data-i18n="app.resultCard.license"> Lizenz </a>' : 'Lizenz: Unbekannt'}
                </div>
                <div class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs ">
                    <span data-i18n="app.resultCard.specimenType"> Exemplartyp: </span> ${res.originalOject.original_object['dwc:basisOfRecord']} <br> <span data-i18n="app.resultCard.objectType"> Objekttyp: </span> ${res.originalOject.original_object['dc:type'] ? res.originalOject.original_object['dc:type'] : 'Unbekannt'}
                </div>
            `

            case 5: // search on Europeana
                return `
                <a data-i18n="app.resultCard.dataDetails" href="${res.occurenceSourceLink}" target="_blank" class="mx-1 px-2 py-1 rounded-full bg-blue-400 text-white text-xs">Suche-Details Anzeigen</a> 
                 
                <div class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs ">
                    <span data-i18n="app.resultCard.dataOwner"> Inhaber: </span> ${res.owner}  - ${res.license ? '<a href="' + res.license + '" target="_blank" onclick="event.stopPropagation();" class="text-blue-700 underline" data-i18n="app.resultCard.license"> Lizenz </a>' : 'Lizenz: Unbekannt'}
                </div>
            `
            case 6: // search on Dissco
                return `
                <a data-i18n="app.resultCard.dataDetails" href="${res.occurenceSourceLink}" target="_blank" class="mx-1 px-2 py-1 rounded-full bg-blue-400 text-white text-xs">Suche-Details Anzeigen</a> 
                <a data-i18n="app.resultCard.originalDetail" href="${res.occurrenceOriginalLink}" target="_blank" class="mx-1 px-2 py-1 rounded-full bg-blue-500 text-white text-xs">Originalquelle Anzeigen</a> 
               
                <div class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs ">
                    <span data-i18n="app.resultCard.dataOwner"> Inhaber: </span> ${res.owner}  - ${res.license ? '<a href="' + res.license + '" target="_blank" onclick="event.stopPropagation();" class="text-blue-700 underline" data-i18n="app.resultCard.license"> Lizenz </a>' : 'Lizenz: Unbekannt'}
                </div>
            `
            case 7: // search on OSCA CACHE
                return `
                
                <div class="w-full flex flex-row items-center">
                <a data-i18n="app.resultCard.dataDetails" href="./occurrence.html?cacheid=${res.originalOject.id}" target="_blank" class="flex flex-grow text-center justify-center mx-1 px-2 py-1 rounded-full bg-pink-400 text-white text-xs">Suche-Details Anzeigen </a>
                ${res.originalOject.associatedSequences ? '<a href="' + res.originalOject.associatedSequences + '"  target="_blank" onclick="event.stopPropagation();" class="bg-white text-xs px-2 py-1 shadow border rounded-full text-yellow-600"><i class="fas fa-dna"></i> </a>' : ''}
                </div>
                
                <div class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs ">
                    <span data-i18n="app.resultCard.dataOwner"> Inhaber: </span> ${res.owner}  - ${res.license ? '<a href="'+ res.license +'" target="_blank" onclick="event.stopPropagation();" class="text-blue-700 underline" data-i18n="app.resultCard.license"> Lizenz </a>' : 'Lizenz: Unbekannt'}
                </div>
                <div class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs ">
                    <span data-i18n="app.resultCard.specimenType"> Exemplartyp: </span> ${res.originalOject.basisOfRecord} <br> <span data-i18n="app.resultCard.objectType"> Objekttyp: </span> ${res.originalOject.typeStatus ? res.originalOject.typeStatus : 'Unbekannt'}
                </div>
                 ${res.originalOject.catalogNumber ? '<div class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs "> <span> Katalog: <b>' + res.originalOject.catalogNumber + '</b> </span> </div>' : ''} 
              
            `
            default: break;
        }
    }

    function displayMedia(media, searchSource) {
        switch (searchSource) {
            case 1: // search on GBIF 
                return displayListMedia(media);

            case 2: // search on GeoCase
                return displayGeoCASeListMedia(media);

            case 3: // search on OSCA
                return displayOSCAListMedia(media);

            case 5: // search on Europeana
                return displayEuropeanaMedia(media);

            case 6: // search on Dissco
                return displayDisscoMedia(media);

            case 7: // search on OSCA Cahe
                return displayOSCAListMedia(media);

            default: break;
        }
    }

    function displayListMedia(media) {
        switch (media[0]?.type) {
            case 'StillImage': return `
        <div class="flex flex-col">
            <img src="${media[0].identifier}" loading="lazy" class="w-32 rounded-sm shadow"/>
            <div class="flex flex-col items-start">
                <a href="detailedMedia.html?src=${encodeURIComponent(media[0].identifier)}" target="_blank" onclick="event.stopPropagation();" class="-mt-8 ml-1 bg-white text-xs px-2 py-1 shadow border rounded-sm text-blue-600"><i class="fas fa-external-link-alt"></i></a>
             </div>
        </div>
        `
            default: return `
             <div class="flex flex-col">
                <div class="flex flex-col items-center justify-center text-center border w-full h-24 rounded-sm bg-gray-50">
                <span data-i18n="app.resultCard.errorImage">Keine Medien <br> verfügbar</span>
                </div>
            </div>
            `
        }
    }

    function displayGeoCASeListMedia(media) {
        if (media) {
            if (media[0].startsWith('https://')) {
                return `
                <div class="flex flex-col">
                    <img src="${media[0]}" loading="lazy" class="w-28 rounded-sm shadow"/>
                    <div class="flex flex-col items-start">
                        <a href="detailedMedia.html?src=${encodeURIComponent(media[0])}"  target="_blank" onclick="event.stopPropagation();" class="-mt-8 ml-1 bg-white text-xs px-2 py-1 shadow border rounded-sm text-blue-600"><i class="fas fa-external-link-alt"></i></a>
                    </div>
                </div>
            `
            } else {
                return `
                <div class="flex flex-col">
                    <img src="https://${media[0]}" loading="lazy" class="w-28 rounded-sm shadow"/>
                    <div class="flex flex-col items-start">
                        <a href="detailedMedia.html?src=${encodeURIComponent('https://' + media[0])}" target="_blank" onclick="event.stopPropagation();" class="-mt-8 ml-1 bg-white text-xs px-2 py-1 shadow border rounded-sm text-blue-600"><i class="fas fa-external-link-alt"></i></a>
                    </div>
                </div>
            `
            }

        } else {
            return `
            <div class="flex flex-col">
               <div class="flex flex-col items-center justify-center text-center border w-full h-24 rounded-sm bg-gray-50">
               <span data-i18n="app.resultCard.errorImage">Keine Medien <br> verfügbar</span>
               </div>
           </div>
           `
        }



    }

    function displayOSCAListMedia(media) {

        if (typeof media !== 'string') { // Invalid input
            return `
            <div class="flex flex-col">
                <div class="flex flex-col items-center justify-center text-center border w-full h-24 rounded-sm bg-gray-50">
                <span data-i18n="app.resultCard.errorImage">Keine Medien <br> verfügbar</span>
                </div>
            </div>
            `;
        }

        const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/;

        const urls = media.split(',').map(url => url.trim());

        if (urls.length === 1 && urlPattern.test(urls[0])) { // Single URL
            return `
            <div class="flex flex-col">
                <img src="${media}" loading="lazy" class="w-28 rounded-sm shadow"/>
                <div class="flex flex-col items-start">
                    <a href="${media}"  target="_blank" onclick="event.stopPropagation();" class="-mt-8 ml-1 bg-white text-xs px-2 py-1 shadow border rounded-sm text-blue-600"><i class="fas fa-external-link-alt"></i></a>
                </div>
            </div>
            `;
        }

        if (urls.length > 1 && urls.every(url => urlPattern.test(url))) { //List of URLs
            return `
           <div class="flex flex-col">
                <img src="${urls[0]}" loading="lazy" class="w-28 rounded-sm shadow"/>
                <div class="w-100 -mt-8 gap-2 flex flex-row flex-wrap items-start">
                     ${urls.map((elem) => {
                return '<a href="' + elem + '"  target="_blank" onclick="event.stopPropagation();" class="bg-white text-xs px-2 py-1 shadow border rounded-sm text-blue-600"><i class="fas fa-external-link-alt"></i> </a>'
            }).join('')}
                </div>
            </div>
            `;
        }

        // Invalid input
        return `
            <div class="flex flex-col">
                <div class="flex flex-col items-center justify-center text-center border w-full h-24 rounded-sm bg-gray-50">
                    <span data-i18n="app.resultCard.errorImage">Keine Medien <br> verfügbar</span>
                </div>
            </div>
            `;

    }

    function displayEuropeanaMedia(media) {
        if (media && media.length > 2) {
            return `
           <div class="flex flex-col">
                <img src="${media}" loading="lazy" class="w-28 rounded-sm shadow"/>
                <div class="flex flex-col items-start">
                    <a href="${media}"  target="_blank" onclick="event.stopPropagation();" class="-mt-8 ml-1 bg-white text-xs px-2 py-1 shadow border rounded-sm text-blue-600"><i class="fas fa-external-link-alt"></i></a>
                </div>
            </div>
            `
        }

    }

    function displayDisscoMedia(media) {
        if (media.length > 2) {
            return `
            <div class="flex flex-col">
                <div class="flex flex-col items-center justify-center text-center border w-full h-24 rounded-sm bg-gray-50">
                <span data-i18n="app.resultCard.errorImage">Keine Medien <br> verfügbar</span>
                </div>
            </div>
            `
        }

        return `
        <div class="flex flex-col">
            <div class="flex flex-col items-center justify-center text-center border w-full h-24 rounded-sm bg-gray-50">
            <span data-i18n="app.resultCard.errorImage">Keine Medien <br> verfügbar</span>
            </div>
        </div>
        `
    }

    function displayError(errorText, sourceNumber) {
        switch (sourceNumber) {
            case 1: $("#result-grid").html(`
            <div class="flex flex-col py-2"></div>
            
            
            <div class="flex flex-col shadow rounded-sm gap-2 bg-white hover:bg-gray-50 text-left py-2 text-red-500">
                <div class="border-t-0 px-3 align-middle text-xs font-semibold">
                <img src="./img/gbif-icon.png" class="object-center object-contain w-8 h-8 inline-block rounded-sm p-1" />
                    ERROR: ${errorText}        
                </div>
            </div>

            <div class="flex flex-col py-2"></div>
            `);
                break;

            case 2: $("#result-grid").html(`
            <div class="flex flex-col py-2"></div>
            
            
            <div class="flex flex-col shadow rounded-lg gap-2 bg-white hover:bg-gray-50 text-left py-2 text-red-500">
                <div class="border-t-0 px-3 align-middle text-xs font-semibold">
                <img src="./img/geocase-icon.ico" class="object-center object-contain w-8 h-8 inline-block rounded-sm p-1" />
                    ERROR: ${errorText}        
                </div>
            </div>

            <div class="flex flex-col py-2"></div>
            `);
                break;

            case 3: $("#result-grid").html(`
            <div class="flex flex-col py-2"></div>
            
            
            <div class="flex flex-col shadow rounded-lg gap-2 bg-white hover:bg-gray-50 text-left py-2 text-red-500">
                <div class="border-t-0 px-3 align-middle text-xs font-semibold">
                <img src="./img/osca-icon.png" class="object-center object-contain w-8 h-8 inline-block rounded-sm p-1" />
                    ERROR: ${errorText}        
                </div>
            </div>

            <div class="flex flex-col py-2"></div>
            `);
                break;

            case 4: $("#result-grid").html(`
            <div class="flex flex-col py-2"></div>
            
            
            <div class="flex flex-col shadow rounded-lg gap-2 bg-white hover:bg-gray-50 text-left py-2 text-red-500">
                <div class="border-t-0 px-3 align-middle text-xs font-semibold">
                <img src="./img/bold-icon.png" class="object-center object-contain w-8 h-8 inline-block rounded-sm p-1" />
                    ERROR: ${errorText}        
                </div>
            </div>

            <div class="flex flex-col py-2"></div>
            `);
                break;

        }
    }

    function extractTextFromHTML(str) {
        const div = document.createElement("div");
        div.innerHTML = str;
        return div.textContent
            .replace(/\s+/g, " ")
            .replace(/:\s*/g, ": ")
            .trim();
    }


    function convertArrayOfObjectsToTSV(array) {
        let tsv = '';
        // Header
        const headers = Object.keys(array[0]);
        tsv += headers.join('\t') + '\n';

        // Rows
        array.forEach(item => {
            const row = headers.map(header => {
                let value = item[header];

                if (header == 'sourceOfSearch') {
                    switch (value) {
                        case 1: return 'GBIF';
                        case 2: return 'GeoCASE';
                        case 3: return 'OSCA';
                        case 4: return 'BOLD Systems';
                        case 5: return 'Europeana';
                        case 6: return 'DiSSCo';
                    }
                }

                if (typeof value === 'string') {
                    value = extractTextFromHTML(value).replace(/\t/g, '    '); // Replace tabs with spaces
                };

                if (typeof value === 'object') {
                    value = JSON.stringify(value) // MAke object a string
                };

                return value;
            });
            tsv += row.join('\t') + '\n';
        });

        return tsv;
    }

    function downloadCSV(array, filename) {
        const tsv = convertArrayOfObjectsToTSV(array);
        const blob = new Blob([tsv], { type: 'text/tab-separated-values;charset=utf-8;' });
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, filename);
        } else {
            const link = document.createElement('a');
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', filename);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }

    function downloadCurrentResults() {
        let usecase = 4;
        switch (usecase) {
            case 1: // search on GBIF 
                let dataAccumulator = [];

                $('#resultDownloadIcon').hide();
                $('#resultDownloadInProgressIcon').show();

                for (let i = 0; i < resultCountGBIF / 300; i++) {
                    $.get("https://api.gbif.org/v1/occurrence/search?advanced=1&basis_of_record=PRESERVED_SPECIMEN&publishing_country=AT&offset=" + i * 300 + "&limit=300&q=" + encodeURIComponent(searchQuery), function (data) {
                        dataAccumulator = dataAccumulator.concat(data.results);
                    });
                }
                setTimeout(() => {
                    console.dir(dataAccumulator);
                    downloadCSV(dataAccumulator, 'Resultate_' + searchQuery + '_von_GBIF.csv');

                    $('#resultDownloadInProgressIcon').hide();
                    $('#resultDownloadIcon').show();
                }, 6000)
                break;

            case 2: // search on GeoCase
                downloadCSV(currentResults, 'Resultate_' + searchQuery + '_von_GeoCase.csv')
                break;

            case 3: // search on OSCA
                $('#resultDownloadIcon').hide();
                $('#resultDownloadInProgressIcon').show();
                localDataModule.search(searchQuery, 'asc', 0, 50000, '', function (results) {
                    downloadCSV(results.data, 'Resultate_' + searchQuery + '_von_OSCA.csv');
                    $('#resultDownloadInProgressIcon').hide();
                    $('#resultDownloadIcon').show();
                });
                break;

            case 4: // download all
                downloadCSV(currentResults, 'Resultate_' + searchQuery + '_von_OSCA_Portal.csv')
                break;
        }
    }

    // Utility functions for UI and data handling
    /**
     * Checks is the input string contains all the words in the array
     * @param {string} input - The string to search in. It can be a scientific name or a verbatim name
     * @param {string[]} words - Array of strings (words to check for)
     */
    function containsAllWordsInsensitive(input, words) {
        const lowerInput = input?.toLowerCase();
        return words.every(word => lowerInput?.includes(word.toLowerCase()));
    }

    function urlDomain(data) {
        let a = document.createElement('a');
        a.href = data;
        return a.hostname;
    }


    function getMonthName(monthNumber) {
        // Validate input
        if (typeof monthNumber !== 'number' || monthNumber < 1 || monthNumber > 12) {
            return '';
        }

        // Array of month names
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        // Return the corresponding month name
        return monthNames[monthNumber - 1];
    }

    function getIcon(searchSource) {
        switch (searchSource) {
            case 1: // search on GBIF 
                return './img/gbif-icon.png';

            case 2: // search on GeoCase
                return './img/geocase-icon.ico';

            case 3: // search on OSCA
                return './img/osca-icon.png';

            case 5: // search on Europeana
                return './img/europeana-icon.jpg';

            case 6: // search on Dissco
                return './img/dissco-icon.png';

            default: return './img/osca-icon.png';
        }
    }

    function markMedia(media) {
        if (media && media.length >= 1) return 'hasMedia'
        return 'hideMedia';
    }

    function markSource(searchSource) {
        switch (searchSource) {
            case 1: // search on GBIF 
                return 'gbifResultCard';

            case 2: // search on GeoCase
                return 'geocaseResultCard';

            case 3: // search on OSCA
                return 'oscaResultCard';

            case 5: // search on Europeana
                return 'europeanaResultCard';

            case 6: // search on Europeana
                return 'disscoResultCard';

            case 7: // search on OSCA CACHE
                return 'oscaResultCard';

            default: return 'defaultResultCard';
        }
    }

    function shuffleArray(array) {
        // Create a copy of the array to avoid modifying the original
        let shuffledArray = array.slice();

        // Fisher-Yates shuffle algorithm
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            // Generate a random index from 0 to i
            let j = Math.floor(Math.random() * (i + 1));

            // Swap elements at indices i and j
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
        }

        return shuffledArray;
    }

    // Expose only the necessary functions
    return {
        init: init,
        mergeResults: mergeResults,
        pushResults: pushResults,
        renderResultGrid: renderResultGrid,
        downloadCurrentResults: downloadCurrentResults
    };

})();
