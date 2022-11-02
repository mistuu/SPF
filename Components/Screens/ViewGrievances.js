import { CheckBox } from 'native-base';
import React, { Component } from 'react';
import { View, BackHandler, Text, Route, Dimensions, TouchableOpacity, Platform, PermissionsAndroid, Image, ScrollView, Alert, SafeAreaView, StatusBar } from 'react-native';
import Colors from '../../Assets/Colors';
import { connect } from 'react-redux';
import moment from 'moment';
import { mapStateToProps, mapDispatchToProps } from '../../Reducers/ApiClass';
import { axiosAuthGet } from '../../utility/apiConnection';
import RNFetchBlob from 'rn-fetch-blob';
import { IMAGEURL } from '../../utility/util'
import { IMAGES } from '../../Assets';
const { width, height } = Dimensions.get('window');

const fileUrl = IMAGEURL;

class ViewGrievances extends Component {
    constructor(props) {
        super(props);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this)

        this.state = {
            GrievanceId: '',
            data: null,
            title: '',
            description: '',
            date: '',
            document: '',
            remark: ''
        };

    }
    async componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);

        console.log("grievanceId", this.props.GrievanceDetails);
        try {
            let response = await axiosAuthGet('Grievance/GetById/' + this.props.GrievanceDetails);
            response.forEach(element => {
                this.setState({
                    title: element.title,
                    description: element.grievanceDescription,
                    date: element.grievanceDate,
                    document: element.document,
                    remark: element.remarks
                })
            });
            this.setState({ data: response })
            console.log(this.state.data);
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
    checkPermission = async () => {

        // Function to check the platform
        // If Platform is Android then check for permissions.

        if (Platform.OS === 'ios') {
            this.downloadFile()
        } else {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'Storage Permission Required',
                        message:
                            'Application needs access to your storage to download File',
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    // Start downloading
                    this.downloadFile()
                    console.log('Storage Permission Granted.');
                } else {
                    // If permission denied then show alert
                    Alert.alert('Error', 'Storage Permission Not Granted');
                }
            } catch (err) {
                // To handle permission related exception
                console.log("++++" + err);
            }
        }
    }
    downloadFile = async () => {

        // Get today's date to add the time suffix in filename
        let date = new Date();
        // File URL which we want to download
        let FILE_URL = fileUrl + this.state.document;
        // Function to get extention of the file url
        let file_ext = this.getFileExtention(FILE_URL);

        file_ext = '.' + file_ext[0];
        console.log(file_ext);
        // config: To get response by passing the downloading related options
        // fs: Root directory path to download
        if (Platform.OS == 'ios') {
            const { dirs: { DownloadDir, DocumentDir } } = RNFetchBlob.fs;
            const { config } = RNFetchBlob;
            const isIOS = Platform.OS == "ios";
            const aPath = Platform.select({ ios: DocumentDir, android: DownloadDir });
            const fPath = aPath + '/' + Math.floor(date.getTime() + date.getSeconds() / 2) + file_ext;
            const configOptions = Platform.select({
                ios: {
                    fileCache: true,
                    path: fPath,
                    // mime: 'application/xlsx',
                    // appendExt: 'xlsx',
                    //path: filePath,
                    //appendExt: fileExt,
                    notification: true,
                },

                android: {
                    fileCache: false,
                    addAndroidDownloads: {
                        useDownloadManager: true,
                        notification: true,
                        path: fPath,
                        description: 'Downloading xlsx...',
                    }
                },
            }); config(configOptions)
                .fetch('GET', FILE_URL)
                .then(res => {

                    //  this.setState({overLoader: false});
                    //  this.onResumeCall();
                    //  //this.refs.toast.show('File download successfully');
                    setTimeout(() => {
                        // RNFetchBlob.ios.previewDocument('file://' + res.path());   //<---Property to display iOS option to save file
                        RNFetchBlob.ios.openDocument(res.data);                      //<---Property to display downloaded file on documaent viewer
                        // Alert.alert(CONSTANTS.APP_NAME, 'File download successfully');
                    }, 300);

                })
                .catch(errorMessage => {
                    //  this.setState({overLoader: false});
                    //  this.refs.toast.show(errorMessage,2000);
                });
        } else {
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
    getFileExtention = fileUrl => {
        // To get the file extension
        return /[.]/.exec(fileUrl) ?
            /[^.]+$/.exec(fileUrl) : undefined;
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <SafeAreaView style={{ paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0, backgroundColor: Colors.primary, flexDirection: 'row', width: '100%', height: "10%", justifyContent: 'flex-start', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => this.handleBackButtonClick()} style={{ marginTop: 10, alignItems: 'flex-start', marginLeft: 10 }}>
                        <Image source={IMAGES.back}
                            style={{ height: 15, width: 22, tintColor: 'white', alignSelf: 'center' }} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: Colors.white, marginLeft: 20, marginTop: 10 }}>Description</Text>
                </SafeAreaView>
                <ScrollView>
                    <View style={{ margin: 33 }}>
                        <Text style={{ alignItems: 'center', textAlign: 'center', fontSize: 20, color: Colors.primary }}>Grievance Details</Text>
                        <View style={{ alignSelf: 'center', marginTop: 10, width: '60%', height: 2, backgroundColor: Colors.black }} />

                        <View style={{ marginTop: 20, flexDirection: 'row', }}>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5, color: Colors.primary, fontWeight: 'bold' }}>Grievances Title</Text>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5 }}>: {this.state.title}</Text>
                        </View>
                        <View style={{ marginTop: 10, width: '100%', height: 1, backgroundColor: Colors.graye00 }} />
                        <View style={{ marginTop: 10, flexDirection: 'row', }}>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5, color: Colors.primary, fontWeight: 'bold' }}>Date</Text>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5 }}>: {moment(this.state.date).format("MM-DD-YYYY")}</Text>
                        </View>
                        <View style={{ marginTop: 10, width: '100%', height: 1, backgroundColor: Colors.graye00 }} />
                        <View style={{ marginTop: 10, flexDirection: 'row', }}>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5, color: Colors.primary, fontWeight: 'bold' }}>Grievance Description</Text>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5 }}>: {this.state.description}</Text>
                        </View>
                        <View style={{ marginTop: 10, width: '100%', height: 1, backgroundColor: Colors.graye00 }} />

                        {
                            this.state?.remark != null ? (

                                <View style={{ marginTop: 10, flexDirection: 'row', }}>
                                    <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5, color: Colors.primary, fontWeight: 'bold' }}>Remark</Text>
                                    <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5 }}>: {this.state.remark}</Text>
                                </View>
                            ) : null
                        }
                        <View style={{ flexDirection: 'row', marginTop: 20 }}>
                            <Text style={{ fontWeight: 'bold', color: Colors.primary }}> Image/Document </Text>
                            <View style={{
                                backgroundColor: Colors.primary,
                                borderRadius: 8,
                                marginLeft: 20
                            }}>
                                <TouchableOpacity onPress={() => this.checkPermission()}>
                                    <Text style={{
                                        color: "#fff",
                                        paddingRight: 20,
                                        paddingLeft: 20,
                                        paddingTop: 5,
                                        fontSize: 13,
                                        paddingBottom: 5,
                                        // justifyContent: 'center',
                                        textAlign: 'center',
                                    }}>Download</Text>
                                </TouchableOpacity>
                            </View>

                        </View>

                    </View>
                </ScrollView>
            </View>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ViewGrievances);