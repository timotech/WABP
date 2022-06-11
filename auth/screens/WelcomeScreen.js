import React, { Component } from "react";
import {
  Image,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  View,
} from "react-native";

import Onboarding from "react-native-onboarding-swiper";

const Skip = ({ ...props }) => {
  return <Button title="Skip" color="#26a535" />;
};

const Next = ({ ...props }) => {
  return <Button title="Next" color="#26a535" {...props} />;
};

const Done = ({ ...props }) => {
  return (
    <TouchableOpacity style={{ marginHorizontal: 10 }} {...props}>
      <Text style={{ fontSize: 16 }}>Done</Text>
    </TouchableOpacity>
  );
};

const Dots = ({ selected }) => {
  let backgroundColor;

  backgroundColor = selected ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.3)";
  return (
    <View
      style={{
        width: 5,
        height: 5,
        marginHorizontal: 3,
        backgroundColor,
      }}
    />
  );
};

export default class WelcomeScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Onboarding
        SkipButtonComponent={Skip}
        NextButtonComponent={Next}
        DoneButtonComponent={Done}
        DotComponent={Dots}
        onSkip={() => this.props.navigation.replace("Login")}
        onDone={() => this.props.navigation.navigate("Login")}
        pages={[
          {
            backgroundColor: "#a6e4d0",
            image: <Image source={require("../../assets/book-tree.png")} />,
            title: "We love books! Do you?",
            subtitle:
              "When you read a book, you are taking in all that the book is about. People, places, things...",
          },
          {
            backgroundColor: "#fdeb93",
            image: <Image source={require("../../assets/girl-reading.jpg")} />,
            title: "Do you like books?",
            subtitle:
              "When you read a book, you are taking in all that the book is about. People, places, things...",
          },
          {
            backgroundColor: "#e9bcbe",
            image: <Image source={require("../../assets/group-people.jpg")} />,
            title: "Do you enjoy reading?",
            subtitle:
              "When you read a book, you are taking in all that the book is about. People, places, things...",
          },
        ]}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
