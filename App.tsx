import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  Alert,
  FlatList,
} from 'react-native';
import axios from 'axios';

const API_URL = 'http://192.168.1.10:3000';

interface Item {
  id: number;
  image: string;
  name: string;
  price: number;
  stock: number;
}

const App = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get(`${API_URL}/items`);
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handlePurchase = async () => {
    if (!selectedItem) return;

    if (selectedItem.stock === 0) {
      Alert.alert('Stock Habis');
      return;
    }

    if (balance < selectedItem.price) {
      Alert.alert('Uang Tidak Cukup');
      return;
    }

    try {
      const newBalance = balance - selectedItem.price;
      setBalance(newBalance);

      const updatedItem = {...selectedItem, stock: selectedItem.stock - 1};
      await axios.put(`${API_URL}/items/${selectedItem.id}`, updatedItem);

      Alert.alert(
        'Pembelian Berhasil',
        '',
        [
          {
            text: 'OK',
            onPress: () => {
              if (newBalance > 0) {
                Alert.alert(`Uang Anda Kembali ${newBalance}`);
                setBalance(0);
              }
            },
          },
        ],
        {cancelable: false},
      );
      fetchItems();
    } catch (error) {
      console.error('Pembelian Gagal:', error);
      Alert.alert('Pembelian Gagal');
    }
  };

  const handleSelectItem = (item: Item) => {
    setSelectedItem(item);
  };

  const handleAddBalance = (amount: number) => {
    setBalance(balance + amount);
    Alert.alert(`Berhasil Menerima Uang Sebesar ${amount}`);
  };

  const renderItem = ({item}: {item: Item}) => (
    <View style={styles.itemContainer}>
      <Image
        source={{uri: item.image}}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.text}>{item.name}</Text>
      <Text style={styles.text}>Price: {item.price}</Text>
      <Text style={styles.text}>Stock: {item.stock}</Text>
      <Button
        title="Select"
        onPress={() => handleSelectItem(item)}
        color={'green'}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Balance: {balance}</Text>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        horizontal
      />
      <Text style={styles.text}>Pilih Uang Pecahan : </Text>
      <View style={styles.buttonsContainer}>
        <View style={styles.buttons}>
          <Button
            color={'red'}
            title="2000"
            onPress={() => handleAddBalance(2000)}
          />
        </View>
        <View style={styles.buttons}>
          <Button
            color={'red'}
            title="5000"
            onPress={() => handleAddBalance(5000)}
          />
        </View>
        <View style={styles.buttons}>
          <Button
            color={'red'}
            title="10000"
            onPress={() => handleAddBalance(10000)}
          />
        </View>
        <View style={styles.buttons}>
          <Button
            color={'red'}
            title="20000"
            onPress={() => handleAddBalance(20000)}
          />
        </View>
        <View style={styles.buttons}>
          <Button
            color={'red'}
            title="50000"
            onPress={() => handleAddBalance(50000)}
          />
        </View>
      </View>

      <Button
        title="Purchase"
        onPress={handlePurchase}
        disabled={!selectedItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  itemContainer: {
    marginBottom: 20,
    marginRight: 10,
    marginLeft: 10,
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  text: {
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
    color: 'black',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  buttons: {
    margin: 5,
    width: 60,
  },
});

export default App;
