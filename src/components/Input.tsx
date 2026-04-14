import { forwardRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  type TextInputProps,
  type ViewStyle,
  type TextStyle,
} from "react-native";

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
};

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, style, ...props }, ref) => {
    return (
      <View>
        {label && <Text style={styles.label}>{label}</Text>}
        <TextInput
          ref={ref}
          placeholderTextColor="#a1a1aa"
          style={[
            styles.input,
            error ? styles.inputError : styles.inputNormal,
            style,
          ]}
          {...props}
        />
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
    );
  },
);

Input.displayName = "Input";

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1e1e2e",
    marginBottom: 6,
  } as TextStyle,
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#1e1e2e",
    backgroundColor: "#ffffff",
  } as TextStyle,
  inputNormal: {
    borderColor: "#e5e5e5",
  } as ViewStyle,
  inputError: {
    borderColor: "#ef4444",
  } as ViewStyle,
  error: {
    marginTop: 4,
    fontSize: 12,
    color: "#ef4444",
  } as TextStyle,
});
