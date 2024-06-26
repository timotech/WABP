import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../shared";
import { Button, Text, Textarea } from "native-base";
import React from "react";
import {
  AsyncStorage,
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import StarRating from "react-native-star-rating";

export default class AddReview extends React.PureComponent {
  state = {
    isLoading: false,
  };

  _hideModal = () => {
    this.props.setModalVisible(false);
  };

  _postReview = async () => {
    const logged = await AsyncStorage.getItem("authtoken");
    if (!logged) {
      return this.props.navigation.navigate("Auth");
    }

    const email = await AsyncStorage.getItem("email");
    Keyboard.dismiss();

    this.setState({ isLoading: true });

    fetch("https://www.wabpreader.com.ng/api/books/postreviews", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Username: JSON.parse(email),
        Comment: this.props.comment,
        Rating: this.props.rating.toString(),
        BookId: this.props.bookId.toString(),
        Name: "from db",
      }),
    })
      .then((res) => res.json())
      .then(
        (responseJson) => {
          if (responseJson.isSuccess == true) {
            this.setState({ isLoading: false });
            alert("Review Submitted");
            this.props.setModalVisible(false);
          } else {
            this.setState({ isLoading: false });
            alert("Network Error, Review Not Submitted!");
          }
        },
        (error) => {
          this.setState({ isLoading: false });
          alert(error.message);
        }
      )
      .finally(() => {
        this.setState({ isLoading: false });
      });
  };

  _setReviewStar = (number) => {
    this.props.setData({ submittedRating: number });
  };

  _setReviewComment = (value) => {
    this.props.setData({ submittedComment: value });
  };

  render() {
    const { name, rating, comment, modalVisible } = this.props;

    return (
      <Modal
        animationType="fade"
        transparent={false}
        visible={modalVisible}
        onRequestClose={this._hideModal}
      >
        <View style={styles.container}>
          <View>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
              Reviewing {name}
            </Text>

            <TouchableOpacity
              style={styles.closeContainer}
              onPress={this._hideModal}
            >
              <Ionicons name="md-close" size={30} style={styles.closeIcon} />
            </TouchableOpacity>
          </View>

          <View style={[styles.formContainer]}>
            <View style={{ width: 140, marginBottom: 25 }}>
              <StarRating
                emptyStar={"ios-star-outline"}
                fullStar={"ios-star"}
                halfStar={"ios-star-half"}
                iconSet={"Ionicons"}
                maxStars={5}
                rating={rating}
                fullStarColor={Colors.yellow50}
                starSize={25}
                selectedStar={this._setReviewStar}
              />
            </View>

            <Textarea
              rowSpan={5}
              bordered
              autoCapitalize="sentences"
              returnKeyType="done"
              value={comment}
              onChangeText={this._setReviewComment}
              placeholder="Leave a comment"
              style={styles.textInput}
            />
            <Button block style={styles.button} onPress={this._postReview}>
              <Text style={styles.buttonText}>Submit Review</Text>
            </Button>
            <View style={{ marginTop: 5 }}>
              <ActivityIndicator
                size="large"
                color="#00ff00"
                animating={this.state.isLoading}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    ...Platform.select({
      ios: {
        paddingTop: 70,
      },
      android: {
        paddingTop: 30,
      },
    }),
  },
  title: {
    fontSize: 16,
    color: Colors.congoBrown,
    marginTop: 20,
  },
  closeContainer: {
    position: "absolute",
    right: 0,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  closeIcon: {
    color: Colors.congoBrown,
  },
  formContainer: {
    marginTop: 50,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  // inputItem: {
  //     borderBottomColor: Colors.borderFaintColor,
  //     marginTop: 20,
  // },
  // inputLabel: {
  //     fontSize: 10
  // },
  textInput: {
    borderColor: Colors.congoBrown,
    color: Colors.congoBrown,
    fontSize: 14,
    width: "100%",
    marginBottom: 25,
  },
  button: {
    backgroundColor: Colors.blueViolet,
  },
  buttonText: {
    color: Colors.titanWhite,
  },
});
