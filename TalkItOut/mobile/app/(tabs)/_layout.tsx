import {TabBarIcon} from '@/components/navigation/TabBarIcon';
import {Tabs} from 'expo-router';
import {LogBox} from 'react-native';

export default function TabLayout() {
  LogBox.ignoreAllLogs();
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
