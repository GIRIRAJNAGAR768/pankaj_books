import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import RootNavigation from './navigations/root.navigation';
import database from '@react-native-firebase/database';

import {LogBox} from 'react-native';
import AppUpdateSheet from './components/app.update.sheet';
import packageData from '../package.json';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

const App = () => {
  const [appUpdate, setAppUpdate] = useState(false);

  useEffect(() => {
    database()
      .ref('/currentVersion')
      .on('value', snapshot => {
        if (packageData?.version !== snapshot.val()) {
          setAppUpdate(true);
        } else {
          setAppUpdate(false);
        }
      });
  }, []);

  const renderUpdateAppSheet = () => {
    return <AppUpdateSheet visible={appUpdate} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#FFFFFF'} />
      {appUpdate && renderUpdateAppSheet()}
      <NavigationContainer>
        <RootNavigation />
      </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

export default App;
