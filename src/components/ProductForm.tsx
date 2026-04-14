import { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Alert,
  type ViewStyle,
  type TextStyle,
  type ImageStyle,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { uploadImage } from "@/services/upload.service";
import { createProduct, updateProduct } from "@/services/product.service";
import { API_BASE } from "@/services/api";
import type { Product } from "@/types/product";

const schema = z.object({
  codigo_produto: z.string().min(1, "Codigo obrigatorio"),
  descricao_produto: z.string().min(1, "Descricao obrigatoria"),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

type FormData = z.infer<typeof schema>;

type Props = {
  product?: Product;
  barId: string;
};

export function ProductForm({ product, barId }: Props) {
  const navigation = useNavigation();
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(product?.foto_produto ?? "");
  const [thumbUrl, setThumbUrl] = useState(product?.thumb_produto ?? "");
  const [preview, setPreview] = useState<string | null>(
    product?.thumb_produto
      ? product.thumb_produto.startsWith("http")
        ? product.thumb_produto
        : `${API_BASE}${product.thumb_produto}`
      : null,
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      codigo_produto: product?.codigo_produto ?? "",
      descricao_produto: product?.descricao_produto ?? "",
      status: product?.status ?? "ACTIVE",
    },
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
      allowsEditing: true,
    });

    if (result.canceled || !result.assets[0]) return;

    const uri = result.assets[0].uri;
    setPreview(uri);
    setUploading(true);
    setError("");

    try {
      const uploaded = await uploadImage(uri);
      setImageUrl(uploaded.url);
      setThumbUrl(uploaded.thumb_url);
    } catch {
      setError("Erro ao enviar imagem");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    setError("");
    try {
      if (product) {
        await updateProduct(product.id, {
          ...data,
          foto_produto: imageUrl || null,
          thumb_produto: thumbUrl || null,
        });
      } else {
        await createProduct({
          ...data,
          bar_id: barId,
          foto_produto: imageUrl || null,
          thumb_produto: thumbUrl || null,
        });
      }
      navigation.goBack();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Erro ao salvar produto";
      setError(message);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      {error !== "" && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <Text style={styles.label}>Foto do produto</Text>
      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        {preview ? (
          <Image source={{ uri: preview }} style={styles.previewImage} />
        ) : (
          <View style={styles.placeholderBox}>
            <Text style={styles.placeholderEmoji}>&#128247;</Text>
            <Text style={styles.placeholderText}>Enviar foto</Text>
          </View>
        )}
        {uploading && (
          <View style={styles.uploadingOverlay}>
            <ActivityIndicator size="large" color="#6366f1" />
          </View>
        )}
      </TouchableOpacity>

      <Controller
        control={control}
        name="codigo_produto"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Codigo do produto"
            placeholder="Ex: CERV001"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.codigo_produto?.message}
          />
        )}
      />

      <View style={styles.spacer} />

      <Controller
        control={control}
        name="descricao_produto"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Descricao"
            placeholder="Ex: Cerveja IPA 500ml"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.descricao_produto?.message}
          />
        )}
      />

      <View style={styles.spacer} />

      <Text style={styles.label}>Status</Text>
      <Controller
        control={control}
        name="status"
        render={({ field: { onChange, value } }) => (
          <View style={styles.statusRow}>
            <TouchableOpacity
              onPress={() => onChange("ACTIVE")}
              style={[
                styles.statusOption,
                value === "ACTIVE" && styles.statusActive,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  value === "ACTIVE" && styles.statusTextSelected,
                ]}
              >
                Ativo
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onChange("INACTIVE")}
              style={[
                styles.statusOption,
                value === "INACTIVE" && styles.statusInactive,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  value === "INACTIVE" && styles.statusTextSelected,
                ]}
              >
                Inativo
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={styles.buttonRow}>
        <Button
          variant="secondary"
          onPress={() => navigation.goBack()}
          style={styles.flex1}
        >
          Cancelar
        </Button>
        <Button
          loading={isSubmitting || uploading}
          onPress={handleSubmit(onSubmit)}
          style={styles.flex1}
        >
          {product ? "Salvar alteracoes" : "Criar produto"}
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  } as ViewStyle,
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  } as ViewStyle,
  errorBox: {
    backgroundColor: "#fef2f2",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  } as ViewStyle,
  errorText: {
    color: "#ef4444",
    fontSize: 14,
  } as TextStyle,
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1e1e2e",
    marginBottom: 8,
  } as TextStyle,
  imagePicker: {
    width: 160,
    height: 160,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#e5e5e5",
    backgroundColor: "#f5f5f5",
    overflow: "hidden",
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  } as ImageStyle,
  placeholderBox: {
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,
  placeholderEmoji: {
    fontSize: 28,
    marginBottom: 4,
    opacity: 0.4,
  } as TextStyle,
  placeholderText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#a1a1aa",
  } as TextStyle,
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.7)",
  } as ViewStyle,
  spacer: {
    height: 16,
  } as ViewStyle,
  statusRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  } as ViewStyle,
  statusOption: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#ffffff",
  } as ViewStyle,
  statusActive: {
    borderColor: "#22c55e",
    backgroundColor: "#f0fdf4",
  } as ViewStyle,
  statusInactive: {
    borderColor: "#ef4444",
    backgroundColor: "#fef2f2",
  } as ViewStyle,
  statusText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  } as TextStyle,
  statusTextSelected: {
    color: "#1e1e2e",
  } as TextStyle,
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  } as ViewStyle,
  flex1: {
    flex: 1,
  } as ViewStyle,
});
