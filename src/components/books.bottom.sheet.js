import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import GenericButton from './generic.button';

const BooksBottomSheet = props => {
  const {
    visible,
    onClose,
    modalPosition = 'flex-end',
    allBooks = [],
    activeBook,
    otherBookChecked,
    setOtherBookChecked,
    payNow,
    totalDiscount,
  } = props;

  const sortedBook = [
    activeBook,
    ...allBooks?.filter(book => book?.id !== activeBook?.id),
  ];

  const totalBooksPrice = allBooks?.reduce(
    (curr, a) => curr + a?.discountedPrice,
    0,
  );

  console.log({totalBooksPrice});

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

        <View style={styles.mainBox}>
          <View style={styles.topBox}>
            <Text style={styles.cartPageTitle}>{'Cart Page'}</Text>
            <AntDesign
              name={'close'}
              color={'#000000'}
              size={25}
              onPress={() => onClose()}
            />
          </View>

          <Text style={styles.offerText}>
            {`By both books and get \u20B9${totalDiscount} discount on the total price`}
          </Text>

          {sortedBook?.map((item, index) => {
            return (
              <View style={styles.bookMainBox} key={item?.id}>
                <Image
                  source={{uri: item?.bookBannerImage}}
                  style={styles.bannerImage}
                />
                <View style={styles.bookNamePriceBox}>
                  <Text style={styles.bookNametext}>{item?.bookName}</Text>
                  <Text style={styles.boxPriceText}>
                    {'\u20B9 ' + item?.discountedPrice}
                  </Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    setOtherBookChecked(!otherBookChecked);
                  }}
                  disabled={item?.id === activeBook?.id}
                  style={styles.checkBoxContainer}>
                  {item?.id === activeBook?.id || otherBookChecked ? (
                    <AntDesign
                      name={'checksquare'}
                      color={'#E59866'}
                      size={25}
                    />
                  ) : (
                    <Feather name={'square'} color={'#E59866'} size={25} />
                  )}
                </TouchableOpacity>
              </View>
            );
          })}

          <View style={styles.totalBox}>
            <View style={styles.totalPriceBox}>
              {otherBookChecked && (
                <Text style={styles.totalPriceText}>
                  {'\u20B9 ' + totalBooksPrice}
                </Text>
              )}

              <Text style={styles.discountedPricetext}>
                {'\u20B9 ' +
                  (otherBookChecked
                    ? totalBooksPrice - totalDiscount
                    : activeBook?.discountedPrice)}
              </Text>
            </View>
            <GenericButton
              title={'Pay Now'}
              onButtonPress={() => {
                payNow();
              }}
            />
          </View>
        </View>
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
    minHeight: 200,
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 10,
  },
  topBox: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  cartPageTitle: {
    flex: 1,
    color: '#000000',
    fontFamily: 'Nunito-SemiBold',
    fontSize: 18,
  },
  offerText: {
    color: '#000000',
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    marginBottom: 20,
  },
  bookMainBox: {
    height: 120,
    width: '100%',
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    flexDirection: 'row',
    borderRadius: 5,
    elevation: 2,
  },
  bannerImage: {
    height: '100%',
    width: 120,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  bookNamePriceBox: {
    paddingHorizontal: 5,
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
  },
  bookNametext: {
    color: '#000000',
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
    marginBottom: 5,
  },
  boxPriceText: {
    color: '#000000',
    fontSize: 14,
    fontFamily: 'Nunito-Medium',
  },
  checkBoxContainer: {
    height: 24,
    width: 24,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    alignSelf: 'center',
    marginRight: 5,
  },
  totalBox: {
    width: '100%',
    backgroundColor: '#E5E7E9',
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingRight: 8,
  },
  totalPriceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    flex: 1,
  },
  totalPriceText: {
    color: '#000000',
    fontSize: 14,
    fontFamily: 'Nunito-Medium',
    marginRight: 8,
    textDecorationLine: 'line-through',
  },
  discountedPricetext: {
    color: '#000000',
    fontSize: 18,
    fontFamily: 'Nunito-SemiBold',
    marginRight: 5,
  },
});

export default BooksBottomSheet;
