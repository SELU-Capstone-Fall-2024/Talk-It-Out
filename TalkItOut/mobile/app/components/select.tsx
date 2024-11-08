import {Adapt, Select, Sheet} from 'tamagui'; // or '@tamagui/select'
import {OptionItemDto} from '../types';

type Props = {
  items: OptionItemDto[];
};

export const FormSelect = (props: Props) => {
  return (
    <Select defaultValue="" size={50}>
      <Select.Trigger>
        <Select.Value placeholder="Search..." />
      </Select.Trigger>

      <Adapt when="sm" platform="touch">
        {/* or <Select.Sheet> */}
        <Sheet>
          <Sheet.Frame>
            <Adapt.Contents />
          </Sheet.Frame>
          <Sheet.Overlay />
        </Sheet>
      </Adapt>

      <Select.Content>
        <Select.ScrollUpButton />
        <Select.Viewport>
          <Select.Group>
            <Select.Label />
            {props.items.map((item) => {
              return (
                <Select.Item index={item.value} value={item.text}>
                  <Select.ItemText />
                </Select.Item>
              );
            })}
          </Select.Group>
        </Select.Viewport>
        <Select.ScrollDownButton />
      </Select.Content>
    </Select>
  );
};
