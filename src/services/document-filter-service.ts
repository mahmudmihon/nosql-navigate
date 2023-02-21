import { CustomLinq } from "./custom-linq-service";
import { SelectMixedOption } from 'naive-ui/es/select/src/interface';

export class DocumentFiltering {
    static filterTypes: SelectMixedOption[] =
    [
        {
            label: "Equal",
            value: "Equal"
        },
        {
            label: "Not equal",
            value: "Not equal"
        },
        {
            label: "Contains",
            value: "Contains"
        },
        {
            label: "In",
            value: "In"
        },
        {
            label: "Not in",
            value: "Not in"
        },
        {
            label: "Less than",
            value: "Less than"
        },
        {
            label: "Less than or equal",
            value: "Less than or equal"
        },
        {
            label: "Greater than",
            value: "Greater than"
        },
        {
            label: "Greater than or equal",
            value: "Greater than or equal"
        }
    ];

    static extractSimpleBuilderFilters = (filtersData: any[]): object => {
        var filters = {};

        var shouldApplyFilters = filtersData.filter(x => x.shouldApply);

        if(shouldApplyFilters != null && shouldApplyFilters.length > 0) {
            const fieldGroupedData = CustomLinq.groupBy(shouldApplyFilters, v => v.field);

            for(let key in fieldGroupedData)
            {
                if(fieldGroupedData[key].length > 1) {
                    const multipleFiltersData = fieldGroupedData[key];

                    const fieldsValue = multipleFiltersData.map(x => {
                        return this.generateValueForField(x);
                    });

                    filters[key] = Object.assign({}, ...fieldsValue);
                }
                else {
                    filters[key] = this.generateValueForField(fieldGroupedData[key][0]);
                }
            }
        }

        return filters;
    }

    static generateValueForField = (x: any): any => {
        if (x.filterType == "Equal") {
            return {"$eq": this.parseInputValueForStringOrNumber(x.value)};
        }
        else if (x.filterType == "Not equal") {
            return {"$ne": this.parseInputValueForStringOrNumber(x.value)};
        }
        else if (x.filterType == "Contains") {
            return { "$regex": x.value, "$options": "i" };
        }
        else if (x.filterType == "In") {
            return { "$in": this.parseInputValueForArray(x.value) };
        }
        else if (x.filterType == "Not in") {
            return { "$nin": this.parseInputValueForArray(x.value) };
        }
        else if (x.filterType == "Less than") {
            return { "$lt": Number(x.value) };
        }
        else if (x.filterType == "Less than or equal") {
            return { "$lte": Number(x.value) };
        }
        else if (x.filterType == "Greater than") {
            return { "$gt": Number(x.value) };
        }
        else if (x.filterType == "Greater than or equal") {
            return { "$gte": Number(x.value) };
        }
    }

    static parseInputValueForArray = (value: string): string[] | number[] => {
        const stringArray = value.split(",").map(x => x.trim());
        const numberArray = stringArray.map(Number);

        if(numberArray.some(x => Number.isNaN(x))) {
            return stringArray;
        }
        else {
            return numberArray;
        }
    }

    static parseInputValueForStringOrNumber = (value: string): string | number => {
        const numberValue = Number(value.trim());

        if(Number.isNaN(numberValue)) {
            return value;
        }
        else {
            return numberValue;
        }
    }
}