import { Colors } from "../shared";
import { ScrollableTab, Tab, Tabs } from "native-base";
import React from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
  AsyncStorage,
} from "react-native";
import { withNavigation } from "react-navigation";

import Pick from "./Pick";

// const PICKS = [
//     {
//         _id: '9038746890',
//         image: '',
//         author: 'Steve Jobs',
//         genre: 'Autobiography',
//         price: 'N900'
//     },
//     {
//         _id: '7846537e8',
//         image: '',
//         author: 'Ellen Degeneres',
//         genre: 'Biography',
//         price: 'N800',
//         specialPrice: 'N625'
//     },
//     {
//         _id: '298768954',
//         image: '',
//         author: 'Bharathiar',
//         genre: 'Biography',
//         price: 'N650',
//         specialPrice: 'N450'
//     },
//     {
//         _id: '46789087',
//         image: '',
//         author: 'Bharathiar',
//         genre: 'Biography',
//         price: 'N600',
//         specialPrice: 'N450'
//     },
//     {
//         _id: '17657890',
//         image: '',
//         author: 'Bharathiar',
//         genre: 'Biography',
//         price: 'N605',
//         specialPrice: 'N450'
//     },
//     {
//         _id: '3987657886',
//         image: '',
//         author: 'Bharathiar',
//         genre: 'Biography',
//         price: 'N605',
//         specialPrice: 'N453'
//     },
// ]

// {
//     "id": 1,
//     "title": "GETTING READY FOR MATHEMATICS KINDERGARTEN",
//     "price": 450.00,
//     "specialPrice": 0.00,
//     "picPath": "https://www.wabpreader.com.ng/images/f7370079-d245-4764-b390-88f152051a52_GETTING-READY-FOR-MATHS-FOR-KINDERGARTEN.jpg",
//     "genre": "Textbook",
//     "author": "M.A. Agadzi"
// }

class Showcase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataBook: [],
      dataBest: [],
      dataMost: [],
      dataKids: [],
      selectCatg: 0,
      isLoading: false,
      error: null,
    };
  }

  async componentDidMount() {
    await this.getData();
    await this.getBest();
    await this.getKidsSpecial();
    await this.getMostViewed();
  }

  getData = async () => {
    this.setState({ isLoading: true });

    const allConnections = await AsyncStorage.getItem("showcase");
    //console.log(allConnections);
    if (allConnections !== null) {
      this.setState({
        isLoading: false,
        dataBook: JSON.parse(allConnections),
      });
    } else {
      const url = "https://www.wabpreader.com.ng/api/books";
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
          AsyncStorage.setItem("showcase", JSON.stringify(responseJson));
        })
        .catch((error) => {
          // Alert.alert("Something Went Wrong", error.message, [
          //   {
          //     text: "Try Again",
          //     onPress: this.getData,
          //   },
          // ]);
          console.log(error.message);
        })
        .finally(() => {
          this.setState({ isLoading: false });
        });
    }
  };

  //Best Selling
  getBest = async () => {
    //this.setState({ isLoading: true });

    const allConnections = await AsyncStorage.getItem("bestselling");
    //console.log(allConnections);
    if (allConnections !== null) {
      this.setState({
        dataBest: JSON.parse(allConnections),
      });
    } else {
      const url = "https://www.wabpreader.com.ng/api/books/bestselling";
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
            dataBest: responseJson,
          });
          AsyncStorage.setItem("bestselling", JSON.stringify(responseJson));
        })
        .catch((error) => {
          // Alert.alert("Something Went Wrong", error.message, [
          //   {
          //     text: "Try Again",
          //     onPress: this.getData,
          //   },
          // ]);
          console.log(error.message);
        });
    }
  };

  //Most Viewed
  getMostViewed = async () => {
    //this.setState({ isLoading: true });

    const allConnections = await AsyncStorage.getItem("mostviewed");
    //console.log(allConnections);
    if (allConnections !== null) {
      this.setState({
        dataMost: JSON.parse(allConnections),
      });
    } else {
      const url = "https://www.wabpreader.com.ng/api/books/mostviewed";
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
            dataMost: responseJson,
          });
          AsyncStorage.setItem("mostviewed", JSON.stringify(responseJson));
        })
        .catch((error) => {
          // Alert.alert("Something Went Wrong", error.message, [
          //   {
          //     text: "Try Again",
          //     onPress: this.getData,
          //   },
          // ]);
          console.log(error.message);
        });
    }
  };

  //Kids Special
  getKidsSpecial = async () => {
    //this.setState({ isLoading: true });

    const allConnections = await AsyncStorage.getItem("kidsSpecial");
    //console.log(allConnections);
    if (allConnections !== null) {
      this.setState({
        dataKids: JSON.parse(allConnections),
      });
    } else {
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
            dataKids: responseJson,
          });
          AsyncStorage.setItem("kidsSpecial", JSON.stringify(responseJson));
        })
        .catch((error) => {
          // Alert.alert("Something Went Wrong", error.message, [
          //   {
          //     text: "Try Again",
          //     onPress: this.getData,
          //   },
          // ]);
          console.log(error.message);
        });
    }
  };

  _keyExtractor = (item, index) => `${index}`;

  _renderItem = ({ item }) => (
    <Pick
      key={item.id}
      pick={item}
      handleOnPress={() => this.props.navigation.navigate("Detail", item)}
    />
  );

  render() {
    return (
      <View>
        {/** Tabs */}
        <Tabs
          locked={true}
          tabBarBackgroundColor={Colors.snow}
          renderTabBar={() => (
            <ScrollableTab
              // tabsBorderBottomWidth={0}
              style={{ borderWidth: 0 }}
            />
          )}
          tabBarUnderlineStyle={{
            borderBottomWidth: 4,
            borderBottomColor: Colors.blueViolet,
          }}
        >
          {/** Tabs */}
          <Tab
            heading="Top Picks"
            tabStyle={styles.tabStyle}
            textStyle={styles.tabTextStyle}
            activeTabStyle={styles.tabStyle}
            activeTextStyle={styles.tabTextStyle}
          >
            <View style={styles.tabContent}>
              {/** Tab Content */}
              {/* data={PICKS} */}
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
          </Tab>
          <Tab
            heading="Best Selling"
            tabStyle={styles.tabStyle}
            textStyle={styles.tabTextStyle}
            activeTabStyle={styles.tabStyle}
            activeTextStyle={styles.tabTextStyle}
          >
            <View style={styles.tabContent}>
              <FlatList
                data={this.state.dataBest}
                extraData={this.state}
                keyExtractor={this._keyExtractor}
                renderItem={this._renderItem}
                scrollEventThrottle={16}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            </View>
          </Tab>
          <Tab
            heading="Most Viewed"
            tabStyle={styles.tabStyle}
            textStyle={styles.tabTextStyle}
            activeTabStyle={styles.tabStyle}
            activeTextStyle={styles.tabTextStyle}
          >
            <View style={styles.tabContent}>
              <FlatList
                data={this.state.dataMost}
                extraData={this.state}
                keyExtractor={this._keyExtractor}
                renderItem={this._renderItem}
                scrollEventThrottle={16}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            </View>
          </Tab>
          <Tab
            heading="Kids Special"
            tabStyle={styles.tabStyle}
            textStyle={styles.tabTextStyle}
            activeTabStyle={styles.tabStyle}
            activeTextStyle={styles.tabTextStyle}
          >
            <View style={styles.tabContent}>
              <FlatList
                data={this.state.dataKids}
                extraData={this.state}
                keyExtractor={this._keyExtractor}
                renderItem={this._renderItem}
                scrollEventThrottle={16}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            </View>
          </Tab>
        </Tabs>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  tabStyle: {
    backgroundColor: "transparent",
    justifyContent: "flex-start",
    paddingLeft: 0,
    marginRight: 20,
  },
  tabTextStyle: {
    color: Colors.congoBrown,
    fontSize: 12,
    fontWeight: "normal",
    marginLeft: -1,
  },
  tabContent: {
    paddingVertical: 20,
    backgroundColor: Colors.snow,
  },
});

export default withNavigation(Showcase);
