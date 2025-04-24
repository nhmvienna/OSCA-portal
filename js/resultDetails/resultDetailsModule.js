// Define the resultDetailsModule as an Immediately Invoked Function Expression (IIFE)
let resultDetailsModule = (function () {

    // Function to initialize the module
    function init() {
        // Placeholder for initialization logic for the result details module
    }

    // Utility function to convert camelCase strings to words
    function camelCaseToWords(input) {
        // Inserts a space before uppercase letters and converts the string to uppercase
        return input.replace(/([a-z])([A-Z])/g, '$1 $2').toUpperCase();
    }

    // Function to display media details for GBIF observations
    function displayDetailsGBIFMedia(observation) {
        switch (observation.media[0]?.type) {
            case 'StillImage': 
            return `
            <div class="flex flex-col items-center gap-4">
                <img src="${observation.media[0].identifier}" loading="lazy" class="w-64 rounded-sm shadow"/>
                <a href="detailedMedia.html?src=${encodeURIComponent(observation.media[0].identifier)}" target="_blank" class="bg-white text-xs p-2 shadow border rounded-lg text-blue-600">Open in new tab <i class="fas fa-external-link-alt"></i></a>
                    
                <div class="flex flex-col text-xs w-64">
                    
                    <div class="row-span-1">${observation.media[0].rightsHolder ? 'Rights Holder: ' + observation.media[0].rightsHolder : 'Rights Holder: Unknown'}</div>
                    <div class="row-span-1">${observation.media[0].license? observation.media[0].license: ''}</div>
                </div>
            </div>
            `;

            default: 
            return `
            <div class="flex flex-col gap-4"></div>
            `
        }
    }

    // Function to display media details for GeoCASe observations
    function displayGeoCASeDetailsMedia(observation) {
        if (observation.images[0].startsWith('https://')) {
            return `
            <div class="flex flex-col items-end gap-4">   
                <img src="${observation.images[0]}" loading="lazy" class="w-64 rounded-sm shadow"/>
                <a href="detailedMedia.html?src=${encodeURIComponent(observation.images[0])}" target="_blank" class="bg-white text-xs p-2 shadow border rounded-lg text-blue-600">Open in new tab <i class="fas fa-external-link-alt"></i></a>
            </div>`
        } else {
            return `
            <div class="flex flex-col items-end gap-4">
                <img src="https://${observation.images[0]}" loading="lazy" class="w-64 rounded-sm shadow"/>
                <a href="detailedMedia.html?src=${encodeURIComponent('https://' + observation.images[0])}" target="_blank" class="bg-white text-xs p-2 shadow border rounded-lg text-blue-600">Open in new tab <i class="fas fa-external-link-alt"></i></a>
            </div>`
        }
    }

    // Function to display media details for GeoCASe observations
    function displayOSCADetailsMedia(media) {
        if (typeof media !== 'string') { // Invalid input
            return `
            <div class="w-60 flex flex-col items-center gap-4 p-2 bg-white rounded">
                <div class="flex flex-col items-center justify-center text-center border w-full h-60 rounded-sm bg-gray-50">
                <span>Keine Medien <br> verfügbar</span>
                </div>
            </div>`;
        }
        
        const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/;
        const urls = media.split(',').map(url => url.trim());
        
        if (urls.length === 1 && urlPattern.test(urls[0])) { // Single URL
            return `
            <div class="w-60 flex flex-col items-center gap-4 p-2 bg-white rounded">
                <img src="${media}" loading="lazy" class="w-full rounded-sm shadow"/>
                <div class="flex flex-col items-start">
                    <a href="${media}"  target="_blank" onclick="event.stopPropagation();" class=" mt-2 ml-1 bg-white text-xs px-2 py-1 shadow border rounded-sm text-blue-600"><i class="fas fa-external-link-alt"></i></a>
                </div>
            </div>`;
        }
        
        if (urls.length > 1 && urls.every(url => urlPattern.test(url))) { //List of URLs
            return `
           <div class="w-60 flex flex-col items-center gap-4 p-2 bg-white rounded">
                <img src="${urls[0]}" loading="lazy" class="w-full rounded-sm shadow"/>
                <div class="w-100 mt-2 gap-2 flex flex-row flex-wrap items-start">
                    ${urls.map((elem) => '<a href="'+ elem +'"  target="_blank" onclick="event.stopPropagation();" class="bg-white text-xs px-2 py-1 shadow border rounded-sm text-blue-600"><i class="fas fa-external-link-alt"></i> </a>').join('')}
                </div>
            </div>`;
        }
        
        // Invalid input
        return `
            <div class="w-60 flex flex-col items-center gap-4 p-2 bg-white rounded">
                <div class="flex flex-col items-center justify-center text-center border w-full h-60 rounded-sm bg-gray-50">
                    <span>Keine Medien <br> verfügbar</span>
                </div>
            </div>`;

    }

    // Function to display media details based on the search source
    function displayDetailsMedia(observation, searchSource) {
        $('#detailsMedia').html('');
        switch (searchSource) {
            case 1: // show media from GBIF
                $('#detailsMedia').html(displayDetailsGBIFMedia(observation));
                break

            case 2: // show media from GeoCase
                $('#detailsMedia').html(displayGeoCASeDetailsMedia(observation));
                break

            case 3: // show media from OSCA
                $('#detailsMedia').html(displayOSCADetailsMedia(observation.media));
                break

        }
    }

    // Function to process and display details for GBIF observations
    function displayDetailsGBIF(obs) {
        console.dir(obs);

        let rows = '';
        if (obs) {
            for (const [key, value] of Object.entries(obs)) {
                if (value && (key.includes('Key') || key.includes('ID'))) {
                    switch (key) {
                        case 'datasetKey':
                            rows += `
                            <tr class="hover:bg-white text-left">
                                <th class="border-t-0 px-3 align-middle text-xs whitespace-nowrap p-4">
                                    ${camelCaseToWords(key)}
                                </th>
                                <td class="break-words border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs p-4">
                                    <a href="https://www.gbif.org/dataset/${value}" target="_blank" onclick="event.stopPropagation();" class="text-blue-700 underline">${value}</a>
                                </td>
                            </tr>`;
                        break;

                        case 'publishingOrgKey':
                            rows += `
                            <tr class="hover:bg-white text-left">
                                <th class="border-t-0 px-3 align-middle text-xs whitespace-nowrap p-4">
                                    ${camelCaseToWords(key)}
                                </th>
                                <td class="break-words border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs p-4">
                                    <a href="https://www.gbif.org/publisher/${value}" target="_blank" onclick="event.stopPropagation();" class="text-blue-700 underline">${value}</a>
                                </td>
                            </tr>`;
                        break;

                        case 'taxonKey':
                            rows += `
                            <tr class="hover:bg-white text-left">
                                <th class="border-t-0 px-3 align-middle text-xs whitespace-nowrap p-4">
                                    ${camelCaseToWords(key)}
                                </th>
                                <td class="break-words border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs p-4">
                                    <a href="https://www.gbif.org/species/${value}" target="_blank" onclick="event.stopPropagation();" class="text-blue-700 underline">${value}</a>
                                </td>
                            </tr>`;
                        break;

                        case 'speciesKey':
                            rows += `
                            <tr class="hover:bg-white text-left">
                                <th class="border-t-0 px-3 align-middle text-xs whitespace-nowrap p-4">
                                    ${camelCaseToWords(key)}
                                </th>
                                <td class="break-words border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs p-4">
                                    <a href="https://www.gbif.org/species/${value}" target="_blank" onclick="event.stopPropagation();" class="text-blue-700 underline">${value}</a>
                                </td>
                            </tr>`;
                        break;

                        case 'gbifID':
                            rows += `
                            <tr class="hover:bg-white text-left">
                                <th class="border-t-0 px-3 align-middle text-xs whitespace-nowrap p-4">
                                    ${camelCaseToWords(key)}
                                </th>
                                <td class="break-words border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs p-4">
                                    <a href="https://www.gbif.org/occurrence/${value}" target="_blank" onclick="event.stopPropagation();" class="text-blue-700 underline">${value}</a>
                                </td>
                            </tr>`;
                        break;
                        
                        default:
                            rows += `
                            <tr class="hover:bg-white text-left">
                                <th class="border-t-0 px-3 align-middle text-xs whitespace-nowrap p-4">
                                    ${camelCaseToWords(key)}
                                </th>
                                <td class="break-words border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs p-4">
                                ${typeof value === 'object' ? JSON.stringify(value) : value}
                                </td>
                            </tr>`;
                        break
                    }

                   
                }
            }
        }

        let htmlKeysTemplate = `
        <table class="items-center w-full border shadow-lg rounded bg-green-50 overflow-hidden">
            <thead>
                <tr>
                    <th class="w-1/4 px-3 bg-p-bluegray-50 text-p-bluegray-500 align-middle border-b py-3 text-xs uppercase whitespace-nowrap font-semibold text-left">
                        Observation Key
                    </th>
                    <th class="px-3 bg-p-bluegray-50 text-p-bluegray-500 align-middle border-b py-3 text-xs uppercase font-semibold text-left">
                        Observation Value
                    </th>
                </tr>
            </thead>
            <tbody  class="mt-12">
                ${rows}
            </tbody>
        </table>
        `;

        let dataRows = '';
        if (obs) {
            for (const [key, value] of Object.entries(obs)) {
                if (value && !key.includes('Key') && !key.includes('ID')) {

                    dataRows +=
                        `
            <tr class="hover:bg-white text-left">
                <th class="border-t-0 px-3 align-middle text-xs whitespace-nowrap p-4">
                    ${camelCaseToWords(key)}
                </th>
                <td class="break-all border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs p-4">
                ${typeof value === 'object' ? JSON.stringify(value) : value}
                </td>
            </tr>
            `;
                }
            }
        }

        let htmlDataTemplate = `
        <table class="items-center w-full border shadow-lg rounded bg-pink-50 overflow-hidden">
            <thead>
                <tr>
                    <th class="w-1/4 px-3 bg-p-bluegray-50 text-p-bluegray-500 align-middle border-b py-3 text-xs uppercase whitespace-nowrap font-semibold text-left">
                        Observation Key
                    </th>
                    <th class="px-3 bg-p-bluegray-50 text-p-bluegray-500 align-middle border-b py-3 text-xs uppercase font-semibold text-left">
                        Observation Value
                    </th>
                </tr>
            </thead>
            <tbody  class="mt-12">
                ${dataRows}
            </tbody>
        </table>
        `;

        let htmlTemplate =
            `
        <div class="w-full px-4 py-2"> 
            <div class="pb-4"> <b> IDENTIFICATION KEYS </b> </div>
            ${htmlKeysTemplate} 
            <div class="py-4"> <b> OCCURENCE DATA </b> </div>
            ${htmlDataTemplate} 
        </div>
        `;

        $('#detailsScientificName').html(obs.scientificName);

        return htmlTemplate;
    }

    // Function to process and display details for GBIF observations
    function displayDetailsGeoCASe(obs) {
        let rows = '';
        if (obs) {
            for (const [key, value] of Object.entries(obs)) {
                if (value && key.endsWith('id')) {

                    rows +=
                        `
            <tr class="hover:bg-white text-left">
                <th class="border-t-0 px-3 align-middle text-xs whitespace-nowrap p-4">
                    ${camelCaseToWords(key)}
                </th>
                <td class="break-words border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs p-4">
                ${typeof value === 'object' ? JSON.stringify(value) : value}
                </td>
            </tr>
            `;
                }
            }
        }

        let htmlKeysTemplate = `
        <table class="items-center w-full border shadow-lg rounded bg-blue-50 overflow-hidden">
            <thead>
                <tr>
                    <th class="w-1/4 px-3 bg-p-bluegray-50 text-p-bluegray-500 align-middle border-b py-3 text-xs uppercase whitespace-nowrap font-semibold text-left">
                        Observation Key
                    </th>
                    <th class="px-3 bg-p-bluegray-50 text-p-bluegray-500 align-middle border-b py-3 text-xs uppercase font-semibold text-left">
                        Observation Value
                    </th>
                </tr>
            </thead>
            <tbody  class="mt-12">
                ${rows}
            </tbody>
        </table>
        `;

        let dataRows = '';
        if (obs) {
            for (const [key, value] of Object.entries(obs)) {
                if (value && !key.endsWith('id')) {

                    dataRows +=
                        `
            <tr class="hover:bg-white text-left">
                <th class="border-t-0 px-3 align-middle text-xs whitespace-nowrap p-4">
                    ${camelCaseToWords(key)}
                </th>
                <td class="break-all border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs p-4">
                ${typeof value === 'object' ? JSON.stringify(value) : value}
                </td>
            </tr>
            `;
                }
            }
        }

        let htmlDataTemplate = `
        <table class="items-center w-full border shadow-lg rounded bg-pink-50 overflow-hidden">
            <thead>
                <tr>
                    <th class="w-1/4 px-3 bg-p-bluegray-50 text-p-bluegray-500 align-middle border-b py-3 text-xs uppercase whitespace-nowrap font-semibold text-left">
                        Observation Key
                    </th>
                    <th class="px-3 bg-p-bluegray-50 text-p-bluegray-500 align-middle border-b py-3 text-xs uppercase font-semibold text-left">
                        Observation Value
                    </th>
                </tr>
            </thead>
            <tbody  class="mt-12">
                ${dataRows}
            </tbody>
        </table>
        `;

        let htmlTemplate =
            `
        <div class="w-full px-4 py-2"> 
            <div class="pb-4"> <b> IDENTIFICATION KEYS </b> </div>
            ${htmlKeysTemplate} 
            <div class="py-4"> <b> OCCURANCE DATA </b> </div>
            ${htmlDataTemplate} 
        </div>
        `;

        $('#detailsScientificName').html(obs.fullscientificname);

        return htmlTemplate;
    }

    // Function to process and display details for OSCA observations
    function displayDetailsOSCA(obs) {
        let rows = `
            <tr class="hover:bg-white text-left">
                <th class="border-t-0 px-3 align-middle text-xs whitespace-nowrap p-4">
                    ${camelCaseToWords('collection_number')}
                </th>
                <td class="break-words border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs p-4">
                ${obs.collection_number}
                </td>
            </tr>
            <tr class="hover:bg-white text-left">
                <th class="border-t-0 px-3 align-middle text-xs whitespace-nowrap p-4">
                    ${camelCaseToWords('physical_specimen_id')}
                </th>
                <td class="break-words border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs p-4">
                ${obs.phisical_specimen_id}
                </td>
            </tr>
            `;

        let htmlKeysTemplate = `
        <table class="items-center w-full border shadow-lg rounded bg-p-orange-50 overflow-hidden">
            <thead>
                <tr>
                    <th class="w-1/4 px-3 bg-p-bluegray-50 text-p-bluegray-500 align-middle border-b py-3 text-xs uppercase whitespace-nowrap font-semibold text-left">
                        Observation Key
                    </th>
                    <th class="px-3 bg-p-bluegray-50 text-p-bluegray-500 align-middle border-b py-3 text-xs uppercase font-semibold text-left">
                        Observation Value
                    </th>
                </tr>
            </thead>
            <tbody  class="mt-12">
                ${rows}
            </tbody>
        </table>
        `;

        let dataRows = '';
        if (obs) {
            for (const [key, value] of Object.entries(obs)) {
                if (value && !key.includes('collection_number') && !key.includes('phisical_specimen_id')) {

                    dataRows +=
                        `
            <tr class="hover:bg-white text-left">
                <th class="border-t-0 px-3 align-middle text-xs whitespace-nowrap p-4">
                    ${camelCaseToWords(key)}
                </th>
                <td class="break-all border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs p-4">
                ${typeof value === 'object' ? JSON.stringify(value) : value}
                </td>
            </tr>
            `;
                }
            }
        }

        let htmlDataTemplate = `
        <table class="items-center w-full border shadow-lg rounded bg-pink-50 overflow-hidden">
            <thead>
                <tr>
                    <th class="w-1/4 px-3 bg-p-bluegray-50 text-p-bluegray-500 align-middle border-b py-3 text-xs uppercase whitespace-nowrap font-semibold text-left">
                        Observation Key
                    </th>
                    <th class="px-3 bg-p-bluegray-50 text-p-bluegray-500 align-middle border-b py-3 text-xs uppercase font-semibold text-left">
                        Observation Value
                    </th>
                </tr>
            </thead>
            <tbody  class="mt-12">
                ${dataRows}
            </tbody>
        </table>
        `;

        let htmlTemplate =
            `
        <div class="w-full px-4 py-2"> 
            <div class="pb-4"> <b> IDENTIFICATION KEYS </b> </div>
            ${htmlKeysTemplate} 
            <div class="py-4"> <b> OCCURANCE DATA </b> ${obs.media.length>2? '<span class="ml-4 rounded-full py-1 px-3 bg-p-blue-700 font-bold text-white">MIDS 2</span>' : '<span class="ml-4 rounded-full py-1 px-3 bg-p-blue-700 font-bold text-white">MIDS 1</span>'} </div>
            ${htmlDataTemplate} 
        </div>
        `;

        $('#detailsScientificName').html(obs.scientific_name);

        return htmlTemplate;
    }

    // Function to process and display details based on the search source
    function processDetails(obs, searchSource) {

        $('#detailsBody').html('');

        switch (searchSource) {
            case 1: // GBIF
                $('#detailsBody').html(displayDetailsGBIF(obs));
                break;

            case 2: // GeoCase
                $('#detailsBody').html(displayDetailsGeoCASe(obs));
                break;

            case 3: // OSCA
                $('#detailsBody').html(displayDetailsOSCA(obs));
                break;

        }

    }

    // Function to handle the modal display for details
    function modalHandler(val, idx) {
        let modal = $("#modal");
        if (val) {
            modal.removeClass('hidden'); //show modal
            processDetails(currentResults[idx], searchSourceSelectedValue)
            displayDetailsMedia(currentResults[idx], searchSourceSelectedValue)
        } else {
            modal.addClass('hidden'); //hide modal
        }
    };

    // Function to handle the modal display for new details
    function newModalHandler(val, stringObj) {
        let modal = $("#modal");
        if (val) {
            modal.removeClass('hidden'); //show modal
            console.log(JSON.parse(decodeURIComponent(stringObj)));
            processDetails(JSON.parse(decodeURIComponent(stringObj)), 3);
            displayDetailsMedia(JSON.parse(decodeURIComponent(stringObj)), 3)
        } else {
            modal.addClass('hidden'); //hide modal
        }
    };

    // Expose only the necessary functions
    return {
        init: init,
        processDetails: processDetails,
        displayDetailsMedia: displayDetailsMedia,
        modalHandler: modalHandler,
        newModalHandler: newModalHandler
    };
})();
