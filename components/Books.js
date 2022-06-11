import { Colors } from "../shared";
import React from "react";
import { FlatList, StyleSheet, Text, View, Alert } from "react-native";
import { withNavigation } from "react-navigation";

import Best from "./Best";

// const AUTOBIOGRAPHY = [
//     {
//         _id: '9038746890',
//         image: '',
//     },
//     {
//         _id: '7846537e8',
//         image: '',
//     },
//     {
//         _id: '298768954',
//         image: '',
//     },
//     {
//         _id: '46789087',
//         image: '',
//     },
//     {
//         _id: '17657890',
//         image: '',
//     },
//     {
//         _id: '3987657886',
//         image: '',
//     },
// ];

class Books extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataBook: [],
      selectCatg: 0,
      isLoading: false,
      error: null,
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    this.setState({ isLoading: true });

    const url = "https://www.wabpreader.com.ng/api/books/bestbooks";
    return fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Network error, or Something went wrong ...");
        }
      })
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          dataBook: responseJson,
        });
      })
      .catch((error) => {
        Alert.alert("Something Went Wrong", error.message, [
          {
            text: "Try Again",
            onPress: this.getData,
          },
        ]);
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  };

  _keyExtractor = (item, index) => `${index}`;

  _renderItem = ({ item }) => (
    <Best
      key={item.id}
      pick={item}
      handleOnPress={() => this.props.navigation.navigate("Detail", item)}
    />
  );

  render() {
    return (
      <View>
        <Text style={styles.title}>Best of Prose</Text>
        <FlatList
          data={this.state.dataBook}
          extraData={this.state}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          scrollEventThrottle={16}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 14,
    color: Colors.congoBrown,
    marginTop: 5,
    marginBottom: 20,
  },
});

export default withNavigation(Books);
