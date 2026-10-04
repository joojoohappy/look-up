/**
 * App entry. Integrator-owned — see docs/BUILD-PLAN.md. Nobody else edits this.
 *
 * Holds the screen state machine and joins Person A's capture journey to
 * Person B's store: A awaits onSubmit, this file makes WORLD reload.
 */

import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { BackHandler } from 'react-native';

import { submitMoment } from './src/data/moments';
import CaptureScreen from './src/screens/CaptureScreen';
import LandingScreen from './src/screens/LandingScreen';
import WorldScreen from './src/screens/WorldScreen';
import { CreateMomentInput, Moment } from './src/types/moment';

type Screen = 'landing' | 'capture' | 'world';

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing');
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

  // The demo device is Android, where the back gesture would otherwise leave
  // the app and wipe the in-memory store mid-demo. Landing is the root: back
  // from there exits, as Android users expect.
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (screen === 'landing') {
        return false;
      }
      // Capture and WORLD both step back to landing, which also gives WORLD a
      // route back into the journey for repeat demo runs.
      setScreen('landing');
      return true;
    });
    return () => subscription.remove();
  }, [screen]);

  return (
    <>
      {screen === 'landing' ? <LandingScreen onStart={() => setScreen('capture')} /> : null}
      {screen === 'capture' ? (
        <CaptureScreen
          onSubmit={handleSubmit}
          onDone={() => setScreen('world')}
          onCancel={() => setScreen('landing')}
        />
      ) : null}
      {screen === 'world' ? (
        <WorldScreen reloadToken={submitCount} onLookUp={() => setScreen('landing')} />
      ) : null}
      <StatusBar style="auto" />
    </>
  );
}
