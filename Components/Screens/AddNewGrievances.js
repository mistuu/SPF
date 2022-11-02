import React from 'react';
import { BackHandler, Dimensions, Image, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DocumentPickerHandle from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import Toast from 'react-native-simple-toast';
import { COLORS } from '../../Assets';
import Colors from '../../Assets/Colors';
import Images from '../../Assets/Images';
import { axiosPost } from '../../utility/apiConnection';
import { getItem } from '../../utility/AsyncConfig';
const { width, height } = Dimensions.get('window');
import { Formik } from 'formik';
import * as Yup from 'yup';
const grievance = Yup.object().shape({
    title: Yup.string().required("Grievances title is required"),
    description: Yup.string().required("Grievances Description is required")
});
export default class AddNewGrievances extends React.Component {
    constructor(props) {
        super(props);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this)

        this.state = {
            date: "2016-05-15",
            singleFile: null,
            setSingleFile: null,
            data: null,
            grievanceData: {
                title: '',
                description: '',
            },
            documents: null,
            compressFile: null,
            filePath: null,
        };
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);

        var date = new Date()
        console.log(date);
        this.setState({ date: date })
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
            var res = await DocumentPickerHandle.pick({
                type: [DocumentPickerHandle.types.allFiles],
            });

            if (Platform.OS == 'ios') {
                res = Object.assign({}, ...res)
                console.log("for ios ==", res);
                var data = await RNFS.readFile(res.uri, 'base64').then(ress => { return ress });
                this.setState({ filePath: "data:" + res.type + ";base64," + data })
                this.setState({ documents: res.name + "," + data })
            } else {
                var data = await RNFS.readFile("file://" + res.uri, 'base64').then(ress => { return ress });
                this.setState({ filePath: "data:" + res.type + ";base64," + data })
                this.setState({ documents: res.name + "," + data })
            }
            // var data = await RNFS.readFile("file://" + res.uri, 'base64').then(ress => { return ress });
            // this.setState({ filePath: "data:" + res.type + ";base64," + data })
            // this.setState({ documents: res.name + "," + data })
            // this.setState({ setSingleFile: res })

            // RNFetchBlob.fs
            //     .stat(res.uri) // Relative path obtained from document picker
            //     .then(stats => {
            //         console.log(stats);
            //         var str1 = "file://";
            //         var str2 = stats.path;
            //         var correctpath = str1.concat(str2);
            //         this.setState({ filePath: correctpath });
            //         let data = RNFetchBlob.fs.readFile(correctpath, 'base64')
            //         this.setState({ compressFile: data })
            //         console.log("file Path:", correctpath);
            //     })
            //     .catch(err => {
            //         console.log(err);
            //     });

            // console.log("Compress File:",data);
        } catch (error) {
            console.log(error);
        }
    }
    submitData = async (value) => {
        var date = new Date()
        var values;


        await getItem('LoginDetails').then((data) => {
            values = data.memberId;
            this.setState({ id: values })
            // console.log("Member id:", data.memberId);
        })
        console.log("Member id:", values);


        console.log("compress File:", this.state.compressFile);
        const params = {

            "grievanceId": 0,
            "title": value.title,
            "grievanceDescription": value.description,
            "grievanceDate": date,
            "document": this.state.documents,
            "memberId": values

        }
        // var formdata = new FormData()
        // formdata.append("title", this.state.title)
        // formdata.append("grievanceDescription", this.state.description)
        // formdata.append("document", this.state.documents)
        // formdata.append("grievanceDate", date)
        // formdata.append("memberId", values)
        // console.log("Submit Data:====", formdata);

        try {
            // axios.post('https://spfapi.naapbooks.com/api/Grievance/Save/',formdata, {
            //     headers: {
            //     'Content-Type': 'application/json'
            //     }
            //   }
            // ).then((response)=>{
            //     console.log(response);
            // })
            // this.props.navigation.goBack('Grievances');

            let response = await axiosPost('Grievance/Save/', params);

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
                <Formik
                    validationSchema={grievance}
                    // enableReinitialize={false}
                    initialValues={this.state.grievanceData}
                    onSubmit={values => this.submitData(values)}
                >
                    {({ setFieldValue,
                        handleSubmit,
                        handleChange,
                        values, handleBlur,
                        errors, touched
                    }) => (
                        <>
                            <SafeAreaView style={{ paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0, backgroundColor: Colors.primary, flexDirection: 'row', width: '100%', height: "10%", justifyContent: 'flex-start', alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => this.handleBackButtonClick()} style={{ marginTop: 10, alignItems: 'flex-start', marginLeft: 10 }}>
                                    <Image source={IMAGES.back}
                                        style={{ height: 15, width: 22, tintColor: 'white', alignSelf: 'center' }} />
                                </TouchableOpacity>
                                <Text style={{ fontSize: 18, fontWeight: 'bold', color: Colors.white, marginLeft: 20, marginTop: 10 }}>Add New Grievances</Text>
                            </SafeAreaView>
                            {/* <Text style={styles.GrievancesTitle}>Add New Grievances </Text> */}

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
                                        onBlur={handleBlur("title")}
                                        onChangeText={handleChange("title")}
                                        value={values.title}
                                        style={{ flex: 1, fontSize: 18, color: Colors.primary, marginTop: 20 }}
                                    />
                                </View>
                                {
                                    console.log("Errors:", errors.title),
                                    errors.title && touched.title ?
                                        <Text style={{ color: Colors.red, fontSize: 15 }}>{errors.title}</Text>
                                        : null
                                }
                                <View style={styles.otpView}>

                                    <TextInput
                                        style={{
                                            flex: 1, fontSize: 18, color: Colors.primary, marginTop: 20
                                        }}
                                        onBlur={handleBlur("description")}
                                        onChangeText={handleChange("description")}
                                        value={values.description}
                                        underlineColorAndroid="transparent"
                                        placeholder={"description."}
                                        placeholderTextColor={Colors.primary}
                                        multiline={true}
                                    />
                                </View>
                                {
                                    console.log("Errors:", errors.description),
                                    errors.description && touched.description ?
                                        <Text style={{ color: Colors.red, fontSize: 15 }}>{errors.description}</Text>
                                        : null
                                }

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
                                    onPress={() => handleSubmit()}><Text style={styles.submitText}> Submit </Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}

                </Formik>
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
        marginTop: 30,
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
