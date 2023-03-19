import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import GenericHeader from '../components/generic.header';
import GenericButton from '../components/generic.button';
import LoginBottomSheet from '../components/login.sheet';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const HomeScreen = props => {
  const [loginSheetOpen, setLoginSheetOpen] = useState(false);
  const [loader, setLoader] = useState(true);
  const [booksData, setBooksData] = useState([]);

  useEffect(() => {
    loadApiData();
  }, []);

  const loadApiData = async () => {
    database()
      .ref('/books')
      .once('value', snapshot => {
        console.log('booksData', snapshot.val());
        if (snapshot.val() && Object.keys(snapshot.val())?.length > 0) {
          const allBooksData =
            Object?.entries(snapshot.val())?.map(item => {
              console.log({item});
              return item?.[1];
            }) || [];
          console.log({allBooksData});
          setBooksData(allBooksData);
          setLoader(false);
        }
      });
  };

  const loginBottomSheet = () => {
    return (
      <LoginBottomSheet
        visible={loginSheetOpen}
        onClose={() => setLoginSheetOpen(false)}
      />
    );
  };

  return (
    <View style={styles.container}>
      <GenericHeader
        title={'Pankaj Nagar Books'}
        rightIcon={() => (
          <MaterialIcons
            style={styles.logoutIcon}
            name={'logout'}
            color={'#000000'}
            size={25}
            onPress={async () => {
              await AsyncStorage.clear();
              await GoogleSignin.signOut();
              ToastAndroid.showWithGravity(
                'Logout Successfully',
                ToastAndroid.BOTTOM,
                ToastAndroid.LONG,
              );
            }}
          />
        )}
      />
      {loginSheetOpen && loginBottomSheet()}

      {loader ? (
        <View style={styles.loaderBox}>
          <ActivityIndicator size={30} color={'#000000'} />
        </View>
      ) : (
        <View style={styles.mainView}>
          <FlatList
            keyExtractor={({item, index}) => index?.toString()}
            data={booksData ?? []}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            renderItem={({item, index}) => {
              return (
                <View key={index} style={styles.imageBox1}>
                  <Image
                    source={{
                      uri: item?.bookBannerImage,
                    }}
                    style={styles.imageStyle}
                  />
                  <Text style={styles.bookNameText}>{item?.bookName}</Text>
                  <GenericButton
                    title={'Read Now'}
                    onButtonPress={() => {
                      props?.navigation?.navigate('PDFScreen', {
                        bookData: item,
                        allBooks: booksData,
                      });
                    }}
                    width={'98%'}
                  />
                </View>
              );
            }}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mainView: {
    padding: 12,
    backgroundColor: '#FFFFFF',
  },
  imageBox1: {
    width: '98%',
    backgroundColor: '#FFFFFF',
    marginBottom: 15,
    elevation: 5,
    paddingBottom: 10,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  imageStyle: {
    minWidth: '100%',
    height: 200,
    zIndex: 1,
    marginBottom: 10,
    borderRadius: 5,
  },
  listContainer: {
    paddingBottom: 50,
  },
  loaderBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
  },
  bookNameText: {
    color: '#000000',
    fontSize: 16,
    marginHorizontal: 5,
    marginBottom: 10,
    fontFamily: 'Nunito-SemiBold',
  },
  logoutIcon: {
    position: 'absolute',
    right: 10,
  },
});

export default HomeScreen;
