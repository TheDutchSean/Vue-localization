export function getBrowserLang() {
  const langFull = navigator.language;
  // const lang = langFull.split("-");
  // return lang[0];
  return langFull;
}

// path = the source target
// selectedLang = selected language
// mode = fetch will use fetch and req will use VUE require
async function getLocalization(path, selectedLang, mode = "req") {
  let response = null;
  let data = null;

  // if path is URL or mode is fetch
  if (
    path.startsWith("http:") ||
    path.startsWith("https:") ||
    path.startsWith("ftp:") ||
    path.startsWith("file:") ||
    path.startsWith("data:") ||
    mode === "fetch"
  ) {
    response = await fetch(path);
    // check response
    if (response.headers.get("content-type").startsWith("application/json")) {
      data = await response.json();
    }
  }
  // if path is NOT URL and not fetch
  else {
    try {
      data =
        await require(`@/localization/${path.toLowerCase()}/${selectedLang}.json`);
    } catch (e) {
      console.warn(
        `module ${selectedLang}.json not found at @/localization/${path.toLowerCase()}/${selectedLang}.json.`
      );
    }
  }
  return data;
}

// basic function to get, handel and set localizations
async function setLocalizaton(
  path,
  selectedLang,
  previousLang,
  exChange,
  route,
  mode = "req"
) {
  const locCode = selectedLang.split("-");

  // get localization json
  let localization = await getLocalization(path, locCode[0], mode);

  // get app vue elements and set new inner text
  for (let element in localization) {
    if (document.querySelector(element) !== null) {
      // get node list
      const nodes = document.querySelectorAll(element);
      const nrNodes = nodes.length;
      for (let index = 0; index < nrNodes; index++) {
        const dynamicStr = await VUEDynamicStr(localization[element], route);
        const formatedCurrency = await formatCurrency(
          dynamicStr,
          route,
          selectedLang,
          previousLang,
          exChange
        );
        nodes[index].innerText = String(formatedCurrency);
      }
    }
  }
  return true;
}

//=========================================================================
//
// locSet - the latest version of langSet
//
// Sets App and the selected path - dynamic strings and convert currenct and format numbers
//
// path = the source target
// selectedLang = selected language
// mode = fetch will use fetch and req will use VUE require
// route = VUE active route - for dynamic strings
export async function locSet(
  path,
  selectedLang,
  previousLang,
  exChange,
  route,
  mode = "req"
) {
  const ready = await setLocalizaton(
    "App",
    selectedLang,
    previousLang,
    exChange,
    route,
    mode
  );

  // if route exits get and set route
  if (path !== undefined && path !== null && ready) {
    setLocalizaton(path, selectedLang, previousLang, exChange, route, mode);
  }
}

// basic function to get, handel and set Langauge
async function setLanguage(path, selectedLang, route, mode = "req") {
  const locCode = selectedLang.split("-");

  // get localization json
  let localization = await getLocalization(path, locCode[0], mode);

  // get app vue elements and set new inner text
  for (let element in localization) {
    if (document.querySelector(element) !== null) {
      // get node list
      const nodes = document.querySelectorAll(element);
      const nrNodes = nodes.length;
      for (let index = 0; index < nrNodes; index++) {
        const dynamicStr = await VUEDynamicStr(localization[element], route);
        nodes[index].innerText = String(dynamicStr);
      }
    }
  }
  return true;
}

//=========================================================================
//
// langSet
//
// Sets App and the selected path - dynamic strings and convert currenct and format numbers
//
// path = the source target
// selectedLang = selected language
// mode = fetch will use fetch and req will use VUE require
// route = VUE active route - for dynamic strings
// path = the source target
// selectedLang = selected language
// mode = fetch will use fetch and req will use VUE require
// route = VUE active route - for dynamic strings
export async function langSet(path, selectedLang, route, mode = "req") {
  const ready = await setLanguage("App", selectedLang, route, mode);

  // if route exits get and set route
  if (path !== undefined && path !== null && ready) {
    setLanguage(path, selectedLang, route, mode);
  }
}

//=========================================================================
//
// langSetPath
//
// only sets the selected path - dynamic strings and convert currenct and format numbers
//
// path = the source target
// selectedLang = selected language
// mode = fetch will use fetch and req will use VUE require
// route = VUE active route - for dynamic strings
export async function langSetPath(path, selectedLang, route, mode = "req") {
  // if route exits get and set route
  if (path !== undefined && path !== null) {
    setLocalizaton(path, selectedLang, route, mode);
  }
}

//=========================================================================
//
// langSetSlim
//
// only sets selecors and dynamic strings ${myVariable}
//
// path = the source target
// selectedLang = selected language
// mode = fetch will use fetch and req will use VUE require
// route = VUE active route - for dynamic strings
export async function langSetSlim(path, selectedLang, route, mode = "req") {
  const locCode = selectedLang.split("-");

  // get localization json
  const localization = await getLocalization(path, locCode[0], mode);

  // get element and set new inner text
  for (let element in localization) {
    if (document.querySelector(element) !== null) {
      // get node list
      const nodes = document.querySelectorAll(element);
      const nrNodes = nodes.length;
      for (let index = 0; index < nrNodes; index++) {
        const dynamicStr = await VUEDynamicStr(localization[element], route);
        nodes[index].innerText = String(dynamicStr);
      }
    }
  }
}

async function getLangLabel(key, path, selectedLang, mode = "req") {
  const locCode = selectedLang.split("-");
  let output = "";

  // get localization json
  const localization = await getLocalization(
    path.toLowerCase(),
    locCode[0],
    mode
  );

  if (localization === undefined || localization === null) {
    output = `file ${
      path.toLowerCase() + locCode[0]
    }.json not found in localization for:${selectedLang}.`;
  } else {
    const keys = Object.keys(localization);
    // check json on key
    for (let i in keys) {
      if (keys[i] == key) {
        output = localization[key];
        break;
      } else {
        output = `key:${key} not found in ${
          path.toLowerCase() + locCode[0]
        }.json for:${selectedLang}.`;
      }
    }
  }
  return output;
}

// function to insert a varible into a string by using "${myVar}"
async function VUEDynamicStr(input, route) {
  const regExp = "\\${(.*?)}";
  const regExpAll = new RegExp(regExp, "g");

  let result = input;
  let variable = "";

  if (input.match(regExp) !== null) {
    try {
      const data = await require(`@/views/${route}.vue`).default;

      const inputVariables = input.match(regExpAll);
      const numberOfVar = inputVariables.length;

      for (let i = 0; i < numberOfVar; i++) {
        variable = inputVariables[i].replace("${", "").replace("}", "");
        if (data[variable] === undefined) {
          console.warn(
            `${variable} not found in module ..src/views/${route}.vue not found.`
          );
        } else {
          result = result.replace(inputVariables[i], data[variable]);
        }
      }
    } catch (e) {
      console.warn(
        `${variable} not found in module ..src/views/${route}.vue not found.`
      );
    }
  }
  return result;
}

// https://docs.google.com/spreadsheets/d/1sFXfRHjS69RdwcjgK6TuOnGspCq6tWBvmAeNzHgEA2E/edit#gid=363979889
const currencys = {
  "ps-AF": "AFN",
  "fa-AF": "AFN",
  "uz-AF": "AFN",
  "sq-AL": "ALL",
  "en-AL": "ALL",
  "ar-DZ": "DZD",
  "fr-DZ": "DZD",
  "kab-DZ": "DZD",
  "en-AS": "USD",
  "ca-AD": "EUR",
  "en-AD": "EUR",
  "ln-AO": "AOA",
  "pt-AO": "AOA",
  "en-AI": "XCD",
  "es-AI": "XCD",
  "en-AR": "ARS",
  "es-AR": "ARS",
  "hy-AM": "AMD",
  "nl-AW": "AWG",
  "es-AW": "AWG",
  "en-AU": "AUD",
  "en-AT": "EUR",
  "de-AT": "EUR",
  "az-AZ": "AZM",
  "en-BS": "BSD",
  "es-BS": "BSD",
  "ar-BH": "BHD",
  "bn-BD": "BDT",
  "ccp-BD": "BDT",
  "en-BD": "BDT",
  "en-BB": "BBD",
  "es-BB": "BBD",
  "be-BY": "BYR",
  "ru-BY": "BYR",
  "nl-BE": "EUR",
  "en-BE": "EUR",
  "fr-BE": "EUR",
  "de-BE": "EUR",
  "wa-BE": "EUR",
  "en-BZ": "BZD",
  "es-BZ": "BZD",
  "fr-BJ": "XOF",
  "yo-BJ": "XOF",
  "en-BM": "BMD",
  "es-BM": "BMD",
  "dz-BT": "INR",
  "qu-BO": "BOB",
  "es-BO": "BOB",
  "bs-BA": "BAM",
  "hr-BA": "BAM",
  "en-BA": "BAM",
  "sr-BA": "BAM",
  "en-BW": "BWP",
  "tn-BW": "BWP",
  "en-BR": "BRL",
  "pt-BR": "BRL",
  "es-BR": "BRL",
  "en-IO": "USD",
  "ms-BN": "BND",
  "bg-BG": "BGN",
  "en-BG": "BGN",
  "fr-BF": "XOF",
  "ff-BF": "XOF",
  "en-BI": "BIF",
  "fr-BI": "BIF",
  "rn-BI": "BIF",
  "km-KH": "KHR",
  "agq-CM": "XAF",
  "ksf-CM": "XAF",
  "bas-CM": "XAF",
  "dua-CM": "XAF",
  "en-CM": "XAF",
  "ewo-CM": "XAF",
  "fr-CM": "XAF",
  "ff-CM": "XAF",
  "kkj-CM": "XAF",
  "nmg-CM": "XAF",
  "mgo-CM": "XAF",
  "mua-CM": "XAF",
  "nnh-CM": "XAF",
  "jgo-CM": "XAF",
  "yav-CM": "XAF",
  "en-CA": "CAD",
  "fr-CA": "CAD",
  "iu-CA": "CAD",
  "moh-CA": "CAD",
  "es-CA": "CAD",
  "kea-CV": "CVE",
  "pt-CV": "CVE",
  "en-KY": "KYD",
  "es-KY": "KYD",
  "fr-CF": "XAF",
  "ln-CF": "XAF",
  "sg-CF": "XAF",
  "ar-TD": "XAF",
  "fr-TD": "XAF",
  "en-CL": "CLP",
  "arn-CL": "CLP",
  "es-CL": "CLP",
  "en-CX": "AUD",
  "en-CC": "AUD",
  "en-CO": "COP",
  "es-CO": "COP",
  "ar-KM": "KMF",
  "fr-KM": "KMF",
  "en-CK": "NZD",
  "es-CR": "CRC",
  "hr-HR": "HRK",
  "en-HR": "HRK",
  "es-CU": "CUP",
  "en-CY": "CYP",
  "el-CY": "CYP",
  "tr-CY": "CYP",
  "da-DK": "DKK",
  "en-DK": "DKK",
  "fo-DK": "DKK",
  "ar-DJ": "DJF",
  "fr-DJ": "DJF",
  "so-DJ": "DJF",
  "en-DM": "XCD",
  "es-DM": "XCD",
  "es-DO": "DOP",
  "qu-EC": "ECV",
  "es-EC": "ECV",
  "ar-EG": "EGP",
  "es-SV": "SVC",
  "fr-GQ": "XAF",
  "pt-GQ": "XAF",
  "es-GQ": "XAF",
  "ar-ER": "ERN",
  "byn-ER": "ERN",
  "en-ER": "ERN",
  "gez-ER": "ERN",
  "tig-ER": "ERN",
  "ti-ER": "ERN",
  "en-EE": "EEK",
  "et-EE": "EEK",
  "am-ET": "ETB",
  "gez-ET": "ETB",
  "om-ET": "ETB",
  "so-ET": "ETB",
  "ti-ET": "ETB",
  "wal-ET": "ETB",
  "fo-FO": "DKK",
  "en-FJ": "FJD",
  "en-FI": "EUR",
  "fi-FI": "EUR",
  "smn-FI": "EUR",
  "se-FI": "EUR",
  "sv-FI": "EUR",
  "br-FR": "EUR",
  "ca-FR": "EUR",
  "co-FR": "EUR",
  "en-FR": "EUR",
  "fr-FR": "EUR",
  "oc-FR": "EUR",
  "pt-FR": "EUR",
  "gsw-FR": "EUR",
  "fr-GF": "EUR",
  "es-GF": "EUR",
  "fr-PF": "XPF",
  "fr-GA": "XAF",
  "en-GM": "GMD",
  "ff-GM": "GMD",
  "ka-GE": "GEL",
  "os-GE": "GEL",
  "ksh-DE": "EUR",
  "en-DE": "EUR",
  "de-DE": "EUR",
  "nds-DE": "EUR",
  "dsb-DE": "EUR",
  "hsb-DE": "EUR",
  "ak-GH": "GHC",
  "en-GH": "GHC",
  "ee-GH": "GHC",
  "ff-GH": "GHC",
  "gaa-GH": "GHC",
  "ha-GH": "GHC",
  "en-GI": "GIP",
  "en-GR": "EUR",
  "el-GR": "EUR",
  "da-GL": "DKK",
  "kl-GL": "DKK",
  "es-GL": "DKK",
  "en-GD": "XCD",
  "es-GD": "XCD",
  "fr-GP": "EUR",
  "es-GP": "EUR",
  "en-GU": "USD",
  "es-GT": "GTQ",
  "ff-GW": "XOF",
  "pt-GW": "XOF",
  "fr-GN": "GNF",
  "ff-GN": "GNF",
  "kpe-GN": "GNF",
  "nqo-GN": "GNF",
  "en-GY": "GYD",
  "es-GY": "GYD",
  "fr-HT": "HTG",
  "es-HT": "HTG",
  "es-HN": "HNL",
  "yue-HK": "HKD",
  "zh-HK": "HKD",
  "en-HK": "HKD",
  "en-HU": "HUF",
  "hu-HU": "HUF",
  "en-IS": "ISK",
  "is-IS": "ISK",
  "as-IN": "INR",
  "bn-IN": "INR",
  "brx-IN": "INR",
  "ccp-IN": "INR",
  "en-IN": "INR",
  "gu-IN": "INR",
  "hi-IN": "INR",
  "kn-IN": "INR",
  "ks-IN": "INR",
  "kok-IN": "INR",
  "ml-IN": "INR",
  "mni-IN": "INR",
  "mr-IN": "INR",
  "ne-IN": "INR",
  "or-IN": "INR",
  "pa-IN": "INR",
  "sa-IN": "INR",
  "sat-IN": "INR",
  "ta-IN": "INR",
  "te-IN": "INR",
  "bo-IN": "INR",
  "ur-IN": "INR",
  "en-ID": "IDR",
  "id-ID": "IDR",
  "jv-ID": "IDR",
  "ar-IQ": "IQD",
  "ckb-IQ": "IQD",
  "lrc-IQ": "IQD",
  "syr-IQ": "IQD",
  "en-IE": "EUR",
  "ga-IE": "EUR",
  "ar-IL": "ILS",
  "en-IL": "ILS",
  "he-IL": "ILS",
  "ca-IT": "EUR",
  "en-IT": "EUR",
  "fur-IT": "EUR",
  "de-IT": "EUR",
  "it-IT": "EUR",
  "sc-IT": "EUR",
  "scn-IT": "EUR",
  "en-JM": "JMD",
  "en-JP": "JPY",
  "ja-JP": "JPY",
  "ar-JO": "JOD",
  "kk-KZ": "KZT",
  "ru-KZ": "KZT",
  "ebu-KE": "KES",
  "en-KE": "KES",
  "guz-KE": "KES",
  "kln-KE": "KES",
  "kam-KE": "KES",
  "ki-KE": "KES",
  "luo-KE": "KES",
  "luy-KE": "KES",
  "mas-KE": "KES",
  "mer-KE": "KES",
  "om-KE": "KES",
  "saq-KE": "KES",
  "so-KE": "KES",
  "sw-KE": "KES",
  "dav-KE": "KES",
  "teo-KE": "KES",
  "en-KI": "AUD",
  "ar-KW": "KWD",
  "ky-KG": "KGS",
  "ru-KG": "KGS",
  "en-LV": "LVL",
  "lv-LV": "LVL",
  "ar-LB": "LBP",
  "en-LS": "LSL",
  "st-LS": "LSL",
  "en-LR": "LRD",
  "ff-LR": "LRD",
  "kpe-LR": "LRD",
  "vai-LR": "LRD",
  "de-LI": "CHF",
  "gsw-LI": "CHF",
  "en-LT": "LTL",
  "lt-LT": "LTL",
  "en-LU": "EUR",
  "fr-LU": "EUR",
  "de-LU": "EUR",
  "lb-LU": "EUR",
  "pt-LU": "EUR",
  "zh-MO": "MOP",
  "en-MO": "MOP",
  "pt-MO": "MOP",
  "en-MG": "MGA",
  "fr-MG": "MGA",
  "mg-MG": "MGA",
  "en-MW": "MWK",
  "ny-MW": "MWK",
  "en-MY": "MYR",
  "ms-MY": "MYR",
  "ta-MY": "MYR",
  "dv-MV": "MVR",
  "en-MV": "MVR",
  "bm-ML": "XOF",
  "fr-ML": "XOF",
  "khq-ML": "XOF",
  "ses-ML": "XOF",
  "en-MT": "MTL",
  "mt-MT": "MTL",
  "en-MH": "USD",
  "fr-MQ": "EUR",
  "es-MQ": "EUR",
  "ar-MR": "MRO",
  "fr-MR": "MRO",
  "ff-MR": "MRO",
  "en-MU": "MUR",
  "fr-MU": "MUR",
  "mfe-MU": "MUR",
  "fr-YT": "EUR",
  "en-MX": "MXN",
  "es-MX": "MXN",
  "fr-MC": "EUR",
  "mn-MN": "MNT",
  "en-MS": "XCD",
  "es-MS": "XCD",
  "ar-MA": "MAD",
  "tzm-MA": "MAD",
  "fr-MA": "MAD",
  "zgh-MA": "MAD",
  "shi-MA": "MAD",
  "mgh-MZ": "MZM",
  "pt-MZ": "MZM",
  "seh-MZ": "MZM",
  "af-NA": "NAD",
  "en-NA": "NAD",
  "naq-NA": "NAD",
  "en-NR": "AUD",
  "ne-NP": "NPR",
  "nl-NL": "EUR",
  "en-NL": "EUR",
  "nds-NL": "EUR",
  "fy-NL": "EUR",
  "fr-NC": "XPF",
  "en-NZ": "NZD",
  "mi-NZ": "NZD",
  "es-NI": "NIO",
  "fr-NE": "XOF",
  "ff-NE": "XOF",
  "ha-NE": "XOF",
  "twq-NE": "XOF",
  "dje-NE": "XOF",
  "en-NG": "NGN",
  "ff-NG": "NGN",
  "ha-NG": "NGN",
  "ig-NG": "NGN",
  "kaj-NG": "NGN",
  "kcg-NG": "NGN",
  "yo-NG": "NGN",
  "en-NU": "NZD",
  "en-NF": "AUD",
  "en-MP": "USD",
  "en-NO": "NOK",
  "se-NO": "NOK",
  "nb-NO": "NOK",
  "nn-NO": "NOK",
  "ar-OM": "OMR",
  "en-PK": "PKR",
  "ps-PK": "PKR",
  "pa-PK": "PKR",
  "sd-PK": "PKR",
  "ur-PK": "PKR",
  "en-PW": "USD",
  "es-PA": "PAB",
  "en-PG": "PGK",
  "gn-PY": "PYG",
  "es-PY": "PYG",
  "qu-PE": "PEN",
  "es-PE": "PEN",
  "ceb-PH": "PHP",
  "en-PH": "PHP",
  "fil-PH": "PHP",
  "es-PH": "PHP",
  "en-PL": "PLN",
  "pl-PL": "PLN",
  "en-PT": "EUR",
  "pt-PT": "EUR",
  "en-PR": "USD",
  "es-PR": "USD",
  "ar-QA": "QAR",
  "en-RO": "ROL",
  "ro-RO": "ROL",
  "en-RW": "RWF",
  "fr-RW": "RWF",
  "rw-RW": "RWF",
  "en-WS": "WST",
  "it-SM": "EUR",
  "ar-SA": "SAR",
  "en-SA": "SAR",
  "fr-SN": "XOF",
  "ff-SN": "XOF",
  "dyo-SN": "XOF",
  "wo-SN": "XOF",
  "en-SC": "SCR",
  "fr-SC": "SCR",
  "en-SL": "SLL",
  "ff-SL": "SLL",
  "zh-SG": "SGD",
  "en-SG": "SGD",
  "ms-SG": "SGD",
  "ta-SG": "SGD",
  "en-SK": "SKK",
  "sk-SK": "SKK",
  "en-SI": "SIT",
  "sl-SI": "SIT",
  "en-SB": "SBD",
  "ar-SO": "SOS",
  "so-SO": "SOS",
  "af-ZA": "ZAR",
  "en-ZA": "ZAR",
  "nso-ZA": "ZAR",
  "nr-ZA": "ZAR",
  "st-ZA": "ZAR",
  "ss-ZA": "ZAR",
  "ts-ZA": "ZAR",
  "tn-ZA": "ZAR",
  "ve-ZA": "ZAR",
  "xh-ZA": "ZAR",
  "zu-ZA": "ZAR",
  "ast-ES": "EUR",
  "eu-ES": "EUR",
  "ca-ES": "EUR",
  "en-ES": "EUR",
  "gl-ES": "EUR",
  "es-ES": "EUR",
  "si-LK": "LKR",
  "ta-LK": "LKR",
  "ar-SD": "SDD",
  "en-SD": "SDD",
  "nl-SR": "SRD",
  "es-SR": "SRD",
  "en-SE": "SEK",
  "se-SE": "SEK",
  "sv-SE": "SEK",
  "en-CH": "CHF",
  "fr-CH": "CHF",
  "de-CH": "CHF",
  "it-CH": "CHF",
  "pt-CH": "CHF",
  "rm-CH": "CHF",
  "gsw-CH": "CHF",
  "wae-CH": "CHF",
  "tg-TJ": "TJS",
  "en-TH": "THB",
  "th-TH": "THB",
  "pt-TL": "USD",
  "ee-TG": "XOF",
  "fr-TG": "XOF",
  "en-TK": "NZD",
  "en-TO": "TOP",
  "to-TO": "TOP",
  "ar-TN": "TND",
  "fr-TN": "TND",
  "en-TR": "TRL",
  "ku-TR": "TRL",
  "tr-TR": "TRL",
  "tk-TM": "TMM",
  "en-TV": "AUD",
  "cgg-UG": "UGX",
  "en-UG": "UGX",
  "lg-UG": "UGX",
  "nyn-UG": "UGX",
  "xog-UG": "UGX",
  "sw-UG": "UGX",
  "teo-UG": "UGX",
  "en-UA": "UAH",
  "ru-UA": "UAH",
  "uk-UA": "UAH",
  "ar-AE": "AED",
  "en-AE": "AED",
  "kw-GB": "GBP",
  "en-GB": "GBP",
  "gd-GB": "GBP",
  "cy-GB": "GBP",
  "chr-US": "USD",
  "en-US": "USD",
  "haw-US": "USD",
  "lkt-US": "USD",
  "es-US": "USD",
  "es-UY": "UYU",
  "uz-UZ": "UZS",
  "en-VU": "VUV",
  "fr-VU": "VUV",
  "es-VE": "VEB",
  "ar-EH": "MAD",
  "ar-YE": "YER",
  "bem-ZM": "ZMK",
  "en-ZM": "ZMK",
  "en-ZW": "ZWD",
  "nd-ZW": "ZWD",
  "sn-ZW": "ZWD",
};

// API function to get exchange rates
const exAPI = "https://api.exchangerate.host/latest";

async function getExRate() {
  const options = { method: "GET" };
  // fetch url
  const response = await fetch(exAPI, options);

  // check response on succes
  if (!response.ok) throw response.statusText;
  else {
    const type = response.headers.get("content-type");

    const obj = {
      type: type,
      html: null,
      json: null,
      blob: null,
    };

    if (type.startsWith("text/html")) {
      return (obj.html = await response.text());
    } else if (type.startsWith("application/json")) {
      return (obj.json = await response.json());
    } else if (type.startsWith("image/")) {
      return (obj.blob = await response.blob());
    }
  }
}

function convCurrency(number, localization = "en-EU", currency = "EUR") {
  let cleanNumber = number;

  if (typeof cleanNumber != "number") {
    cleanNumber = Number(cleanNumber);
  }

  return new Intl.NumberFormat(localization, {
    style: "currency",
    currency: currency,
  }).format(cleanNumber);

  // end convCurrency function
}

//=========================================================================
//
// calcCurrency
//
// converts a currency value to another according to exchangerate
//
// value = the value that needs to be converted. By adding value-Currency Code the amount will be fixed to that code ( 234-USD )
// selectedLang = selected language
// previousLang = the previou selected language
// currencys = language-country and currency codes
// exChange = currency exchange rates
function calcCurrency(value, selectedLang, previousLang, currencys, exChange) {
  let valueFixed = "";
  const previousCurrency = currencys[previousLang];
  let selectedCurrency = "";

  if (typeof value === "string") {
    valueFixed = value.split("-");
  } else {
    valueFixed = [value];
  }

  if (valueFixed.length === 2) {
    selectedCurrency = [valueFixed[1]];
  } else {
    selectedCurrency = currencys[selectedLang];
  }

  if (selectedCurrency === previousCurrency) {
    return value;
  } else {
    let valueInEUR = Number(valueFixed[0]);
    if (previousCurrency !== "EUR") {
      valueInEUR = Number(valueFixed[0]) / exChange[previousCurrency];
    }
    return valueInEUR * exChange[selectedCurrency];
  }
  // end calcCurrency
}

// function to format currency using a varible by using "#{myVar}"
async function formatCurrency(
  input,
  route,
  selectedLang,
  previousLang,
  exChange
) {
  const regExp = "\\#{(.*?)}";
  const regExpAll = new RegExp(regExp, "g");

  let result = input;
  let variable = "";

  if (currencys[selectedLang] != null && currencys[selectedLang] != undefined) {
    if (input.match(regExp) !== null) {
      try {
        const data = await require(`@/views/${route}.vue`).default;

        const inputVariables = input.match(regExpAll);
        const numberOfVar = inputVariables.length;

        for (let i = 0; i < numberOfVar; i++) {
          variable = inputVariables[i].replace("#{", "").replace("}", "");

          if (data[variable] == undefined) {
            console.warn(
              `${variable} not found in module ..src/views/${route}.vue not found.`
            );
          } else {
            data[variable] = calcCurrency(
              data[variable],
              selectedLang,
              previousLang,
              currencys,
              exChange
            );
            result = result.replace(
              inputVariables[i],
              convCurrency(
                data[variable],
                selectedLang,
                currencys[selectedLang]
              )
            );
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }
  return result;
}

const localization = {
  currencys,
  calcCurrency,
  getExRate,
  switchLabel: getLangLabel,
  locSet,
  langSet,
  langSetPath,
  getBrowser: getBrowserLang,
};

export default localization;
