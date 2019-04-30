export function getFromStorage(key){
    if(!key){
        return null;
    }

    try{
        const valueStr = localStorage.getItem(key);
        if(valueStr){
            return JSON.parse(valueStr);
        }
        else{
            return null;
        }
    }
    catch (err){
        return null;
    }
}

export function setInStorage(key, obj){
    if(!key){
        console.error('Error: Key is missing');
    }

    try{
        localStorage.setItem(key, JSON.stringify(obj));
    }
    catch(err){
        console.log(err);
    }
} 

export function clearFromStorage (key){
    if(!key){
        return null;
    }
    try{
        localStorage.removeItem(key);
    }
    catch (err){
        return null;
    }

}

// export function clearFromStorage (key){
//     if(!key){
//         return null;
//     }
//     try{
//         localStorage.removeItem(key);
//     }
//     catch (err){
//         return null;
//     }

// }