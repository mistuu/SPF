import React, { Component } from 'react'
import { Text, View, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions, Alert, Modal, ScrollView } from 'react-native'
import Colors from '../../Assets/Colors'
import Images from '../../Assets/Images';
import { Header } from '../CusComponent';
import ActivityScreen from './ActivityScreen/ActivityScreen';
const { width, height } = Dimensions.get('window');


export default class Activity extends Component {


    constructor(props) {
        super(props);
        this.state = {
           
        }
    }

    render() {
        return (

            <View style={styles.container}>
                <Header title={"Activity"} navigation={this.props.navigation} />

                <ActivityScreen />
               
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
    activityMainCardview: {
        width: Dimensions.get('window').width / 1.2,
        borderRadius: 13,
        flex: 1,
        backgroundColor: Colors.white,
        margin: 24,
        padding: 20,
    },
    subcardView: {
        height: 70, width: 70,
        backgroundColor: Colors.white,
        borderRadius: 13,
        marginLeft: Dimensions.get('window').width / 1.3,
        position: 'absolute',
    },
    listTitle: {
        fontSize: 13,
        color: Colors.primary
    },
    itemMainView: {
        backgroundColor: Colors.primary,
        // margin: 15,
        marginRight: 15,
        marginLeft: 15,
        marginBottom: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 13,
        height: Dimensions.get('window').height / 16,

    },
    GrievancesTitle: {
        color: Colors.black,
        fontSize: 24,
        marginTop: 32,
        textAlign: 'left',
        marginLeft: 20,
        alignItems: 'flex-start'
    },
    ActivityTitle: {
        color: Colors.primary,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'left',
        alignItems: 'flex-start'
    },
    enrollCardView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: Colors.white,
        borderRadius: 13,
        margin: 25,
        width: Dimensions.get('window').width / 1.5,
        padding: 20
    },
    otherCardView: {
        backgroundColor: Colors.white,
        borderRadius: 13,
        margin: 25,
        width: Dimensions.get('window').width / 1.2,
        padding: 20
    },
    cardView: {
        backgroundColor: Colors.white,
        borderRadius: 13,
        margin: 25,
        width: Dimensions.get('window').width / 1.1,
        marginBottom: 500,
        paddingBottom: 20,
        paddingTop: 20
    },
    GridViewInsideTextItemStyle: {
        color: "#fff",
        fontSize: 15,
        padding: 10,
        justifyContent: 'center',
    },
    insideDetails: {
        textAlign: 'center',
        color: Colors.black,

    },
    threeDotsStyle: {
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        height: 41,
        marginTop: 5,
        tintColor: Colors.white
    },
    Alert_Main_View: {

        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary,
        height: Dimensions.get('window').height / 3.3,
        width: Dimensions.get('window').width / 1.4,
        borderWidth: 1,
        borderColor: Colors.white,
        borderRadius: 7,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5

        // padding:30,
    },

    Alert_Title: {

        fontSize: 25,
        color: "#fff",
        textAlign: 'center',
        padding: 10,
    },

    Alert_Message: {

        fontSize: 15,
        color: "#fff",
        textAlign: 'center',
        padding: 10,

    },

    buttonStyle: {

        width: '50%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'

    },

    TextStyle: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 22,
        marginTop: -5
    }
})
