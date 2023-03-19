import {View, Text, Modal, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';

const LoginBottomSheet = props => {
  const {visible, onClose, modalPosition = 'flex-end'} = props;
  return (
    <Modal
      animationType="fade"
      visible={visible}
      onRequestClose={() => {
        onClose();
      }}
      transparent>
      <View style={{...styles.mainModalView, justifyContent: modalPosition}}>
        <TouchableOpacity
          onPress={() => onClose()}
          style={styles.topBlankView}
        />

        <View style={styles.mainBox}></View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  mainModalView: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  topBlankView: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  mainBox: {
    height: 200,
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
});

export default LoginBottomSheet;
