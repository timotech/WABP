import React, { useRef, useState, useEffect } from "react";
import Carousel, { ParallaxImage } from "react-native-snap-carousel";
import { View, Text, Dimensions, StyleSheet, Platform } from "react-native";

const CAROUSEL_BOOKS = [
  {
    title: "Learn Basic Agriculture",
    subtitle: "For Nigerian Primary Schools 1",
    picPath: require("../assets/images/Agric-bk-primary-1.-1519x2048.jpg"),
  },
  {
    title: "Tie Ebe Edo",
    subtitle: "For Primary Schools 1",
    picPath: require("../assets/images/Edo-Language-Book-1-1499x2048.jpg"),
  },
  {
    title: "Inikpi",
    subtitle: "Ayegbas Beloved Daughter ",
    picPath: require("../assets/images/INIKPI.-1431x2048.jpg"),
  },
  {
    title: "Iye (Mother)",
    subtitle: "Mother",
    picPath: require("../assets/images/IYE_Mother.jpg"),
  },
  {
    title: "Poetry",
    subtitle: "For Primary Schools",
    picPath: require("../assets/images/POETRY.jpg"),
  },
  {
    title: "The Mourner Songs",
    subtitle: "A Collection of Poems",
    picPath: require("../assets/images/The-Mourners-Songs-e1598898740494.jpg"),
  },
];

const { width: screenWidth } = Dimensions.get("window");

const HomeCarousel = (props) => {
  const [entries, setEntries] = useState([]);
  const carouselRef = useRef(null);

  const goForward = () => {
    carouselRef.current.snapToNext();
  };

  // useEffect(() => {
  //   setEntries(CAROUSEL_BOOKS);
  // }, []);

  useEffect(() => {
    fetch("https://www.wabpreader.com.ng/api/books/GetBanners")
      .then((response) => response.json())
      .then((json) => {
        setEntries(json);
        // console.log(json);
      })
      .catch((error) => console.error(error));
  }, []);

  const renderItem = ({ item, index }, parallaxProps) => {
    return (
      <View style={styles.item}>
        <ParallaxImage
          source={{ uri: item.picPath }} //to use local path use source={item.picPath}
          containerStyle={styles.imageContainer}
          style={styles.image}
          parallaxFactor={0.4}
          {...parallaxProps}
        />
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* <TouchableOpacity onPress={goForward}>
        <Text>go to next slide</Text>
      </TouchableOpacity> */}
      <Carousel
        ref={carouselRef}
        sliderWidth={screenWidth}
        sliderHeight={screenWidth}
        itemWidth={screenWidth - 60}
        data={entries}
        renderItem={renderItem}
        hasParallaxImages={true}
      />
    </View>
  );
};

// return (
//     <View style={styles.exampleContainer}>
//         <Carousel
//             data={CAROUSEL_BOOKS}
//             renderItem={_renderItem}
//         parallax={true}
//         sliderWidth={sliderWidth}
//         itemWidth={itemWidth}
//         inactiveSlideScale={0.95}
//         inactiveSlideOpacity={0.65}
//         enableMomentum={true}
//         containerCustomStyle={styles.slider}
//         contentContainerCustomStyle={styles.sliderContentContainer}
//         activeAnimationType={'spring'}
//         activeAnimationOptions={{
//             friction: 4,
//             tension: 40
//         }}
//         />
//     </View>
// )

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    width: screenWidth - 60,
    height: screenWidth - 60,
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
    backgroundColor: "white",
    borderRadius: 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "contain",
  },
});

export default HomeCarousel;
