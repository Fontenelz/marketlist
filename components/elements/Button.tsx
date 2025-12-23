import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

type IButton = TouchableOpacityProps & {
  label: string;
};

export function Button({ label, ...rest }: IButton) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      {...rest}
      style={[styles.button, rest.style]}
    >
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    height: 48,
    width: '100%',
    borderRadius: 8,
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
