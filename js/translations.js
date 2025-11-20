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
                debug: true,
                lng: getLanguageFromUrl(window.location.href), // evtl. use language-detector https://github.com/i18next/i18next-browser-languageDetector
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
                                    dataOwner: 'Owner:'
                                }
                            },
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
            });
  