import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Activity from '../Activity';
import OtherActivity from './OtherActivity'
import React from 'react';
import MyActivity from './MyActivity';
import Colors from '../../../Assets/Colors';
import { COLORS } from '../../../Assets';

const Tab = createMaterialTopTabNavigator();

function ActivityScreen() {
    return (
        <Tab.Navigator
            initialRouteName="My Activity"
            tabBarOptions={{
                activeTintColor: Colors.white,
                labelStyle: { fontSize: 12, },
                indicatorStyle:{borderColor:Colors.white},
                pressColor:COLORS.primary,
                style: { backgroundColor: Colors.primary,borderBottomColor:Colors.primary },
            }}
        >
            <Tab.Screen
                name="My Activity"
                component={MyActivity}
                options={{
                    
                }}
            />
            <Tab.Screen
                name="Other Activity"
                component={OtherActivity}
            
            />

        </Tab.Navigator>
    );
}
export default ActivityScreen;