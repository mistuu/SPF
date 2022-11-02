import React, { Component } from 'react'
import { View, Dimensions, Text, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';
import { COLORS } from '../../Assets';
import CustomBackground from '../../utility/CustomBackground'
import Svg, { Path } from 'react-native-svg';
import Colors from '../../Assets/Colors';
import Images from '../../Assets/Images';

const WIDTH = Dimensions.get('screen').width;

export default class ChangePassword extends Component {
    render() {
        return (
            <View style={styles.container}>
                <View style={{ alignItems: 'center', marginTop: 50 }}>
                    <Text style={styles.headerText}>Login</Text>

                </View>
                <View style={{}}>
                    <Svg height={300} width='100%'>
                        <Path
                            d="M-17.5 378.5C31.5 32.5 302.5 463 375 89C447.5 -285 375 644 375 644H0C0 644 -66.5 724.5 -17.5 378.5Z" // put your path here
                            fill={Colors.primary}
                            stroke={Colors.primary}
                        />
                    </Svg>
                </View>
                <View style={{ backgroundColor:Colors.primary, flex: 1 }}>
                    <View>
                        <View style={{ width: WIDTH - 60, height: 50, backgroundColor: 'white', borderRadius: 30, margin: 30, justifyContent: 'center', paddingLeft: 10 }}>
                            <TextInput
                                placeholder='Email'
                            />
                        </View>
                        <View style={{ width: WIDTH - 60, height: 50, backgroundColor: 'white', borderRadius: 30,marginLeft:30, justifyContent: 'center', paddingLeft: 10 }}>
                            <TextInput
                                placeholder='Password'
                            />
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('ChangePassword')}>
                        <Text style={styles.forgot_button}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.loginBtn} onPress={() => this.props.navigation.replace('DrawerScreen')}>
                        <Text style={styles.loginText}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>

        )
    }
}
const styles = StyleSheet.create({
    // rest of the styles
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: Colors.white
    },
    headerText: {
        fontSize: 40,
        // change the color property for better output
        color: Colors.primary,
        // fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 50,
        position: 'absolute',
        alignItems: 'center',

    },
    image: {
        marginTop: 100,
        height: Dimensions.get('window').height / 5.1,
        width: Dimensions.get('window').width / 1.7,
    },
    forgot_button: {
        height: 30,
        marginBottom: 10,
        marginRight: 30,
        marginTop:20,
        textAlign: 'right',
        color: COLORS.white,
    },
    loginText: {
        color: Colors.primary,
        fontSize: 24,
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'center'
    },

    loginBtn: {
        width: "30%",
        borderRadius: 25,
        height: 40,
        marginLeft: 30,
        
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        backgroundColor: Colors.white,
    },
});
