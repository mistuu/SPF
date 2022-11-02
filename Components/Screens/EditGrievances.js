import React, { Component } from 'react';
import { View, Text, BackHandler, StyleSheet, TextInputComponent, Image, TextInput, TouchableOpacity, Dimensions, SafeAreaView, Platform, StatusBar } from 'react-native';
import Colors from '../../Assets/Colors';
import { Header } from '../CusComponent';
import DatePicker from 'react-native-datepicker'
import { COLORS } from '../../Assets';
import Images from '../../Assets/Images';
const { width, height } = Dimensions.get('window');
import DocumentPickerHandle from 'react-native-document-picker';
import { getItem } from '../../utility/AsyncConfig';
import { axiosAuthGet, axiosPost } from '../../utility/apiConnection';
import Toast from 'react-native-simple-toast';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import { mapStateToProps, mapDispatchToProps } from '../../Reducers/ApiClass';
import { connect } from 'react-redux';
class EditGrievances extends React.Component {
    constructor(props) {
        super(props);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this)

        this.state = {
            date: "2016-05-15",
            singleFile: null,
            setSingleFile: null,
            data: null,
            title: '',
            description: '',
            compressFile: null,
            filePath: null,
            gerId: '',
        };
    }
    async componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);

        // var date = new Date()
        // console.log(date);
        // this.setState({ date: date })
        this.setState({ gerId: this.props.GetgervId })
        console.log(this.props.GetgervId);
        try {
            let response = await axiosAuthGet('Grievance/GetById/' + this.props.GetgervId);
            console.log(response);
            response.forEach(element => {
                this.setState({ title: element.title, description: element.grievanceDescription, filePath: element.document })

            });

        } catch (error) {
            console.log(error);
        }
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);

    }
    handleBackButtonClick() {
        this.props.navigation.goBack()
        return true;
    }
    selectFile = async () => {
        try {
            const res = await DocumentPickerHandle.pick({
                type: [DocumentPickerHandle.types.allFiles],
            });
            console.log(JSON.stringify(res));
            // this.setState({ setSingleFile: res })

            RNFetchBlob.fs
                .stat(res.uri) // Relative path obtained from document picker
                .then(stats => {
                    console.log(stats);
                    var str1 = "file://";
                    var str2 = stats.path;
                    var correctpath = str1.concat(str2);
                    this.setState({ filePath: correctpath });
                    let data = RNFetchBlob.fs.readFile(correctpath, 'base64')
                    this.setState({ compressFile: data })
                    console.log("file Path:", correctpath);
                })
                .catch(err => {
                    console.log(err);
                });

            // console.log("Compress File:",data);
        } catch (error) {
            console.log(error);
        }
    }
    submitData = async () => {
        var date = new Date()
        var values;
        await getItem('LoginDetails').then((data) => {
            values = data.memberId;
            this.setState({ id: values })
            // console.log("Member id:", data.memberId);
        })
        console.log("Member id:", values);


        // console.log("compress File:", this.state.compressFile);
        const params = {

            "grievanceId": this.state.gerId,
            "title": this.state.title,
            "grievanceDescription": this.state.description,
            "grievanceDate": date,
            "document": "",
            "memberId": values

        }

        try {
            let response = await axiosPost('Grievance/Save', params);

            this.setState({ data: response })
            console.log(this.state.data);
            Toast.show(response.message, Toast.SHORT);
            this.props.navigation.goBack('Grievances');
        } catch (error) {
            console.log(error);
        }
    }
    render() {
        return (
            <View style={{
                flex: 1
            }}>
                <SafeAreaView style={{ paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0, backgroundColor: Colors.primary, flexDirection: 'row', width: '100%', height: "10%", justifyContent: 'flex-start', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => this.handleBackButtonClick()} style={{ marginTop: 10, alignItems: 'flex-start', marginLeft: 10 }}>
                        <Image source={IMAGES.back}
                            style={{ height: 15, width: 22, tintColor: 'white', alignSelf: 'center' }} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: Colors.white, marginLeft: 20, marginTop: 10 }}>Edit Grievances</Text>
                </SafeAreaView>

                <View style={styles.internalItems}>

                    {/* <View style={styles.otpView}> */}
                    {/* <TextInput
                            defaultValue={this.state.date}
                            value={this.state.date}
                            style={{ flex: 1, fontSize: 18, color: Colors.primary }}
                            underlineColorAndroid="transparent"
                        /> */}
                    {/* <TouchableOpacity>
                            <Image
                                source={Images.calander_icon}
                                style={{}} />
                        </TouchableOpacity> */}
                    {/* </View> */}
                    <View style={styles.otpView}>
                        <TextInput
                            placeholder="Grievances Title"
                            placeholderTextColor={Colors.primary}
                            value={this.state.title}
                            onChangeText={txt => this.setState({ title: txt })}
                            style={{ flex: 1, fontSize: 18, color: Colors.primary, marginTop: 20 }}
                        />
                    </View>
                    <View style={styles.otpView}>

                        <TextInput
                            style={{
                                flex: 1, fontSize: 18, color: Colors.primary, marginTop: 20
                            }}
                            value={this.state.description}
                            onChangeText={txt => this.setState({ description: txt })}
                            underlineColorAndroid="transparent"
                            placeholder={"Type Something in Text Area."}
                            placeholderTextColor={Colors.primary}
                            multiline={true}
                        />
                    </View>
                    <Text style={{ color: Colors.primary, marginTop: 30 }}>Upload Image/Doc</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => this.selectFile()}
                            style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}>
                            <Image
                                source={Images.upload}
                                style={{ marginTop: 10 }} />
                            <Image
                                source={{ uri: this.state.filePath }}
                                style={{ height: 30, width: 30, marginLeft: 10, marginTop: 10 }} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={() => this.submitData()}><Text style={styles.submitText}> Update </Text>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.backgroundscreencolor
    },
    internalItems: {
        marginTop: 10,
        margin: 30,
    },
    listTitle: {
        fontSize: 13,
        color: Colors.primary
    },
    otpView: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: Colors.primary,
        alignItems: 'center',
    },
    GrievancesTitle: {
        color: Colors.black,
        fontSize: 24,
        marginTop: 32,
        textAlign: 'left',
        marginLeft: 20,
        alignItems: 'flex-start'
    },
    cardView: {
        backgroundColor: Colors.white,
        borderRadius: 13,
        margin: 20,
        marginBottom: "30%"
    },
    GridViewInsideTextItemStyle: {

        color: "#ADADAD",
        fontSize: 10
        ,
        justifyContent: 'center',

    },
    submitButton: {
        backgroundColor: Colors.primary,
        marginTop: 30,
        borderRadius: 8,
        marginLeft: 200

        // justifyContent: 'center',
        // textAlign: 'center',
        // alignItems: 'center'
    },
    submitText: {
        color: "#fff",
        paddingRight: 20,
        paddingLeft: 20,
        paddingTop: 5,
        fontSize: 18,
        paddingBottom: 5,
        // justifyContent: 'center',
        textAlign: 'center',
        // alignItems: 'center'
    },
})
export default connect(mapStateToProps)(EditGrievances);