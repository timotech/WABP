import { Ionicons } from "@expo/vector-icons";
import { Colors, Layout, Touchable } from "../shared";
import React, { Component } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  Text,
  FlatList,
  AsyncStorage,
  ActivityIndicator,
  Alert,
} from "react-native";
//import Pick from "../components/Pick";
//import Best from "../components/Best";
import Collection from "../components/Collection";
import NetInfo from "@react-native-community/netinfo";
import * as FileSystem from "expo-file-system";
import base64 from "react-native-base64";
//import * as Permissions from "expo-permissions";
//import * as MediaLibrary from "expo-media-library";

const SCREEN_WIDTH = Layout.window.width;

export default class CollectionScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      dataBook: [],
      selectCatg: 0,
      isLoading: false,
      isUpdating: false,
      error: null,
      isConnected: false,
      base64Code: "",
      downloading: false,
      totalProgress: 0,
      writeProgress: 0,
      fileSize: 0,
    };
  }

  componentWillUnmount() {
    this._subscribe.remove();
    //console.log("I unmounted");
  }

  async componentDidMount() {
    this._subscribe = this.props.navigation.addListener("didFocus", () => {
      this.getData();
      //Put your Data loading function here instead of my this.LoadData()
    });

    const allConnections = await AsyncStorage.getItem("collections");
    if (allConnections == null) {
      //console.log('I got here');
      this.getOnlineCollection();
    }
    // NetInfo.fetch().then((state) => {
    //   if (state.isConnected == true) {
    //     this.getData();
    //   } else {
    //     this.setState({ isLoading: true });
    //     const allConnections = AsyncStorage.getItem("collections");
    //     console.log(allConnections);
    //     if (allConnections !== null) {
    //       const colls = JSON.parse(allConnections);
    //       this.setState({ dataBook: colls, isLoading: false });
    //     }
    //   }
    // });
  }

  getData = async () => {
    this.setState({ isLoading: true });

    const allConnections = await AsyncStorage.getItem("collections");

    if (allConnections !== null) {
      //console.log("getting local collections");
      this.setState({
        isLoading: false,
        dataBook: JSON.parse(allConnections),
      });
    } else {
      this.getOnlineCollection();
    }
  };

  getOnlineCollection = async () => {
    //console.log("getting online collections");
    let email = await AsyncStorage.getItem("email");

    let url = `https://www.wabpreader.com.ng/api/books/GetMyCollection?Email=${JSON.parse(
      email
    )}`;

    return fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Network error, or Something went wrong ...");
        }
      })
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          dataBook: responseJson,
        });

        //store in storage here
        //this.saveFile(responseJson);
        AsyncStorage.setItem("collections", JSON.stringify(responseJson));
        //const allConnections = AsyncStorage.getItem("collections");
        //console.log(JSON.stringify(responseJson));
      })
      .catch((error) => {
        // Alert.alert("Something Went Wrong", error.message, [
        //   {
        //     text: "Try Again",
        //     onPress: this.getData,
        //   },
        // ]);
        //console.log(error.message);
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  };

  downloadEbook = async (ebookPath, title, id) => {
    let total = 0;
    let writeByte = 0;

    //Check whether already downloaded before continuing
    var getStatus = await this._checkDownloaded(id);
    //console.log("Status: ", getStatus);

    if (getStatus !== 1) {
      //console.log("downloading");
      this.setState({ downloading: true });

      const callback = (downloadProgress) => {
        total = downloadProgress.totalBytesExpectedToWrite / 1000;
        writeByte = downloadProgress.totalBytesWritten / 1000;

        this.setState({
          totalProgress:
            total == -0.001
              ? this.state.fileSize / 1000
              : writeByte > this.state.fileSize / 1000
              ? writeByte
              : total,
          writeProgress: writeByte,
        });
      };

      // console.log(
      //   "downloading: " +
      //     "https://www.wabpreader.com.ng/images/compressed/" +
      //     ebookPath +
      //     ".txt"
      // );

      const downloadResumable = FileSystem.createDownloadResumable(
        "https://www.wabpreader.com.ng/images/compressed/" + ebookPath + ".txt",
        FileSystem.documentDirectory + ebookPath + ".txt",
        {
          headers: {
            "Content-Type": "*/*",
          },
        },
        callback
      );

      await downloadResumable
        .downloadAsync()
        .then(({ uri }) => {
          console.log("Finished downloading to ", uri);
          //update database book downloaded to device
          var message = this._updateCollectionInfo(id);
          //console.log("Collection Update: ", message);
          this._checkFile(ebookPath, title);
        })
        .catch((error) => {
          console.error(error);
          this.setState({ downloading: false });

          let tmp = FileSystem.getInfoAsync(
            FileSystem.documentDirectory + ebookPath + ".txt"
          );

          if (tmp.exists) {
            FileSystem.deleteAsync(
              FileSystem.documentDirectory + ebookPath + ".txt"
            );
          }

          alert("Network Error or file Unreachable. Please try again!");
          this.getData();
        });

      // Alert.alert("Something Went Wrong", e.message, [
      //   {
      //     text: "Try Again",
      //     onPress: this.downloadEbook(ebookPath, title, id),
      //   },
      // ]);
    } else {
      alert("Ebook Already Downloaded!");
      this.getData();
    }
  };

  _checkFile = async (ebookPath, title) => {
    let tmp = await FileSystem.getInfoAsync(
      FileSystem.documentDirectory + ebookPath + ".txt"
    );

    if (tmp.exists) {
      this.viewFile(tmp.uri, title);
    }
  };

  viewFile = async (fileUri, title) => {
    let file = await FileSystem.readAsStringAsync(fileUri, {
      encoding: "base64",
    });

    this.setState({
      base64Code: base64.decode(file),
      downloading: false,
    });
    this.props.navigation.navigate("Views", {
      base64Code: this.state.base64Code,
      title: title,
    });
  };

  downloadEbookNew = async (ebookPath, title, id) => {
    this.setState({ downloading: true });

    console.log("downloading");

    const callback = (downloadProgress) => {
      const progress =
        downloadProgress.totalBytesWritten /
        downloadProgress.totalBytesExpectedToWrite;
      this.setState({
        downloadProgress: progress,
        writeProgress: downloadProgress.totalBytesWritten,
        totalProgress: downloadProgress.totalBytesExpectedToWrite,
      });
    };

    const { uri } = await FileSystem.downloadAsync(
      "https://www.wabpreader.com.ng/images/compressed/" + ebookPath + ".txt",
      FileSystem.documentDirectory + ebookPath + ".txt"
    )
      .then(({ uri }) => {
        console.log("Finished downloading to ", uri);
        this.viewFile(uri, title);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  readEbook = async (ebookPath, title, fileSize, id) => {
    try {
      this.setState({ isLoading: true });
      this.setState({ fileSize: fileSize });
      ebookPath = ebookPath.split(".").slice(0, -1).join(".");

      let tmp = await FileSystem.getInfoAsync(
        FileSystem.documentDirectory + ebookPath + ".txt"
      );

      //Check if file size is accurate
      if (tmp.exists && tmp.size !== fileSize) {
        await FileSystem.deleteAsync(
          FileSystem.documentDirectory + ebookPath + ".txt"
        );
      }

      //Check again, if deleted, then download from source
      let tmp2 = await FileSystem.getInfoAsync(
        FileSystem.documentDirectory + ebookPath + ".txt"
      );

      if (tmp2.exists) {
        // console.log(
        //   "File Exists, File Name: ",
        //   FileSystem.documentDirectory + ebookPath + ".txt"
        // );

        //console.log("File Details: ", tmp2);

        //let filecontent = await FileSystem.readAsStringAsync(tmp2.uri);
        //console.log("File Content: " + filecontent);

        let file = await FileSystem.readAsStringAsync(tmp2.uri, {
          encoding: "base64",
        });

        this.setState({ base64Code: base64.decode(file) });

        this.props.navigation.navigate("Readers", {
          base64Code: this.state.base64Code,
          title: title,
        });
      } else {
        this.downloadEbookNew(ebookPath, title, id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  _updateCollectionInfo = async (id) => {
    this.setState({ isUpdating: true });
    //console.log("updating collection");
    let email = await AsyncStorage.getItem("email");

    let url = `https://www.wabpreader.com.ng/api/books/UpdateCollection?id=${id}&email=${JSON.parse(
      email
    )}`;

    return fetch(url, {
      method: "PUT",
      headers: {
        Accept: "*/*",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Network error, or Something went wrong ...");
        }
      })
      .then((responseJson) => {
        this.setState({
          isUpdating: false,
        });
        //console.log("Collection Update", responseJson.message);
        return JSON.stringify(responseJson.message);
      })
      .catch((error) => {
        // Alert.alert("Something Went Wrong", error.message, [
        //   {
        //     text: "Try Again",
        //     onPress: this.getData,
        //   },
        // ]);
        //console.log(error.message);
      });
  };

  _checkDownloaded = async (id) => {
    let email = await AsyncStorage.getItem("email");

    let url = `https://www.wabpreader.com.ng/api/books/checkdownload?id=${id}&email=${JSON.parse(
      email
    )}`;

    return fetch(url, {
      method: "GET",
      headers: {
        Accept: "*/*",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Network error, or Something went wrong ...");
        }
      })
      .then((responseJson) => {
        return JSON.parse(responseJson);
      })
      .catch((error) => {
        // Alert.alert("Something Went Wrong", error.message, [
        //   {
        //     text: "Try Again",
        //     onPress: this.getData,
        //   },
        // ]);
        //console.log(error.message);
      });
  };

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: `My Collections`,
      headerLeft: () => (
        <Touchable
          background={Touchable.Ripple(Colors.blueViolet, true)}
          style={[styles.headerItem, styles.headerIcon]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="ios-arrow-back" size={25} color={Colors.congoBrown} />
        </Touchable>
      ),
    };
  };

  _onRefresh = () => {
    this.setState({ refreshing: true });
    setTimeout(() => {
      this.getOnlineCollection();
      this.setState({ refreshing: false });
    }, 10000);
  };

  _keyExtractor = (item, index) => `${index}`;

  _renderItem = ({ item }) => (
    <View>
      <Collection
        key={item.id}
        pick={item}
        handleOnPress={() =>
          this.readEbook(item.ebookPath, item.title, item.fileSize, item.id)
        }
      />
    </View>
  );

  render() {
    return (
      <View style={styles.container}>
        {this.state.downloading ? (
          <View style={{ marginTop: 20 }}>
            <ActivityIndicator
              size="large"
              color="#00ff00"
              animating={this.state.downloading}
            />
            <Text
              style={{
                marginTop: 30,
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                fontSize: 18,
              }}
            >
              Fetching Ebook for first time use at {this.state.writeProgress}kb
              of {this.state.totalProgress}kb
            </Text>
          </View>
        ) : this.state.isLoading ? (
          <View style={{ marginTop: 20 }}>
            <ActivityIndicator
              size="large"
              color="#00ff00"
              animating={this.state.isLoading}
            />
          </View>
        ) : (
          <View style={styles.content}>
            <FlatList
              data={this.state.dataBook}
              extraData={this.state}
              keyExtractor={this._keyExtractor}
              renderItem={this._renderItem}
              scrollEventThrottle={16}
              showsHorizontalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh}
                />
              }
            />
            <Text>Pull down to refresh</Text>
          </View>
        )}
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
  content: {
    flex: 1,
    padding: 20,
  },
  author: {
    fontSize: 12,
    color: Colors.congoBrown,
  },
  genre: {
    fontSize: 10,
    color: Colors.congoBrown,
  },
});
