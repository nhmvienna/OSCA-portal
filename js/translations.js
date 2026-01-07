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
        },
        bs: {
            translation: {
                app: {
                    search: 'Pretraga',
                    results: 'Rezultati:',
                    resultsFromOSCA: 'iz OSCA',
                    resultsFromGBIF: 'iz GBIF',
                    resultsFromGeoCASE: 'iz GeoCASe',
                    resultsFromEuropeana: 'iz Europeana',
                    resultsFromDiSSCO: 'iz DiSSCO',
                    oscaInNumbers: 'OSCA u brojevima',
                    downloadResults: 'Rezultati download-a',
                    filterList: 'Filter lista (pod obradom)',
                    filterOrganization: 'Organizacija',
                    filterOrganizationPlaceholder: 'Utipkajte ime organizacije',
                    filterDataId: 'Data ID',
                    filterDataIdPlaceholer: 'Naprimjer: 12345',
                    filterBtnApply: 'Koristi filtere',
                    filterBtnReset: 'Resetuj filtere',
                    resultCard: {
                        dataDetails: 'Pogledaj detalje',
                        originalDetail: 'Pogledaj originalni izvor',
                        errorImage: 'Mediji nisu dostupni',
                        dataOwner: 'Vlasnik:',
                        specimenType: 'Tip sepecimena:',
                        objectType: 'Tip objekta:',
                        license: 'Licenca'
                    },
                    inNumbers: {
                        title: 'OSCA u brojevima',
                        subtitle: 'Konzorcij OSCA trenutno se sastoji od 15 institucija diljem Austrije koje čuvaju, razvijaju, istražuju i čine dostupnima javnosti biološke i geoznanstvene zbirke. Ove statistike ilustriraju naš proces i raspodjelu naših resursa.',
                        lastUpdate: 'Zadnji update: ',
                        preparation: {
                            title: '1. Priprema',
                            totalObjects: 'Pripremljeni objekti',
                            mollusks: 'Mollusks',
                            endemics: 'Endemics',
                            drySpecimen: 'Suhi specimen.', //Suhi specimen
                            wetSpecimen: 'Mokri specimen.' //Mokri specimen
                        },
                        cataloging: {
                            title: '2. Kataloziranje metapodataka',
                            totalObjects: 'Katalizirani predmeti',
                            mids0: 'MIDS Level 0',
                            mids1: 'MIDS Level 0',
                            mids2: 'MIDS Level 2',
                            mids3: 'MIDS Level 3'
                        },
                        digitizing: {
                            title: '3. Digitalizacija',
                            totalObjects: 'Digitalizirani objekti',
                            onePic: 'Minimalno jedna slika',
                            picGallery: 'Sa galerijom slika',
                            multimedia: 'Multimedija dostupna'
                        },
                        exposing: {
                            title: '4. Ekspozitura za OSCA Portal',
                            totalObjects: 'Izloženi predmeti',
                            endemics: 'Endemics',
                            mollusks: 'Mollusks'
                        },
                        publishing: {
                            title: 'Integracija/difuzija na međunarodnim portalima',
                            totalObjects: 'Objavljeni predmeti'
                        }
                    }
                },
                occurrence: {
                    header: 'Detalji pojave',
                    backToPortalBtn: 'Povratak na pretraživanje',
                    identifiers: 'IDENTIFIKATORI za',
                    data: 'Podaci o pojavljivanju s kvalitetom',
                    extra: 'PODACI O DODATNIM DOGAĐAJIMA'
                }
            }
        },
        sr: {
            translation: {
                app: {
                    search: 'Pretraga',
                    results: 'Rezultati:',
                    resultsFromOSCA: 'iz OSCA',
                    resultsFromGBIF: 'iz GBIF',
                    resultsFromGeoCASE: 'iz GeoCASe',
                    resultsFromEuropeana: 'iz Europeana',
                    resultsFromDiSSCO: 'iz DiSSCO',
                    oscaInNumbers: 'OSCA u brojevima',
                    downloadResults: 'Rezultati download-a',
                    filterList: 'Filter lista (pod obradom)',
                    filterOrganization: 'Organizacija',
                    filterOrganizationPlaceholder: 'Utipkajte ime organizacije',
                    filterDataId: 'Data ID',
                    filterDataIdPlaceholer: 'Naprimjer: 12345',
                    filterBtnApply: 'Koristi filtere',
                    filterBtnReset: 'Resetuj filtere',
                    resultCard: {
                        dataDetails: 'Pogledaj detalje',
                        originalDetail: 'Pogledaj originalni izvor',
                        errorImage: 'Mediji nisu dostupni',
                        dataOwner: 'Vlasnik:',
                        specimenType: 'Tip sepecimena:',
                        objectType: 'Tip objekta:',
                        license: 'Licenca'
                    },
                    inNumbers: {
                        title: 'OSCA u brojevima',
                        subtitle: 'Konzorcij OSCA trenutno se sastoji od 15 institucija diljem Austrije koje čuvaju, razvijaju, istražuju i čine dostupnima javnosti biološke i geoznanstvene zbirke. Ove statistike ilustriraju naš proces i raspodjelu naših resursa.',
                        lastUpdate: 'Zadnji update: ',
                        preparation: {
                            title: '1. Priprema',
                            totalObjects: 'Pripremljeni objekti',
                            mollusks: 'Mollusks',
                            endemics: 'Endemics',
                            drySpecimen: 'Suhi specimen.', //Suhi specimen
                            wetSpecimen: 'Mokri specimen.' //Mokri specimen
                        },
                        cataloging: {
                            title: '2. Kataloziranje metapodataka',
                            totalObjects: 'Katalizirani predmeti',
                            mids0: 'MIDS Level 0',
                            mids1: 'MIDS Level 0',
                            mids2: 'MIDS Level 2',
                            mids3: 'MIDS Level 3'
                        },
                        digitizing: {
                            title: '3. Digitalizacija',
                            totalObjects: 'Digitalizirani objekti',
                            onePic: 'Minimalno jedna slika',
                            picGallery: 'Sa galerijom slika',
                            multimedia: 'Multimedija dostupna'
                        },
                        exposing: {
                            title: '4. Ekspozitura za OSCA Portal',
                            totalObjects: 'Izloženi predmeti',
                            endemics: 'Endemics',
                            mollusks: 'Mollusks'
                        },
                        publishing: {
                            title: 'Integracija/difuzija na međunarodnim portalima',
                            totalObjects: 'Objavljeni predmeti'
                        }
                    }
                },
                occurrence: {
                    header: 'Detalji pojave',
                    backToPortalBtn: 'Povratak na pretraživanje',
                    identifiers: 'IDENTIFIKATORI za',
                    data: 'Podaci o pojavljivanju s kvalitetom',
                    extra: 'PODACI O DODATNIM DOGAĐAJIMA'
                }
            }
        },
        hr: {
            translation: {
                app: {
                    search: 'Pretraga',
                    results: 'Rezultati:',
                    resultsFromOSCA: 'iz OSCA',
                    resultsFromGBIF: 'iz GBIF',
                    resultsFromGeoCASE: 'iz GeoCASe',
                    resultsFromEuropeana: 'iz Europeana',
                    resultsFromDiSSCO: 'iz DiSSCO',
                    oscaInNumbers: 'OSCA u brojevima',
                    downloadResults: 'Rezultati download-a',
                    filterList: 'Filter lista (pod obradom)',
                    filterOrganization: 'Organizacija',
                    filterOrganizationPlaceholder: 'Utipkajte ime organizacije',
                    filterDataId: 'Data ID',
                    filterDataIdPlaceholer: 'Naprimjer: 12345',
                    filterBtnApply: 'Koristi filtere',
                    filterBtnReset: 'Resetuj filtere',
                    resultCard: {
                        dataDetails: 'Pogledaj detalje',
                        originalDetail: 'Pogledaj originalni izvor',
                        errorImage: 'Mediji nisu dostupni',
                        dataOwner: 'Vlasnik:',
                        specimenType: 'Tip sepecimena:',
                        objectType: 'Tip objekta:',
                        license: 'Licenca'
                    },
                    inNumbers: {
                        title: 'OSCA u brojevima',
                        subtitle: 'Konzorcij OSCA trenutno se sastoji od 15 institucija diljem Austrije koje čuvaju, razvijaju, istražuju i čine dostupnima javnosti biološke i geoznanstvene zbirke. Ove statistike ilustriraju naš proces i raspodjelu naših resursa.',
                        lastUpdate: 'Zadnji update: ',
                        preparation: {
                            title: '1. Priprema',
                            totalObjects: 'Pripremljeni objekti',
                            mollusks: 'Mollusks',
                            endemics: 'Endemics',
                            drySpecimen: 'Suhi specimen.', //Suhi specimen
                            wetSpecimen: 'Mokri specimen.' //Mokri specimen
                        },
                        cataloging: {
                            title: '2. Kataloziranje metapodataka',
                            totalObjects: 'Katalizirani predmeti',
                            mids0: 'MIDS Level 0',
                            mids1: 'MIDS Level 0',
                            mids2: 'MIDS Level 2',
                            mids3: 'MIDS Level 3'
                        },
                        digitizing: {
                            title: '3. Digitalizacija',
                            totalObjects: 'Digitalizirani objekti',
                            onePic: 'Minimalno jedna slika',
                            picGallery: 'Sa galerijom slika',
                            multimedia: 'Multimedija dostupna'
                        },
                        exposing: {
                            title: '4. Ekspozitura za OSCA Portal',
                            totalObjects: 'Izloženi predmeti',
                            endemics: 'Endemics',
                            mollusks: 'Mollusks'
                        },
                        publishing: {
                            title: 'Integracija/difuzija na međunarodnim portalima',
                            totalObjects: 'Objavljeni predmeti'
                        }
                    }
                },
                occurrence: {
                    header: 'Detalji pojave',
                    backToPortalBtn: 'Povratak na pretraživanje',
                    identifiers: 'IDENTIFIKATORI za',
                    data: 'Podaci o pojavljivanju s kvalitetom',
                    extra: 'PODACI O DODATNIM DOGAĐAJIMA'
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
