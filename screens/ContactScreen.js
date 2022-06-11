import React, { Component } from "react";
import { Colors, Layout, Touchable } from "../shared";
import { StyleSheet, TouchableOpacity, View, Alert } from "react-native";
import {
  Container,
  Header,
  Title,
  Content,
  Text,
  Icon,
  Card,
  CardItem,
  Item,
  Body,
  Right,
  Button,
  Input,
  Form,
  Textarea,
  Left,
} from "native-base";

export default class ContactScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: null,
      mobile: null,
      email: null,
      msg: null,
      isSubmited: false,
    };
  }

  postContact = (
    name,
    mobile,
    email,
    msg,
    nameClear,
    mobileClear,
    emailClear,
    msgClear
  ) => {
    if (this.state.msg != null) {
      fetch("https://www.wabpreader.com.ng/api/books/PostContact", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          mobile: mobile,
          email: email,
          msg: msg,
        }),
      })
        .then((response) => response.json())
        .then((responseData) => {
          if (responseData.name != null) {
            this.refs[nameClear].setNativeProps({ text: "" });
            this.refs[mobileClear].setNativeProps({ text: "" });
            this.refs[emailClear].setNativeProps({ text: "" });
            this.refs[msgClear].setNativeProps({ text: "" });
            this.setState({
              name: null,
              mobile: null,
              email: null,
              msg: null,
              isSubmited: true,
            });
          } else {
            Alert.alert(
              "Oops !",
              "Something went wrong",
              [
                {
                  text: "OK",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
              ],
              { cancelable: false }
            );
          }
        })
        .done();
    } else {
      Alert.alert(
        "Oops !",
        "Press SUBMIT button after entering your message",
        [
          {
            text: "OK",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
        ],
        { cancelable: false }
      );
    }
  };

  _togglePostCard() {
    this.setState({
      isSubmited: false,
    });
  }

  render() {
    return (
      <Container>
        <Header
          androidStatusBarColor={Colors.blueViolet}
          style={{ backgroundColor: Colors.blueViolet }}
        >
          <Body
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Title>CONTACT</Title>
          </Body>
        </Header>
        <Content>
          <Card style={styles.postCard}>
            {this.state.isSubmited ? (
              <View>
                <CardItem>
                  <Item>
                    <Icon
                      activename="ios-checkmark-circle"
                      style={{
                        fontSize: 30,
                        color: "#4CAF50",
                        marginLeft: 5,
                        marginRight: 10,
                      }}
                    />
                    <Text style={{ flex: 1 }}>
                      Thanks. We will get in touch with you as soon as possible
                    </Text>
                  </Item>
                </CardItem>
                <CardItem>
                  <Left></Left>
                  <Body>
                    <TouchableOpacity
                      success
                      onPress={() => this._togglePostCard()}
                    >
                      <Icon
                        active
                        name="refresh"
                        style={{
                          fontSize: 50,
                          color: "#64DD17",
                          marginLeft: 10,
                        }}
                      />
                    </TouchableOpacity>
                  </Body>
                  <Right></Right>
                </CardItem>
              </View>
            ) : (
              <View>
                <CardItem>
                  <Item>
                    <Input
                      placeholder="Name"
                      onChangeText={(name) => this.setState({ name })}
                      ref={"nameClear"}
                    />
                  </Item>
                </CardItem>
                <CardItem>
                  <Item>
                    <Input
                      placeholder="Mobile"
                      onChangeText={(mobile) => this.setState({ mobile })}
                      ref={"mobileClear"}
                      keyboardType={"phone-pad"}
                    />
                  </Item>
                </CardItem>
                <CardItem>
                  <Item>
                    <Input
                      placeholder="Email"
                      onChangeText={(email) => this.setState({ email })}
                      ref={"emailClear"}
                      keyboardType={"email-address"}
                    />
                  </Item>
                </CardItem>
                <Form style={{ marginLeft: 20, marginRight: 20 }}>
                  <Textarea
                    rowSpan={5}
                    borderedplaceholder="Type your message"
                    onChangeText={(msg) => this.setState({ msg })}
                    ref={"msgClear"}
                    placeholder="Type your message here"
                  />
                </Form>
                <CardItem>
                  <Left></Left>
                  <Body>
                    <Button
                      success
                      onPress={() =>
                        this.postContact(
                          this.state.name,
                          this.state.mobile,
                          this.state.email,
                          this.state.msg,
                          "nameClear",
                          "mobileClear",
                          "emailClear",
                          "msgClear"
                        )
                      }
                    >
                      <Text>SUBMIT</Text>
                    </Button>
                  </Body>
                  <Right></Right>
                </CardItem>
              </View>
            )}
          </Card>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  postCard: {
    marginLeft: 25,
    marginRight: 25,
    marginTop: 20,
    marginBottom: 20,
  },
});
