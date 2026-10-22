/** WORLD screen in isolation, reading the real store and seed. */
import { fireEvent, render, screen } from '@testing-library/react-native';

import WorldScreen from '../src/screens/WorldScreen';

test('shows the demo seed, each badged, with no engagement counters', async () => {
  await render(<WorldScreen />);
  await screen.findByText('What other people saw when they looked up.');
  expect(screen.getAllByText('DEMO EXAMPLE')).toHaveLength(3);
  expect(screen.queryByText(/like|follow|views?\b|comment/i)).toBeNull();
});

test('regression LU-1: the header offers a way back', async () => {
  const onLookUp = jest.fn();
  await render(<WorldScreen onLookUp={onLookUp} />);
  await fireEvent.press(await screen.findByRole('button', { name: 'Look up again' }));
  expect(onLookUp).toHaveBeenCalledTimes(1);
});
