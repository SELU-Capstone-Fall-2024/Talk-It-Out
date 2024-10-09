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
          title: 'Home',
          tabBarIcon: ({color, focused}) => <TabBarIcon name={'search'} />,
        }}
      />
    </Tabs>
  );
}
