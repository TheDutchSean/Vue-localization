export function getBrowserLang(){
    
    const langFull = navigator.language;
    // const lang = langFull.split("-");  
    // return lang[0];
    return langFull
}


// path = the source target
// selectedLang = selected language
// mode = fetch will use fetch and req will use VUE require
async function getLocalization(path, selectedLang, mode = "req"){

    let response = null;
    let data = null;

    // if path is URL or mode is fetch     
    if(path.startsWith("http:") || path.startsWith("https:") || path.startsWith("ftp:") || path.startsWith("file:") || path.startsWith("data:") || mode === "fetch"){
        response = await fetch(path);
        // check response
        if(response.headers.get("content-type").startsWith("application/json")){
            data = await response.json();
        }
    }
    // if path is NOT URL and not fetch
    else{
        try{
            data = await require(`@/localization/${path.toLowerCase()}/${selectedLang}.json`);
        }
        catch(e){
            console.warn(`module ${selectedLang}.json not found at @/localization/${path.toLowerCase()}/${selectedLang}.json.`)
        }
    }
    return data;
}


// path = the source target
// selectedLang = selected language
// mode = fetch will use fetch and req will use VUE require
// route = VUE active route - for dynamic strings
export async function langSet(path, selectedLang, route, mode = "req"){
 
    const locCode = selectedLang.split("-")

    // get localization json
    const localization = await getLocalization(path, locCode[0], mode);
    // get element and set new inner text
    for(let element in localization){
        if(document.querySelector(element) !== null){
            // get node list
            const nodes = document.querySelectorAll(element)
            const nrNodes = nodes.length;
            for(let index = 0; index < nrNodes; index++){
                const dynamicStr = await VUEDynamicStr(localization[element], route);
                nodes[index].innerText = String(dynamicStr);
            }
        }
    }
    
}


// path = the source target
// selectedLang = selected language
// mode = fetch will use fetch and req will use VUE require
export async function langSetO(path, selectedLang, mode = "req"){
 
    const locCode = selectedLang.split("-")

    // get localization json
    const localization = await getLocalization(path, locCode[0], mode);
    // get element and set new inner text
    for(let element in localization){
        if(document.querySelector(element) !== null){
            // get node list
            const nodes = document.querySelectorAll(element)
            const nrNodes = nodes.length;
            for(let index = 0; index < nrNodes; index++){
                nodes[index].innerText = String(localization[element]);
            }
        }
    }
}


export async function getLangLabel(key, path, selectedLang, mode = "req"){

    const locCode = selectedLang.split("-");
    let output = "";

    // get localization json
    const localization = await getLocalization(path.toLowerCase(), locCode[0], mode);
    
    if(localization === undefined || localization === null){     
        output = `file ${path.toLowerCase()+locCode[0]}.json not found in localization for:${selectedLang}.`;
    }
    else{
        const keys = Object.keys(localization)
        // check json on key
        for(let i in keys){
            if(keys[i] == key){
                output = localization[key];
                break;
            }
            else{
                output = `key:${key} not found in ${path.toLowerCase()+locCode[0]}.json for:${selectedLang}.`;
            }
        } 
    }
    return output;    
}


// function to insert a varible into a string by using "${myVar}"
async function VUEDynamicStr(input, route){

    const regExp = "\\$\{(.*?)\}";
    const regExpAll = new RegExp(regExp,'g');
 
    let result = input;

    if(input.match(regExp) !== null){
        
        try{
            const data = await require(`@/views/${route}.vue`).default;
            
            const inputVariables = input.match(regExpAll);
            const numberOfVar = inputVariables.length;

            for(let i = 0; i < numberOfVar; i++){
                let variable = inputVariables[i].replace("${","").replace("}","");
                result = result.replace(inputVariables[i], data[variable]);
            }
        }
        catch(e){
            console.warn(`module ..src/views/${route}.vue not found.`)
        }    
    }
    return result;
}

const localization = {
    switchLabel : getLangLabel,
    langSet : langSet,
    getBrowser : getBrowserLang
}

export default localization;