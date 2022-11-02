import React, { Component } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import Colors from '../../../Assets/Colors';
import { mapDispatchToProps, mapStateToProps } from '../../../Reducers/ApiClass';
import { axiosAuthGet } from '../../../utility/apiConnection';
import { IMAGEURL } from '../../../utility/util';

const { width, height } = Dimensions.get('window');
// function renderNode(node, index, siblings, parent, defaultRenderer) {
//     if (node.name == 'mytag') {
//         const specialSyle = node.attribs.style
//         return (
//           <Text key={index} style={specialSyle}>
//             {defaultRenderer(node.children, parent)}
//           </Text>
//         )
//       }
//   }

class OtherProgram extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            selectValue: '',
            otherProgramList: null,
            programMasterTitle: [],
            programList: null,
            coreProgramList: null,
            selfDevlopList: null,
            socialList: null,
            data: null,
            newData: null
        };
    }

    async componentDidMount() {
        try {
            let response = await axiosAuthGet('Program/List');
            this.setState({ newData: response })

            var x = [];
            response.forEach((item) => {
                this.state.programMasterTitle.push({ label: item.programMasterTitle, value: item.programMasterID })


            })
            // this.setState({ programMasterTitle: x })

        } catch (error) {
            console.log(error);
        }
    }

    onchangeValue = async (value) => {

        // this.setState({ selectValue: value.label })
        console.log(value.label);
        var x = null
        var s = []
        await this.state.newData.filter(element => {
            if (value.value == element.programMasterID) {
                x = element.program
            }
        })
        // console.log(x);
        await x.filter(item => {
            s.push({ programDescription: item.programDescription, endDate: item.endDate, startDate: item.startDate, title: item.programTitle, programId: item.programId, icon: item.icon })
        })
        this.setState({ programList: s })
        console.log("New Data===", s);

    }
    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    }
    updateUser = (program) => {
        this.setState({ programMasterTitle: program })
    }
    viewDetails = async (value) => {
        //    console.log(value);
        await this.props.ProgramId(value)
        this.props.navigation.navigate('OtherProgramDescription')
    }
    EmptyListMessage = () => {
        return (
            // Flat List Item
            <View style={styles.emptyListStyle}>
                <Text style={styles.emptyMessageStyle}>No Program</Text>
            </View>
        );
    }
    render() {
        const { modalVisible } = this.state;


        return (

            <View style={{ flex: 1 }}>
                 {
                        this.state.programMasterTitle.length>=0?(
                                // <Picker.Item  label={item.programMasterTitle} value={item.proId} key={index} />
                                <DropDownPicker
                                items={this.state.programMasterTitle}
                                // defaultValue={this.state.selectValue}
                                placeholder={"Select Program"}
                                containerStyle={{ height: 40 }}
                                style={{ backgroundColor: '#fafafa' }}
                                dropDownStyle={{ backgroundColor: '#fafafa' }}
                                onChangeItem={item => this.onchangeValue(item)}
                            />
                                ):null
                    }
                
                {/* <Picker
                    // style={{ width: width, }}
                    mode='dropdown'
                    selectedValue={this.state.programMasterTitle}
                    onValueChange={(value) => this.onchangeValue(value)}
                >
                    {
                        this.state.programMasterTitle && this.state.programMasterTitle.map((item, index) => {
                            return (
                                <Picker.Item  label={item.programMasterTitle} value={item.proId} key={index} />
                            );
                        })
                    }


                </Picker> */}
                {/* {console.log("mail List",this.state.programList)} */}
                <View style={{ marginBottom: height / 9.5 }}>
                    <FlatList
                        style={{ margin: 10, }}
                        data={this.state.programList}

                        renderItem={({ item }) =>
                            <TouchableOpacity onPress={() => this.viewDetails(item.programId)}>
                                <View style={styles.cardView}>
                                    <Image
                                        source={{ uri: IMAGEURL + item.icon }}
                                        style={{ width: width / 5, resizeMode: 'stretch', height: 75 }} />
                                    <View>
                                        <View style={{ flexDirection: 'column', marginLeft: 10 }}>
                                            <Text style={{ fontWeight: 'bold', fontSize: 18, width: width / 2, color: Colors.primary, marginLeft: 10 }}>{item.title}</Text>
                                            {/* <WebView
                                                html
                                            /> */}
                                            <Text
                                                numberOfLines={3}
                                                style={{ fontSize: 15, width: width / 2, marginLeft: 10 }}>{item.programDescription.replace(/<\/?[^>]+(>|$)/g, "")}</Text>

                                        </View>
                                        {/* <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                                        <Text style={{ color: Colors.primary, width: width / 4 }}>Start Date</Text>
                                        <Text style={{ width: width / 4, marginLeft: 10 }}>: {moment(item.startDate).format('DD/MM/YYYY')}</Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                                        <Text style={{ color: Colors.primary, width: width / 4 }}>End Date</Text>
                                        <Text style={{ width: width / 4, marginLeft: 10 }}>: {moment(item.endDate).format('DD/MM/YYYY')}</Text>
                                    </View> */}
                                        {/* <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                                    <Text style={{ color: Colors.primary, width: width / 4 }}>LDE</Text>
                                    <Text style={{ width: width / 4, marginLeft: 10 }}>:{item.LDE}</Text>

                                </View> */}
                                        {/* <TouchableOpacity onPress={() => this.viewDetails(item.programId)}>
                                        <View style={{ backgroundColor: Colors.primary, marginTop: 20, padding: 3, paddingLeft: 20, paddingRight: 20, borderRadius: 8, marginLeft: 150 }}>
                                            <Text style={{ color: Colors.white }}>Apply</Text>
                                        </View>
                                    </TouchableOpacity> */}
                                    </View>
                                    {/* <View>
                                <TouchableOpacity onPress={() => this.setModalVisible(true)}>
                                    <Image
                                        source={Images.horizontalDot}
                                        style={{ marginTop: 5, marginLeft: 10 }}
                                    />
                                </TouchableOpacity>

                            </View> */}
                                </View>
                            </TouchableOpacity>
                        }
                        numColumns={1}
                        ListEmptyComponent={this.EmptyListMessage()}
                        keyExtractor={item => item.No}
                    />
                </View>


                <Modal
                    isVisible={this.state.modalVisible}
                    onBackdropPress={() => this.setModalVisible(false)}
                    onSwipeComplete={() => this.setModalVisible(false)}
                    swipeDirection="left"
                    onBackButtonPress={() => this.setModalVisible(false)}
                >

                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

                        <View style={styles.Alert_Main_View}>

                            <Text style={styles.Alert_Title}>Actions</Text>

                            <View style={{ width: '80%', height: 2, backgroundColor: '#fff' }} />

                            <TouchableOpacity onPress={() => this.props.navigation.navigate('OtherProgramDescription')}>
                                <Text style={styles.Alert_Message}> View </Text>
                            </TouchableOpacity>


                            <View style={{ width: '80%', height: 1, backgroundColor: '#fff' }} />

                            <TouchableOpacity onPress={() => this.setModalVisible(!modalVisible)}>
                                <Text style={styles.Alert_Message}>Delete </Text>
                            </TouchableOpacity>



                        </View>

                    </View>


                </Modal>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: Colors.backgroundscreencolor
    },
    listTitle: {
        fontSize: 13,
        color: Colors.primary
    },
    emptyListStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        textAlignVertical: 'center'

    },

    emptyMessageStyle: {
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        textAlignVertical: 'center'
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
        fontWeight: 'bold',
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: Colors.white,
        borderRadius: 13,
        margin: 25,
        width: Dimensions.get('window').width / 1.5,
        padding: 20
    },
    cardView: {
        backgroundColor: Colors.white,
        borderRadius: 13,
        width: width / 1.1,
        margin: 5,
        flexDirection: 'row',
        padding: 10,

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
        height: Dimensions.get('window').height / 4.7,
        width: Dimensions.get('window').width / 1.7,
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
export default connect(mapStateToProps, mapDispatchToProps)(OtherProgram);
