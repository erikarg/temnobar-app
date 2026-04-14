import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  type ViewStyle,
  type TextStyle,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import type { AuthStackParamList } from "@/navigation/AppNavigator";

const schema = z.object({
  name: z.string().min(2, "Nome obrigatorio"),
  email: z.string().email("Email invalido"),
  password: z.string().min(6, "Minimo 6 caracteres"),
});

type FormData = z.infer<typeof schema>;

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

export function RegisterScreen({ navigation }: Props) {
  const { register } = useAuth();
  const [error, setError] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setError("");
    try {
      await register(data.name, data.email, data.password);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Erro ao criar conta";
      setError(message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoBox}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>T</Text>
          </View>
          <Text style={styles.title}>Criar sua conta</Text>
          <Text style={styles.subtitle}>
            Comece a gerenciar seu bar agora
          </Text>
        </View>

        <View style={styles.card}>
          {error !== "" && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Nome"
                placeholder="Seu nome"
                autoComplete="name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.name?.message}
              />
            )}
          />

          <View style={styles.spacer} />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Email"
                placeholder="seu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.email?.message}
              />
            )}
          />

          <View style={styles.spacer} />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Senha"
                placeholder="Minimo 6 caracteres"
                secureTextEntry
                autoComplete="password-new"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
              />
            )}
          />

          <View style={styles.spacerLg} />

          <Button loading={isSubmitting} onPress={handleSubmit(onSubmit)}>
            Criar conta
          </Button>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Ja tem conta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.link}>Fazer login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#fafafa" } as ViewStyle,
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
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
  } as TextStyle,
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    padding: 20,
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
  spacer: { height: 16 } as ViewStyle,
  spacerLg: { height: 24 } as ViewStyle,
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  } as ViewStyle,
  footerText: {
    fontSize: 14,
    color: "#6b7280",
  } as TextStyle,
  link: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6366f1",
  } as TextStyle,
});
