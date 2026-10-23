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
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { listPublicMoments } from '../data/moments';
import { isSeedMoment } from '../data/seedMoments';
import { timeAgo } from '../lib/time';
import { Moment } from '../types/moment';

export type WorldScreenProps = {
  /** Change this value after a successful submission to reload the list. */
  reloadToken?: unknown;
  /** Wired by the integrator to return to the capture flow. */
  onLookUp?: () => void;
};

type LoadState = 'loading' | 'ready' | 'error';

/** The public query, with failure turned into null for the caller to show. */
function fetchPublicMoments(): Promise<Moment[] | null> {
  return listPublicMoments().then(
    (moments) => moments,
    () => null,
  );
}

export default function WorldScreen({ reloadToken, onLookUp }: WorldScreenProps) {
  const [moments, setMoments] = useState<Moment[]>([]);
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [refreshing, setRefreshing] = useState(false);
  // Real insets on both platforms; replaces a fixed 64pt guess on iOS (LU-4).
  const insets = useSafeAreaInsets();

  const apply = useCallback((result: Moment[] | null) => {
    if (result) {
      setMoments(result);
      setLoadState('ready');
    } else {
      setLoadState('error');
    }
  }, []);

  /** Pull-to-refresh and "Try again". */
  const load = useCallback(async () => {
    apply(await fetchPublicMoments());
  }, [apply]);

  // Reloads on mount and whenever the integrator bumps reloadToken, so a new
  // submission shows up without a manual refresh. State is set in the promise
  // callback, never synchronously in the effect, and a result that arrives
  // after unmount or after a newer reload is dropped.
  useEffect(() => {
    let current = true;
    void fetchPublicMoments().then((result) => {
      if (current) apply(result);
    });
    return () => {
      current = false;
    };
  }, [apply, reloadToken]);

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
        ListHeaderComponent={<Header onLookUp={onLookUp} />}
        ListEmptyComponent={<Empty />}
        contentContainerStyle={[
          styles.list,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 48 },
          moments.length === 0 && styles.listEmpty,
        ]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colours.muted} />
        }
      />
    </View>
  );
}

// The route back lives in the header, not only in the empty state: the demo
// seed means WORLD is never empty, and iOS has no back gesture, so an
// empty-state-only button left iPhone users stuck in WORLD.
function Header({ onLookUp }: { onLookUp?: () => void }) {
  return (
    <View style={styles.header}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>WORLD</Text>
        {onLookUp ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Look up again"
            hitSlop={8}
            onPress={onLookUp}
            style={({ pressed }) => [styles.lookUp, pressed && styles.pressed]}
          >
            <Text style={styles.lookUpLabel}>Look up ↑</Text>
          </Pressable>
        ) : null}
      </View>
      <Text style={styles.subtitle}>What other people saw when they looked up.</Text>
    </View>
  );
}

function Empty() {
  return (
    <View style={styles.centred}>
      <Text style={styles.stateTitle}>Nothing here yet</Text>
      <Text style={styles.stateBody}>
        No one has left a moment in the world today. Yours would be the first.
      </Text>
    </View>
  );
}

function MomentCard({ moment }: { moment: Moment }) {
  const seed = isSeedMoment(moment);
  const when = timeAgo(moment.createdAt);

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
      <Text style={styles.meta}>{when ? `${moment.location} · ${when}` : moment.location}</Text>
    </View>
  );
}

const colours = {
  background: '#FBFAF7',
  card: '#FFFFFF',
  text: '#1C1B19',
  muted: '#6B6A66',
  line: '#E8E4DC',
  badge: '#ECE8DF',
};

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
    paddingHorizontal: 20,
  },
  listEmpty: {
    flexGrow: 1,
  },
  header: {
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lookUp: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: colours.badge,
  },
  lookUpLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colours.text,
  },
  pressed: {
    opacity: 0.7,
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
