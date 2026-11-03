export const requestNotificationPermission = () => window.Notification ? Notification.requestPermission(): 'unsupported';
export const getNotificationPermission = () => window.Notification?.permission || 'unsupported';

export const playReminderChime = () => {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if(!Ctx) return;
    const ctx = new Ctx();
    [659, 831].forEach((f, i) => {
      const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime + i * 0.12;
      o.frequency.value = f;
      g.gain.setValueAtTime(0.15, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      o.connect(g); g.connect(ctx.destination);
      o.start(t);
      o.stop(t + 0.35);
    });

  } catch {}
}

export const showCrowserReminder = (dose) => {
  if(window.Notification?.permission !== 'granted') return false;
  const food = dose.foodRequirement?.replace('_', ' ');
  const n = new Notification('Medollo Pill Reminder', {
    body: `Time for ${dose.medicineName} (${dose.pillCount} pill${dose.pillCount > 1? 's' : ''}${food?' - ' +food : ''})`,
    icon: dose.iamge || '/vite.svg',
    tag: `dose-${dose.id}`,
  });
  n.onclick = () => {window.focus(); n.close();};
  playReminderChime();
  return true;
};