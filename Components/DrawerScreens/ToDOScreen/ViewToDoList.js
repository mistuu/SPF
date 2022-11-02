import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import Colors from '../../../Assets/Colors';
import Images from '../../../Assets/Images';


export default class ViewToDoList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
        };
    }
    componentDidMount() {
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.white }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginRight: 23, marginTop: 30 }}>
                    <Image
                        source={Images.star}
                        style={{ marginLeft: 10 }}
                    />
                    <Image
                        source={Images.trash}
                        style={{ marginLeft: 10 }}
                    />
                    <Image
                        source={Images.verticaldots}
                        style={{ marginLeft: 10 }}
                    />
                </View>
                <Text style={{ marginTop: 20, marginLeft: 20, fontWeight: 'bold', fontSize: 23 }}> Title</Text>
                <View style={{ borderWidth: 1, borderColor: Colors.grayCCC, marginTop: 20 }} />
                <Text style={{ margin: 23, fontSize: 18, }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text>
            </View>
        );
    }
}
