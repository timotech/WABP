//import LOGIN from '@graphql/query/login.query'
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors, Touchable } from "../../shared";
import { Button, Input, Item } from "native-base";
import React, { Component } from "react";
import {
  AsyncStorage,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Keyboard,
  Image,
  ImageBackground,
} from "react-native";
import * as Facebook from "expo-facebook";
import * as Google from "expo-google-app-auth";

class LoginScreen extends Component {
  state = {
    username: "",
    password: "",
    isLoading: false,
    isDisabled: false,
  };

  _signin = async () => {
    this.setState({ isLoading: true });
    this.setState({ isDisabled: true });
    Keyboard.dismiss();

    fetch("https://www.wabpreader.com.ng/api/auth/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Email: this.state.username,
        Password: this.state.password,
      }),
    })
      .then((res) => res.json())
      .then(
        (responseJson) => {
          if (responseJson.isSuccess == true) {
            this.setState({ isLoading: false });
            this.setState({ isDisabled: false });
            AsyncStorage.setItem(
              "authtoken",
              JSON.stringify(responseJson.message)
            );
            AsyncStorage.setItem(
              "firstname",
              JSON.stringify(responseJson.firstname)
            );
            AsyncStorage.setItem(
              "lastname",
              JSON.stringify(responseJson.lastname)
            );
            AsyncStorage.setItem("email", JSON.stringify(responseJson.email));

            this.props.navigation.navigate("App");
          } else {
            alert("Invalid username or password, please try again");
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

  async _facebookSignin() {
    this.setState({ isLoading: true });
    this.setState({ isDisabled: true });
    try {
      await Facebook.initializeAsync({
        appId: "3764647870245351",
      });
      const { type, token } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ["public_profile"],
      });

      if (type === "success") {
        // Get the user's name using Facebook's Graph API
        const response = await fetch(
          `https://graph.facebook.com/me?access_token=${token}`
        );
        //console.log(token);
        //Alert.alert("Logged in!", `Hi ${(await response.json()).name}!`);
        // AsyncStorage.setItem(
        //   "picture",
        //   JSON.stringify(response.json().picture)
        // );
        this._socialSignin(token);
      } else {
        // type === 'cancel'
      }
    } catch ({ message }) {
      this.setState({ isLoading: false });
      this.setState({ isDisabled: false });
      alert(`Facebook Login Error: ${message}`);
    }
  }

  async signInWithGoogleAsync() {
    try {
      const result = await Google.logInAsync({
        androidClientId:
          "837171953151-ibk8kqu0kodsdjs3ac4v23bf4tci7911.apps.googleusercontent.com",
        //iosClientId: YOUR_CLIENT_ID_HERE,
        scopes: ["profile", "email"],
      });

      if (result.type === "success") {
        console.log(result.accessToken);
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    }
  }

  _socialSignin = async (token) => {
    const url = `https://www.wabpreader.com.ng/api/auth/loginfacebook?token=${token}`;
    //console.log(url);
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
            AsyncStorage.setItem(
              "authtoken",
              JSON.stringify(responseJson.message)
            );
            AsyncStorage.setItem(
              "firstname",
              JSON.stringify(responseJson.firstname)
            );
            AsyncStorage.setItem(
              "lastname",
              JSON.stringify(responseJson.lastname)
            );
            AsyncStorage.setItem("email", JSON.stringify(responseJson.email));

            this.props.navigation.navigate("App");
          } else {
            alert("Incorrect Facebook Login");
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
        {/* {isLoading && <Loader />} imageStyle={{ opacity: 0.1 }} */}

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

                <Text style={styles.header}>Sign In</Text>
                {/* <Text style={styles.headerExcerpt}>Thoughts of the story</Text> */}
                {/* <Text style={styles.headerExcerpt}>The current cache is: {client.extract()}</Text> */}
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
                  onPress={() => this.signInWithGoogleAsync()}
                >
                  <FontAwesome name="google" size={30} color="red" />
                  <Text style={styles.socialText}>Google</Text>
                </Button> */}
                <Button
                  iconLeft
                  transparent
                  onPress={() => this._facebookSignin()}
                >
                  <FontAwesome name="facebook" size={30} color="blue" />
                  <Text style={styles.socialText}>Facebook</Text>
                </Button>
              </View>
              {/** Social Area */}

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
                <Item regular last style={styles.inputItem}>
                  <Input
                    style={styles.textInput}
                    placeholder="Password"
                    placeholderTextColor={Colors.titanWhite}
                    secureTextEntry={true}
                    onChangeText={(password) => this.setState({ password })}
                    value={this.state.password}
                  />
                </Item>
              </View>
              {/** Form Area */}

              {/** Form after */}
              <View style={styles.formAfter}>
                <Text style={styles.formAfterText}>Don't have an account?</Text>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate("Register")}
                >
                  <Text
                    style={[
                      styles.formAfterText,
                      {
                        color: Colors.blueViolet,
                        textDecorationLine: "underline",
                        textDecorationColor: Colors.congoBrown,
                      },
                    ]}
                  >
                    Register here
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.formAfter}>
                <Text style={styles.formAfterText}>Forgot your password?</Text>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate("ForgotPassword")
                  }
                >
                  <Text
                    style={[
                      styles.formAfterText,
                      {
                        color: Colors.blueViolet,
                        textDecorationLine: "underline",
                        textDecorationColor: Colors.congoBrown,
                      },
                    ]}
                  >
                    Click here
                  </Text>
                </TouchableOpacity>
              </View>
              {/** Form after */}
              <View
                style={{
                  marginTop: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate("App")}
                >
                  <Text style={{ color: Colors.titanWhite, fontSize: 14 }}>
                    I just want to{" "}
                    <Text
                      style={{
                        color: Colors.blueViolet,
                        fontWeight: "bold",
                        fontSize: 16,
                      }}
                    >
                      PREVIEW
                    </Text>
                  </Text>
                </TouchableOpacity>
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
          onPress={() => this._signin()}
        >
          <Text style={styles.buttonText}>Login</Text>
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

export default LoginScreen;
