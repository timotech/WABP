import { Colors, Layout } from "../shared";
import React from "react";
import { StyleSheet, View, Image, Text } from "react-native";

const SCREEN_WIDTH = Layout.window.width;
const LARGE_BOOK_WIDTH = (SCREEN_WIDTH - 20) / 3 + 10;
const BOOK_WIDTH = (SCREEN_WIDTH - 50) * 0.4;

export default class History extends React.PureComponent {
  render() {
    const { pick } = this.props;

    return (
      <View style={styles.content}>
        <View style={styles.buyDetails}>
          <Image
            style={{ width: BOOK_WIDTH }}
            resizeMode="contain"
            source={{ uri: pick.picPath }}
          />
          <View style={styles.detailsInfo}>
            <View style={styles.titleRatings}>
              <Text
                numberOfLines={4}
                ellipsizeMode="tail"
                style={[styles.title]}
              >
                {pick.title}
              </Text>
            </View>
            <Text style={styles.short_description}>
              Order Date: {pick.orderDate}
            </Text>
            <Text>Price: {pick.unitPrice}</Text>
            <Text>Order Id: {pick.orderId}</Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  largeBookItem: {
    width: LARGE_BOOK_WIDTH,
    height: 250,
    marginRight: 15,
  },
  content: {
    flex: 1,
    padding: 5,
  },
  buyDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailsInfo: {
    flexDirection: "column",
    justifyContent: "flex-start",
    marginLeft: 15,
    width: SCREEN_WIDTH - 50 - BOOK_WIDTH,
  },
  titleRatings: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  title: {
    fontSize: 20,
    color: Colors.congoBrown,
    fontWeight: "500",
    width: 140,
  },
  short_description: {
    fontSize: 12,
    color: Colors.congoBrown,
    marginVertical: 12,
    lineHeight: 20,
    fontWeight: "200",
  },
  genre: {
    fontSize: 10,
    color: Colors.congoBrown,
  },
});
