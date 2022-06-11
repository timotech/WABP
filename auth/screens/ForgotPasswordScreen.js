//import LOGIN from '@graphql/query/login.query'
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors, Touchable } from "../../shared";
import { Button, Input, Item } from "native-base";
import React, { Component } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Keyboard,
  Image,
  ImageBackground,
} from "react-native";

class ForgotPasswordScreen extends Component {
  state = {
    username: "",
    isLoading: false,
    isDisabled: false,
  };

  _signin = async () => {
    this.setState({ isLoading: true });
    this.setState({ isDisabled: true });
    Keyboard.dismiss();

    const url = `https://www.wabpreader.com.ng/api/auth/forgotpassword?Email=${this.state.username}`;

    fetch(url, {
      method: "POST",
      headers: {
        Accept: "*/*",
      },
    })
      .then((res) => res.json())
      .then(
        (responseJson) => {
          if (responseJson.isSuccess == true) {
            this.setState({ isLoading: false });
            this.setState({ isDisabled: false });
            //AsyncStorage.setItem("token", JSON.stringify(responseJson.message));
            //AsyncStorage.setItem("email", JSON.stringify(responseJson.email));

            this.props.navigation.navigate("Reset", responseJson);
          } else {
            var json = JSON.stringify(responseJson.errors);
            var obj = JSON.parse(json);
            var values = Object.keys(obj).map(function (key) {
              return obj[key];
            });
            //console.log(values);
            alert(values);
            this.setState({ isLoading: false });
            this.setState({ isDisabled: false });
          }
        },
        (error) => {
          this.setState({ isLoading: false });
          this.setState({ isDisabled: false });
          alert(error.message);
        }
      );
  };

  render() {
    return (
      <ImageBackground
        source={require("../../assets/login_bg.jpeg")}
        style={styles.container}
      >
        {/* {isLoading && <Loader />} */}

        <View style={styles.container} behavior="padding" enabled>
          <ScrollView style={styles.container}>
            <View style={styles.scrollInner}>
              {/** Logo Area */}
              <View>
                {/* <MaterialCommunityIcons
                  name="book"
                  size={60}
                  color={Colors.blueViolet}
                  style={{
                    marginLeft: -8,
                    marginBottom: 10,
                  }}
                /> */}

                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    paddingBottom: 10,
                  }}
                >
                  <Image
                    source={require("../../assets/icon.png")}
                    style={styles.icon}
                  />
                </View>
                <Text style={styles.header}>Forgot Password</Text>
                {/* <Text style={styles.headerExcerpt}>Thoughts of the story</Text> */}
                {/* <Text style={styles.headerExcerpt}>The current cache is: {client.extract()}</Text> */}
              </View>
              {/** Logo Area */}

              {/** Form Area */}
              <View>
                <Item regular style={styles.inputItem}>
                  <Input
                    style={styles.textInput}
                    placeholder="Email"
                    placeholderTextColor={Colors.titanWhite}
                    keyboardType="default"
                    onChangeText={(username) => this.setState({ username })}
                    value={this.state.username}
                  />
                </Item>
              </View>
              {/** Form Area */}

              <View style={{ marginTop: 20 }}>
                <ActivityIndicator
                  size="large"
                  color="#00ff00"
                  animating={this.state.isLoading}
                />
              </View>
            </View>
          </ScrollView>
        </View>
        <Touchable
          background={Touchable.Ripple(Colors.snow, false)}
          style={styles.button}
          onPress={() => this._signin()}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </Touchable>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,20,0,0.6)", //rgba(0,30,0,0.5)
  },
  scrollInner: {
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  header: {
    color: Colors.blueViolet,
    fontSize: 18,
    fontWeight: "bold",
    justifyContent: "center",
  },
  headerExcerpt: {
    color: Colors.titanWhite,
    fontSize: 14,
    marginVertical: 10,
  },
  icon: {
    height: 50,
    width: 50,
  },
  social: {
    flexDirection: "row",
    marginVertical: 15,
  },
  socialText: {
    fontSize: 14,
    color: Colors.titanWhite,
    marginLeft: 5,
  },
  inputItem: {
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: 15,
    color: Colors.titanWhite,
  },
  inputLabel: {
    fontSize: 14,
    color: Colors.titanWhite,
  },
  textInput: {
    letterSpacing: 1,
    fontSize: 14,
    color: Colors.titanWhite,
  },
  formAfter: {
    marginVertical: 20,
    flexDirection: "row",
  },
  formAfterText: {
    fontSize: 14,
    color: Colors.titanWhite,
    marginRight: 5,
  },
  button: {
    ...Platform.select({
      ios: {
        height: 70,
      },
      android: {
        height: 60,
      },
    }),
    backgroundColor: Colors.blueViolet,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: Colors.titanWhite,
    fontSize: 16,
  },
});

export default ForgotPasswordScreen;
