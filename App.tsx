/**
 * App entry. Integrator-owned — see docs/BUILD-PLAN.md. Nobody else edits this.
 *
 * Holds the screen state machine and joins Person A's capture journey to
 * Person B's store: A awaits onSubmit, this file makes WORLD reload.
 */

import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { submitMoment } from './src/data/moments';
import WorldScreen from './src/screens/WorldScreen';
import { CreateMomentInput, Moment } from './src/types/moment';

type Screen = 'landing' | 'capture' | 'world';

export default function App() {
  // WORLD is the opening screen only while Person A's journey is in flight;
  // once LandingScreen lands this becomes 'landing'.
  const [screen, setScreen] = useState<Screen>('world');
  const [submitCount, setSubmitCount] = useState(0);

  /**
   * Person A awaits this and shows error.message on rejection. It stores the
   * moment and bumps the reload token; A keeps control of navigation.
   */
  const handleSubmit = useCallback(async (input: CreateMomentInput): Promise<Moment> => {
    const moment = await submitMoment(input);
    setSubmitCount((count) => count + 1);
    return moment;
  }, []);

  if (screen === 'world') {
    return (
      <>
        <WorldScreen reloadToken={submitCount} onLookUp={() => setScreen('landing')} />
        <StatusBar style="auto" />
      </>
    );
  }

  // ---------------------------------------------------------------------
  // Seam for Person A. When the two screens land, this block becomes:
  //
  //   if (screen === 'landing') {
  //     return <LandingScreen onStart={() => setScreen('capture')} />;
  //   }
  //   return (
  //     <CaptureScreen
  //       onSubmit={handleSubmit}
  //       onDone={() => setScreen('world')}
  //       onCancel={() => setScreen('landing')}
  //     />
  //   );
  // ---------------------------------------------------------------------
  void handleSubmit; // wired into CaptureScreen the moment it lands
  return <AwaitingScreen name={screen} onBack={() => setScreen('world')} />;
}

/** Placeholder so the state machine is walkable before A's screens exist. */
function AwaitingScreen({ name, onBack }: { name: Screen; onBack: () => void }) {
  const expected = name === 'landing' ? 'LandingScreen' : 'CaptureScreen';

  return (
    <View style={styles.pending}>
      <Text style={styles.pendingLabel}>INTEGRATION SEAM</Text>
      <Text style={styles.pendingTitle}>{expected} 尚未交件</Text>
      <Text style={styles.pendingBody}>
        Person A 的畫面會接在這裡。這不是產品 UI，交件後整個區塊會被換掉。
      </Text>
      <Pressable style={styles.pendingButton} onPress={onBack}>
        <Text style={styles.pendingButtonLabel}>回到 WORLD</Text>
      </Pressable>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  pending: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 36,
    backgroundColor: '#F6F7F9',
  },
  pendingLabel: {
    fontSize: 10,
    letterSpacing: 1.5,
    fontWeight: '600',
    color: '#8A90A0',
  },
  pendingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#14161C',
  },
  pendingBody: {
    fontSize: 14,
    lineHeight: 20,
    color: '#5A6170',
    textAlign: 'center',
  },
  pendingButton: {
    marginTop: 10,
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 999,
    backgroundColor: '#14161C',
  },
  pendingButtonLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#F6F7F9',
  },
});
