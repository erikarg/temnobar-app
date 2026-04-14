import {
  NavigationContainer,
  type DefaultTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  type ViewStyle,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import { LoginScreen } from "@/screens/LoginScreen";
import { RegisterScreen } from "@/screens/RegisterScreen";
import { SelectBarScreen } from "@/screens/SelectBarScreen";
import { HomeScreen } from "@/screens/HomeScreen";
import { NewProductScreen } from "@/screens/NewProductScreen";
import { EditProductScreen } from "@/screens/EditProductScreen";

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AppStackParamList = {
  SelectBar: undefined;
  Home: undefined;
  NewProduct: undefined;
  EditProduct: { id: string };
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();

const theme: typeof DefaultTheme = {
  ...({} as typeof DefaultTheme),
  dark: false,
  colors: {
    primary: "#6366f1",
    background: "#fafafa",
    card: "#ffffff",
    text: "#1e1e2e",
    border: "#e5e5e5",
    notification: "#ef4444",
  },
  fonts: {
    regular: { fontFamily: "System", fontWeight: "400" },
    medium: { fontFamily: "System", fontWeight: "500" },
    bold: { fontFamily: "System", fontWeight: "700" },
    heavy: { fontFamily: "System", fontWeight: "900" },
  },
};

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

function AppNavigator() {
  const { user, barName, logout } = useAuth();

  const needsBar = !user?.bar_id;

  return (
    <AppStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#ffffff" },
        headerTintColor: "#1e1e2e",
        headerShadowVisible: true,
        headerTitleStyle: { fontWeight: "600", fontSize: 16 },
      }}
    >
      {needsBar ? (
        <AppStack.Screen
          name="SelectBar"
          component={SelectBarScreen}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <AppStack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: barName ?? "TemNoBar",
              headerRight: () => (
                <HeaderLogout onPress={logout} />
              ),
            }}
          />
          <AppStack.Screen
            name="NewProduct"
            component={NewProductScreen}
            options={{ title: "Novo produto" }}
          />
          <AppStack.Screen
            name="EditProduct"
            component={EditProductScreen}
            options={{ title: "Editar produto" }}
          />
        </>
      )}
    </AppStack.Navigator>
  );
}

function HeaderLogout({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <HeaderLogoutText />
    </TouchableOpacity>
  );
}

function HeaderLogoutText() {
  return (
    <Text style={{ color: "#6b7280", fontSize: 14, fontWeight: "500" }}>
      Sair
    </Text>
  );
}

export function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={theme}>
      {user ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fafafa",
  } as ViewStyle,
});
