import { Colors } from "../shared";
import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";

const CartTotal = ({ totalCost }) => (
  <View style={styles.total}>
    <View style={styles.totalBreakdown}>
      {/*<View style={styles.totalItem}>
        <Text style={styles.totalItemHeading}>Subtotal</Text>
        <Text style={styles.totalItemCost}>N{totalCost}</Text>
      </View>
       <View style={styles.totalItem}>
        <Text style={styles.totalItemHeading}>Shipping Amount</Text>
        <Text style={styles.totalItemCost}>N0</Text>
      </View> */}
    </View>
    <View style={styles.totalGrand}>
      <View style={styles.totalItem}>
        <Text style={[styles.totalItemHeading, { fontWeight: "700" }]}>
          Grand Total
        </Text>
        <Text
          style={[
            styles.totalItemCost,
            { color: Colors.blueViolet, fontSize: 16 },
          ]}
        >
          N{totalCost}
        </Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  total: {},
  totalBreakdown: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  totalGrand: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.congoBrown,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  totalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },
  totalItemHeading: {
    fontSize: 14,
    color: Colors.congoBrown,
    fontWeight: "200",
  },
  totalItemCost: {
    fontSize: 14,
    color: Colors.congoBrown,
  },
});

export default CartTotal;
