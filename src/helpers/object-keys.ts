let objectKeys: any[] = [];

const extractObjectKeys = (obj: any, previousPath: string = '') => {

    Object.keys(obj).forEach((key) => {
        const currentPath = previousPath ? `${previousPath}.${key}` : key;

        if (obj[key] == null || typeof obj[key] !== 'object' || obj[key] instanceof Array) {
            objectKeys.push(currentPath);
        }
        else {
            objectKeys.push(currentPath);
            extractObjectKeys(obj[key], currentPath);
        }
    });

    return objectKeys;
}

const clearObjectKeys = () => {
    objectKeys = [];
}

export { extractObjectKeys, clearObjectKeys };
