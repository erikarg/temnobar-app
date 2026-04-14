import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
} from "react-native";

type Variant = "primary" | "secondary" | "danger" | "ghost";

type ButtonProps = {
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  children: string;
  style?: ViewStyle;
};

const bgColors: Record<Variant, string> = {
  primary: "#6366f1",
  secondary: "#ffffff",
  danger: "#ef4444",
  ghost: "transparent",
};

const textColors: Record<Variant, string> = {
  primary: "#ffffff",
  secondary: "#1e1e2e",
  danger: "#ffffff",
  ghost: "#6b7280",
};

const borderColors: Record<Variant, string | undefined> = {
  primary: undefined,
  secondary: "#e5e5e5",
  danger: undefined,
  ghost: undefined,
};

export function Button({
  variant = "primary",
  loading,
  disabled,
  onPress,
  children,
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={[
        styles.base,
        {
          backgroundColor: bgColors[variant],
          borderColor: borderColors[variant] ?? "transparent",
          borderWidth: variant === "secondary" ? 1 : 0,
          opacity: isDisabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={textColors[variant]}
          style={styles.spinner}
        />
      )}
      <Text style={[styles.text, { color: textColors[variant] }]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  } as ViewStyle,
  text: {
    fontSize: 14,
    fontWeight: "600",
  } as TextStyle,
  spinner: {
    marginRight: 8,
  } as ViewStyle,
});
