import { Feather, Ionicons } from "@expo/vector-icons";
import { Colors, Layout, Touchable } from "../shared";
import { Button, Input, Item } from "native-base";
import React, { Component } from "react";
import {
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  AsyncStorage,
} from "react-native";

import { AdditionalInfo, AddReview } from "../components";

const SCREEN_WIDTH = Layout.window.width;
const BOOK_WIDTH = (SCREEN_WIDTH - 50) * 0.4;

export default class DetailScreen extends Component {
  state = {
    qty: 1,

    // Review
    submittedRating: 0,
    submittedComment: "",
    refreshing: false,
    reviewModalVisible: false,
    reviewData: [],
  };

  componentDidMount() {
    this._getReviews();
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam("title"),
      headerLeft: () => (
        <Touchable
          background={Touchable.Ripple(Colors.blueViolet, true)}
          style={[styles.headerItem, styles.headerIcon]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="ios-arrow-back" size={25} color={Colors.congoBrown} />
        </Touchable>
      ),
      headerRight: () => (
        <Touchable
          background={Touchable.Ripple(Colors.blueViolet, true)}
          style={[
            styles.headerItem,
            styles.headerIcon,
            { paddingVertical: 15 },
          ]}
          onPress={() => navigation.navigate("Cart")}
        >
          <View
            style={{
              position: "relative",
            }}
          >
            <Feather name="shopping-cart" size={20} color={Colors.congoBrown} />
            <View style={styles.cartHasItems}></View>
          </View>
        </Touchable>
      ),
    };
  };

  _getReviews = () => {
    var id = this.props.navigation.getParam("id");

    const url = `https://www.wabpreader.com.ng/api/books/getreviews?BookId=${id}`;
    //console.log(url);
    fetch(url, {
      method: "GET",
      headers: {
        Accept: "*/*",
      },
    })
      .then((res) => res.json())
      .then(
        (responseJson) => {
          this.setState({
            reviewData: responseJson,
          });
        },
        (error) => {
          this.setState({ isLoading: false });
          this.setState({ isDisabled: false });
          alert(error.message);
        }
      )
      .finally(() => {
        this.setState({ isLoading: false });
      });
  };

  _setReviewData = (value) => {
    this.setState(value);
    this._getReviews();
  };

  _setReviewModalVisible = (visible) => {
    this.setState({ reviewModalVisible: visible });
  };

  _onRefresh = () => {
    this.setState({ refreshing: true });
    setTimeout(() => {
      this.setState({ refreshing: false });
    }, 1500);
  };

  _incrementQty = () => {
    const qty = `${+this.state.qty + 1}`;
    this.setState({ qty });
  };

  _decreaseQty = () => {
    const prevQty = +this.state.qty;
    if (prevQty > 1) {
      const qty = `${prevQty - 1}`;
      this.setState({ qty });
    }
  };

  _handleQtyChanged = (value) => {
    let qty = +value;
    if (qty >= 0) {
      qty = `${qty}`;
      this.setState({ qty });
    }
  };

  _addToCart = async (data) => {
    const logged = await AsyncStorage.getItem("authtoken");
    if (!logged) {
      return this.props.navigation.navigate("Auth");
    }

    const itemcart = {
      book: data,
      quantity: this.state.qty,
      price: data.price,
    };

    //Get all items in collection and check if item already exists
    var allCollections = await AsyncStorage.getItem("collections");

    if (allCollections !== null) {
      var allColls = JSON.parse(allCollections);
      var itemExists = allColls.filter(
        (item) => item.title == itemcart.book.title
      );

      if (itemExists.length !== 0) {
        alert("Item already Purchased!!!");
        return;
      }
    }

    const qty = +this.state.qty;
    if (qty < 1) {
      alert(`You cannot add ${qty} quantity of this item`);
      return false;
    }

    AsyncStorage.getItem("cart")
      .then((datacart) => {
        if (datacart !== null) {
          // We have data!!
          const cart = JSON.parse(datacart);
          cart.push(itemcart);
          AsyncStorage.setItem("cart", JSON.stringify(cart));
        } else {
          const cart = [];
          cart.push(itemcart);
          AsyncStorage.setItem("cart", JSON.stringify(cart));
        }
        alert("Book Added To Cart");
      })
      .catch((err) => {
        alert(err);
      });
  };

  render() {
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        {/** Content */}
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
          <View style={styles.content}>
            <View style={styles.buyDetails}>
              <Image
                style={{ width: BOOK_WIDTH }}
                resizeMode="contain"
                source={{ uri: navigation.getParam("picPath") }}
              />
              <View style={styles.detailsInfo}>
                <View style={styles.titleRatings}>
                  <Text
                    numberOfLines={4}
                    ellipsizeMode="tail"
                    style={[styles.title]}
                  >
                    {navigation.getParam("title")}
                  </Text>
                  <View style={styles.rating}>
                    <Text style={styles.ratingText}>{4.9}</Text>
                  </View>
                </View>
                <Text
                  numberOfLines={3}
                  ellipsizeMode="tail"
                  style={styles.short_description}
                >
                  {navigation.getParam("description")}
                </Text>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.qtyLeft}
                >
                  In stock
                </Text>

                <View style={styles.prices}>
                  <Text
                    style={[
                      styles.price,
                      navigation.getParam("specialPrice")
                        ? styles.oldPrice
                        : {},
                    ]}
                  >
                    N{navigation.getParam("price")}
                  </Text>
                  {navigation.getParam("specialPrice") != 0 && (
                    <Text style={[styles.price, styles.newPrice]}>
                      N{navigation.getParam("specialPrice")}
                    </Text>
                  )}
                </View>
                {/* <Text numberOfLines={1} ellipsizeMode='tail' style={styles.freeShipping}>FREE Shipping on eligible orders</Text> */}
              </View>
            </View>

            <AdditionalInfo
              description={navigation.getParam("fullInfo")}
              reviews={this.state.reviewData}
              setModalVisible={this._setReviewModalVisible}
            />
          </View>
        </ScrollView>

        {/** -- Floating action button */}
        {/*  -- <TouchableOpacity
                    style={styles.add}
                    onPress={() => this._setReviewModalVisible(true)}
                >
                    <Feather name='plus' size={30} color={Colors.titanWhite} />
                </TouchableOpacity> */}

        <View style={styles.buyActions}>
          <View style={styles.buyQty}>
            <Button
              transparent
              style={styles.buyQtyPlusMinusBtn}
              onPress={() => this._decreaseQty()}
            >
              <Feather name="minus" size={20} color={Colors.titanWhite} />
            </Button>
            <Item regular style={styles.buyQtyInputContainer}>
              <Input
                value={this.state.qty}
                keyboardType="numeric"
                onChangeText={(value) => this._handleQtyChanged(value)}
                style={styles.buyQtyInput}
              />
            </Item>
            <Button
              transparent
              style={styles.buyQtyPlusMinusBtn}
              onPress={() => this._incrementQty()}
            >
              <Feather name="plus" size={20} color={Colors.titanWhite} />
            </Button>
          </View>
          <Button
            transparent
            style={styles.buyBtn}
            onPress={() => this._addToCart(navigation.state.params)}
          >
            <Text style={styles.buyActionsText}>Buy Now</Text>
          </Button>
        </View>

        {/** Review Form */}
        <AddReview
          name={navigation.getParam("title")}
          modalVisible={this.state.reviewModalVisible}
          setModalVisible={this._setReviewModalVisible}
          rating={this.state.submittedRating}
          comment={this.state.submittedComment}
          setData={this._setReviewData}
          bookId={navigation.getParam("id")}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.snow,
  },
  headerItem: {
    justifyContent: "center",
    alignItems: "center",
  },
  headerIcon: {
    paddingVertical: 9,
    paddingHorizontal: 20,
  },
  cartHasItems: {
    position: "absolute",
    top: 0,
    left: 18,
    width: 7,
    height: 7,
    backgroundColor: Colors.blueViolet,
    borderRadius: 50,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  buyDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailsInfo: {
    flexDirection: "column",
    justifyContent: "flex-start",
    width: SCREEN_WIDTH - 50 - BOOK_WIDTH,
  },
  titleRatings: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  title: {
    fontSize: 15,
    color: Colors.congoBrown,
    fontWeight: "bold",
    width: "80%",
  },
  rating: {
    width: 30,
    height: 30,
    borderWidth: 2,
    borderRadius: 100 / 2,
    borderColor: "green",
    justifyContent: "center",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 12,
  },
  short_description: {
    fontSize: 12,
    color: Colors.congoBrown,
    marginVertical: 12,
    lineHeight: 20,
    fontWeight: "200",
  },
  qtyLeft: {
    fontSize: 12,
    color: "green",
  },
  prices: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 10,
  },
  price: {
    fontSize: 16,
    color: Colors.congoBrown,
    fontWeight: "bold",
  },
  oldPrice: {
    fontSize: 14,
    textDecorationLine: "line-through",
    textDecorationColor: Colors.congoBrown,
    fontWeight: "normal",
  },
  newPrice: {
    marginLeft: 15,
  },
  freeShipping: {
    fontSize: 12,
    color: Colors.congoBrown,
    marginVertical: 12,
    fontWeight: "200",
  },
  buyActions: {
    ...Platform.select({
      ios: {
        height: 70,
      },
      android: {
        height: 60,
      },
    }),
    backgroundColor: Colors.blueViolet,
    paddingHorizontal: 20,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buyActionsText: {
    color: Colors.titanWhite,
    fontSize: 14,
  },
  buyQty: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: 115,
  },
  buyQtyPlusMinusBtn: {
    width: 30,
  },
  buyQtyInputContainer: {
    borderWidth: 0,
    borderColor: "transparent",
    width: 50,
    height: 35,
    padding: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  buyQtyInput: {
    color: Colors.titanWhite,
    fontSize: 18,
  },
  buyBtn: {
    paddingHorizontal: 15,
    alignSelf: "center",
  },
});
