import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors, Touchable } from "../../shared";
import { Button, Input, Item } from "native-base";
import React, { Component } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Image,
  ImageBackground,
} from "react-native";

export default class RegisterScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      isLoading: false,
      isDisabled: false,
    };
  }

  _register = async () => {
    this.setState({ isLoading: true });
    this.setState({ isDisabled: true });

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(this.state.username) === false) {
      alert("Email Not Valid");
      this.setState({ isLoading: false });
      this.setState({ isDisabled: false });
      return;
    }

    if (this.state.password !== this.state.confirmPassword) {
      alert("Password and Confirm Password Not Same!");
      this.setState({ isLoading: false });
      this.setState({ isDisabled: false });
      return;
    }

    if (
      this.state.username == "" ||
      this.state.password == "" ||
      this.state.confirmPassword == "" ||
      this.state.firstName == "" ||
      this.state.lastName == "" ||
      this.state.phoneNumber == ""
    ) {
      alert("All fields are required");
      this.setState({ isLoading: false });
      this.setState({ isDisabled: false });
      return;
    }

    fetch("https://www.wabpreader.com.ng/api/auth/register", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Email: this.state.username,
        Password: this.state.password,
        ConfirmPassword: this.state.confirmPassword,
        FirstName: this.state.firstName,
        LastName: this.state.lastName,
        Phone: this.state.phoneNumber,
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
          alert("A server error has occured, error details: " + error + ". Please contact administrator or try again later");
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

                <Text style={styles.header}>Sign Up</Text>
                {/* <Text style={styles.headerExcerpt}>Thoughts of the story</Text> */}
              </View>
              {/** Logo Area */}

              {/** Social Area */}
              <View style={styles.social}>
                {/* <Button
                  iconLeft
                  transparent
                  style={{
                    marginRight: 40,
                  }}
                >
                  <FontAwesome name="google" size={30} color="red" />
                  <Text style={styles.socialText}>Google</Text>
                </Button> */}
                <Button iconLeft transparent>
                  <FontAwesome name="facebook" size={30} color="blue" />
                  <Text style={styles.socialText}>Facebook</Text>
                </Button>
              </View>
              {/** Social Area */}

              {/** Form Area */}
              <View>
                <Item regular style={styles.inputItem}>
                  {/* <Label style={styles.inputLabel}>First Name</Label> */}
                  <Input
                    style={styles.textInput}
                    placeholder="First Name"
                    placeholderTextColor={Colors.titanWhite}
                    onChangeText={(firstName) => this.setState({ firstName })}
                    value={this.state.firstName}
                  />
                </Item>
                <Item regular style={styles.inputItem}>
                  {/* <Label style={styles.inputLabel}>Last Name</Label> */}
                  <Input
                    style={styles.textInput}
                    placeholder="Last Name"
                    placeholderTextColor={Colors.titanWhite}
                    onChangeText={(lastName) => this.setState({ lastName })}
                    value={this.state.lastName}
                  />
                </Item>
                <Item regular style={styles.inputItem}>
                  {/* <Label style={styles.inputLabel}>Email ID</Label> */}
                  <Input
                    style={styles.textInput}
                    placeholder="Email Address"
                    placeholderTextColor={Colors.titanWhite}
                    keyboardType="email-address"
                    onChangeText={(username) => this.setState({ username })}
                    value={this.state.username}
                  />
                </Item>
                <Item regular style={styles.inputItem}>
                  {/* <Label style={styles.inputLabel}>Phone Number</Label> */}
                  <Input
                    style={styles.textInput}
                    placeholder="Phone Number"
                    placeholderTextColor={Colors.titanWhite}
                    keyboardType="phone-pad"
                    onChangeText={(phoneNumber) =>
                      this.setState({ phoneNumber })
                    }
                    value={this.state.phoneNumber}
                  />
                </Item>
                <Item regular last style={styles.inputItem}>
                  {/* <Label style={styles.inputLabel}>Password</Label> */}
                  <Input
                    style={styles.textInput}
                    placeholder="password"
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
              </View>
              {/** Form Area */}

              {/** Form after */}
              <View style={styles.formAfter}>
                <Text style={styles.formAfterText}>Already registered?</Text>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate("Login")}
                >
                  <Text
                    style={[
                      styles.formAfterText,
                      {
                        color: Colors.blueViolet,
                        textDecorationLine: "underline",
                        textDecorationColor: Colors.congoBrown,
                        fontWeight: "bold",
                      },
                    ]}
                  >
                    Login here
                  </Text>
                </TouchableOpacity>
              </View>
              {/** Form after */}
              <View>
                <Text style={styles.formAfterText}>
                  Note: Password must have at least one uppercase letter, one
                  lower case letter, and one special character
                </Text>
              </View>
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
          <Text style={styles.buttonText}>Register</Text>
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
