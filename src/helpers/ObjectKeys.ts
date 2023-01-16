const isObject = (a: object) => typeof a === 'object';
const isEmptyObject = (a: object) => !Object.keys(a).length;
const isSimple = (a: object) => !a || !isObject(a) || isEmptyObject(a);
const pop = (a: any[]) => a.pop() || [];

const getObjectKeys = (divider: string, obj: object) => {   
    check(divider, obj);
    
    if (isEmptyObject(obj))
        return [];
    
    return getAll(divider, obj);
}

const getAll = (divider: string, obj: object) => {
    const result = [];
    
    const [currentResult, stack] = readPaths(obj, divider);
    
    result.push(...currentResult);
    
    let [key, current] = pop(stack);
    
    while (current) {
        const [currentResult, currentStack]: any = readPaths(current, divider, key);
        
        result.push(...currentResult);
        stack.push(...currentStack);
        
        [key, current] = pop(stack);
    }
    
    return result;
}

const {entries} = Object;

function readPaths(obj: object, divider: string, path = '') {
    const result = [];
    const stack = [];
    
    for (const [key, value] of entries(obj)) {
        const fullPath = !path ? key : `${path}${divider}${key}`;
        
        if (isSimple(value)) {
            result.push(fullPath);
            continue;
        }
        
        if (value === obj)
            continue;
        
        stack.push([fullPath, value]);
    }
    
    return [result, stack];
}

function check(divider: string, obj: object) {
    if (typeof divider !== 'string')
        throw Error('divider should be a string!');
    
    if (typeof obj !== 'object')
        throw Error('obj should be an object!');
}

export { getObjectKeys }