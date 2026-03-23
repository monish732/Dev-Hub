export const patients = [
  {
    id: 'p1',
    name: 'Nisha G',
    age: 38,
    role: 'patient',
    vitals: [
      { time: '08:00', hr: 78, spo2: 98, temp: 36.6, status: 'stable' },
      { time: '10:00', hr: 82, spo2: 96, temp: 36.8, status: 'warning' },
      { time: '12:00', hr: 92, spo2: 94, temp: 37.4, status: 'critical' },
      { time: '14:00', hr: 90, spo2: 95, temp: 37.0, status: 'warning' }
    ],
    conditions: ['Circadian stress', 'Mild hypoxemia risk']
  },
  {
    id: 'p2',
    name: 'Arjun R',
    age: 46,
    role: 'patient',
    vitals: [
      { time: '08:00', hr: 76, spo2: 99, temp: 36.5, status: 'stable' },
      { time: '10:00', hr: 84, spo2: 94, temp: 37.8, status: 'critical' },
      { time: '12:00', hr: 88, spo2: 93, temp: 37.6, status: 'critical' },
      { time: '14:00', hr: 85, spo2: 96, temp: 37.8, status: 'warning' }
    ],
    conditions: ['ECG micro-variation signature', 'Possible early arrhythmia']
  }
];
