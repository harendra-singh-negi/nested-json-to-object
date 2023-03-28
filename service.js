/*
Author :Harendra Simgh Negi
Contact :harendrasinghnegi83@gmail.com
*/

'use strict'
const JsonToOnlyObjectConverter = (obj) => {
    let MainKey = Object.keys(obj);
    let output = {}
    MainKey.forEach(item => {
        let temp = {}
        // check key type
        if (typeof obj[item] === "object") {
            temp = JsonToOnlyObjectConverter(obj[item]);
        } else if (typeof obj[item] === "array") {
            // id key type is array then pas one by one oject to same function
            temp = obj[item].map(v => JsonToOnlyObjectConverter(v));
        } else if (typeof obj[item] === "boolean") {
            temp[item] = obj[item] ? "TRUE" : "FALSE";
        } else {
            // normal key value  
            temp[item] = obj[item];
        }
        // append all key to one object 
        output = { ...output, ...temp }
    })
    return output;
}

// this is master function of genrate all type of report 
async function GetDataforApi(dbname, filter, TableHeader = [], notRequirekey = { __v: 0, _id: 0 }) {

    let results = await dbname.find(filter, notRequirekey);
    const FinalOutPut = ConvertNormalJsonObject(results, TableHeader)
    return FinalOutPut;
}

function ConvertNormalJsonObject(results = [], TableHeader = []) {
    let UnicKey = [];
    let FinalOutPut = [];

    results = JSON.parse(JSON.stringify(results), true)
    const HeaderLength = TableHeader.length;
    let output = results.map(item => {
        // convert 
        const newData = JsonToOnlyObjectConverter(item);
        // convert Object allkey to unic normal aaray 
        UnicKey = HeaderLength > 0 ? [] : [...UnicKey, ...new Set(Object.keys(newData))];
        return newData;
    })
    // convert all data to table header array object
    output.map(item => {
        let t = {}
        let RunData = UnicKey
        if (HeaderLength > 0) {
            RunData = TableHeader;
        }
        RunData.map(r => {
            t = {
                ...t,
                // if objecct is not avilable in my output array the make it blank
                [r]: item[r] !== undefined ? item[r] : ""
            }
            return ""
        })
        // if object is not empty them push it to fainal output array
        if (Object.keys(t).length > 0) {
            FinalOutPut.push(t);
        }
    })
    return (FinalOutPut);
}

module.exports = { GetDataforApi, JsonToOnlyObjectConverter, ConvertNormalJsonObject };
