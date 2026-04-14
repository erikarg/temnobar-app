import { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAuth } from "@/context/AuthContext";
import { ProductForm } from "@/components/ProductForm";
import { getProduct } from "@/services/product.service";
import type { Product } from "@/types/product";
import type { AppStackParamList } from "@/navigation/AppNavigator";

type Props = NativeStackScreenProps<AppStackParamList, "EditProduct">;

export function EditProductScreen({ route }: Props) {
  const { id } = route.params;
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getProduct(id)
      .then(setProduct)
      .catch(() => setError("Produto não encontrado"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (!user?.bar_id) return null;

  if (error || !product) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error || "Produto não encontrado"}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ProductForm product={product} barId={user.bar_id} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  } as ViewStyle,
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fafafa",
  } as ViewStyle,
  error: {
    color: "#ef4444",
    fontSize: 14,
  } as TextStyle,
});
