import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import React from 'react';
import Colors from '../../Assets/Colors';
import SPFActivity from './SPFActivity';
import SPFMember from './SPFMember';

const Tab = createMaterialBottomTabNavigator();

export default class BottomScreen extends React.Component {
    render() {

        return (
            <Tab.Navigator
                activeColor={Colors.white}
                inactiveColor={Colors.graye3}
                barStyle={{ backgroundColor: Colors.primary }}
            >
                <Tab.Screen
                    name="SPFActivity"
                    component={SPFActivity}

                />
                <Tab.Screen
                    name="SPFMember"
                    component={SPFMember}
                // options={{
                //   tabBarLabel: 'Updates',
                //   tabBarIcon: ({ color }) => (
                //     <MaterialCommunityIcons name="bell" color={color} size={26} />
                //   ),
                // }}
                />
                {/* <Tab.Screen
                    name="Profile"
                    component={Profile}
                // options={{
                //   tabBarLabel: 'Profile',
                //   tabBarIcon: ({ color }) => (
                //     <MaterialCommunityIcons name="account" color={color} size={26} />
                //   ),
                // }}
                /> */}
            </Tab.Navigator>
        );
    }
}