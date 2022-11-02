import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { COLORS } from '../../../../Assets';
import Colors from '../../../../Assets/Colors';
import VideoScreen from './VideoScreen'
import AudioScreen from './AudioScreen'
import BookScreen from './BookScreen'
import ProImages from './ProImages';
import Doc from './Doc';

const Tab = createMaterialTopTabNavigator();

function DocumentScreen() {
    return (
        <ScrollView 
        >


            <Tab.Navigator
                initialRouteName="Books"
                tabBarOptions={{
                    activeTintColor: Colors.white,
                    labelStyle: { fontSize: 12, },
                    indicatorStyle: { borderColor: Colors.white },
                    pressColor: COLORS.primary,
                    style: { backgroundColor: Colors.primary, borderBottomColor: Colors.primary },
                }}
            >
             <Tab.Screen
                    name="Books"
                    component={BookScreen}

                />   
                <Tab.Screen
                    name="Audio"
                    component={AudioScreen}

                />
                <Tab.Screen
                    name="Video"
                    component={VideoScreen}
                    options={{

                    }}
                />
                
                <Tab.Screen
                    name="Doc"
                    component={Doc}

                />
                <Tab.Screen
                    name="Images"
                    component={ProImages}

                />
            </Tab.Navigator>
        </ScrollView>
    );
}
export default DocumentScreen;