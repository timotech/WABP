import React from "react";
import Navigator from "./shared/navigation/RootNavigator";
//import Navigator from "./auth/navigation/AuthStackNavigator";
//import Navigator from "./navigation/DrawerNavigation";
import { enableScreens } from "react-native-screens";
enableScreens();

export default function App() {
  return <Navigator />;
}
