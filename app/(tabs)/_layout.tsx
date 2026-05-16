import { Tabs } from 'expo-router';
import { Chrome as Home, TrendingUp, Target, Settings, Plus } from 'lucide-react-native';
import { TouchableOpacity, View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1E40AF',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5E7EB',
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 8,
          height: 88,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cashflow"
        options={{
          title: 'Cashflow',
          tabBarIcon: ({ size, color }) => (
            <TrendingUp size={size} color={color} />
          ),
        }}
      />
     <Tabs.Screen
       name="add-transaction"
       options={{
         title: '',
         tabBarIcon: ({ size, color }) => (
           <Plus size={32} color="#FFFFFF" />
         ),
         tabBarButton: ({ ...restProps }) => (
           <TouchableOpacity
             {...restProps}
             style={[
               {
                 justifyContent: 'center',
                 alignItems: 'center',
               },
               restProps.style, 
             ]}

       >
        <View style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: '#1E40AF',
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
        }}>
          <Plus size={32} color="#FFFFFF" />
        </View>
      </TouchableOpacity>
    ),
  }}
/>
      <Tabs.Screen
        name="readiness"
        options={{
          title: 'Readiness',
          tabBarIcon: ({ size, color }) => (
            <Target size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ size, color }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}