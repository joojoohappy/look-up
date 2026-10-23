/**
 * Capture form behaviour that the journey test does not reach: validation,
 * permission denial, double taps and a failing submit.
 */
import { expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import * as ImagePicker from 'expo-image-picker';

import CaptureScreen from '../src/screens/CaptureScreen';
import type { CreateMomentInput, Moment } from '../src/types/moment';

function savedMoment(input: CreateMomentInput): Moment {
  return { ...input, id: 'moment-test', createdAt: new Date().toISOString(), location: 'Taipei' };
}

type Submit = (input: CreateMomentInput) => Promise<Moment>;

function setup(onSubmit: Submit = jest.fn(async (input: CreateMomentInput) => savedMoment(input))) {
  const onDone = jest.fn();
  const onCancel = jest.fn();
  return { onSubmit, onDone, onCancel, ui: <CaptureScreen onSubmit={onSubmit} onDone={onDone} onCancel={onCancel} /> };
}

async function pickPhoto() {
  await fireEvent.press(screen.getByRole('button', { name: /Choose today/ }));
  await screen.findByLabelText('Selected photo preview');
}

test('cannot submit before a photo is chosen', async () => {
  const { ui } = setup();
  await render(ui);
  expect(screen.getByRole('button', { name: 'Leave in WORLD →', disabled: true })).toBeTruthy();
});

test('the note is capped at 50 and the counter says so', async () => {
  const { ui } = setup();
  await render(ui);
  await fireEvent.changeText(screen.getByLabelText('Optional note'), '天'.repeat(60));
  expect(screen.getByLabelText('50 of 50 characters')).toBeTruthy();
});

test('an emoji counts as one character (LU-8)', async () => {
  const { ui } = setup();
  await render(ui);
  await fireEvent.changeText(screen.getByLabelText('Optional note'), '🌤🌤🌤');
  expect(screen.getByLabelText('3 of 50 characters')).toBeTruthy();
});

test('public submit sends the exact input once and then opens WORLD', async () => {
  let resolve: () => void = () => {};
  const onSubmit = jest.fn((input: CreateMomentInput) => new Promise<Moment>((r) => { resolve = () => r(savedMoment(input)); }));
  const { onDone, ui } = setup(onSubmit);
  await render(ui);
  await pickPhoto();
  await fireEvent.changeText(screen.getByLabelText('Optional note'), 'pink sky');

  const submit = screen.getByRole('button', { name: 'Leave in WORLD →' });
  await fireEvent.press(submit);
  await fireEvent.press(submit); // a second tap while the first is in flight

  expect(onSubmit).toHaveBeenCalledTimes(1);
  expect(onSubmit).toHaveBeenCalledWith({ imageUri: 'file:///library/photo.jpg', note: 'pink sky', visibility: 'public' });
  resolve();
  await screen.findByText('Your window is open.');
  expect(onDone).toHaveBeenCalledTimes(1);
});

test('a rejected submit shows the reason and keeps the form for a retry', async () => {
  const onSubmit = jest.fn<Submit>()
    .mockRejectedValueOnce(new Error('Keep the note to 50 characters or fewer.'))
    .mockImplementation(async (input) => savedMoment(input));
  const { onDone, ui } = setup(onSubmit);
  await render(ui);
  await pickPhoto();

  await fireEvent.press(screen.getByRole('button', { name: 'Leave in WORLD →' }));
  await screen.findByText('Keep the note to 50 characters or fewer.');
  expect(onDone).not.toHaveBeenCalled();

  await fireEvent.press(screen.getByRole('button', { name: 'Leave in WORLD →' }));
  await screen.findByText('Your window is open.');
  expect(onSubmit).toHaveBeenCalledTimes(2);
});

test('camera permission denied for good offers Settings and keeps the library option', async () => {
  jest.mocked(ImagePicker.requestCameraPermissionsAsync)
    .mockResolvedValueOnce({ granted: false, canAskAgain: false } as Awaited<ReturnType<typeof ImagePicker.requestCameraPermissionsAsync>>);
  const { ui } = setup();
  await render(ui);

  await fireEvent.press(screen.getByRole('button', { name: 'Take a photo' }));
  await screen.findByText(/Camera access is off/);
  expect(screen.getByRole('button', { name: 'Open Settings' })).toBeTruthy();
  expect(ImagePicker.launchCameraAsync).not.toHaveBeenCalled();
  expect(screen.getByRole('button', { name: /Choose today/, disabled: false })).toBeTruthy();
});

test('cancelling the picker leaves the form unchanged', async () => {
  jest.mocked(ImagePicker.launchImageLibraryAsync)
    .mockResolvedValueOnce({ canceled: true, assets: null } as Awaited<ReturnType<typeof ImagePicker.launchImageLibraryAsync>>);
  const { ui } = setup();
  await render(ui);
  await fireEvent.press(screen.getByRole('button', { name: /Choose today/ }));
  await screen.findByRole('button', { name: /Choose today/, disabled: false });
  expect(screen.queryByLabelText('Selected photo preview')).toBeNull();
});
