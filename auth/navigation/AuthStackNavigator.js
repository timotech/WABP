import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
//import WelcomeScreen from "../screens/WelcomeScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import ResetScreen from "../screens/ResetScreen";

const AuthStack = createStackNavigator(
  {
    // Welcome: { screen: WelcomeScreen },
    Login: { screen: LoginScreen },
    Register: { screen: RegisterScreen },
    ForgotPassword: { screen: ForgotPasswordScreen },
    Reset: { screen: ResetScreen },
  },
  {
    initialRouteName: "Login",
    headerMode: "none",
    navigationOptions: () => ({
      headerTitleStyle: {
        fontWeight: "normal",
      },
    }),
  }
);

export default createAppContainer(AuthStack);
