import React, { Component } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Colors from '../../Assets/Colors';
import { Header } from '../CusComponent';
import EventScreen from './EventScreen/EventScreen';
const { width, height } = Dimensions.get('window');


export default class Event extends Component {


    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            data: null,
        }
    }

    render() {
        const { modalVisible } = this.state;
        return (

            <View style={styles.container}>
                <Header title={"Event"} navigation={this.props.navigation} />
                <EventScreen /> 

            </View >
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: Colors.backgroundscreencolor
    },
  
})
