export function getBrowserLang(){
    const langFull = navigator.language;
    // const lang = langFull.split("-");  
    // return lang[0];
    return langFull
}

async function getLocalization(path){
    const response = await fetch(path);
    if(response.headers.get("content-type").startsWith("application/json")){
        const jsonLocalization = await response.json();
        return jsonLocalization;
    }
}


export async function langSet(path, selectedLang){
 
    const locCode = selectedLang.split("-")

    // get localization json
    const localization = await getLocalization(path.toLowerCase()+locCode[0]+".json");
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


export async function getLangLabel(key, path, selectedLang){

    const locCode = selectedLang.split("-");
    let output = "";

    // get localization json
    const localization = await getLocalization(path.toLowerCase()+locCode[0]+".json");
    
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

