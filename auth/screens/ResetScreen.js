import { Colors, Touchable } from "../../shared";
import { Input, Item } from "native-base";
import React, { Component } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Image,
  ImageBackground,
} from "react-native";

export default class ResetScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.navigation.getParam("email"),
      password: "",
      confirmPassword: "",
      isLoading: false,
      isDisabled: false,
      code: "",
    };
  }

  _register = async () => {
    this.setState({ isLoading: true });
    this.setState({ isDisabled: true });

    fetch("https://www.wabpreader.com.ng/api/auth/resetpassword", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Email: this.state.username,
        Password: this.state.password,
        ConfirmPassword: this.state.confirmPassword,
        Code: this.state.code,
      }),
    })
      .then((res) => res.json())
      .then(
        (responseJson) => {
          if (responseJson.isSuccess == true) {
            this.setState({ isLoading: false });
            this.setState({ isDisabled: false });
            this.props.navigation.navigate("Login");
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
                <Text style={styles.header}>Reset Password</Text>
                {/* <Text style={styles.headerExcerpt}>Thoughts of the story</Text> */}
              </View>
              {/** Logo Area */}

              {/** Form Area */}
              <View>
                <Item regular last style={styles.inputItem}>
                  {/* <Label style={styles.inputLabel}>Password</Label> */}
                  <Input
                    style={styles.textInput}
                    placeholder="Password"
                    placeholderTextColor={Colors.titanWhite}
                    secureTextEntry={true}
                    onChangeText={(password) => this.setState({ password })}
                    value={this.state.password}
                  />
                </Item>
                <Item regular last style={styles.inputItem}>
                  {/* <Label style={styles.inputLabel}>Confirm Password</Label> */}
                  <Input
                    style={styles.textInput}
                    placeholder="Confirm Password"
                    placeholderTextColor={Colors.titanWhite}
                    secureTextEntry={true}
                    onChangeText={(confirmPassword) =>
                      this.setState({ confirmPassword })
                    }
                    value={this.state.confirmPassword}
                  />
                </Item>
                <Item regular last style={styles.inputItem}>
                  {/* <Label style={styles.inputLabel}>Confirm Password</Label> */}
                  <Input
                    style={styles.textInput}
                    placeholder="Verification Code Sent To Your Mail"
                    placeholderTextColor={Colors.titanWhite}
                    secureTextEntry={true}
                    onChangeText={(code) => this.setState({ code })}
                    value={this.state.code}
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
          onPress={() => this._register()}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </Touchable>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,20,0,0.6)",
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
