import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
  type ImageStyle,
} from "react-native";
import type { Product } from "@/types/product";

type Props = {
  product: Product;
  apiUrl: string;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
};

export function ProductCard({ product, apiUrl, onEdit, onDelete }: Props) {
  const thumbSrc = product.thumb_produto
    ? product.thumb_produto.startsWith("http")
      ? product.thumb_produto
      : `${apiUrl}${product.thumb_produto}`
    : null;
  const isActive = product.status === "ACTIVE";

  return (
    <View style={[styles.card, !isActive && styles.cardInactive]}>
      <View style={styles.imageContainer}>
        {thumbSrc ? (
          <Image source={{ uri: thumbSrc }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderIcon}>&#128247;</Text>
          </View>
        )}

        {!isActive && (
          <View style={styles.inactiveOverlay}>
            <View style={styles.inactiveBadge}>
              <Text style={styles.inactiveText}>Inativo</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.info}>
          <View style={styles.textContainer}>
            <Text style={styles.code}>{product.codigo_produto}</Text>
            <Text style={styles.description} numberOfLines={2}>
              {product.descricao_produto}
            </Text>
          </View>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: isActive ? "#22c55e" : "#d1d5db" },
            ]}
          />
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => onEdit(product)}
            style={styles.actionButton}
          >
            <Text style={styles.editText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onDelete(product)}
            style={styles.actionButton}
          >
            <Text style={styles.deleteText}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    overflow: "hidden",
    marginBottom: 12,
  } as ViewStyle,
  cardInactive: {
    opacity: 0.7,
  } as ViewStyle,
  imageContainer: {
    aspectRatio: 4 / 3,
    backgroundColor: "#f5f5f5",
  } as ViewStyle,
  image: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
    resizeMode: "cover",
  } as ImageStyle,
  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,
  placeholderIcon: {
    fontSize: 32,
    opacity: 0.3,
  } as TextStyle,
  inactiveOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.5)",
  } as ViewStyle,
  inactiveBadge: {
    backgroundColor: "rgba(30,30,46,0.7)",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  } as ViewStyle,
  inactiveText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "500",
  } as TextStyle,
  content: {
    padding: 12,
  } as ViewStyle,
  info: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  } as ViewStyle,
  textContainer: {
    flex: 1,
  } as ViewStyle,
  code: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6b7280",
  } as TextStyle,
  description: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: "500",
    color: "#1e1e2e",
    lineHeight: 18,
    height: 36,
  } as TextStyle,
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 4,
  } as ViewStyle,
  actions: {
    flexDirection: "row",
    gap: 16,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  } as ViewStyle,
  actionButton: {
    paddingVertical: 4,
  } as ViewStyle,
  editText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6366f1",
  } as TextStyle,
  deleteText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#ef4444",
  } as TextStyle,
});
