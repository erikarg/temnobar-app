import { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "@/context/AuthContext";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/Button";
import { deleteProduct } from "@/services/product.service";
import { API_BASE } from "@/services/api";
import type { Product } from "@/types/product";
import type { AppStackParamList } from "@/navigation/AppNavigator";

type Props = NativeStackScreenProps<AppStackParamList, "Home">;

export function HomeScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "ACTIVE" | "INACTIVE"
  >("ALL");

  const filters = useMemo(
    () => ({
      bar_id: user?.bar_id ?? undefined,
      status: statusFilter === "ALL" ? undefined : statusFilter,
      search: search || undefined,
    }),
    [user?.bar_id, statusFilter, search],
  );

  const { products, loading, meta, reload } = useProducts(filters);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  const handleEdit = (product: Product) => {
    navigation.navigate("EditProduct", { id: product.id });
  };

  const handleDelete = (product: Product) => {
    Alert.alert("Excluir produto", `Excluir "${product.descricao_produto}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          await deleteProduct(product.id);
          reload();
        },
      },
    ]);
  };

  const statusOptions = ["ALL", "ACTIVE", "INACTIVE"] as const;
  const statusLabels = { ALL: "Todos", ACTIVE: "Ativos", INACTIVE: "Inativos" };

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.cardWrapper}>
      <ProductCard
        product={item}
        apiUrl={API_BASE}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </View>
  );

  const ListHeader = (
    <View>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Produtos</Text>
          {!loading && (
            <Text style={styles.count}>
              {meta.total} {meta.total === 1 ? "produto" : "produtos"}
            </Text>
          )}
        </View>
        <Button onPress={() => navigation.navigate("NewProduct")}>
          + Novo produto
        </Button>
      </View>

      <TextInput
        placeholder="Buscar por descrição..."
        placeholderTextColor="#a1a1aa"
        value={search}
        onChangeText={setSearch}
        style={styles.searchInput}
      />

      <View style={styles.filterRow}>
        {statusOptions.map((opt) => (
          <TouchableOpacity
            key={opt}
            onPress={() => setStatusFilter(opt)}
            style={[
              styles.filterChip,
              statusFilter === opt && styles.filterChipActive,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                statusFilter === opt && styles.filterTextActive,
              ]}
            >
              {statusLabels[opt]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const ListEmpty = loading ? (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#6366f1" />
    </View>
  ) : (
    <View style={styles.emptyBox}>
      <Text style={styles.emptyTitle}>Nenhum produto encontrado</Text>
      <Text style={styles.emptySubtitle}>
        {search ? "Tente uma busca diferente" : "Cadastre seu primeiro produto"}
      </Text>
      {!search && (
        <Button
          onPress={() => navigation.navigate("NewProduct")}
          style={styles.emptyButton}
        >
          + Novo produto
        </Button>
      )}
    </View>
  );

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      renderItem={renderProduct}
      numColumns={2}
      columnWrapperStyle={styles.row}
      ListHeaderComponent={ListHeader}
      ListEmptyComponent={ListEmpty}
      contentContainerStyle={styles.list}
      style={styles.bg}
    />
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: "#fafafa",
  } as ViewStyle,
  list: {
    padding: 16,
    paddingBottom: 40,
  } as ViewStyle,
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  } as ViewStyle,
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e1e2e",
  } as TextStyle,
  count: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 2,
  } as TextStyle,
  searchInput: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: "#1e1e2e",
    marginBottom: 12,
  } as TextStyle,
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  } as ViewStyle,
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e5e5",
  } as ViewStyle,
  filterChipActive: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  } as ViewStyle,
  filterText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6b7280",
  } as TextStyle,
  filterTextActive: {
    color: "#ffffff",
  } as TextStyle,
  row: {
    gap: 12,
  } as ViewStyle,
  cardWrapper: {
    flex: 1,
    maxWidth: "50%",
  } as ViewStyle,
  center: {
    paddingVertical: 80,
    alignItems: "center",
  } as ViewStyle,
  emptyBox: {
    alignItems: "center",
    paddingVertical: 60,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderStyle: "dashed",
  } as ViewStyle,
  emptyTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1e1e2e",
  } as TextStyle,
  emptySubtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  } as TextStyle,
  emptyButton: {
    marginTop: 20,
  } as ViewStyle,
});
