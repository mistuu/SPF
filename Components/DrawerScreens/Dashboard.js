import React, { Component } from 'react'
import { Text, View, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions, Alert, Modal, ScrollView, Button, Linking } from 'react-native'
import Colors from '../../Assets/Colors'
import Images from '../../Assets/Images';
import { Header } from '../CusComponent';
import { Dialog } from 'react-native-simple-dialogs';
import { AccordionList } from "accordion-collapse-react-native";
import { Separator } from 'native-base';
import { IMAGES } from '../../Assets';
import BottomScreen from '../BottomScreen/BottomScreen';
import { axiosAuthGet } from '../../utility/apiConnection';
import { getItem } from '../../utility/AsyncConfig';
import { IMAGEURL } from '../../utility/util';
import moment from 'moment';
const { width, height } = Dimensions.get('window');


export default class Dashboard extends Component {


    constructor(props) {
        super(props);
        this.state = {
            data: null,
            program: '',
            event: '',
            activity: null,
            gallery: null,
            img1: '',
            img2: '',
            img3: '',
        }
    }

    async componentDidMount() {
        var q = [2, 3, 4, 3, 2, 1, 3, 4, 5, 6, 7, 5, 1]

        //sorting way

        // q = q.filter(function (item, pos) {
        //     return q.indexOf(item) == pos;
        // })
        // console.log("ans 1:-", q.sort());

        //ans 2
        // var count = {};
        // q.forEach(function (i) { count[i] = (count[i] || 0) + 1; });

        // console.log("ans 2:-", count);

        // //ans 3
        // var s = s.sort()
        // var w = []
        // w = s.concat(t)
        // console.log("ans 3:-", w.sort());

        var values;
        await getItem('LoginDetails').then((data) => {
            values = data.memberId;
            this.setState({ id: values })
            // console.log("Member id:", data.memberId);
        })
        // console.log("Member id:", values);
        try {
            let response = await axiosAuthGet('DashBoard/Data/' + values);
            console.log("Dashbord Data:=", response.activity);
            this.setState({
                // data: response,
                program: response.appliedProgram,
                event: response.appliedEvent,
                activity: response.appliedActivity,
                gallery: response.gallery
            })
            this.setState({ data: response.activity })
            console.log("Activty data", this.state.data);
            this.setState({
                img1: this.state.gallery[1].filePath,
                img2: this.state.gallery[2].filePath,
                img3: this.state.gallery[3].filePath,
            })

        } catch (error) {
            console.log(error);
        }
    }
    render() {
        const { modalVisible } = this.state;
        return (

            <View style={styles.container}>
                <Header title={"Dashboard"} navigation={this.props.navigation} />

                {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.GrievancesTitle}> Dashboard  </Text>

                </View> */}
                <ScrollView >

                    <View style={{ marginTop: 10 }}>
                        {/* <ScrollView horizontal={false} > */}

                        <View style={styles.enrollCardView}>
                            <Text style={{
                                fontSize: 20,
                                color: Colors.primary,
                            }}>Applied Programs</Text>
                            <Text
                                style={{
                                    fontSize: 30,
                                    marginLeft: 10,
                                    fontWeight: 'bold',
                                }} >: {this.state.program}</Text>
                        </View>
                        <View style={styles.enrollCardView}>
                            <Text style={{
                                fontSize: 20,
                                color: Colors.primary,
                            }}>Applied Events</Text>
                            <Text
                                style={{
                                    fontSize: 30,
                                    marginLeft: 10,
                                    fontWeight: 'bold',
                                }} >: {this.state.event}</Text>
                        </View>
                        <View style={styles.enrollCardView}>
                            <Text style={{
                                fontSize: 20,
                                color: Colors.primary,
                            }}>Applied Activity</Text>
                            <Text
                                style={{
                                    fontSize: 30,
                                    marginLeft: 10,
                                    fontWeight: 'bold',
                                }} >: {this.state.activity}</Text>
                        </View>
                        {/* </ScrollView> */}

                    </View>
                    <View style={{ marginTop: 10, flexDirection: 'column', justifyContent: 'space-around', }}>
                        <Text style={styles.subTitle}> Activity  </Text>
                        <FlatList
                            horizontal
                            style={{ margin: 10, }}
                            data={this.state.data}
                            renderItem={({ item }) =>
                                <View style={styles.otherCardView}>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Activity')}>
                                        <Text style={styles.ActivityTitle}>{item?.title}</Text>
                                        <View style={{ flexDirection: 'row', marginTop: 10, }}>
                                            <Text style={{ color: Colors.primary, fontSize: 18, width: width / 9 }}>Date:</Text>
                                            <Text style={{ marginLeft: 20, fontSize: 18, width: width / 2, marginLeft: 32 }}>{moment(item?.endDate).format("DD/MM/YYYY")}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                            <Text style={{ color: Colors.primary, fontSize: 18, width: width / 9 }}>Title:</Text>
                                            <Text style={{ marginLeft: 20, fontSize: 18, width: width / 2, marginLeft: 32 }}>{item?.title}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                            <Text style={{ color: Colors.primary, fontSize: 18, width: width / 9 }}>Link:</Text>
                                            <TouchableOpacity onPress={() => Linking.openURL(item?.programLink)}>
                                                <Text style={{ marginLeft: 20, fontSize: 18, color: Colors.primary, width: width / 2, marginLeft: 32 }}>{item?.programLink}</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                            <Text style={{ color: Colors.primary, fontSize: 18, width: width / 6.5 }}>Timing:</Text>
                                            <Text style={{ marginLeft: 20, fontSize: 18, width: width / 2 }}>{item.programTime.hours}:{item.programTime.minutes}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            }
                            numColumns={1}
                            keyExtractor={item => item.No}
                            onEndReachedThreshold={0}
                        />

                        <Text style={styles.subTitle}> Gallery  </Text>
                        <View style={styles.otherCardView}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Gallery')}>
                                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>

                                    <Image
                                        source={{ uri: IMAGEURL + this.state.img1 }}
                                        style={{ height: 200, width: 150, resizeMode: 'stretch' }}
                                    />
                                    <View style={{ flexDirection: 'column', marginLeft: 10, justifyContent: 'space-around' }}>
                                        <Image
                                            source={{ uri: IMAGEURL + this.state.img2 }}
                                            style={{ height: 100, width: 125, resizeMode: 'stretch' }}
                                        />
                                        <Text style={{
                                            textAlign: 'center',
                                            fontWeight: 'bold',
                                            color: Colors.grayCCC,
                                            fontSize: 24,
                                            marginTop: 35,
                                        }}>View More</Text>
                                    </View>

                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* <BottomScreen /> */}
                </ScrollView>
                {/* <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: 10,

                }}>
                    <TouchableOpacity onPress={() => alert('Under Construction...')}>
                        <View style={{
                            paddingLeft: 20,
                            paddingRight: 20,
                            paddingTop: 5,
                            borderRadius: 8,
                            paddingBottom: 5,
                            alignItems: 'center',
                            backgroundColor: Colors.primary,
                        }}><Text style={{ color: Colors.white }}>SPF Member</Text></View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Activity')}>
                        <View style={{
                            paddingLeft: 20,
                            paddingRight: 20,
                            paddingTop: 5,
                            borderRadius: 8,
                            paddingBottom: 5,
                            alignItems: 'center',
                            marginLeft: 20,
                            backgroundColor: Colors.primary,
                        }}><Text style={{ color: Colors.white }}>SPF Activity</Text></View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Chapters')}>
                        <View style={{
                            paddingLeft: 20,
                            paddingRight: 20,
                            paddingTop: 5,
                            borderRadius: 8,
                            paddingBottom: 5,
                            alignItems: 'center',
                            marginLeft: 20,
                            backgroundColor: Colors.primary,
                        }}><Text style={{ color: Colors.white }}>Chapters</Text></View>
                    </TouchableOpacity>

                </View > */}

            </View >
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundscreencolor
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
        marginTop: 10,
        textAlign: 'left',
        marginLeft: 20,
        fontWeight: 'bold',
        alignItems: 'flex-start'
    },
    subTitle: {
        color: Colors.black,
        fontSize: 24,
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
        backgroundColor: Colors.white,
        borderRadius: 13,
        flexDirection: 'row',
        marginLeft: 25,
        alignItems: 'center',
        marginRight: 25,
        marginTop: 5,
        padding: 15,

    },
    newAddedCardView: {
        backgroundColor: Colors.white,
        borderRadius: 13,
        margin: 25,
        padding: 20,
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
