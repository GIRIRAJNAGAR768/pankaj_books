import {View, Text, StyleSheet, StatusBar} from 'react-native';
import React, {useEffect} from 'react';

const SplashScreen = props => {
  useEffect(() => {
    setTimeout(() => {
      props.navigation.replace('HomeScreen');
    }, 1000);
  }, [props]);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Text style={styles.headerTitle}>Pankaj Nagar Books</Text>
      <Text style={styles.headerSubTitle}>One Man One Hundred Talent</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  headerTitle: {
    fontSize: 25,
    color: '#000',
    marginVertical: 10,
    fontFamily: 'Nunito-Bold',
  },
  headerSubTitle: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'Nunito-SemiBold',
  },
});

export default SplashScreen;
