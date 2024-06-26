import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import { WebView } from "react-native-webview";
import { Colors, Touchable } from "../shared";
import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";

export default class ViewScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //id: this.props.navigation.getParam("id"),
      title: this.props.navigation.getParam("title"),
      //bookpath: this.props.navigation.getParam("ebookPath"),
      added: false,
      base64Code: this.props.navigation.getParam("base64Code"),
      isLoading: false,
      downloadProgress: 0,
      filePath: "",
    };
  }

  // componentDidMount(){
  //   console.log(this.state.base64Code);
  // }

  componentWillUnmount() {
    this.setState({
      base64Code: "",
      title: "",
    });
  }

  // saveFile = async () => {
  //   const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
  //   if (status === "granted") {
  //     this.setState({ isLoading: true });
  //     await FileSystem.downloadAsync(
  //       "http://books.timotechng.com/images/compressed/Basic Technology for Junior  Secondary Schools, Book 3.txt",
  //       FileSystem.documentDirectory +
  //         "Basic Technology for Junior  Secondary Schools, Book 3.txt"
  //     )
  //       .then(({ uri }) => {
  //         this.setState({ isLoading: false });
  //         console.log("Finished downloading to ", uri);
  //         this.setState({ added: true });
  //       })
  //       .catch((error) => {
  //         this.setState({ isLoading: false });
  //         console.error(error);
  //       });
  //     //write base64Code to userdata.txt file
  //     if (this.state.added == true) {
  //       let fileUri =
  //         FileSystem.documentDirectory +
  //         "Basic Technology for Junior  Secondary Schools, Book 3.txt";
  //       //const asset = await MediaLibrary.createAssetAsync(fileUri);
  //       //await MediaLibrary.createAlbumAsync("Download", asset, false);
  //       //get file information
  //       const asset = FileSystem.getInfoAsync(fileUri);
  //       //const assetInfo = await MediaLibrary.getAssetInfoAsync(asset);
  //       console.log(asset);
  //     }
  //   }
  // };
  //${this.state.title}

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: navigation.getParam("title"),
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

  onMessage(m) {
    // if(m.nativeEvent.data === "pause"){
    //   if(Speech.isSpeakingAsync()){
    //     Speech.pause();
    //   }else{
    //     Speech.resume();
    //   }
    // } else
    if (m.nativeEvent.data === "stop") {
      Speech.stop();
    } else {
      if (m.nativeEvent.data.length > Speech.maxSpeechInputLength) {
        const chunks = m.nativeEvent.data.match(/.{1,3999}(\s|$)/g);
        //console.log(chunks.length);
        chunks.forEach(function (i, x) {
          Speech.speak(chunks[x]);
        });
      } else {
        Speech.speak(m.nativeEvent.data, {
          pitch: 1.0,
          rate: 0.8,
        });
      }
    }
  }

  render() {
    const html = `
      <html>
      <head>
      <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Epub Reader</title>
  <script src="https://unpkg.com/epub.js@0.2.15/build/libs/zip.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/epub.js/0.2.13/epub.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.2/jquery.min.js"></script>
  
<style>
html,
body {
    min-height: 100%;
    margin: 0;
    padding: 5px;
}

#reader {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    flex-direction: column;
}

#reader #toolbar {
  flex: 5%;
  display: flex;
  justify-content: space-between;
  background: rgba(0,0,0,0.05);
  padding: 0px 10px 8px;
}

/*#reader #toolbar .left {
  flex: 0 1 auto;
}

#reader #toolbar .center {
  flex: 0 1 auto;
}

#reader #toolbar .right {
  flex: 0 1 auto;
}*/

#reader #area {
  flex: 95%;
  display: flex;
	margin: 15px;
	padding: 5px;
}

.cover {
	position: absolute;
  height: 100%;
  width: 100%;
  margin-top: 40px;
  display: block;
  z-index: 999;
}

/** side nav section*/
.sidenav {
  height: 100%;
  width: 0;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  background-color: #111;
  overflow-x: hidden;
  transition: 0.5s;
  padding-top: 0px;
}

.sidenav a {
  padding: 8px 8px 8px 32px;
  text-decoration: none;
  font-size: 25px;
  color: #818181;
  display: block;
  transition: 0.3s;
}

.sidenav a:hover {
  color: #f1f1f1;
}

.sidenav .closebtn {
  position: absolute;
  top: 0;
  right: 25px;
  font-size: 36px;
  margin-left: 50px;
}

/*Read Aloud Section*/

button {
  background: none;
  border: none;
  cursor: pointer;
  height: 38px;
  outline: none;
  padding: 0;
  width: 48px;
}

</style>
</head>
<body>
<div id="mySidenav" class="sidenav">
  <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>
</div>
<div id="reader">
    <div id="toolbar">
        <div class="left">
			    <span style="font-size:30px;cursor:pointer" onclick="openNav()">&#9776;</span>            
        </div>
        <div class="center">
            <button id=play>&#10148;</button>
			      <!--<button id=pause>&#8471;</button>-->
			      <button id=stop>&#9744;</button>
        </div>
        <div class="right">
			      <button id="prev">&lt;</button> &nbsp;
            <button id="next">&gt;</button>
        </div>
    </div>

    <div id="area">

    </div>
</div>
<script>
	book = null;
  var b64 = ${JSON.stringify(this.state.base64Code)};
  
  var bin = atob(b64);
  
  var obj = document.createElement('object');
  obj.style.width = '100%';
  obj.style.height = '842pt';
  obj.type = 'application/epub+zip';
  obj.data = 'data:application/epub+zip;base64,' + b64;
  
  var file = dataURLtoFile(obj.data,'readme.epub');
      if (window.FileReader) {
          var reader = new FileReader();
          reader.onload = function(e) {
              book = ePub({
                  bookPath: e.target.result
              });
  
              book.renderTo("area", { method: "default", width: "100%", height: "100%" });
              /* Replace area with the id for your div to put the book in */
          }.bind(this);
  
          reader.readAsArrayBuffer(file);

          reader.onloadend = () => {
            LoadToc();
          }
      } else {
          alert("Error displaying file, please contact administrator!");
      }
    
    function dataURLtoFile(dataurl, filename) {
   
          var arr = dataurl.split(','),
              mime = arr[0].match(/:(.*?);/)[1],
              bstr = atob(arr[1]), 
              n = bstr.length, 
              u8arr = new Uint8Array(n);
              
          while(n--){
              u8arr[n] = bstr.charCodeAt(n);
          }
          
          return new File([u8arr], filename, {type:mime});
      }

      function LoadToc() {
        if (book !== null && book.isRendered == true) {
          var results = book.toc;
      
          var $select = document.getElementById("mySidenav");
          
        results.forEach(function(chapter) {
          var aTag = document.createElement('a');
          aTag.setAttribute('href',"#");
          aTag.innerText = chapter.label;
          aTag.onclick = function() {
            url = chapter.href;
            book.gotoHref(url);
            closeNav();
            return false;
          };
          $select.appendChild(aTag);
        });
        }
      }      
      
  document.getElementById("prev").onclick = function() {
      book.prevPage();
  }
  
  document.getElementById("next").onclick = function() {
      book.nextPage();
  }

  function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }
  
  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }

  document.addEventListener('swiped-left', function(e) {
    book.nextPage();
 });
 
 document.addEventListener('swiped-right', function(e) {    
    book.prevPage();
 });
  
  </script>
  <script>
	(function($) {
  $.fn.swipeDetector = function(options) {
    // States: 0 - no swipe, 1 - swipe started, 2 - swipe released
    var swipeState = 0;
    // Coordinates when swipe started
    var startX = 0;
    var startY = 0;
    // Distance of swipe
    var pixelOffsetX = 0;
    var pixelOffsetY = 0;
    // Target element which should detect swipes.
    var swipeTarget = this;
    var defaultSettings = {
      // Amount of pixels, when swipe don't count.
      swipeThreshold: 70,
      // Flag that indicates that plugin should react only on touch events.
      // Not on mouse events too.
      useOnlyTouch: false
    };

    // Initializer
    (function init() {
      options = $.extend(defaultSettings, options);
      // Support touch and mouse as well.
      swipeTarget.on("mousedown touchstart", swipeStart);
      $("html").on("mouseup touchend", swipeEnd);
      $("html").on("mousemove touchmove", swiping);
    })();

    function swipeStart(event) {
      if (options.useOnlyTouch && !event.originalEvent.touches) return;

      if (event.originalEvent.touches) event = event.originalEvent.touches[0];

      if (swipeState === 0) {
        swipeState = 1;
        startX = event.clientX;
        startY = event.clientY;
      }
    }

    function swipeEnd(event) {
      if (swipeState === 2) {
        swipeState = 0;

        if (
          Math.abs(pixelOffsetX) > Math.abs(pixelOffsetY) &&
          Math.abs(pixelOffsetX) > options.swipeThreshold
        ) {
          // Horizontal Swipe
          if (pixelOffsetX < 0) {
            swipeTarget.trigger($.Event("swipeLeft.sd"));
            console.log("Left");
          } else {
            swipeTarget.trigger($.Event("swipeRight.sd"));
            console.log("Right");
          }
        } else if (Math.abs(pixelOffsetY) > options.swipeThreshold) {
          // Vertical swipe
          if (pixelOffsetY < 0) {
            swipeTarget.trigger($.Event("swipeUp.sd"));
            console.log("Up");
          } else {
            swipeTarget.trigger($.Event("swipeDown.sd"));
            console.log("Down");
          }
        }
      }
    }

    function swiping(event) {
      // If swipe don't occuring, do nothing.
      if (swipeState !== 1) return;

      if (event.originalEvent.touches) {
        event = event.originalEvent.touches[0];
      }

      var swipeOffsetX = event.clientX - startX;
      var swipeOffsetY = event.clientY - startY;

      if (
        Math.abs(swipeOffsetX) > options.swipeThreshold ||
        Math.abs(swipeOffsetY) > options.swipeThreshold
      ) {
        swipeState = 2;
        pixelOffsetX = swipeOffsetX;
        pixelOffsetY = swipeOffsetY;
      }
    }

    return swipeTarget; // Return element available for chaining.
  };
})(jQuery);

// Showcase
$("document").ready(function() {
  $(".swipe-detector")
    .swipeDetector()
    .on("swipeLeft.sd swipeRight.sd swipeUp.sd swipeDown.sd", function(event) {
      if (event.type === "swipeLeft") {
        console.log("Swipe Left");
		book.nextPage();
      } else if (event.type === "swipeRight") {
        console.log("Swipe Right");
		book.prevPage();
      } 
      //else if (event.type === "swipeUp") {
        //console.log("Swipe Up");
      //} else if (event.type === "swipeDown") {
        //console.log("Swipe Down");
      //}
    });
});
   </script>
   <script>
    var playEle = document.querySelector('#play');
    //var pauseEle = document.querySelector('#pause');
    var stopEle = document.querySelector('#stop');

    playEle.addEventListener('click', onClickPlay);
    //pauseEle.addEventListener('click', onClickPause);
    stopEle.addEventListener('click', onClickStop);

    function onClickPlay() {
      window.ReactNativeWebView.postMessage(document.getElementsByTagName('iframe')[0].contentWindow.document.body.innerText);
    }

    //function onClickPause() {
    //  window.ReactNativeWebView.postMessage('pause');
    //}

    function onClickStop() {
      window.ReactNativeWebView.postMessage('stop');
    }
   </script>
      </body>
      </html>`;

    return this.state.base64Code !== "" && this.state.base64Code !== null ? (
      <View style={{ flex: 1 }}>
        <WebView
          source={{ html: html }}
          javaScriptEnabled={true}
          onMessage={(m) => this.onMessage(m)}
        />
      </View>
    ) : (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ textAlign: "center" }}>
          Book Render Error, Please contact administrator at info@wabp.com.ng
        </Text>
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
});
