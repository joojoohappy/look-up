/**
 * WORLD: what other people saw when they looked up. Person B owns this file.
 *
 * No likes, views, follows, comments or ranking — see PROJECT.md. The list is
 * whatever listPublicMoments returns, so private submissions never reach it.
 */

import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  Pressable,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { listPublicMoments } from '../data/moments';
import { isSeedMoment } from '../data/seedMoments';
import { Moment } from '../types/moment';

export type WorldScreenProps = {
  /** Change this value after a successful submission to reload the list. */
  reloadToken?: unknown;
  /** Wired by the integrator to return to the capture flow. */
  onLookUp?: () => void;
};

type LoadState = 'loading' | 'ready' | 'error';

export default function WorldScreen({ reloadToken, onLookUp }: WorldScreenProps) {
  const [moments, setMoments] = useState<Moment[]>([]);
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      setMoments(await listPublicMoments());
      setLoadState('ready');
    } catch {
      setLoadState('error');
    }
  }, []);

  // Reloads on mount and whenever the integrator bumps reloadToken, so a new
  // submission shows up without a manual refresh.
  useEffect(() => {
    load();
  }, [load, reloadToken]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  if (loadState === 'loading') {
    return (
      <View style={[styles.screen, styles.centred]}>
        <ActivityIndicator color={colours.muted} />
      </View>
    );
  }

  if (loadState === 'error') {
    return (
      <View style={[styles.screen, styles.centred]}>
        <Text style={styles.stateTitle}>WORLD is not loading</Text>
        <Text style={styles.stateBody}>Something went wrong reading today&rsquo;s moments.</Text>
        <Pressable style={styles.button} onPress={load}>
          <Text style={styles.buttonLabel}>Try again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={moments}
        keyExtractor={(moment) => moment.id}
        renderItem={({ item }) => <MomentCard moment={item} />}
        ListHeaderComponent={<Header />}
        ListEmptyComponent={<Empty onLookUp={onLookUp} />}
        contentContainerStyle={[styles.list, moments.length === 0 && styles.listEmpty]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colours.muted} />
        }
      />
    </View>
  );
}

function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>WORLD</Text>
      <Text style={styles.subtitle}>What other people saw when they looked up.</Text>
    </View>
  );
}

function Empty({ onLookUp }: { onLookUp?: () => void }) {
  return (
    <View style={styles.centred}>
      <Text style={styles.stateTitle}>Nothing here yet</Text>
      <Text style={styles.stateBody}>
        No one has left a moment in the world today. Yours would be the first.
      </Text>
      {onLookUp ? (
        <Pressable style={styles.button} onPress={onLookUp}>
          <Text style={styles.buttonLabel}>Look up</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function MomentCard({ moment }: { moment: Moment }) {
  const seed = isSeedMoment(moment);

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: moment.imageUri }}
        style={styles.photo}
        resizeMode="cover"
        accessibilityLabel={moment.note || 'A moment someone looked up at'}
      />
      {seed ? (
        <View style={styles.badge}>
          <Text style={styles.badgeLabel}>DEMO EXAMPLE</Text>
        </View>
      ) : null}
      {moment.note ? <Text style={styles.note}>{moment.note}</Text> : null}
      <Text style={styles.meta}>
        {moment.location} · {timeAgo(moment.createdAt)}
      </Text>
    </View>
  );
}

function timeAgo(createdAt: string): string {
  const minutes = Math.floor((Date.now() - new Date(createdAt).getTime()) / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  return `${Math.floor(hours / 24)} d ago`;
}

const colours = {
  background: '#FBFAF7',
  card: '#FFFFFF',
  text: '#1C1B19',
  muted: '#6B6A66',
  line: '#E8E4DC',
  badge: '#ECE8DF',
};

// The blank Expo template has no safe-area provider; keep clear of the status bar.
const TOP_INSET = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) + 16 : 64;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colours.background,
  },
  centred: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  list: {
    paddingTop: TOP_INSET,
    paddingHorizontal: 20,
    paddingBottom: 48,
  },
  listEmpty: {
    flexGrow: 1,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 13,
    letterSpacing: 3,
    fontWeight: '600',
    color: colours.muted,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 20,
    lineHeight: 28,
    color: colours.text,
  },
  card: {
    marginBottom: 28,
    backgroundColor: colours.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colours.line,
    padding: 10,
  },
  photo: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 8,
    backgroundColor: colours.line,
  },
  badge: {
    alignSelf: 'flex-start',
    marginTop: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: colours.badge,
  },
  badgeLabel: {
    fontSize: 10,
    letterSpacing: 1,
    fontWeight: '600',
    color: colours.muted,
  },
  note: {
    marginTop: 12,
    fontSize: 16,
    lineHeight: 22,
    color: colours.text,
  },
  meta: {
    marginTop: 8,
    fontSize: 13,
    color: colours.muted,
  },
  stateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colours.text,
    textAlign: 'center',
  },
  stateBody: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 21,
    color: colours.muted,
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 999,
    backgroundColor: colours.text,
  },
  buttonLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colours.background,
  },
});
