import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
} from "react-native";
import { getBars, createBar } from "@/services/bar.service";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import type { Bar } from "@/types/bar";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function SelectBarScreen() {
  const { selectBar } = useAuth();
  const [bars, setBars] = useState<Bar[]>([]);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newBarName, setNewBarName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getBars()
      .then((data) => setBars(data))
      .catch(() => setError("Erro ao carregar bares"))
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = async (barId: string) => {
    setSelecting(barId);
    setError("");
    try {
      await selectBar(barId);
    } catch {
      setError("Erro ao selecionar bar");
      setSelecting(null);
    }
  };

  const handleCreate = async () => {
    if (!newBarName.trim()) return;

    setCreating(true);
    setError("");
    try {
      const bar = await createBar({
        nome: newBarName.trim(),
        slug: slugify(newBarName),
      });
      await selectBar(bar.id);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Erro ao criar bar";
      setError(message);
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.logoBox}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>T</Text>
        </View>
        <Text style={styles.title}>Selecione um bar</Text>
        <Text style={styles.subtitle}>
          Escolha um bar existente ou crie um novo
        </Text>
      </View>

      {error !== "" && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {bars.map((bar) => (
        <TouchableOpacity
          key={bar.id}
          onPress={() => handleSelect(bar.id)}
          disabled={selecting !== null}
          style={styles.barItem}
        >
          <View>
            <Text style={styles.barName}>{bar.nome}</Text>
            <Text style={styles.barSlug}>{bar.slug}</Text>
          </View>
          {selecting === bar.id ? (
            <ActivityIndicator size="small" color="#6366f1" />
          ) : (
            <Text style={styles.chevron}>›</Text>
          )}
        </TouchableOpacity>
      ))}

      {bars.length === 0 && !showCreate && (
        <Text style={styles.emptyText}>
          Nenhum bar disponivel. Crie o primeiro!
        </Text>
      )}

      {bars.length > 0 && !showCreate && (
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>ou</Text>
          <View style={styles.dividerLine} />
        </View>
      )}

      {!showCreate ? (
        <Button
          variant="secondary"
          onPress={() => setShowCreate(true)}
        >
          + Criar novo bar
        </Button>
      ) : (
        <View style={styles.createCard}>
          <Text style={styles.createTitle}>Novo bar</Text>
          <Input
            label="Nome do bar"
            placeholder="Ex: Boteco do Ze"
            value={newBarName}
            onChangeText={setNewBarName}
          />
          {newBarName !== "" && (
            <Text style={styles.slugPreview}>
              Slug:{" "}
              <Text style={styles.slugValue}>{slugify(newBarName)}</Text>
            </Text>
          )}
          <View style={styles.createButtons}>
            <Button
              variant="secondary"
              onPress={() => {
                setShowCreate(false);
                setNewBarName("");
              }}
              style={styles.flex1}
            >
              Cancelar
            </Button>
            <Button
              loading={creating}
              onPress={handleCreate}
              style={styles.flex1}
            >
              Criar e selecionar
            </Button>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fafafa",
  } as ViewStyle,
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 60,
    backgroundColor: "#fafafa",
  } as ViewStyle,
  logoBox: {
    alignItems: "center",
    marginBottom: 32,
  } as ViewStyle,
  logo: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#6366f1",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  } as ViewStyle,
  logoText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
  } as TextStyle,
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1e1e2e",
  } as TextStyle,
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
    textAlign: "center",
  } as TextStyle,
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
  barItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 8,
  } as ViewStyle,
  barName: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1e1e2e",
  } as TextStyle,
  barSlug: {
    fontSize: 12,
    color: "#a1a1aa",
    marginTop: 2,
  } as TextStyle,
  chevron: {
    fontSize: 22,
    color: "#a1a1aa",
  } as TextStyle,
  emptyText: {
    textAlign: "center",
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 24,
  } as TextStyle,
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    gap: 12,
  } as ViewStyle,
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e5e5e5",
  } as ViewStyle,
  dividerText: {
    fontSize: 12,
    color: "#a1a1aa",
  } as TextStyle,
  createCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    padding: 20,
    marginTop: 12,
  } as ViewStyle,
  createTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e1e2e",
    marginBottom: 12,
  } as TextStyle,
  slugPreview: {
    fontSize: 12,
    color: "#a1a1aa",
    marginTop: 8,
  } as TextStyle,
  slugValue: {
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    color: "#1e1e2e",
    backgroundColor: "#f5f5f5",
  } as TextStyle,
  createButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  } as ViewStyle,
  flex1: {
    flex: 1,
  } as ViewStyle,
});
