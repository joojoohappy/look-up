import { useRef, useState } from 'react';
import {
  Image, Keyboard, KeyboardAvoidingView, Linking, Platform, Pressable,
  SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { NOTE_MAX_LENGTH, type CreateMomentInput, type Moment, type Visibility } from '../types/moment';
import { CaptureButton } from '../components/capture/CaptureButton';

export type CaptureScreenProps = {
  onCancel: () => void;
  onSubmit: (input: CreateMomentInput) => Promise<Moment>;
  /** Integrator: switch to WORLD and refresh its public query after this callback. */
  onDone: () => void;
};

export function CaptureScreen({ onCancel, onSubmit, onDone }: CaptureScreenProps) {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [visibility, setVisibility] = useState<Visibility>('public');
  const [picking, setPicking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsSettings, setNeedsSettings] = useState(false);
  const [previewFailed, setPreviewFailed] = useState(false);
  const [saved, setSaved] = useState<Moment | null>(null);
  // State alone does not block two taps before React renders the disabled button.
  const operationInFlight = useRef(false);
  const busy = picking || submitting;

  async function choosePhoto(source: 'camera' | 'gallery') {
    if (operationInFlight.current) return;
    operationInFlight.current = true;
    setPicking(true);
    setError(null);
    setNeedsSettings(false);
    try {
      if (source === 'camera') {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          setError('Camera access is off. You can choose a photo instead, or allow camera access in Settings.');
          setNeedsSettings(!permission.canAskAgain);
          return;
        }
      }
      // The system image-only library picker does not need full library access.
      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ['images'], allowsEditing: false, allowsMultipleSelection: false, quality: 1,
      };
      const result = source === 'camera'
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);
      if (result.canceled) return;
      const uri = result.assets[0]?.uri;
      if (!uri) throw new Error('That photo could not be opened. Please choose another.');
      setImageUri(uri);
      setPreviewFailed(false);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not open your photos. Please try again.');
    } finally {
      operationInFlight.current = false;
      setPicking(false);
    }
  }

  function openWorld() {
    try {
      onDone();
    } catch {
      // A navigation failure must never trigger another store submission.
      setError('Your moment was saved, but WORLD could not open. Please try opening WORLD again.');
    }
  }

  async function submit() {
    if (operationInFlight.current || saved) return;
    if (!imageUri || previewFailed) {
      setError('Choose a photo you can preview before leaving your moment.');
      return;
    }
    if (note.length > NOTE_MAX_LENGTH) {
      setError(`Keep your note to ${NOTE_MAX_LENGTH} characters or fewer.`);
      return;
    }
    operationInFlight.current = true;
    setSubmitting(true);
    setError(null);
    Keyboard.dismiss();
    let moment: Moment;
    try {
      moment = await onSubmit({ imageUri, note, visibility });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Your moment was not saved. Please try again.');
      operationInFlight.current = false;
      setSubmitting(false);
      return;
    }
    setSaved(moment);
    setSubmitting(false);
    if (moment.visibility === 'public') openWorld();
  }

  if (saved) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.success}>
          <Text style={styles.eyebrow}>LOOK UP</Text>
          <Image source={{ uri: saved.imageUri }} style={styles.preview} resizeMode="contain" accessibilityLabel="Your saved moment" />
          <Text accessibilityRole="header" style={styles.title}>
            {saved.visibility === 'public' ? 'Your window is open.' : 'Saved for you.'}
          </Text>
          <Text style={styles.body}>{saved.visibility === 'private'
            ? 'This moment stays out of WORLD. It is kept until this app session ends.'
            : 'Your moment is ready in WORLD.'}</Text>
          {error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
          <CaptureButton label={saved.visibility === 'public' ? 'Open WORLD →' : 'Back to Look Up'}
            onPress={saved.visibility === 'public' ? openWorld : onCancel} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentContainerStyle={styles.content}>
          <Pressable accessibilityRole="button" accessibilityLabel="Back to Look Up" disabled={busy}
            accessibilityState={{ disabled: busy }} onPress={onCancel} style={styles.back}>
            <Text style={[styles.backText, busy && styles.muted]}>← Look Up</Text>
          </Pressable>
          <Text style={styles.eyebrow}>A MOMENT FROM YOUR DAY</Text>
          <Text accessibilityRole="header" style={styles.title}>What did you notice?</Text>
          {imageUri ? (
            <View style={styles.previewFrame}>
              <Image key={imageUri} source={{ uri: imageUri }} style={styles.preview} resizeMode="contain"
                accessibilityLabel="Selected photo preview" onError={() => setPreviewFailed(true)} />
              {previewFailed && <Text accessibilityRole="alert" style={styles.error}>This photo could not be previewed. Please choose another.</Text>}
            </View>
          ) : (
            <View style={styles.emptyPhoto}>
              <Text style={styles.photoSymbol}>↑</Text>
              <Text style={styles.body}>A small piece of the world, as you see it.</Text>
            </View>
          )}
          <View style={styles.photoActions}>
            <CaptureButton label={imageUri ? 'Take another photo' : 'Take a photo'} secondary disabled={busy} onPress={() => void choosePhoto('camera')} />
            <CaptureButton label="Choose today’s photo" secondary disabled={busy} onPress={() => void choosePhoto('gallery')} />
          </View>
          {picking && <Text accessibilityLiveRegion="polite" style={styles.body}>Opening your photo…</Text>}
          <Text style={styles.hint}>For WORLD, choose a photo taken today.</Text>
          <View style={styles.noteHeader}>
            <Text style={styles.label}>Anything you want to leave here?</Text>
            <Text style={styles.counter} accessibilityLabel={`${note.length} of ${NOTE_MAX_LENGTH} characters`}>{note.length}/{NOTE_MAX_LENGTH}</Text>
          </View>
          <TextInput accessibilityLabel="Optional note" placeholder="A few words, or none at all." placeholderTextColor="#6A756E"
            style={styles.input} multiline editable={!busy} maxLength={NOTE_MAX_LENGTH} value={note}
            onChangeText={(text) => setNote(text.slice(0, NOTE_MAX_LENGTH))} textAlignVertical="top" />
          <Text style={styles.label}>Where would you like to leave it?</Text>
          {([
            ['public', 'Leave this in the world', 'Share this moment in WORLD.'],
            ['private', 'Keep this for myself', 'Only for this app session.'],
          ] as const).map(([value, title, description]) => (
            <Pressable key={value} accessibilityRole="radio" accessibilityLabel={`${title}. ${description}`}
              accessibilityState={{ checked: visibility === value, disabled: busy }} disabled={busy}
              onPress={() => setVisibility(value)} style={[styles.visibility, visibility === value && styles.selected]}>
              <Text style={styles.radio}>{visibility === value ? '●' : '○'}</Text>
              <View style={styles.flex}><Text style={styles.label}>{title}</Text><Text style={styles.hint}>{description}</Text></View>
            </Pressable>
          ))}
          {error && <Text accessibilityRole="alert" accessibilityLiveRegion="assertive" style={styles.error}>{error}</Text>}
          {needsSettings && <CaptureButton label="Open Settings" secondary disabled={busy}
            onPress={() => { void Linking.openSettings().catch(() => setError('Please open Settings on your phone and allow camera access for Expo Go.')); }} />}
          <CaptureButton label={submitting ? 'Leaving your moment…' : visibility === 'public' ? 'Leave in WORLD →' : 'Save for myself'}
            loading={submitting} disabled={busy || !imageUri || previewFailed} onPress={() => void submit()} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default CaptureScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F7F5EF' },
  flex: { flex: 1 },
  content: { paddingHorizontal: 24, paddingBottom: 40, gap: 14, maxWidth: 560, width: '100%', alignSelf: 'center' },
  success: { flexGrow: 1, padding: 28, justifyContent: 'center', gap: 24, maxWidth: 560, width: '100%', alignSelf: 'center' },
  back: { minHeight: 48, justifyContent: 'center', alignSelf: 'flex-start', paddingRight: 20 },
  backText: { color: '#233E37', fontSize: 16 },
  muted: { opacity: 0.45 },
  eyebrow: { color: '#5B6C64', fontSize: 11, letterSpacing: 2, fontWeight: '600' },
  title: { color: '#233E37', fontSize: 30, lineHeight: 38, fontWeight: '500', letterSpacing: -0.8 },
  body: { color: '#5B6C64', fontSize: 16, lineHeight: 24 },
  previewFrame: { gap: 8 },
  preview: { width: '100%', aspectRatio: 1, backgroundColor: '#E5EAE2', borderRadius: 22 },
  emptyPhoto: { minHeight: 190, backgroundColor: '#E5EAE2', borderRadius: 22, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 8 },
  photoSymbol: { color: '#5B796E', fontSize: 48 },
  photoActions: { gap: 10 },
  hint: { color: '#5B6C64', fontSize: 13, lineHeight: 20 },
  label: { color: '#233E37', fontSize: 15, lineHeight: 22, fontWeight: '600' },
  noteHeader: { gap: 6, marginTop: 10 },
  counter: { color: '#5B6C64', fontSize: 13, alignSelf: 'flex-end', fontVariant: ['tabular-nums'] },
  input: { minHeight: 100, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#B9C8BC', backgroundColor: '#FFFDF8', color: '#233E37', fontSize: 17, lineHeight: 24 },
  visibility: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, minHeight: 76, borderWidth: 1, borderColor: '#D6DDD2', borderRadius: 18 },
  selected: { borderColor: '#537461', backgroundColor: '#E9EDE4' },
  radio: { fontSize: 23, color: '#375B48' },
  error: { color: '#9C3429', backgroundColor: '#FCECE4', padding: 14, borderRadius: 12, fontSize: 15, lineHeight: 22 },
});
