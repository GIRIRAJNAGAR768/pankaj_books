import {View, Text, StyleSheet, ToastAndroid} from 'react-native';
import React, {useEffect, useState} from 'react';
import GenericHeader from '../components/generic.header';
import AntDesign from 'react-native-vector-icons/AntDesign';
import PDFView from 'react-native-view-pdf';
import GenericButton from '../components/generic.button';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BooksBottomSheet from '../components/books.bottom.sheet';
import RazorpayCheckout from 'react-native-razorpay';
import Spinner from 'react-native-loading-spinner-overlay/lib';

GoogleSignin.configure({
  offlineAccess: true,
  webClientId:
    '1012242455025-pmpkfs0d7t31e88fkuv6je4vfqr8h6uu.apps.googleusercontent.com',
  androidClientId:
    '1012242455025-pmpkfs0d7t31e88fkuv6je4vfqr8h6uu.apps.googleusercontent.com',
});

const PaymentStatusEnum = {
  DONE: 'DONE',
  PENDING: 'PENDING',
  NOTDONE: 'NOTDONE',
  FAILED: 'FAILED',
};

const PDFScreen = props => {
  const {bookData, allBooks} = props?.route?.params;

  const [userData, setUserData] = useState(null);
  const [booksSheetOpen, setBookSheetOpen] = useState(false);
  const [otherBookChecked, setOtherBookChecked] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [totalDiscount, setTotalDiscount] = useState(0);

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    console.log('userDatauserDatauserData', userData);
  }, [userData]);

  const getUserData = async () => {
    const userData1 = await AsyncStorage.getItem('userData');
    if (userData1) {
      const userJsonData = JSON.parse(userData1);
      setUserData(userJsonData);
      fetchAndUpdateUserData(userJsonData?.uid);
    }
    fetchTotalDiscount();
  };

  const fetchAndUpdateUserData = async uid => {
    database()
      .ref('/users/' + uid)
      .once('value')
      .then(async snapshot => {
        console.log('User data: ', snapshot.val());
        const userData1 = snapshot.val();
        if (userData1) {
          await AsyncStorage.setItem('userData', JSON.stringify(userData1));
          setUserData(userData1);
        }
      });
  };

  const fetchTotalDiscount = async () => {
    database()
      .ref('/totalDiscountAmount')
      .once('value')
      .then(async snapshot => {
        console.log('User data: ', snapshot.val());
        setTotalDiscount(snapshot.val() ?? 0);
      });
  };

  const onLoginWithGoogle = async () => {
    setShowLoader(true);
    try {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      // Get the users ID token
      const {idToken} = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      let data = await auth().signInWithCredential(googleCredential);
      console.log('datata', data?.user?._user);

      if (data?.user?._user?.emailVerified) {
        const {displayName, email, photoURL, uid, phoneNumber} =
          data?.user?._user;

        database()
          .ref('/users/' + uid)
          .once('value')
          .then(async snapshot => {
            console.log('User data: ', snapshot.val());
            const userData1 = snapshot.val();
            if (!userData1) {
              const dataBody = {
                name: displayName,
                email: email,
                profile: photoURL,
                uid: uid,
                phone: phoneNumber,
              };

              database()
                .ref('/users/' + uid)
                .set(dataBody)
                .then(async () => {
                  console.log('Data set.');
                  await AsyncStorage.setItem(
                    'userData',
                    JSON.stringify(dataBody),
                  );
                  setUserData(dataBody);
                  setBookSheetOpen(true);
                  setShowLoader(false);
                })
                .catch(async error => {
                  ToastAndroid.showWithGravity(
                    'Something went wrong! try again.',
                    ToastAndroid.BOTTOM,
                    ToastAndroid.LONG,
                  );
                  await GoogleSignin.signOut();
                  setShowLoader(false);
                });
            } else {
              console.log('userDatauserData', userData1);
              await AsyncStorage.setItem('userData', JSON.stringify(userData1));
              setUserData(userData1);
              setShowLoader(false);
            }
          })
          .catch(async error => {
            ToastAndroid.showWithGravity(
              'Something went wrong! try again.',
              ToastAndroid.BOTTOM,
              ToastAndroid.LONG,
            );
            await GoogleSignin.signOut();
            setShowLoader(false);
          });
      }
    } catch (error) {
      console.log({error});
      ToastAndroid.showWithGravity(
        'Something went wrong! try again.',
        ToastAndroid.BOTTOM,
        ToastAndroid.LONG,
      );
      setShowLoader(false);
    }
  };

  const checkoutStarted = () => {
    if (userData?.orderHistory) {
      const otherBookId = allBooks?.filter(
        book => book?.id !== bookData?.id,
      )?.[0]?.id;
      const otherBookPaymentStatus =
        userData?.orderHistory?.[otherBookId]?.paymentStatus;

      if (
        otherBookPaymentStatus &&
        otherBookPaymentStatus === PaymentStatusEnum.DONE
      ) {
        paymentCheckout();
        return;
      }
    }
    setBookSheetOpen(true);
  };

  const paymentCheckout = async () => {
    setShowLoader(true);

    const totalBooksPrice = allBooks?.reduce(
      (curr, a) => curr + a?.discountedPrice,
      0,
    );

    const totalPayableAmount = otherBookChecked
      ? totalBooksPrice - totalDiscount
      : bookData?.discountedPrice;

    try {
      const url = 'https://api.razorpay.com/v1/orders/';
      const apiBody = JSON.stringify({
        amount: totalPayableAmount + '00',
        currency: 'INR',
      });
      const base64 = require('base-64');
      const razorpay_order = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Basic ' +
            base64.encode('rzp_test_cKMehKLeQrqSv6:8ME2rW76a3CPAYshxcVrrt0b'),
        },
        body: apiBody,
      });

      const razorpay_order_data = await razorpay_order.json();

      if (razorpay_order_data?.id) {
        var options = {
          description: 'Books Payment',
          image: 'https://i.imgur.com/3g7nmJC.png',
          currency: 'INR',
          key: 'rzp_test_cKMehKLeQrqSv6', // Your api key
          amount: razorpay_order_data?.amount,
          name: 'Pankaj Books',
          prefill: {
            email: userData?.email,
            contact: userData?.phone,
            name: userData?.name,
          },
          theme: {color: '#E59866'},
          order_id: razorpay_order_data?.id,
        };
        RazorpayCheckout.open(options)
          .then(async data => {
            if (data?.razorpay_order_id) {
              const activeBook = {
                id: bookData?.id,
                paymentStatus: PaymentStatusEnum.DONE,
                razorpay_order_id: data?.razorpay_order_id,
                razorpay_payment_id: data?.razorpay_payment_id,
                razorpay_signature: data?.razorpay_signature,
              };

              await database()
                .ref(
                  '/users/' + userData?.uid + '/orderHistory/' + bookData?.id,
                )
                .update(activeBook);

              if (otherBookChecked) {
                const otherBookData = {
                  id: allBooks?.filter(book => book?.id !== bookData?.id)?.[0]
                    ?.id,
                  paymentStatus: PaymentStatusEnum.DONE,
                  razorpay_order_id: data?.razorpay_order_id,
                  razorpay_payment_id: data?.razorpay_payment_id,
                  razorpay_signature: data?.razorpay_signature,
                };

                await database()
                  .ref(
                    '/users/' +
                      userData?.uid +
                      '/orderHistory/' +
                      otherBookData?.id,
                  )
                  .update(otherBookData);
              }
              fetchAndUpdateUserData(userData?.uid);
              fetchTotalDiscount();
              setBookSheetOpen(false);
              setShowLoader(false);
            }
          })
          .catch(async error => {
            console.log('rezorPayError', {error, allBooks, bookData});

            const activeBook = {
              id: bookData?.id,
              paymentStatus: PaymentStatusEnum.FAILED,
              razorpay_order_id: '',
              razorpay_payment_id: '',
              razorpay_signature: '',
            };

            await database()
              .ref('/users/' + userData?.uid + '/orderHistory/' + bookData?.id)
              .update(activeBook);

            if (otherBookChecked) {
              const otherBookData = {
                id: allBooks?.filter(book => book?.id !== bookData?.id)?.[0]
                  ?.id,
                paymentStatus: PaymentStatusEnum.FAILED,
                razorpay_order_id: '',
                razorpay_payment_id: '',
                razorpay_signature: '',
              };

              await database()
                .ref(
                  '/users/' +
                    userData?.uid +
                    '/orderHistory/' +
                    otherBookData?.id,
                )
                .update(otherBookData);
            }
            fetchAndUpdateUserData(userData?.uid);
            fetchTotalDiscount();
            setBookSheetOpen(false);
            setShowLoader(false);
          });
      } else {
        setShowLoader(false);
      }
    } catch (error) {}
  };

  const booksBottomSheet = () => {
    return (
      <BooksBottomSheet
        visible={booksSheetOpen}
        onClose={() => {
          setOtherBookChecked(false);
          setBookSheetOpen(false);
        }}
        allBooks={allBooks}
        activeBook={bookData}
        otherBookChecked={otherBookChecked}
        setOtherBookChecked={setOtherBookChecked}
        payNow={() => {
          paymentCheckout();
        }}
        totalDiscount={totalDiscount}
      />
    );
  };

  const renderLoader = () => {
    return <Spinner visible={showLoader} />;
  };

  const isPaymentDone =
    userData?.orderHistory?.[bookData?.id]?.paymentStatus ===
    PaymentStatusEnum.DONE;

  return (
    <View style={styles.container}>
      <GenericHeader
        title={bookData?.bookName}
        navigation={props?.navigation}
        leftView={() => {
          return (
            <AntDesign
              size={20}
              color={'#000000'}
              name={'arrowleft'}
              onPress={() => {
                props?.navigation?.goBack();
              }}
            />
          );
        }}
      />

      {booksBottomSheet()}
      {renderLoader()}

      <PDFView
        style={styles.pdfBox}
        resource={isPaymentDone ? bookData?.bookPdfUrl : bookData?.sampleBook}
        resourceType={'url'}
        onLoad={() => console.log(`PDF rendered from ${'url'}`)}
        onError={error => console.log('Cannot render PDF', error)}
      />

      {!isPaymentDone && (
        <>
          <Text style={styles.logintext}>
            If you want to read more please purchase this e book
          </Text>

          <View style={styles.buttonBox}>
            <Text style={styles.ruppeeText}>
              {'\u20B9 ' + bookData?.discountedPrice}
            </Text>
            <GenericButton
              width={200}
              title={!userData ? 'Login With Google' : 'Pay Now'}
              onButtonPress={() => {
                if (!userData) {
                  onLoginWithGoogle();
                } else {
                  checkoutStarted();
                }
              }}
            />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  logintext: {
    color: '#000000',
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    textAlign: 'center',
    margin: 5,
  },
  ruppeeText: {
    color: '#000000',
    fontSize: 18,
    fontFamily: 'Nunito-SemiBold',
    marginVertical: 10,
    flex: 1,
  },
  buttonBox: {
    width: '100%',
    marginTop: 5,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  pdfBox: {
    flex: 1,
  },
});

export default PDFScreen;
