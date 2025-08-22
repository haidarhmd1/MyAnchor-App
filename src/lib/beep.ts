export const playBeep = (durationMs = 200, frequency = 600, volume = 1) => {
  const context = new (window.AudioContext ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).webkitAudioContext)();
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.frequency.value = frequency;
  oscillator.type = "sine";
  gainNode.gain.value = volume;

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.start();
  oscillator.stop(context.currentTime + durationMs / 1000);
};
