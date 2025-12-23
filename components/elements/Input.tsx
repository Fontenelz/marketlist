import { StyleSheet, TextInput, TextInputProps } from "react-native";

type InputProps = TextInputProps & {
  type?: string;
  placeholder?: string;
  value?: string | number;
};

export function Input({
  type = "text",
  placeholder = "Enter text",
  value,
  ...rest
}: InputProps) {
  return (
    <TextInput
      placeholder={placeholder}
      value={value?.toString()}
      style={[styles.input, rest.style]}
      keyboardType={type === "number" ? "decimal-pad" : "default"}
      placeholderTextColor="#9CA3AF"
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderRadius: 8,
    padding: 16,
    width: '100%',
    height: 48,
    fontSize: 16,
    color: '#FFF',
  },
});
