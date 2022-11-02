import { Formik } from 'formik';
import React, { Component } from 'react';
import { BackHandler, Dimensions, Image, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Toast from 'react-native-simple-toast';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import { COLORS } from '../../../Assets';
import Colors from '../../../Assets/Colors';
import { mapDispatchToProps, mapStateToProps } from '../../../Reducers/ApiClass';
import { axiosPost } from '../../../utility/apiConnection';

const { width, height } = Dimensions.get('window');
const book = Yup.object().shape({
  bookName: Yup.string().required("Book Name is required.")

});
class RequestNewBook extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this)

    this.state = {
      request: {
        bookName: '',
      },

      author: '',
      publication: '',
      category: '',
      categoryList: [],
    };
  }

  async componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    console.log(this.props.CategoryList);
    this.props.CategoryList.filter(e=>{
      this.state.categoryList.push({label:e,value:""})
    })
    // this.setState({ categoryList: this.props.CategoryList })
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);

  }
  handleBackButtonClick() {
    this.props.navigation.goBack()
    return true;
  }
  onchangeValue = (value) => {
    this.setState({ category: value.label })
  }
  submitData = async (values) => {
    console.log(values.bookName);
    console.log(this.state.author);
    console.log(this.state.publication);
    console.log(this.state.category);
    if (this.state.category != '') {
      const params = {
        "bookId": 0,
        "bookName": values.bookName,
        "author": this.state.author,
        "publication": this.state.publication,
        "category": this.state.category,
        "status": 0,
        "createdby": 0,

      }
      try {
        let response = await axiosPost("Program/SaveBookRequest", params);
        // this.setState({ data: response })
        console.log(response);
        Toast.show(response.message)
        this.props.navigation.replace('SamtaDigitalLibrary');


      } catch (error) {
        console.log(error);
      }
    } else {
      Toast.show("Category is required.")
    }

    //
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Formik
          validationSchema={book}
          // enableReinitialize={false}
          initialValues={this.state.request}
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
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: Colors.white, marginLeft: 20, marginTop: 10 }}>Request Book</Text>
              </SafeAreaView>
              {/* <Text>Request a Book</Text> */}

              <View style={styles.otpView}>
                <TextInput
                  placeholder="Book Name*"
                  placeholderTextColor={Colors.primary}
                  onBlur={handleBlur("bookName")}
                  onChangeText={handleChange("bookName")}
                  value={values.bookName}
                  style={{ fontSize: 18, color: Colors.primary, marginTop: 10, borderBottomColor: Colors.primary, borderBottomWidth: 1 }}
                />
                {
                  console.log("Errors:", errors.bookName),
                  errors.bookName && touched.bookName ?
                    <Text style={{ color: Colors.red, fontSize: 15 }}>{errors.bookName}</Text>
                    : null
                }

                <TextInput
                  placeholder="Author"
                  placeholderTextColor={Colors.primary}
                  value={this.state.author}
                  onChangeText={txt => this.setState({ author: txt })}
                  style={{ fontSize: 18, color: Colors.primary, marginTop: 10, borderBottomColor: Colors.primary, borderBottomWidth: 1 }}
                />

                <TextInput
                  placeholder="Publication"
                  placeholderTextColor={Colors.primary}
                  value={this.state.publication}
                  onChangeText={txt => this.setState({ publication: txt })}
                  style={{ fontSize: 18, marginTop: 10, color: Colors.primary, borderBottomColor: Colors.primary, borderBottomWidth: 1 }}
                />

                <View style={{
                  borderColor: Colors.primary,
                  borderBottomWidth: 1,
                  marginTop: 10,
                  borderRadius: 4

                }}>
                    {
                        this.state.categoryList.length>=0?(
                                // <Picker.Item  label={item.programMasterTitle} value={item.proId} key={index} />
                                <DropDownPicker
                                items={this.state.categoryList}
                                // defaultValue={this.state.selectValue}
                                placeholder={"Select Category"}
                                containerStyle={{ height: 40 }}
                                // style={{ backgroundColor: '#fafafa' }}
                                // dropDownStyle={{ backgroundColor: '#fafafa' }}
                                onChangeItem={item => this.onchangeValue(item)}
                            />
                                ):null
                    }

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
  pickerIcon: {
    color: COLORS.primary,
    position: "absolute",
    bottom: 15,
    right: 10,
    fontSize: 20
  },

  pickerContent: {
    color: Colors.primary,
    backgroundColor: "transparent",
  },
  listTitle: {
    fontSize: 13,
    color: Colors.primary
  },
  otpView: {
    // alignItems: 'center',
    margin: 20
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
export default connect(mapStateToProps, mapDispatchToProps)(RequestNewBook);