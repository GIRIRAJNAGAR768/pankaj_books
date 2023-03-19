import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';

const GenericButton = props => {
  const {title, onButtonPress, width} = props;
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onButtonPress()}
      style={{...styles.container, width: width ?? '40%'}}>
      <Text style={styles.buttonTitle}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E59866',
    height: 45,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buttonTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'Nunito-Bold',
  },
});
export default GenericButton;
