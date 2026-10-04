import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  secondary?: boolean;
};

/** Buttons used only by Person A's contribution screens. */
export function CaptureButton({ label, onPress, disabled, loading, secondary }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled || !!loading, busy: !!loading }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        secondary && styles.secondary,
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      {loading && <ActivityIndicator color={secondary ? '#233E37' : '#FFFFFF'} />}
      <Text style={[styles.label, secondary && styles.secondaryLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: 54, paddingVertical: 15, paddingHorizontal: 22, borderRadius: 18,
    backgroundColor: '#233E37', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  secondary: { backgroundColor: '#E9EDE4' },
  label: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', textAlign: 'center' },
  secondaryLabel: { color: '#233E37' },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.75 },
});
