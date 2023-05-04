const extractMessageFromMongoError = (error: string): string => {
    const extracted = error.match(/^.*?(?={)/);

    if(Array.isArray(extracted)) {
        return extracted[0];
    }
    else {
        return error;
    }
}

export { extractMessageFromMongoError };