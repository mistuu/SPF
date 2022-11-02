import React, { Component } from 'react';
import { View, TextInput, BackHandler, Button, StyleSheet, Image, Dimensions, ScrollView, TouchableOpacity, Text, FlatList, SafeAreaView, Platform, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import Colors from '../../../Assets/Colors';
import Images from '../../../Assets/Images';
import RNFS from 'react-native-fs';
import DocumentPickerHandle from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
import { Dropdown } from 'react-native-material-dropdown';
import ImagePicker, { launchImageLibrary } from 'react-native-image-picker';
import * as Yup from 'yup';
import Toast from 'react-native-simple-toast';
import { Formik } from 'formik'
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DatePicker from 'react-native-datepicker'
import ToggleSwitch from 'toggle-switch-react-native';
import { mapStateToProps } from '../../../Reducers/ApiClass';
import { axiosAuthGet, axiosPost } from '../../../utility/apiConnection';
import { getItem } from '../../../utility/AsyncConfig';
const { width, height } = Dimensions.get('window');

const textField = Yup.object().shape({
    text: Yup.string()
        .required("This field is required.")
});
class dynamicForm extends Component {
    constructor(props) {
        super(props);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this)

        this.state = {
            textInput: [],
            inputData: [],
            data: null,
            date: "",
            data1: [],
            selectedStateItems: "",
            lableList: null,
            filePath: null,
            urgentToggle: false,
            documents: null,
        };
    }
    async componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);

        console.log(this.props.Proid);
        try {
            let response = await axiosAuthGet("Program/ApplicationForm/" + this.props.Proid);
            this.setState({ data: response.data })
            console.log(this.state.data);
            var s;
            await this.state.data.filter(e => {
                // if(e.labelType==1){
                //     e.formValue = "";
                // }
                if (e.labelType == 3) {
                    e.groupList = [];
                    e.formDropdown = ""
                    e.formValue = "";
                    e.groupName.split(",").filter(x => {
                        e.groupList.push({ name: x });
                    })
                }
                if (e.labelType == 6) {
                    e.formValue = "";

                }
                if (e.labelType == 4) {
                    e.formValue = false
                }
            })

            console.log("searchble", this.state.data);
        } catch (error) {
            console.log(error);
        }
    }
    componentDidUpdate() {
        // this.onStateSelectedItemsChange();
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
                type: [DocumentPickerHandle.types.images],
            });
            var formdata = new FormData()
            formdata.append("uploaApplication", res)
            console.log(res);

            let response = await axiosPost("Master/UploadIcon", formdata)
            console.log(response);
            // this.setState({ setSingleFile: res })
            var data = await RNFS.readFile("file://" + res.uri, 'base64').then(ress => { return ress });
            console.log(res);
            this.setState({ filePath: "data:" + res.type + ";base64," + data })
            this.setState({ documents: res.name + "," + data })
            await this.state.data.filter(e => {
                if (e.labelType == 5) {
                    e.formValue = response.message
                }

            })
            // console.log("Compress File:",data);
        } catch (error) {
            console.log(error);
        }
    }
    onStateSelectedItemsChange = async (value, labelId, labelName) => {
        this.setState({ selectedStateItems: value });
        console.log("Selcted Item:-", value);
        this.setState({ date: value })
        await this.state.data.filter(e => {
            //for dropdown
            if (e.labelType == 3) {
                if (e.labelId == labelId) {
                    e.formDropdown = value
                    e.formValue = value[0]
                }
            }
        })
        var s = this.state.data

        var ind = s.findIndex(c => c.labelType == 6 && c.labelId == labelId)

        if (ind > -1) {
            s[ind].formValue = value
            this.setState({ data: s })
        }
        console.log(ind, labelId);

    };
    async switchToggle(toggle) {
        this.setState({ urgentToggle: toggle })
        await this.state.data.filter(e => {
            if (e.labelType == 4) {
                e.formValue = toggle
            }

        })
        if (toggle == false) {
            Toast.show("Male")
        }
        else {
            Toast.show("Female")

        }
    }

    //function to console the output
    getValues = async () => {
        var values;
        await getItem('LoginDetails').then((data) => {
            values = data.memberId;
            this.setState({ id: values })
        })
        console.log('Data', this.state.data);
        await this.state.data.filter(e => {
            e.memberId = values
            e.programId = this.props.programIdValue
            e.formId = e.programFormId
            if (e.labelType == 4) {
                e.formValue = e.formValue == null ? '0' : '1';
            }

        })

        console.log("final data==",this.state.data);
        try {
            let response = await axiosPost("Program/SaveForm", this.state.data)
            console.log(response);
            if (response.responseCodes == 200) {
                Toast.show(response.message)
                this.props.navigation.goBack()
            }
            else {
                Toast.show("Unsuccessfull")

            }
        } catch (error) {

        }
    }
    render() {
        var dateTime;
        return (
            <View style={{ flex: 1 }}>
                <SafeAreaView style={{ paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0, backgroundColor: Colors.primary, flexDirection: 'row', width: '100%', height: "10%", justifyContent: 'flex-start', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => this.handleBackButtonClick()} style={{ marginTop: 10, alignItems: 'flex-start', marginLeft: 10 }}>
                        <Image source={Images.back}
                            style={{ height: 15, width: 22, tintColor: 'white', alignSelf: 'center' }} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: Colors.white, marginLeft: 20, marginTop: 10 }}>Program Form</Text>
                </SafeAreaView>
                {/* {this.state.textInput.map((value) => {
                        return value
                    })} */}
                <FlatList
                    style={{ margin: 10 }}
                    data={this.state.data}

                    renderItem={({ item }) =>

                        <View>
                            {
                                item.labelType == 1 ? (
                                    <View style={styles.otpView}>
                                        <TextInput
                                            placeholder={item.labelName}
                                            placeholderTextColor={Colors.primary}
                                            value={item.formValue}
                                            onChangeText={txt => item.formValue = txt}
                                            style={{ fontSize: 18, color: Colors.black, marginTop: 20 }}
                                        />
                                    </View>
                                ) : null
                            }
                            {
                                item.labelType == 2 ? (
                                    <View style={styles.otpView}>
                                        <TextInput
                                            placeholder={item.labelName}
                                            placeholderTextColor={Colors.primary}
                                            multiline={true}
                                            value={item.formValue}
                                            onChangeText={txt => item.formValue = txt}
                                            style={{ fontSize: 18, color: Colors.black, marginTop: 20 }}
                                        />
                                    </View>
                                ) : null
                            }
                            {
                                item.labelType == 3 ? (
                                    <View style={styles.to}>

                                        {
                                            console.log("Form Value:", item.formValue),
                                            item?.formValue != null ? (
                                                <SectionedMultiSelect
                                                    styles={search}
                                                    colors={sColor}
                                                    items={item.groupList}
                                                    single={true}
                                                    searchPlaceholderText="Search"
                                                    IconRenderer={Icon}
                                                    uniqueKey="name"
                                                    selectText={item.labelName}
                                                    showDropDowns={true}
                                                    onSelectedItemsChange={(value) => { this.onStateSelectedItemsChange(value, item.labelId) }}
                                                    selectedItems={item.formDropdown}
                                                    hideConfirm={true}
                                                />
                                            ) : null
                                        }

                                    </View>
                                ) : null
                            }
                            {
                                item.labelType == 4 ? (
                                    console.log(item.formValue),
                                    <View style={{ marginLeft: 20, justifyContent: 'center', marginTop: 20 }}>
                                        <ToggleSwitch
                                            isOn={item.formValue}
                                            onColor="green"
                                            offColor={Colors.grayCCC}
                                            label={item.labelName}
                                            labelStyle={{ fontSize: 18, color: Colors.primary, }}
                                            size="medium"
                                            onToggle={isOn => this.switchToggle(isOn)}
                                        />
                                    </View>
                                ) : null
                            }
                            {
                                item.labelType == 5 ? (
                                    <View style={{ flexDirection: 'row', margin: 20, alignItems: 'center' }}>
                                        <TouchableOpacity onPress={() => this.selectFile()}
                                            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', alignContent: 'center' }}>
                                            <Image
                                                source={Images.upload}
                                                style={{ marginTop: 10 }} />
                                            <Image
                                                source={{ uri: this.state.filePath }}
                                                style={{ height: 30, width: 30, marginLeft: 10, marginTop: 10 }} />
                                        </TouchableOpacity>
                                    </View>
                                ) : null
                            }
                            {
                                item.labelType == 6 ? (
                                    <View style={{ flexDirection: 'row', margin: 20, alignItems: 'center' }}>
                                        <DatePicker
                                            style={{ width: 200 }}
                                            date={item.formValue}
                                            mode="date"
                                            placeholder={item.labelName}
                                            format="DD-MM-YYYY"
                                            confirmBtnText="Confirm"
                                            cancelBtnText="Cancel"
                                            customStyles={{
                                                dateIcon: {
                                                    position: 'absolute',
                                                    left: 0,
                                                    top: 4,
                                                    marginLeft: 0,
                                                    // tintColor:Colors.primary
                                                },
                                                dateInput: {
                                                    marginLeft: 36,
                                                    borderColor: Colors.primary
                                                }
                                                // ... You can check the source to find the other keys.
                                            }}
                                            onDateChange={(date) => { this.onStateSelectedItemsChange(date, item.labelId, item.labelName) }}
                                        />

                                    </View>
                                ) : null
                            }


                        </View>
                    }
                    numColumns={1}
                // ListEmptyComponent={this.EmptyListMessage()}
                keyExtractor={item => item.labelId}

                />

                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={() => this.getValues()}><Text style={styles.submitText}> Submit </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
const sColor = {

    // text:'#FF5733',
    // primary:'#FF5733',
    // success:'#FF5733',
    // subText:'#FF5733',
    searchPlaceholderTextColor: '#FF5733',
    searchSelectionColor: '#FF5733',
    // itemBackground:'#FF5733',
    // chipColor:'#FF5733',
    // selectToggleTextColor:'#FF5733',
}
const search = {
    confirmText: {
        color: '#fff',
    },
    chipText: {
        color: '#FF5733',
        backgroundColor: '#FF5733',
        textDecorationColor: '#FF5733',
        textShadowColor: '#FF5733'


    },
    itemText: {
        color: '#FF5733',
        textShadowColor: '#FF5733',
        textDecorationColor: '#FF5733',

    },
    selectedItemText: {
        // color: 'blue',

    },
    subItemText: {
        color: '#FF5733',

    },
    confirmText: {
        backgroundColor: '#FF5733',
        color: '#FF5733',
        textDecorationColor: '#FF5733',
        textShadowColor: '#FF5733'

    },
    item: {
        paddingHorizontal: 10,
        textDecorationColor: '#FF5733',
        textShadowColor: '#FF5733'

    },
    subItem: {
        paddingHorizontal: 10
    },
    selectedItem: {
        // backgroundColor: '#FF5733'
    },
    selectedSubItem: {
        // backgroundColor: '#FF5733'
    },
    selectedSubItemText: {
        // color: 'blue',
    },

    selectToggleText: {
        color: '#FF5733',
        fontSize: 15
    },
    scrollView: { paddingHorizontal: 0 }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    buttonView: {
        flexDirection: 'row'
    },
    textInput: {
        height: 40,
        borderColor: 'black',
        borderWidth: 1,
        margin: 20
    },
    to: {
        borderBottomWidth: 1,
        borderColor: Colors.primary,
        // alignItems: 'center',
        margin: 13,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    otpView: {
        // flexDirection: 'row',
        // margin:20,
        marginLeft: 20,
        marginRight: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.primary,
        // alignItems: 'center',
    },
    submitButton: {
        backgroundColor: Colors.primary,
        marginTop: 30,
        borderRadius: 8,
        width: width / 2,
        // marginLeft: 200,
        marginBottom: 10,
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center'
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
});
export default connect(mapStateToProps)(dynamicForm);
