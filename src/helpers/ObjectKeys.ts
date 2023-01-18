const isObject = (a: object) => typeof a === 'object';
const isEmptyObject = (a: object) => !Object.keys(a).length;
const isSimple = (a: object) => !a || !isObject(a) || isEmptyObject(a);
const pop = (a: any[]) => a.pop() || [];

<<<<<<< HEAD
const extractObjectKeys = (divider: string, obj: object) => {
    check(divider, obj);

    if (isEmptyObject(obj)) {
        return [];
    }
=======
const getObjectKeys = (divider: string, obj: object) => {   
    check(divider, obj);
    
    if (isEmptyObject(obj))
        return [];
>>>>>>> 3ad14eed73ebf3a106cd1d17ef98af8d90549aba
    
    return getAll(divider, obj);
}

const getAll = (divider: string, obj: object) => {
    const result = [];
<<<<<<< HEAD

    const [currentResult, stack] = readPaths(obj, divider);

    result.push(...currentResult);

    let [key, current] = pop(stack);

    while (current) {
        const [currentResult, currentStack]: any = readPaths(current, divider, key);

        result.push(...currentResult);
        stack.push(...currentStack);

        [key, current] = pop(stack);
    }

=======
    
    const [currentResult, stack] = readPaths(obj, divider);
    
    result.push(...currentResult);
    
    let [key, current] = pop(stack);
    
    while (current) {
        const [currentResult, currentStack]: any = readPaths(current, divider, key);
        
        result.push(...currentResult);
        stack.push(...currentStack);
        
        [key, current] = pop(stack);
    }
    
>>>>>>> 3ad14eed73ebf3a106cd1d17ef98af8d90549aba
    return result;
}

const {entries} = Object;

function readPaths(obj: object, divider: string, path = '') {
    const result = [];
    const stack = [];
<<<<<<< HEAD

    for (const [key, value] of entries(obj)) {
        const fullPath = !path ? key : `${path}${divider}${key}`;

=======
    
    for (const [key, value] of entries(obj)) {
        const fullPath = !path ? key : `${path}${divider}${key}`;
        
>>>>>>> 3ad14eed73ebf3a106cd1d17ef98af8d90549aba
        if (isSimple(value)) {
            result.push(fullPath);
            continue;
        }
<<<<<<< HEAD

        if (value === obj)
            continue;

        stack.push([fullPath, value]);
    }

=======
        
        if (value === obj)
            continue;
        
        stack.push([fullPath, value]);
    }
    
>>>>>>> 3ad14eed73ebf3a106cd1d17ef98af8d90549aba
    return [result, stack];
}

function check(divider: string, obj: object) {
    if (typeof divider !== 'string')
        throw Error('divider should be a string!');
<<<<<<< HEAD

=======
    
>>>>>>> 3ad14eed73ebf3a106cd1d17ef98af8d90549aba
    if (typeof obj !== 'object')
        throw Error('obj should be an object!');
}

<<<<<<< HEAD
export { extractObjectKeys }
=======
export { getObjectKeys }
>>>>>>> 3ad14eed73ebf3a106cd1d17ef98af8d90549aba
