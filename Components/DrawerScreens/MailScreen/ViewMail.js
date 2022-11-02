import moment from 'moment';
import React, { Component } from 'react';
import { View, Text, Image, BackHandler, StyleSheet, Dimensions, FlatList, TouchableOpacity, TextInput, ScrollView, Alert, Linking, Platform, SafeAreaView, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import Colors from '../../../Assets/Colors';
import Images from '../../../Assets/Images';
import { mapDispatchToProps, mapStateToProps } from '../../../Reducers/ApiClass';
import { axiosAuthGet, axiosPost } from '../../../utility/apiConnection';
import Modal from 'react-native-modal';
import RNFetchBlob from 'rn-fetch-blob';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getItem } from '../../../utility/AsyncConfig';
import Toast from 'react-native-simple-toast';
import RNFS from 'react-native-fs';

import { IMAGEURL } from '../../../utility/util';
import DocumentPickerHandle from 'react-native-document-picker';

const { width, height } = Dimensions.get('window');
const fileUrl = IMAGEURL;


class ViewMail extends Component {
    constructor(props) {
        super(props);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this)

        this.state = {
            data: null,
            modalVisible: false,
            replyModal: false,
            from: '',
            to: '',
            subject: '',
            message: '',
            cc: '',
            bcc: '',
            x: [],
            size: [],
            document: '',
            selectedStateItems: [],
            data1: null,
            selectedCCItems: [],
            selectedBCCItem: [],
            attachment: [],
            AllMemberList: null,
            CCBCCmodalVisible: false,
            viewCC: [],
            viewBCC: [],
            viewTo: [],

        };
    }
    async componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        try {
            const params = {
                "parameter": "",
                "parameter1": "",
                "pageSize": "100",
                "page": "1",
                "sortColumn": "u.member_spfid desc"

            }
            let res = await axiosPost("Member/MembersList", params)
            var data = []
            var allMem = []
            await res.data.filter(val => {
                if (val.spfemailid != null) {
                    data.push({ id: val.member_id, name: val.spfemailid })
                    allMem.push({ emailaddress: val.spfemailid, id: val.member_id })
                }
            })
            this.setState({ data1: data, AllMemberList: allMem })
            console.log(this.state.data1);
        } catch (error) {

        }
        var date = new Date()
        console.log(date);
        this.setState({ date: date })

        // console.log("Process===", this.props.Member_Id);
        var values;
        await getItem('LoginDetails').then((data) => {
            values = data.memberId;
            this.setState({ id: values })
            // console.log("Member id:", data.memberId);
        })
        try {
            let response = await axiosAuthGet("Inbox/GetViewEmail/" + this.props.inboxmailId.mailId + "/" + this.props.inboxmailId.type + "/" + values)
            console.log(response);
            this.setState({ data: response })
            this.setState({ subject: response.subject, message: response.message })
            // this.state.x.push({ uri: res.uri, type: res.type, name: res.name })
            await response.attachment.forEach(async (v) => {
                // console.log(v);
                // var ress = null;
                var s = null;
                this.state.size.push(v.size)
                // // var uri = await RNFetchBlob.wrap(IMAGEURL+v.filePath)
                await RNFetchBlob.fetch("GET", IMAGEURL + v.filePath)
                    .then((res) => s = res.respInfo.headers["Content-Type"])
                console.log("blob==", s);
                this.state.x.push({ name: v.fileName, uri: IMAGEURL + v.filePath, type: s })
            })
            console.log(this.state.x);
        } catch (error) {

        }
        var date = new Date()
        console.log(date);
        this.setState({ date: date })

        await this.state.data.viewemail.forEach(element => {
            if (values == element.toId || values == this.state.data.senderId) {

                if (element.bcc == 1) {

                    this.state.viewBCC.push(element.emailAddress)

                }
                else if (element.cc == 1) {
                    this.state.viewCC.push(element.emailAddress)

                } else {

                    this.state.viewTo.push(element.emailAddress)
                }
            }
            else if (element.bcc == 0) {
               if (element.cc == 1) {
                    this.state.viewCC.push(element.emailAddress)

                } else {

                    this.state.viewTo.push(element.emailAddress)
                }
            }
        });
    }
    onStateSelectedItemsChange = (value, index) => {
        this.setState({ selectedStateItems: value });
        console.log("Selcted Item:-", value);

    };
    onCCSelectedItemsChange = (value, index) => {
        this.setState({ selectedCCItems: value });
        console.log("Selcted Item:-", value);

    };
    onBCCSelectedItemsChange = (value, index) => {
        this.setState({ selectedBCCItem: value });
        console.log("Selcted Item:-", value);

    };
    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    }

    setReplyModalModalVisible = (visible) => {
        console.log(this.state.data.viewemail);
        this.state.data.viewemail.forEach(element => {
            if (element.bcc == 1) {
                this.state.selectedBCCItem.push(element.emailAddress)

            }
            else if (element.cc == 1) {
                this.state.selectedCCItems.push(element.emailAddress)

            } else {

                this.state.selectedStateItems.push(element.emailAddress)
            }
        });
        this.setState({ replyModal: visible });
    }
    downloadFile = (filePath) => {
        this.setState({ document: filePath })
        Alert.alert("Download",
            "You want to Download",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "OK", onPress: async () => {
                        // Get today's date to add the time suffix in filename
                        let date = new Date();
                        // File URL which we want to download
                        let FILE_URL = fileUrl + this.state.document;
                        // Function to get extention of the file url
                        let file_ext = this.getFileExtention(FILE_URL);

                        file_ext = '.' + file_ext[0];
                        if (Platform.OS == 'ios') {
                            Linking.openURL(FILE_URL).catch(err => console.error("Couldn't load page", err));
              
                          }
                          else{
// config: To get response by passing the downloading related options
                        // fs: Root directory path to download
                        const { config, fs } = RNFetchBlob;
                        let RootDir = fs.dirs.PictureDir;
                        let options = {
                            fileCache: true,
                            addAndroidDownloads: {
                                path:
                                    RootDir +
                                    '/file_' +
                                    Math.floor(date.getTime() + date.getSeconds() / 2) +
                                    file_ext,
                                description: 'downloading file...',
                                notification: true,
                                // useDownloadManager works with Android only
                                useDownloadManager: true,
                            },
                        };
                        config(options)
                            .fetch('GET', FILE_URL)
                            .then(res => {
                                // Alert after successful downloading
                                console.log('res -> ', JSON.stringify(res));
                                alert('File Downloaded Successfully.');
                            });
                          }
                        
                    }
                }
            ]
        );

    }
    getFileExtention = fileUrl => {
        // To get the file extension
        return /[.]/.exec(fileUrl) ?
            /[^.]+$/.exec(fileUrl) : undefined;
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);

    }
    handleBackButtonClick() {
        this.props.navigation.goBack()
        return true;
    }

    forwardMsg = async () => {
        console.log(this.state.x);
        var values;
        var newTo = [];
        var newCC = [];
        var newBCC = [];
        await this.state.AllMemberList.filter(val => {
            this.state.selectedStateItems.filter(v => {
                if (v == val.emailaddress) {
                    newTo.push(val)
                }

            })
        })
        await this.state.AllMemberList.filter(val => {
            this.state.selectedCCItems.filter(v => {
                if (v == val.emailaddress) {
                    newCC.push(val)
                }

            })
        })
        await this.state.AllMemberList.filter(val => {
            this.state.selectedBCCItem.filter(v => {
                if (v == val.emailaddress) {
                    newBCC.push(val)
                }

            })
        })
        console.log("New To", newTo);

        await getItem('LoginDetails').then((data) => {
            values = data.memberId;
            this.setState({ id: values })
            // console.log("Member id:", data.memberId);
        })
        // console.log("Member id:", values);

        var params = {
            "parameter": "and spfemailid LIKE \"%" + this.state.to + "%\"",
            "parameter1": "",
            "pageSize": "100",
            "page": "1",
            "sortColumn": "u.member_spfid desc"
        }

        try {
            let response = await axiosPost("Member/MembersList", params)
            // console.log(response.data);
            var data = [];
            var sendToId = [];
            var status = true;
            // response.data.forEach(element => {
            //     if (element.spfemailid == this.state.to) {
            //         data.push({ emailaddress: element.spfemailid })
            //         sendToId.push({ id: element.member_id })
            //         status = true
            //     }

            // });

            var email = []
            var id = []
            var CCEmail = []
            var BCCEmail = []
            newTo.forEach(element => {
                email.push({ emailaddress: element.emailaddress })
                id.push({ id: element.id })

            });
            newCC.forEach(element => {
                CCEmail.push({ cc: element.emailaddress })
                id.push({ id: element.id })

            });
            newBCC.forEach(element => {
                BCCEmail.push({ bcc: element.emailaddress })
                id.push({ id: element.id })

            });
            console.log(email);
            console.log(CCEmail);
            console.log(BCCEmail);
            console.log(id);

            if (email.length != 0) {
                if (status == true) {
                    console.log(this.state.attachment);
                    var formdata = new FormData()
                    this.state.x.forEach(element => {
                        console.log("In form=", element);
                        formdata.append("Attachment", element)
                    });
                    console.log("Formdata=", formdata);
                    formdata.append("mailId", 0)
                    formdata.append("senderId", JSON.stringify(values))
                    formdata.append("sendTo", JSON.stringify(email))
                    formdata.append("subject", this.state.subject)
                    formdata.append("message", this.state.message)
                    formdata.append("sendCC", JSON.stringify(CCEmail))
                    formdata.append("sendToId", JSON.stringify(id))
                    formdata.append("sendBCC", JSON.stringify(BCCEmail))
                    formdata.append('draft', 0)
                    // console.log("Form Data===",formdata);
                    let response1 = await axiosPost("Inbox/SendMessage/", formdata)
                    console.log("New Mail Response:-", response1);
                    if (response1.responseCodes == 200) {
                        let response2 = await axiosPost("Inbox/ReceivedMessage/", formdata)
                        console.log("New Mail Response:-", response2);
                        Toast.show(response1.message);
                        this.props.navigation.goBack("Inbox")
                    }
                }
                else {
                    Toast.show("Member Not Found")
                }
            }
            else {
                Toast.show("To Field is Required")

            }


        } catch (error) {

        }
    }
    replyMsg = async () => {


        var values;
        var newTo = [];
        var newCC = [];
        var newBCC = [];
        await this.state.AllMemberList.filter(val => {
            this.state.selectedStateItems.filter(v => {
                if (v == val.emailaddress) {
                    newTo.push(val)
                }

            })
        })
        await this.state.AllMemberList.filter(val => {
            this.state.selectedCCItems.filter(v => {
                if (v == val.emailaddress) {
                    newCC.push(val)
                }

            })
        })
        await this.state.AllMemberList.filter(val => {
            this.state.selectedBCCItem.filter(v => {
                if (v == val.emailaddress) {
                    newBCC.push(val)
                }

            })
        })
        console.log("New To", newTo);

        await getItem('LoginDetails').then((data) => {
            values = data.memberId;
            this.setState({ id: values })
            // console.log("Member id:", data.memberId);
        })
        // console.log("Member id:", values);

        var params = {
            "parameter": "and spfemailid LIKE \"%" + this.state.to + "%\"",
            "parameter1": "",
            "pageSize": "100",
            "page": "1",
            "sortColumn": "u.member_spfid desc"
        }

        try {
            let response = await axiosPost("Member/MembersList", params)
            // console.log(response.data);
            var data = [];
            var sendToId = [];
            var status = true;
            // response.data.forEach(element => {
            //     if (element.spfemailid == this.state.to) {
            //         data.push({ emailaddress: element.spfemailid })
            //         sendToId.push({ id: element.member_id })
            //         status = true
            //     }

            // });

            var email = []
            var id = []
            var CCEmail = []
            var BCCEmail = []
            newTo.forEach(element => {
                email.push({ emailaddress: element.emailaddress })
                id.push({ id: element.id })

            });
            newCC.forEach(element => {
                CCEmail.push({ cc: element.emailaddress })
                id.push({ id: element.id })

            });
            newBCC.forEach(element => {
                BCCEmail.push({ bcc: element.emailaddress })
                id.push({ id: element.id })

            });

            console.log(email);
            console.log(CCEmail);
            console.log(BCCEmail);
            console.log(id);

            if (email.length != 0) {
                if (status == true) {
                    console.log(this.state.attachment);
                    var formdata = new FormData()
                    // this.state.attachment.forEach(element => {
                    //     console.log(element);
                    //     formdata.append("Attachment", element)
                    // });
                    console.log("Formdata=", formdata);
                    formdata.append("mailId", 0)
                    formdata.append("senderId", JSON.stringify(values))
                    formdata.append("sendTo", JSON.stringify(email))
                    formdata.append("subject", this.state.subject)
                    formdata.append("message", this.state.message)
                    formdata.append("sendCC", JSON.stringify(CCEmail))
                    formdata.append("sendToId", JSON.stringify(id))
                    formdata.append("sendBCC", JSON.stringify(BCCEmail))
                    formdata.append('draft', 0)
                    // console.log("Form Data===",formdata);
                    let response1 = await axiosPost("Inbox/SendMessage/", formdata)
                    console.log("New Mail Response:-", response1);
                    if (response1.responseCodes == 200) {
                        let response2 = await axiosPost("Inbox/ReceivedMessage/", formdata)
                        console.log("New Mail Response:-", response2);
                        Toast.show(response1.message);
                        this.props.navigation.goBack("Inbox")
                    }
                }
                else {
                    Toast.show("Member Not Found")
                }
            }
            else {
                Toast.show("To Field is Required")

            }


        } catch (error) {

        }
    }
    selectFile = async () => {
        try {
            const res = await DocumentPickerHandle.pickMultiple({
                type: [DocumentPickerHandle.types.allFiles],
            });
            res.filter(async (e) => {
                await this.state.size.push(this.formatBytes(e.size))

            })
            var s = await this.state.size.reduce((a, b) =>
                a = a + b.size, 0
            )
            // var s = this.formatBytes(res.size)
            // console.log(s.size);
            if (s <= 5.00) {
                res.filter(async (e) => {

                    Toast.show("File Uploaded.")
                    if(Platform.OS=='ios'){
                        var data = await RNFS.readFile( e.uri, 'base64').then(ress => {
                            return ress
                        });
                        var s = [];
                        s.push({ res: "data:" + e.type + ";base64," + data })
    
                        // this.state.displayImg.push(s)
                        this.setState({ displayImg: s })
                        //  console.log(this.state.displayImg);
                        this.state.x.push({ name: e.name, uri: e.uri, type: e.type })
    
                        // var s = this.formatBytes(res.size)
                        // this.state.x.push({ File: { name: res.name, size: res.size, type: res.type } })
                        console.log(this.state.x);
                    }else{
                        var data = await RNFS.readFile("file://" + e.uri, 'base64').then(ress => {
                            return ress
                        });
                        var s = [];
                        s.push({ res: "data:" + e.type + ";base64," + data })
    
                        // this.state.displayImg.push(s)
                        this.setState({ displayImg: s })
                        //  console.log(this.state.displayImg);
                        this.state.x.push({ name: e.name, uri: e.uri, type: e.type })
    
                        // var s = this.formatBytes(res.size)
                        // this.state.x.push({ File: { name: res.name, size: res.size, type: res.type } })
                        console.log(this.state.x);
                    }
                    
                })
            }
            else {
                Toast.show("File Size must be less than 5 mb.")

            }

        } catch (error) {
            console.log(error);
        }
    }
    setCCBCCModalVisible = (visible) => {
        console.log(this.state.viewTo, this.state.viewCC, this.state.viewBCC);
        this.setState({ CCBCCmodalVisible: visible });
    }
    clearData = () => {
        this.setState({ selectedStateItems: [], selectedCCItems: [], selectedBCCItem: [] })
        this.setModalVisible(false)
        this.setReplyModalModalVisible(false)
    }
    render() {
        return (
            <View style={styles.container}>
                <SafeAreaView style={{ paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0, backgroundColor: Colors.primary, flexDirection: 'row', width: '100%', height: "10%", justifyContent: 'flex-start', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => this.handleBackButtonClick()} style={{ marginTop: 10, alignItems: 'flex-start', marginLeft: 10 }}>
                        <Image source={Images.back}
                            style={{ height: 15, width: 22, tintColor: 'white', alignSelf: 'center' }} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: Colors.white, marginLeft: 20, marginTop: 10 }}>View Mail</Text>

                </SafeAreaView>
                <ScrollView>
                    <View style={{ marginTop: 20, marginLeft: 16 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{this.state.data?.subject}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', margin: 20, alignItems: 'center' }}>
                        <Image
                            source={Images.profile_icon} />
                        <View style={{ marginLeft: 10 }}>
                            <Text style={{ fontWeight: 'bold' }}>{this.state.data?.spFemail}</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Text>{moment(this.state.data?.createdDate).format("DD-MM-YYYY")}</Text>
                                <TouchableOpacity onPress={() => this.setCCBCCModalVisible(true)}>
                                    <Image
                                        source={Images.arrow_down}
                                        style={{ height: 20, width: 20, padding: 10, marginLeft: 10 }} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={{ borderBottomColor: Colors.grayCCC, margin: 13, borderBottomWidth: 1, }} />

                    <Text style={{ margin: 13, fontSize: 18 }}>{this.state.data?.message}</Text>
                    <View style={{ borderBottomColor: Colors.grayCCC, margin: 13, borderBottomWidth: 1, }} />

                    <FlatList
                        horizontal
                        style={{ flex: 1, margin: 10 }}
                        //   contentContainerStyle={{ flexGrow: 1, }}
                        data={this.state.data?.attachment}
                        renderItem={({ item }) =>
                            <View style={{ flexDirection: 'row', marginLeft: 10, alignItems: 'center', marginTop: 30 }}>
                                <TouchableOpacity onPress={() => this.downloadFile(item.filePath)}
                                    style={{ flexDirection: 'row', marginLeft: 10, alignItems: 'center', marginTop: 30 }}>
                                    <Image
                                        source={Images.pinGray} />
                                    <View style={{ marginLeft: 10, }}>
                                        <Text>{item.fileName}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        }
                        numColumns={1}
                        keyExtractor={item => item.No}
                        onEndReachedThreshold={0}
                    />

                </ScrollView>

                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: 10,
                    marginBottom: 30

                }}>
                    <TouchableOpacity onPress={() => this.setReplyModalModalVisible(true)}>
                        <View style={{
                            // width: Dimensions.get('window').width / 2,
                            paddingLeft: 20,
                            paddingRight: 20,
                            paddingTop: 5,
                            borderRadius: 8,
                            paddingBottom: 5,
                            alignItems: 'center',
                            backgroundColor: '#E5E5E5',
                            flexDirection: 'row'
                        }}>
                            <Image
                                source={Images.reply_icon} />
                            <Text style={{ color: '#C4C4C4', marginLeft: 10 }}>Reply</Text></View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.setModalVisible(true)}>
                        <View style={{
                            // width: Dimensions.get('window').width / 2,
                            paddingLeft: 20,
                            paddingRight: 20,
                            paddingTop: 5,
                            borderRadius: 8,
                            paddingBottom: 5,
                            alignItems: 'center',
                            marginLeft: 20,
                            backgroundColor: '#E5E5E5',
                            flexDirection: 'row'
                        }}>
                            <Image
                                source={Images.forward_icon} />
                            <Text style={{ color: '#C4C4C4', marginLeft: 10 }}>Forward</Text></View>
                    </TouchableOpacity>

                </View>

                {/* forward Mail */}
                <Modal
                    isVisible={this.state.modalVisible}
                    onBackdropPress={() => this.clearData()}
                    onSwipeComplete={() => this.clearData()}
                    swipeDirection="left"
                    onBackButtonPress={() => this.clearData()}
                // style={{ backgroundColor:'transparent', }}
                >
                    <ScrollView>
                        {
                            this.state.data1 != null ?
                                (
                                    <View style={{ borderRadius: 5, padding: 20, backgroundColor: Colors.white }}>
                                        <View style={styles.to}>

                                            <SectionedMultiSelect
                                                // styles={search}
                                                // colors={sColor}
                                                items={this.state.data1}
                                                // single={true}
                                                searchPlaceholderText="Search"
                                                IconRenderer={Icon}
                                                uniqueKey="name"
                                                // subKey="id"
                                                selectText="To"
                                                showDropDowns={true}
                                                // readOnlyHeadings={true}
                                                onSelectedItemsChange={(value, index) => this.onStateSelectedItemsChange(value, index)}
                                                selectedItems={this.state.selectedStateItems}
                                                confirmText={"Select"}
                                            // hideConfirm={true}
                                            />
                                        </View>
                                        <View style={styles.to}>

                                            <SectionedMultiSelect
                                                // styles={search}
                                                // colors={sColor}
                                                items={this.state.data1}
                                                // single={true}
                                                searchPlaceholderText="Search"
                                                IconRenderer={Icon}
                                                uniqueKey="name"
                                                // subKey="id"
                                                selectText="CC"
                                                showDropDowns={true}
                                                // readOnlyHeadings={true}
                                                onSelectedItemsChange={(value, index) => this.onCCSelectedItemsChange(value, index)}
                                                selectedItems={this.state.selectedCCItems}
                                                confirmText={"Select"}
                                            // hideConfirm={true}
                                            />
                                        </View>
                                        <View style={styles.to}>

                                            <SectionedMultiSelect
                                                // styles={search}
                                                // colors={sColor}
                                                items={this.state.data1}
                                                // single={true}
                                                searchPlaceholderText="Search"
                                                IconRenderer={Icon}
                                                uniqueKey="name"
                                                // subKey="id"
                                                selectText="BCC"
                                                showDropDowns={true}
                                                // readOnlyHeadings={true}
                                                onSelectedItemsChange={(value, index) => this.onBCCSelectedItemsChange(value, index)}
                                                selectedItems={this.state.selectedBCCItem}
                                                confirmText={"Select"}
                                            // hideConfirm={true}
                                            />
                                        </View>
                                        <View style={styles.otpView}>
                                            <TextInput
                                                placeholder="Subject"
                                                placeholderTextColor={Colors.black}
                                                onChangeText={txt => this.setState({ subject: txt })}
                                                value={this.state.subject}
                                                style={{ flex: 1, fontSize: 18, color: Colors.black }}
                                            />
                                        </View>
                                        <View style={styles.messageView}>
                                            <TextInput
                                                placeholder="Message"
                                                placeholderTextColor={Colors.black}
                                                onChangeText={txt => this.setState({ message: txt })}
                                                value={this.state.message}
                                                multiline={true}
                                                style={{ flex: 1, fontSize: 18, color: Colors.black }}
                                            />
                                        </View>
                                        <View style={{ flexDirection: 'row', marginLeft: 10 }}>
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
                                        <TouchableOpacity onPress={() => this.forwardMsg()}>
                                            <View style={{ marginTop: 46, borderRadius: 10, backgroundColor: Colors.primary, }}>
                                                <Text style={{ color: Colors.white, fontSize: 18, fontWeight: 'bold', paddingTop: 10, paddingBottom: 10, textAlign: 'center' }}>Send</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                ) : null
                        }

                    </ScrollView>
                </Modal>
                {/* Reply Mail */}
                <Modal
                    isVisible={this.state.replyModal}
                    onBackdropPress={() => this.clearData()}
                    onSwipeComplete={() => this.clearData()}
                    swipeDirection="left"
                    onBackButtonPress={() => this.clearData()}
                // style={{ backgroundColor:'transparent', }}
                >
                    <ScrollView>
                        {
                            this.state.data1 != null ?
                                (
                                    <View style={{ borderRadius: 5, padding: 20, backgroundColor: Colors.white }}>
                                        <View style={styles.to}>

                                            <SectionedMultiSelect
                                                // styles={search}
                                                // colors={sColor}
                                                items={this.state.data1}
                                                // single={true}
                                                searchPlaceholderText="Search"
                                                IconRenderer={Icon}
                                                uniqueKey="name"
                                                // subKey="id"
                                                selectText="To"
                                                showDropDowns={true}
                                                // readOnlyHeadings={true}
                                                onSelectedItemsChange={(value, index) => this.onStateSelectedItemsChange(value, index)}
                                                selectedItems={this.state.selectedStateItems}
                                                confirmText={"Select"}
                                            // hideConfirm={true}
                                            />
                                        </View>
                                        <View style={styles.to}>

                                            <SectionedMultiSelect
                                                // styles={search}
                                                // colors={sColor}
                                                items={this.state.data1}
                                                // single={true}
                                                searchPlaceholderText="Search"
                                                IconRenderer={Icon}
                                                uniqueKey="name"
                                                // subKey="id"
                                                selectText="CC"
                                                showDropDowns={true}
                                                // readOnlyHeadings={true}
                                                onSelectedItemsChange={(value, index) => this.onCCSelectedItemsChange(value, index)}
                                                selectedItems={this.state.selectedCCItems}
                                                confirmText={"Select"}
                                            // hideConfirm={true}
                                            />
                                        </View>
                                        <View style={styles.to}>

                                            <SectionedMultiSelect
                                                // styles={search}
                                                // colors={sColor}
                                                items={this.state.data1}
                                                // single={true}
                                                searchPlaceholderText="Search"
                                                IconRenderer={Icon}
                                                uniqueKey="name"
                                                // subKey="id"
                                                selectText="BCC"
                                                showDropDowns={true}
                                                // readOnlyHeadings={true}
                                                onSelectedItemsChange={(value, index) => this.onBCCSelectedItemsChange(value, index)}
                                                selectedItems={this.state.selectedBCCItem}
                                                confirmText={"Select"}
                                            // hideConfirm={true}
                                            />
                                        </View>
                                        <View style={styles.otpView}>
                                            <TextInput
                                                placeholder="Subject"
                                                placeholderTextColor={Colors.black}
                                                onChangeText={txt => this.setState({ subject: txt })}
                                                value={this.state.subject}
                                                style={{ flex: 1, fontSize: 18, color: Colors.black }}
                                            />
                                        </View>
                                        <View style={styles.messageView}>
                                            <TextInput
                                                placeholder="Message"
                                                placeholderTextColor={Colors.black}
                                                onChangeText={txt => this.setState({ message: txt })}
                                                value={this.state.message}
                                                multiline={true}
                                                style={{ flex: 1, fontSize: 18, color: Colors.black }}
                                            />
                                        </View>

                                        <TouchableOpacity onPress={() => this.replyMsg()}>
                                            <View style={{ marginTop: 46, borderRadius: 10, backgroundColor: Colors.primary, }}>
                                                <Text style={{ color: Colors.white, fontSize: 18, fontWeight: 'bold', paddingTop: 10, paddingBottom: 10, textAlign: 'center' }}>Reply</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                ) : null
                        }
                    </ScrollView>
                </Modal>

                {/* View Mail Details */}
                <Modal
                    isVisible={this.state.CCBCCmodalVisible}
                    onBackdropPress={() => this.setCCBCCModalVisible(false)}
                    onSwipeComplete={() => this.setCCBCCModalVisible(false)}
                    swipeDirection="left"
                    onBackButtonPress={() => this.setCCBCCModalVisible(false)}
                // style={{ backgroundColor:'transparent', }}
                >
                    <View style={{ borderRadius: 5, padding: 20, backgroundColor: Colors.white }}>
                        <View style={{ marginTop: 20, flexDirection: 'row', }}>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 8.5, color: Colors.black, fontWeight: 'bold' }}>To</Text>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 1.5 }}>: {this.state.viewTo.toString()}</Text>
                        </View>
                        <View style={{ marginTop: 10, width: '100%', height: 1, backgroundColor: Colors.graye00 }} />
                        <View style={{ marginTop: 20, flexDirection: 'row', }}>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 8.5, color: Colors.black, fontWeight: 'bold' }}>CC</Text>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 1.5 }}>: {this.state.viewCC.toString()}</Text>
                        </View>
                        <View style={{ marginTop: 10, width: '100%', height: 1, backgroundColor: Colors.graye00 }} />
                        <View style={{ marginTop: 20, flexDirection: 'row', }}>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 8.5, color: Colors.black, fontWeight: 'bold' }}>BCC</Text>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 1.5 }}>: {this.state.viewBCC.toString()}</Text>
                        </View>
                        <View style={{ marginTop: 10, width: '100%', height: 1, backgroundColor: Colors.graye00 }} />
                    </View>
                </Modal>
            </View >
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: Colors.white
    },
    otpView: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#C4C4C4',
        alignItems: 'center',
        margin: 13,
    },
    to: {
        borderWidth: 1,
        borderColor: '#C4C4C4',
        // alignItems: 'center',
        margin: 13,
    },
    messageView: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#C4C4C4',
        alignItems: 'center',
        margin: 13,
    },
})
export default connect(mapStateToProps, mapDispatchToProps)(ViewMail);