import { Adapt, Select, Sheet } from 'tamagui' // or '@tamagui/select'

export function FormSelect() {

  <Select defaultValue="">
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
          <Select.Item>
            <Select.ItemText />
          </Select.Item>
        </Select.Group>
      </Select.Viewport>
      <Select.ScrollDownButton />
    </Select.Content>
  </Select>
} 
