import { components, type OptionProps } from "react-select";
import type { OptionType } from "../types";

const Option: React.FC<OptionProps<OptionType>> = (props) => {
  return (
    <div>
      <components.Option {...props}>
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
        />{" "}
        {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
        <label>{props.label}</label>
      </components.Option>
    </div>
  );
};

export default Option;
