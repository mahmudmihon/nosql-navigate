import { SelectMixedOption } from "naive-ui/es/select/src/interface";
import { DBProvider } from "../../types/Common/db-provider";

export class ConnectionService {
    static dbList = (): SelectMixedOption[] => {
        var stages = Object.values(DBProvider);
    
        return stages.map(x => {
          return {label: x, value: x}
        });
    }
}