import { VNode, h } from "vue";
import { NTooltip } from "naive-ui";
import { SelectOption } from "naive-ui/es/select/src/interface";

export class NaiveUiService {
  static renderOption = ({ node, option }: { node: VNode; option: SelectOption }) => {
    return h(NTooltip, null, {
      trigger: () => node,
      default: () => option.label,
    });
  };
}