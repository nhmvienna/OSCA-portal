function getLanguageFromUrl(url) {

    const path = new URL(url).pathname.split('/').filter(Boolean);
    let defaultLang = null;

    if (path.length > 1 && /^[a-z]{2}$/i.test(path[0])) {
        defaultLang = path[0];
    }

    return defaultLang;
}

// use plugins and options as needed, for options, detail see
// http://i18next.com/docs/
i18next.init({
    debug: false,
    lng: getLanguageFromUrl(window.parent.location.href), // evtl. use language-detector https://github.com/i18next/i18next-browser-languageDetector
    resources: { // evtl. load via xhr https://github.com/i18next/i18next-xhr-backend
        en: {
            translation: {
                app: {
                    search: 'Search',
                    results: 'Results:',
                    resultsFromOSCA: 'from OSCA',
                    resultsFromGBIF: 'from GBIF',
                    resultsFromGeoCASE: 'from GeoCASe',
                    resultsFromEuropeana: 'from Europeana',
                    resultsFromDiSSCO: 'from DiSSCO',
                    oscaInNumbers: 'OSCA in Numbers',
                    downloadResults: 'Download Results',
                    filterList: 'Filter List (under Development)',
                    filterOrganization: 'Organization',
                    filterOrganizationPlaceholder: 'Type an Organization name',
                    filterDataId: 'Data ID',
                    filterDataIdPlaceholer: 'For example: 12345',
                    filterBtnApply: 'Apply Filters',
                    filterBtnReset: 'Reset Filters',
                    resultCard: {
                        dataDetails: 'Show Details',
                        originalDetail: 'Show Original Source',
                        errorImage: 'No Media available',
                        dataOwner: 'Owner:',
                        specimenType: 'Specimen Type:',
                        objectType: 'Object Type:',
                        license: 'License'
                    },
                    inNumbers: {
                        title: 'OSCA in Numbers',
                        subtitle: 'The OSCA consortium currently consists of 15 institutions from across Austria that preserve, develop, research, and make accessible to the public biological and geoscientific collections. These statistics illustrate our process and the distribution of our resources.',
                        lastUpdate: 'Last Update: ',
                        preparation: {
                            title: '1. Preparation',
                            totalObjects: 'Prepared Objects',
                            mollusks: 'Mollusks',
                            endemics: 'Endemics',
                            drySpecimen: 'Dry Spec.',
                            wetSpecimen: 'Wet Spe.'
                        },
                        cataloging: {
                            title: '2. Cataloging Metadata',
                            totalObjects: 'Cataloged Objects',
                            mids0: 'MIDS Level 0',
                            mids1: 'MIDS Level 0',
                            mids2: 'MIDS Level 2',
                            mids3: 'MIDS Level 3'
                        },
                        digitizing: {
                            title: '3. Digitization',
                            totalObjects: 'Digitized Objects',
                            onePic: 'Min. One Picture',
                            picGallery: 'With Picture Gallery',
                            multimedia: 'Multimedia Available'
                        },
                        exposing: {
                            title: '4. Exposure to OSCA Portal',
                            totalObjects: 'Exposed Objects',
                            endemics: 'Endemics',
                            mollusks: 'Mollusks'
                        },
                        publishing: {
                            title: '5.Integration/Dissemination in International Portals',
                            totalObjects: 'Published Objects'
                        }

                    }
                },
                occurrence: {
                    header: 'OCCURRENCE DETAILS',
                    backToPortalBtn: 'Back to Search',
                    identifiers: 'IDENTIFIERS for',
                    data: 'OCCURRENCE DATA with Quality',
                    extra: 'EXTRA OCCURRENCE DATA'
                }
            }
        }
    }
}, function (err, t) {
    // for options see
    // https://github.com/i18next/jquery-i18next#initialize-the-plugin
    jqueryI18next.init(i18next, $, { useOptionsAttr: true });

    // start localizing, details:
    // https://github.com/i18next/jquery-i18next#usage-of-selector-function
    $('.app').localize();
    $('.occurrence').localize();
});
