import React from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
} from 'react-native';

import BaseInput from './BaseInput';
import Colors from '../../Assets/Colors';
  
export default class FlotingEditText extends BaseInput {
  static propTypes = {
    borderColor: PropTypes.string,
    /*
     * this is used to set backgroundColor of label mask.
     * this should be replaced if we can find a better way to mask label animation.
     */
    maskColor: PropTypes.string,
    inputPadding: PropTypes.number,
    height: PropTypes.number,
  };

  static defaultProps = {
    borderColor: Colors.primary,
    inputPadding: 10,
    height: 45, 
    borderHeight: 1.2, 
  };

  render() {
    const {
      label,
      style: containerStyle,
      inputStyle,
      labelStyle,
      maskColor,
      borderColor,
      borderHeight,
      inputPadding,
      height: inputHeight,
    } = this.props;
    const { width, focusedAnim, value } = this.state;
    const flatStyles = StyleSheet.flatten(containerStyle) || {};
    const containerWidth = flatStyles.width || width;
    
    return (
      <View style={this.props.viewStyle}>
      <View
        style={[
          styles.container,
          containerStyle,
          {
            height: inputHeight + inputPadding,
            width: containerWidth,
          },
        ]}
        onLayout={this._onLayout}
      >
        <TextInput
          ref={this.input}
          {...this.props}
          style={[
            styles.textInput,
            inputStyle,
            {
              width,
              height: inputHeight,
              left: inputPadding,
              bottom:0,
            },
          ]}
          value={value}
          onBlur={this._onBlur}
          onChange={this._onChange}
          onFocus={this._onFocus}
          // underlineColorAndroid={'transparent'}
        />
        <TouchableWithoutFeedback onPress={this.focus}>
          <Animated.View
            style={[
              styles.labelContainer,
              {
                opacity: focusedAnim.interpolate({
                  inputRange: [0, 0.5, 1], 
                  outputRange: [1, 0, 1],
                }),
                top: focusedAnim.interpolate({
                  inputRange: [0, 0.5, 0.51, 1],
                  outputRange: [24, 24, 0, 0],
                }),
                left: focusedAnim.interpolate({
                  inputRange: [0, 0.5, 0.51, 1],
                  outputRange: [inputPadding, 2 * inputPadding, 0, inputPadding],
                }),
              },
            ]}
          >
            <Text style={[this.state.value?{fontSize: 12,color: Colors.primary}:styles.label, labelStyle]}>
              {label}
            </Text>
          </Animated.View>
        </TouchableWithoutFeedback>
        <View
          style={[styles.labelMask, {
            backgroundColor: maskColor,
            width: inputPadding,
          }]}
        />
        <Animated.View
          style={[
            styles.border,
            {
              width: focusedAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, width],
              }),
              backgroundColor: borderColor,
              height: borderHeight,
            },
          ]}
        />
      </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 2,
    borderBottomColor: '#b9c1ca',
  },
  labelContainer: {
    position: 'absolute',
  },
  label: {
    fontSize: 16,
    color: Colors.white,
  },
  textInput: {
    position: 'absolute',
    bottom: 2,
    padding: 0,
    color:Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  labelMask: {
    height: 24,
    marginBottom:10
  },
  border: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
