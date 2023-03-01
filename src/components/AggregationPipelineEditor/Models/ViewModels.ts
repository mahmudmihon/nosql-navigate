export interface LookupModel {
    from: string;
    foreignField: string;
    localField: string;
    as: string;
}

export interface UnwindModel {
    field: string;
    preserveNullAndEmptyArrays: boolean;
    includeArrayIndex;
}