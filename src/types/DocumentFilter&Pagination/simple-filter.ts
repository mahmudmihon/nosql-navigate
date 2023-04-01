export interface SimpleFilter {
    shouldApply: boolean,
    field: string,
    filterType: string,
    value: string
}