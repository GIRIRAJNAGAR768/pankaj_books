import {View, Text, Modal, StyleSheet, Linking} from 'react-native';
import React from 'react';
import GenericButton from './generic.button';

const AppUpdateSheet = props => {
  const {visible} = props;
  return (
    <Modal
      animationType="fade"
      visible={visible}
      onRequestClose={() => {}}
      transparent>
      <View style={styles.mainModalView}>
        <Text style={styles.headertext}>{'New App Update Available'}</Text>
        <Text style={styles.subHeadText}>
          {'Please update the app to new version to get the latest features'}
        </Text>

        <GenericButton
          title={'Update Now'}
          onButtonPress={() => {
            Linking.openURL(
              'https://play.google.com/store/apps/details?id=com.pankaj_books',
            );
          }}
          width={'60%'}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  mainModalView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  headertext: {
    color: '#000000',
    fontSize: 18,
    fontFamily: 'Nunito-SemiBold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subHeadText: {
    color: '#000000',
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default AppUpdateSheet;
