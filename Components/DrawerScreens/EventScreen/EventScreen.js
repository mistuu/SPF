import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import MyEvent from './MyEvent';
import Colors from '../../../Assets/Colors';
import { COLORS } from '../../../Assets';
import OtherEvent from './OtherEvent';

const Tab = createMaterialTopTabNavigator();

function EventScreen() {
    return (
        <Tab.Navigator
            initialRouteName="My Event"
            tabBarOptions={{
                activeTintColor: Colors.white,
                labelStyle: { fontSize: 12, },
                indicatorStyle:{borderColor:Colors.white},
                pressColor:COLORS.primary,
                style: { backgroundColor: Colors.primary,borderBottomColor:Colors.primary },
            }}
        >
            <Tab.Screen
                name="My Event"
                component={MyEvent}
                options={{
                    
                }}
            />
            <Tab.Screen
                name="Other Event"
                component={OtherEvent}
            
            />

        </Tab.Navigator>
    );
}
export default EventScreen;