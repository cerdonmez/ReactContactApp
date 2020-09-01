/* eslint-disable react-native/no-inline-styles */
// In App.js in a new project

import React, {useState, useEffect, useCallback} from 'react';
import {Picker} from '@react-native-community/picker';
import {
  Button,
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableHighlight,
  Modal,
  TextInput,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createConnection, getRepository, getConnection} from 'typeorm/browser';

import Ionicons from 'react-native-vector-icons/Ionicons';

import {Note} from './entity/notes';
import {Shopping} from './entity/shopping';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function Database({children}) {
  const [defaultConnection, setconnection] = useState(null);

  const setupConnection = async () => {
    try {
      const connected = getConnection();
      console.log('********start******************');
      console.log(connected.driver.database);
      console.log('********end******************');
    } catch (error) {
      console.log(error);
      try {
        const connection = await createConnection({
          type: 'react-native',
          database: 'note',
          location: 'default',
          logging: ['error', 'query', 'schema'],
          synchronize: true,
          entities: [Note, Shopping],
        })
          .then((res) => {
            console.log('connection established');
          })
          .catch((e) => {
            console.log('!!!!! connection failed !!!!!! ', e);
          });
        setconnection(connection);
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    if (!defaultConnection) {
      <Text>Loading...</Text>;
      setupConnection();
    } else {
      console.log(defaultConnection, '**************************');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
}

const iconProps = {size: 30, color: '#2196F3'};

function HomeScreen({navigation}) {
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

function DetailsScreen({route, navigation}) {
  /* 2. Get the param */
  const {itemId} = route.params;
  const {otherParam} = route.params;
  const saveData = useCallback(async () => {
    const data = {title: 'Cengiz Erdönmez', note: 'something'};
    const noteRepository = getRepository(Note);
    let result = await noteRepository.find();
    // console.log(result.length);
    if (result.length === 0) {
      const newNote = new Note();
      newNote.title = 'cengiz';
      newNote.note = 'deneme';
      await noteRepository.save(newNote);
      result = await noteRepository.find();
    }
    // await noteRepository.delete({id: '5'});
    // result = await noteRepository.find();
    // console.log(result.length);
    // console.log(result);

    // console.log(data);
  }, []);

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Details Screen</Text>
      <Text>itemId: {JSON.stringify(itemId)}</Text>
      <Text>otherParam: {JSON.stringify(otherParam)}</Text>
      <Button
        title="Go to Details... again"
        onPress={() =>
          navigation.push('Details', {
            itemId: Math.floor(Math.random() * 100),
          })
        }
      />
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
      <Button title="Go back" onPress={() => navigation.goBack()} />
      <Button title="Save data" onPress={() => saveData()} />
    </View>
  );
}

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function NotesScreen() {
  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {backgroundColor: '#ff4466'},
        headerTintColor: '#fff',
        headerTitleStyle: {fontWeight: 'bold'},
      }}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Welcome to home page',
          // headerTitle: 'How are you',
          headerRight: () => (
            <Button
              onPress={() => alert('This is a button!')}
              title="+"
              color=" #58d68d  "
            />
          ),
        }}
      />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
    // <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    //   <Text>NotesScreen!</Text>
    // </View>
  );
}

function TodosScreen() {
  const [value, toggle] = useState(false);
  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>TodosScreen!</Text>
      <TouchableOpacity onPress={() => toggle(!value)}>
        <Text>{value ? 'on' : 'off'}</Text>
      </TouchableOpacity>
    </View>
  );
}

function App() {
  return (
    <Database>
      <NavigationContainer>
        {/* <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {backgroundColor: '#ff4466'},
            headerTintColor: '#fff',
            headerTitleStyle: {fontWeight: 'bold'},
          }}>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: 'Welcome to home page',
            }}
          />
          <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator> */}
        <Tab.Navigator
          screenOptions={({route}) => ({
            tabBarIcon: ({focused, color, size}) => {
              let iconName;

              if (route.name === 'Notes') {
                iconName = focused ? 'document-text' : 'document-text-outline';
              } else if (route.name === 'Todos') {
                iconName = focused
                  ? 'checkmark-circle'
                  : 'checkmark-circle-outline';
              }

              // You can return any component that you like here!
              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
          tabBarOptions={{
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
          }}>
          <Tab.Screen
            name="Notes"
            component={NotesScreen}
            options={{tabBarBadge: 1}}
          />
          <Tab.Screen name="Todos" component={TodosScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </Database>
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

export default App;
