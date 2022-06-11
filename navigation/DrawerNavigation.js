import { createStackNavigator } from "react-navigation-stack";
import { createDrawerNavigator } from "react-navigation-drawer";
import { createAppContainer } from "react-navigation";
import { AboutScreen, DetailScreen, HomeScreen } from "../screens";

import ContactScreen from "../screens/ContactScreen";
import CategoriesScreen from "../screens/CategoriesScreen";
import ListingScreen from "../screens/ListingScreen";
import BookmarksScreen from "../screens/BookmarksScreen";
import CartScreen from "../screens/CartScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import CollectionScreen from "../screens/CollectionScreen";
import SearchScreen from "../screens/SearchScreen";
import EpubScreen from "../screens/EpubScreen";
import ViewScreen from "../screens/ViewScreen";
import ReaderScreen from "../screens/ReaderScreen";

import { Platform } from "react-native";
import { Colors, Layout } from "../shared";
import DrawerMenu from "./DrawerMenu";

const {
  window: { width },
} = Layout;

const screens = {
  Home: { screen: HomeScreen },
  Categories: { screen: CategoriesScreen },
  Listing: { screen: ListingScreen },
  Detail: { screen: DetailScreen },
  About: { screen: AboutScreen },
  Contact: { screen: ContactScreen },
  Bookmarks: { screen: BookmarksScreen },
  Collections: { screen: CollectionScreen },
  Cart: { screen: CartScreen },
  Checkout: { screen: CheckoutScreen },
  Search: { screen: SearchScreen },
  Epub: { screen: EpubScreen },
  Views: { screen: ViewScreen },
  Readers: { screen: ReaderScreen },
};

const presets = {
  initialRouteName: "Home",
  headerMode: "screen",
  defaultNavigationOptions: {
    headerStyle: {
      ...Platform.select({
        ios: {
          height: 50,
        },
      }),
      backgroundColor: Colors.snow,
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        ...Platform.select({
          ios: {
            height: 10,
          },
        }),
      },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    headerTitleStyle: {
      fontWeight: "400",
      color: Colors.congoBrown,
    },
  },
};

const MainStack = createStackNavigator(screens, presets);

const DrawerStack = createDrawerNavigator(
  {
    Main: MainStack,
  },
  {
    contentComponent: DrawerMenu,
    drawerWidth: width,
    drawerBackgroundColor: "transparent",
  }
);

export default createAppContainer(DrawerStack);
