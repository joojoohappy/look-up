import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CaptureButton } from '../components/capture/CaptureButton';

export type LandingScreenProps = { onStart: () => void };

export function LandingScreen({ onStart }: LandingScreenProps) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.brand}>LOOK UP</Text>
        <View style={styles.window} accessible={false} importantForAccessibility="no-hide-descendants">
          <View style={styles.sun} />
          <View style={styles.cloud} />
          <Text style={styles.arrow}>↑</Text>
        </View>
        <Text accessibilityRole="header" style={styles.title}>A little more here.{'\n'}A little less elsewhere.</Text>
        <Text style={styles.description}>Every day looks the same{ '\n' }until you start looking.</Text>
        <View style={styles.action}>
          <CaptureButton label="Look up ↑" onPress={onStart} />
          <Text style={styles.footer}>Notice something. Leave a moment.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default LandingScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F7F5EF' },
  content: { flexGrow: 1, padding: 28, paddingBottom: 32, gap: 24, maxWidth: 560, width: '100%', alignSelf: 'center' },
  brand: { color: '#233E37', fontSize: 15, fontWeight: '700', letterSpacing: 4 },
  window: { alignSelf: 'center', width: '78%', maxWidth: 280, aspectRatio: 0.95, marginVertical: 8,
    backgroundColor: '#D7E8E6', borderTopLeftRadius: 160, borderTopRightRadius: 160,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  sun: { position: 'absolute', top: 38, right: 42, width: 55, height: 55, borderRadius: 28, backgroundColor: '#F5D78E' },
  cloud: { position: 'absolute', bottom: -65, left: -40, width: 310, height: 150, borderRadius: 100, backgroundColor: '#EEF1E7' },
  arrow: { color: '#385D52', fontSize: 90, fontWeight: '200' },
  title: { color: '#233E37', fontSize: 32, lineHeight: 39, fontWeight: '500', letterSpacing: -1 },
  description: { color: '#5B6C64', fontSize: 17, lineHeight: 26 },
  action: { marginTop: 'auto', gap: 14, paddingTop: 12 },
  footer: { textAlign: 'center', color: '#5B6C64', fontSize: 13, lineHeight: 20 },
});
