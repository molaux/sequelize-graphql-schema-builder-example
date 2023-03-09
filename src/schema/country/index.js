import fetch from 'node-fetch'
import _GraphQLJSON from 'graphql-type-json'
const { GraphQLJSON } = _GraphQLJSON

// Use a register to not overwhelm foreign API
const register = new Map([
  [
    "Afghanistan", 
    [
      {
        "name": "Afghanistan",
        "topLevelDomain": [
          ".af"
        ],
        "alpha2Code": "AF",
        "alpha3Code": "AFG",
        "callingCodes": [
          "93"
        ],
        "capital": "Kabul",
        "altSpellings": [
          "AF",
          "Afġānistān"
        ],
        "region": "Asia",
        "subregion": "Southern Asia",
        "population": 40218234,
        "latlng": [
          33,
          65
        ],
        "demonym": "Afghan",
        "area": 652230,
        "timezones": [
          "UTC+04:30"
        ],
        "borders": [
          "IRN",
          "PAK",
          "TKM",
          "UZB",
          "TJK",
          "CHN"
        ],
        "nativeName": "افغانستان",
        "numericCode": "004",
        "currencies": [
          {
            "code": "AFN",
            "name": "Afghan afghani",
            "symbol": "؋"
          }
        ],
        "languages": [
          {
            "iso639_1": "ps",
            "iso639_2": "pus",
            "name": "Pashto",
            "nativeName": "پښتو"
          },
          {
            "iso639_1": "uz",
            "iso639_2": "uzb",
            "name": "Uzbek",
            "nativeName": "Oʻzbek"
          },
          {
            "iso639_1": "tk",
            "iso639_2": "tuk",
            "name": "Turkmen",
            "nativeName": "Türkmen"
          }
        ],
        "translations": {
          "de": "Afghanistan",
          "es": "Afganistán",
          "fr": "Afghanistan",
          "ja": "アフガニスタン",
          "it": "Afghanistan",
          "br": "Afeganistão",
          "pt": "Afeganistão",
          "nl": "Afghanistan",
          "hr": "Afganistan",
          "hu": "Afganisztán",
          "fa": "افغانستان"
        },
        "flag": "https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_the_Taliban.svg",
        "flags": {
          "png": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Flag_of_the_Taliban.svg/320px-Flag_of_the_Taliban.svg.png",
          "svg": "https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_the_Taliban.svg"
        },
        "independent": true,
        "regionalBlocs": [
          {
            "acronym": "SAARC",
            "name": "South Asian Association for Regional Cooperation"
          }
        ],
        "cioc": "AFG"
      }
    ]
  ],
  [
    "Algeria", 
    [
      {
        "name": "Algeria",
        "topLevelDomain": [
          ".dz"
        ],
        "alpha2Code": "DZ",
        "alpha3Code": "DZA",
        "callingCodes": [
          "213"
        ],
        "capital": "Algiers",
        "altSpellings": [
          "DZ",
          "Dzayer",
          "Algérie"
        ],
        "region": "Africa",
        "subregion": "Northern Africa",
        "population": 43851043,
        "latlng": [
          28,
          3
        ],
        "demonym": "Algerian",
        "area": 2381741,
        "timezones": [
          "UTC+01:00"
        ],
        "borders": [
          "TUN",
          "LBY",
          "NER",
          "ESH",
          "MRT",
          "MLI",
          "MAR"
        ],
        "nativeName": "الجزائر",
        "numericCode": "012",
        "currencies": [
          {
            "code": "DZD",
            "name": "Algerian dinar",
            "symbol": "د.ج"
          }
        ],
        "languages": [
          {
            "iso639_1": "ar",
            "iso639_2": "ara",
            "name": "Arabic",
            "nativeName": "العربية"
          }
        ],
        "translations": {
          "de": "Algerien",
          "es": "Argelia",
          "fr": "Algérie",
          "ja": "アルジェリア",
          "it": "Algeria",
          "br": "Argélia",
          "pt": "Argélia",
          "nl": "Algerije",
          "hr": "Alžir",
          "hu": "Algéria",
          "fa": "الجزایر"
        },
        "flag": "https://flagcdn.com/dz.svg",
        "flags": {
          "png": "https://flagcdn.com/w320/dz.png",
          "svg": "https://flagcdn.com/dz.svg"
        },
        "gini": 27.6,
        "independent": true,
        "regionalBlocs": [
          {
            "acronym": "AU",
            "name": "African Union",
            "otherNames": [
              "الاتحاد الأفريقي",
              "Union africaine",
              "União Africana",
              "Unión Africana",
              "Umoja wa Afrika"
            ]
          },
          {
            "acronym": "AL",
            "name": "Arab League",
            "otherNames": [
              "جامعة الدول العربية",
              "Jāmiʻat ad-Duwal al-ʻArabīyah",
              "League of Arab States"
            ]
          }
        ],
        "cioc": "ALG"
      }
    ]
  ],
  [
    "American Samoa", 
    [
      {
        "name": "American Samoa",
        "topLevelDomain": [
          ".as"
        ],
        "alpha2Code": "AS",
        "alpha3Code": "ASM",
        "callingCodes": [
          "1"
        ],
        "capital": "Pago Pago",
        "altSpellings": [
          "AS",
          "Amerika Sāmoa",
          "Amelika Sāmoa",
          "Sāmoa Amelika"
        ],
        "region": "Oceania",
        "subregion": "Polynesia",
        "population": 55197,
        "latlng": [
          -14.33333333,
          -170
        ],
        "demonym": "American Samoan",
        "area": 199,
        "timezones": [
          "UTC-11:00"
        ],
        "nativeName": "American Samoa",
        "numericCode": "016",
        "currencies": [
          {
            "code": "USD",
            "name": "United States Dollar",
            "symbol": "$"
          }
        ],
        "languages": [
          {
            "iso639_1": "en",
            "iso639_2": "eng",
            "name": "English",
            "nativeName": "English"
          },
          {
            "iso639_1": "sm",
            "iso639_2": "smo",
            "name": "Samoan",
            "nativeName": "gagana fa'a Samoa"
          }
        ],
        "translations": {
          "de": "Amerikanisch-Samoa",
          "es": "Samoa Americana",
          "fr": "Samoa américaines",
          "ja": "アメリカ領サモア",
          "it": "Samoa Americane",
          "br": "Samoa Americana",
          "pt": "Samoa Americana",
          "nl": "Amerikaans Samoa",
          "hr": "Američka Samoa",
          "hu": "Amerikai Szamoa",
          "fa": "ساموآی آمریکا"
        },
        "flag": "https://flagcdn.com/as.svg",
        "flags": {
          "png": "https://flagcdn.com/w320/as.png",
          "svg": "https://flagcdn.com/as.svg"
        },
        "independent": false,
        "cioc": "ASA"
      }
    ]
  ]
])

export const extraFields = ({ modelsTypes, nameFormatter }, model) => {
  const extraFields = {}

  if (nameFormatter.namespace === '' && model.name === 'Country') {
    extraFields.infos = {
      type: GraphQLJSON,
      /**
       * A regular GraphQL resolver
       *
       * Here you can link your model to whatever you want.
       * You can pass services handlers through the graphQLContext, like other
       * Sequelize instances (to build fake links between two databases), or mongo, ...
       *
       * @param {*} parent The parent node resolved against a Country Sequelize model instance
       * @param {*} args optional args to your fields
       * @param {*} graphQLContext the GraphQL context
       */
      resolve: async (parent, args, graphQLContext) => {
        if (!register.has(parent.country)) {
          console.log(parent.country)
          register.set(
            parent.country,
            // Looks busy
            await fetch(`https://restcountries.com/rest/v2/name/${parent.country}`)
              .then(response => {
                if (response.ok) {
                  return response
                } else {
                  throw Error(response.statusText)
                }
              })
              .then(response => response.json())
              .catch(() => null)
            
          )
        }

        return register.get(parent.country)
      }
    }
  }
  return extraFields
}
