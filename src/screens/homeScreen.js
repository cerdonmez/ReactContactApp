import React, {useState} from 'react';
import {Picker} from '@react-native-community/picker';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableHighlight,
  Modal,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';

export function HomeScreen({navigation}) {
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState(0);
  const [unit, setUnit] = useState('Adet');
  const [bought, setBought] = useState(0);
  const [itemid, setItemid] = useState(0);

  const shopping = async () => {
    const shoppingRepository = getRepository(Shopping);
    let result = await shoppingRepository.find();
    if (result.length === 0) {
      const newShopping = new Shopping();
      newShopping.title = 'Tomato';
      newShopping.amount = 2;
      newShopping.unit = 'kg';
      newShopping.bought = 0;
      await shoppingRepository.save(newShopping);
      result = await shoppingRepository.find();
    }
    const sorted = result.sort((a, b) => a.bought - b.bought);
    setData(sorted);
  };

  // useEffect(() => {
  //   shopping();
  // }, []);

  // yeni bir alışverişi kaydeder
  const addShopping = async () => {
    const shoppingRepository = getRepository(Shopping);
    const newShopping = new Shopping();
    newShopping.title = title;
    newShopping.amount = amount;
    newShopping.unit = unit;
    newShopping.bought = 0;
    await shoppingRepository.save(newShopping);
    let result = await shoppingRepository.find();
    result = await shoppingRepository.find();
    const sorted = result.sort((a, b) => a.bought - b.bought);
    setData(sorted);
  };
  // }, [title, amount, unit]);

  const updateShopping = async (id) => {
    const shoppingRepository = getRepository(Shopping);
    let resultUpdate = await shoppingRepository.findOne(id);
    resultUpdate.bought = resultUpdate.bought ? 0 : 1;
    await shoppingRepository.save(resultUpdate);
    const newData = data.map((val) => {
      if (val.id === id) {
        return resultUpdate;
      } else {
        return val;
      }
    });
    setData(newData);
  };

  const deleteShopItem = async (id) => {
    const shoppingRepository = getRepository(Shopping);
    let resultUpdate = await shoppingRepository.findOne(id);
    console.log(resultUpdate);
    await shoppingRepository.delete({id: resultUpdate.id});
    const newData = data.filter((val) => {
      if (val.id !== id) {
        return val;
      }
    });
    setData(newData);
  };

  return (
    <View style={{flex: 1}}>
      <View style={styles.icons}>
        <TouchableOpacity onPress={() => shopping()}>
          <Ionicons name="cart-outline" {...iconProps} />
        </TouchableOpacity>
        <Ionicons name="home-outline" {...iconProps} />
        <Ionicons name="cash-outline" {...iconProps} />
        <Ionicons name="key-outline" {...iconProps} />
        <Ionicons name="card-outline" {...iconProps} />
        <Ionicons name="document-text-outline" {...iconProps} />
      </View>
      <View
        style={{
          borderBottomColor: '#900',
          borderBottomWidth: 3,
          marginTop: 3,
        }}
      />
      <View style={{flexDirection: 'row', marginLeft: 20, marginTop: 5}}>
        <Ionicons
          name="checkmark"
          style={{
            flex: 1,
            fontSize: 20,
            textAlign: 'center',
            fontWeight: '800',
            color: '#2196F3',
          }}
        />
        <Text
          style={{
            flex: 5,
            fontSize: 15,
            textAlign: 'center',
            fontWeight: '200',
            color: '#2196F3',
          }}>
          Alınacaklar
        </Text>
        <Text
          style={{
            flex: 2,
            fontSize: 15,
            textAlign: 'center',
            color: '#2196F3',
          }}>
          Miktar
        </Text>
        <Text
          style={{
            flex: 2,
            fontSize: 15,
            textAlign: 'center',
            color: '#2196F3',
          }}>
          Birim
        </Text>
      </View>
      <FlatList
        style={styles.lists}
        data={data}
        renderItem={({item}) => (
          <TouchableWithoutFeedback
            onPress={() => {
              updateShopping(item.id);
            }}
            onLongPress={() => {
              deleteShopItem(item.id);
            }}>
            <View
              style={{
                flexDirection: 'row',
                marginHorizontal: 3,
                marginTop: 3,
                backgroundColor: item.bought ? 'red' : '#2690ba',
                padding: 15,
                borderRadius: 15,
              }}>
              <Text
                style={[
                  styles.flatList,
                  {flex: 1, marginTop: 5, marginRight: 5},
                ]}>
                <Ionicons
                  name={item.bought ? 'checkmark-outline' : 'ellipse-outline'}
                  size={20}
                />
              </Text>
              <Text style={[styles.flatList, {flex: 6, textAlign: 'left'}]}>
                {item.title}
              </Text>
              <Text style={[styles.flatList, {flex: 2}]}>{item.id}</Text>
              <Text style={[styles.flatList, {flex: 2}]}>{item.amount}</Text>
              <Text style={[styles.flatList, {flex: 2}]}>{item.unit}</Text>
            </View>
          </TouchableWithoutFeedback>
        )}
        keyExtractor={(item, index) => String(index)}
      />

      {/* Modal part to enter new shopping item */}
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                Alışveriş Listesine Ürün Ekle
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={styles.inputTxt}>Ürün: </Text>
                <TextInput
                  style={styles.inputTxt}
                  placeholder="ürün adı"
                  value={title}
                  onChangeText={(val) => setTitle(val)}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={styles.inputTxt}>Miktarı(*) : </Text>
                <TextInput
                  style={styles.inputTxt}
                  placeholder="miktarını giriniz"
                  value={amount}
                  onChangeText={(val) => setAmount(val)}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={styles.inputTxt}>Birim(*) :</Text>
                <Picker
                  selectedValue={unit}
                  style={{height: 50, width: 100, fontSize: 20}}
                  value={unit}
                  onValueChange={(itemValue, itemIndex) => setUnit(itemValue)}>
                  <Picker.Item label="Adet" value="Adet" />
                  <Picker.Item label="Kg" value="Kg" />
                </Picker>
              </View>
              <Text>(*) Mecburi olmayan alanlar</Text>
              <View style={{flexDirection: 'row'}}>
                <TouchableHighlight
                  style={{
                    ...styles.openButton,
                    backgroundColor: '#2196F3',
                    right: 20,
                  }}
                  onPress={() => {
                    addShopping();
                    setModalVisible(!modalVisible);
                    setTitle('');
                    setAmount(0);
                  }}>
                  <Text style={styles.textStyle}>Kaydet</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={{...styles.openButton, backgroundColor: '#e50914'}}
                  onPress={() => {
                    setModalVisible(false);
                    setTitle('');
                    setAmount(0);
                  }}>
                  <Text style={styles.textStyle}>Çıkış</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </Modal>
        <TouchableOpacity
          style={{
            alignItems: 'center',
            // position: 'absolute',
            bottom: 0,
            zIndex: 0,
          }}
          onPress={() => {
            setModalVisible(true);
          }}>
          <Ionicons name="add-circle" size={50} color="#e50914" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  icons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 5,
  },
  lists: {flex: 1},
  flatList: {fontSize: 20, color: 'white', textAlign: 'center'},
  centeredView: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 100,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: windowWidth * 0.8,

    elevation: 5,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    top: 20,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
  },
  inputTxt: {
    fontSize: 20,
  },
});
