import { View, StyleSheet, type ViewStyle } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { ProductForm } from "@/components/ProductForm";

export function NewProductScreen() {
  const { user } = useAuth();

  if (!user?.bar_id) return null;

  return (
    <View style={styles.container}>
      <ProductForm barId={user.bar_id} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  } as ViewStyle,
});
