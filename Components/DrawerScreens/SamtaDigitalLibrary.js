import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Linking } from 'react-native';
import { connect } from 'react-redux';
import { IMAGES } from '../../Assets';
import Colors from '../../Assets/Colors';
import Images from '../../Assets/Images';
import IMAGEURL from '../../utility/util';
import { mapStateToProps, mapDispatchToProps } from '../../Reducers/ApiClass';
import { axiosAuthGet } from '../../utility/apiConnection';
import { getItem } from '../../utility/AsyncConfig';
import { Header } from '../CusComponent';
class SamtaDigitalLibrary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            Name: '',
            mobile: '',
            memberImage: '',
            webSites: [{ no: 1, webName: 'SANGH SATHIYA', url: 'https://www.sadhumargi.com/%E0%A4%B8%E0%A4%BE%E0%A4%A7%E0%A5%81%E0%A4%AE%E0%A4%BE%E0%A4%B0%E0%A5%8D%E0%A4%97%E0%A5%80-%E0%A4%AA%E0%A4%AC%E0%A5%8D%E0%A4%B2%E0%A4%BF%E0%A4%95%E0%A5%87%E0%A4%B6%E0%A4%A8-%E0%A4%B8%E0%A4%BE%E0%A4%B9/' },
            { no: 2, webName: 'NATIONAL DIGITAL LIBRARY', url: 'https://ndl.iitkgp.ac.in/' },
            { no: 3, webName: 'VAIDIKA VIGNANAM', url: 'https://vignanam.org/mobile/' },
            { no: 4, webName: 'EBALBHARATI', url: 'https://cart.ebalbharati.in/BalBooks/ebook.aspx' },
            { no: 5, webName: 'Taxman Online', url: 'https://taxindiaonline.com/' },]
        };
    }
    async componentDidMount() {
        try {
            var values;
            await getItem('LoginDetails').then((data) => {
                values = data.memberId;
                this.setState({ memberId: values })
                // console.log("Member id:", data.memberId);
            })
            console.log("Member id:", values);
            let response = await axiosAuthGet("Member/Profile/" + values)
            this.setState({
                data: response,
                Name: response.memberName,
                mobile: response.mobile,
                // MidID: response.memberMIDId,
                // SPFID: response.memberSPFId,
                // memberImage: response.memberImage,

            })
            if (response.memberImage != '') {
                var memberImage = { uri: IMAGEURL + response.memberImage }
                this.setState({ memberImage: memberImage })
            }
            else {
                var memberImage = Images.user_default
                this.setState({ memberImage: memberImage })
            }
            console.log("Profile:-", response);
        } catch (error) {

        }
        try {
            let response = await axiosAuthGet("Library/FileList/" + 'null');
            this.setState({ data: response })
            // console.log(this.state.data);
            let category = [];
            this.state.data.forEach(element => {
                category.push(element.fileName)
            });
            this.setState({ data: this.state.data.concat(this.state.webSites) })

            console.log(this.state.data);
            this.props.Category(category);
        } catch (error) {
            console.log(error);
        }
    }
    navigateScreen = (filePath, name) => {
        // console.log(filePath);
        var dataItem = {
            filePath: filePath,
            name: name
        }
        this.props.SDLibrary(dataItem);
        this.props.navigation.navigate('PopularLibrary')
    }
    requestBook = () => {
        this.props.navigation.navigate('RequestNewBook')
    }
    reDirect = (url) => {
        Linking.openURL(url).catch(err => console.error("Couldn't load page", err));

    }
    render() {

        return (
            <View style={styles.container}>
                <Header title={"Samta Digital Library"} navigation={this.props.navigation} />

                {/* <Text style={{ margin: 10 }}> Segments </Text> */}
                <View style={{ margin: 20, flexDirection: 'row', alignItems: 'center' }}>

                    <Image style={{
                        width: 75, height: 75, borderRadius: 75 / 2,
                        overflow: "hidden",
                    }}
                        source={Images.user_default} />

                    <View style={{ marginLeft: 13 }}>
                        <Text style={{ fontSize: 18, color: Colors.primary, fontWeight: 'bold' }}>{"Shri Nirmal Sanghvi"}</Text>
                        <Text style={{ fontSize: 15 }}>{"+91 9320021008"}</Text>
                    </View>

                </View>
                <FlatList
                    style={{ margin: 10 }}
                    data={this.state.data}

                    renderItem={({ item }) =>
                        <View style={styles.GridViewBlockStyle}>
                            {/* <Text>{item.No}</Text> */}
                            <TouchableOpacity onPress={() => this.navigateScreen(item.filePath, item.fileName)}>
                                <Text style={styles.picsStyle}>{item.fileName}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                            style={{}} onPress={() => this.reDirect(item.url)}>
                                <Text style={styles.picsStyle1}>{item.webName}</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    numColumns={2}
                    keyExtractor={item => item.fileName}
                />
                
                <View style={{
                    position: 'absolute',
                    alignItems: 'center',
                    justifyContent: 'center',
                    right: 30,
                    bottom: 30,
                }}>
                    <TouchableOpacity onPress={() => this.requestBook()}>
                        <Image
                            source={Images.add_icon}
                            style={{
                            }} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    picsStyle: {
        fontSize: 16,
        color: COLORS.primary,
        fontWeight: 'bold',
        textAlign:'center',
        justifyContent:'center',
        alignItems:'center'
    },
    picsStyle1: {
        fontSize: 16,
        justifyContent:'center',
        alignItems:'center',
        textAlign:'center',
        color: COLORS.primary,
        fontWeight: 'bold',
        paddingBottom:10
    },
    GridViewBlockStyle: {

        justifyContent: 'center',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        height: 50,
        borderRadius: 13,
        margin: 5,
        backgroundColor: COLORS.white

    }
})
export default connect(mapStateToProps, mapDispatchToProps)(SamtaDigitalLibrary);
