import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import OtherProgram from './OtherProgram';
import EnrollProgram from './EnrollProgram';
import Colors from '../../../Assets/Colors';

const Tab = createMaterialTopTabNavigator();

function ProgramScreen() {
    return (
        <Tab.Navigator
            initialRouteName="Enroll Program"
            tabBarOptions={{
                activeTintColor: Colors.white,
                labelStyle: { fontSize: 12, },
                indicatorStyle:{borderColor:Colors.white},
                pressColor:Colors.primary,
                style: { backgroundColor: Colors.primary,borderBottomColor:Colors.primary },
            }}
        >
            <Tab.Screen
                name="Enroll Program"
                component={EnrollProgram}
            />
            <Tab.Screen
                name="Other Program"
                component={OtherProgram}
            />

        </Tab.Navigator>
    );
}
export default ProgramScreen;