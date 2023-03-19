import {View, Text, StyleSheet} from 'react-native';
import React from 'react';

const GenericHeader = props => {
  const {title, leftView, rightIcon} = props;
  return (
    <View style={styles.container}>
      {leftView && leftView()}
      <Text style={styles.headerTitle}>{title}</Text>
      {rightIcon && rightIcon()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 45,
    width: '100%',
    backgroundColor: '#FFFFFF',
    marginBottom: 1,
    elevation: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  headerTitle: {
    fontSize: 14,
    color: '#000000',
    textAlign: 'center',
    flex: 1,
    fontFamily: 'Nunito-Bold',
  },
});

export default GenericHeader;
