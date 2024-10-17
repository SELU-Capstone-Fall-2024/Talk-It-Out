import {TabBarIcon} from '@/components/navigation/TabBarIcon';
import {Tabs} from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Clients',
          tabBarIcon: ({color, focused}) => <TabBarIcon name={'person'} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarIcon: ({color, focused}) => <TabBarIcon name={'calendar'} />,
        }}
      />
    </Tabs>
  );
}
