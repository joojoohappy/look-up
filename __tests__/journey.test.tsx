/**
 * The demo path end to end, through the real App, screens and in-memory store
 * (the hackathon definition of done, docs/hackathon/MVP.md). Only the native picker and safe-area are mocked
 * (jest.setup.js). Each test uses its own note text because the store is a
 * module singleton shared within this file.
 */
import { expect, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';

import App from '../App';

async function captureFromLibrary(note: string, visibility: 'public' | 'private') {
  await fireEvent.press(screen.getByRole('button', { name: 'Look up ↑' }));
  await screen.findByText('What did you notice?');
  await fireEvent.press(screen.getByRole('button', { name: /Choose today/ }));
  await screen.findByLabelText('Selected photo preview');
  await fireEvent.changeText(screen.getByLabelText('Optional note'), note);
  if (visibility === 'private') {
    await fireEvent.press(screen.getByRole('radio', { name: /Keep this for myself/ }));
    await fireEvent.press(screen.getByRole('button', { name: 'Save for myself' }));
  } else {
    await fireEvent.press(screen.getByRole('button', { name: 'Leave in WORLD →' }));
  }
}

test('a public moment reaches WORLD with the same photo and note', async () => {
  await render(<App />);
  await captureFromLibrary('Clouds over Dadaocheng', 'public');

  await screen.findByText('What other people saw when they looked up.');
  expect(screen.getByText('Clouds over Dadaocheng')).toBeTruthy();
  // WORLD labels each photo with its note; the URI is the one the picker gave.
  expect(JSON.stringify(screen.getByLabelText('Clouds over Dadaocheng').props.source)).toContain('file:///library/photo.jpg');
  // Demo seed is still there and still badged.
  expect(screen.getAllByText('DEMO EXAMPLE').length).toBeGreaterThan(0);
});

test('regression LU-1: WORLD has a way back even though the seed keeps it non-empty', async () => {
  await render(<App />);
  await captureFromLibrary('First run', 'public');
  await screen.findByText('What other people saw when they looked up.');

  await fireEvent.press(screen.getByRole('button', { name: 'Look up again' }));
  await screen.findByRole('button', { name: 'Look up ↑' });

  // A second run in the same session works and keeps the first.
  await captureFromLibrary('Second run', 'public');
  await screen.findByText('Second run');
  expect(screen.getByText('First run')).toBeTruthy();
});

test('a private moment is saved but never shown in WORLD', async () => {
  await render(<App />);
  await captureFromLibrary('Only for me, not WORLD', 'private');

  await screen.findByText('Saved for you.');
  await fireEvent.press(screen.getByRole('button', { name: 'Back to Look Up' }));

  await captureFromLibrary('A public one after the private one', 'public');
  await screen.findByText('A public one after the private one');
  expect(screen.queryByText('Only for me, not WORLD')).toBeNull();
});
