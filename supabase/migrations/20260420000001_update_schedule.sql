-- Update schedule to final RoboTalk 2026 timetable
DELETE FROM public.enrollments;
DELETE FROM public.workshops;

INSERT INTO public.workshops (id, title, speaker, location, type, start_time, end_time, capacity, group_label, conflict_group) VALUES
  -- ── Morning singles ────────────────────────────────────────────────────
  ('welcome',         'Welcome coffee & Registration',          NULL, 'Φουαγιέ',        'break',   '2026-04-25 09:00:00+03', '2026-04-25 09:30:00+03', 9999, NULL, NULL),
  ('opening',         'Opening Remarks',                        NULL, 'Αμφιθέατρο', 'seminar', '2026-04-25 09:30:00+03', '2026-04-25 09:40:00+03', 9999, NULL, NULL),
  ('isense',          'ISENSE',                                 NULL, 'Αμφιθέατρο', 'seminar', '2026-04-25 09:40:00+03', '2026-04-25 10:10:00+03', 9999, NULL, NULL),
  ('ras-team',        'RAS Team Presentation',                  NULL, 'Αμφιθέατρο', 'seminar', '2026-04-25 10:20:00+03', '2026-04-25 10:35:00+03', 9999, NULL, NULL),
  ('panel',           'Main panel discussion',                  NULL, 'Αμφιθέατρο', 'seminar', '2026-04-25 10:40:00+03', '2026-04-25 11:20:00+03', 9999, NULL, NULL),

  -- ── Group A/B conflict: 11:30–11:50 ────────────────────────────────────
  ('coffee-a',        'Coffee break',                           NULL, 'Πρώτος Όροφος',  'break',   '2026-04-25 11:30:00+03', '2026-04-25 11:50:00+03', 9999, 'A', 'slot-8'),
  ('project-b',       'Project presentation',                   NULL, 'Αμφιθέατρο', 'seminar', '2026-04-25 11:30:00+03', '2026-04-25 11:50:00+03', 9999, 'B', 'slot-8'),

  -- ── Group A/B conflict: 12:00–12:20 ────────────────────────────────────
  ('coffee-b',        'Coffee break',                           NULL, 'Πρώτος Όροφος',  'break',   '2026-04-25 12:00:00+03', '2026-04-25 12:20:00+03', 9999, 'B', 'slot-9'),
  ('project-a',       'Project presentation',                   NULL, 'Αμφιθέατρο', 'seminar', '2026-04-25 12:00:00+03', '2026-04-25 12:20:00+03', 9999, 'A', 'slot-9'),

  -- ── Single ─────────────────────────────────────────────────────────────
  ('asso-subsea',     'ASSO SUBSEA',                            NULL, 'Αμφιθέατρο', 'seminar', '2026-04-25 12:30:00+03', '2026-04-25 13:00:00+03', 9999, NULL, NULL),

  -- ── Group A/B conflict: 13:10–14:00 ────────────────────────────────────
  ('lunch-a',         'Lunch',                                  NULL, 'Πρώτος Όροφος',  'break',   '2026-04-25 13:10:00+03', '2026-04-25 14:00:00+03', 9999, 'A', 'slot-10'),
  ('hermes-uniai',    'HERMES, UNIAI Team Presentations',       NULL, 'Αμφιθέατρο', 'seminar', '2026-04-25 13:10:00+03', '2026-04-25 14:00:00+03', 9999, 'B', 'slot-10'),

  -- ── Group A/B conflict: 14:10–15:00 ────────────────────────────────────
  ('lunch-b',         'Lunch',                                  NULL, 'Πρώτος Όροφος',  'break',   '2026-04-25 14:10:00+03', '2026-04-25 15:00:00+03', 9999, 'B', 'slot-11'),
  ('prom-whitenoise', 'PROM, WHITE NOISE Team Presentations',   NULL, 'Αμφιθέατρο', 'seminar', '2026-04-25 14:10:00+03', '2026-04-25 15:00:00+03', 9999, 'A', 'slot-11'),

  -- ── Enrollable conflict: 15:10–16:50 ───────────────────────────────────
  ('irasional',       'iRASional workshop',                     NULL, 'Πρώτος Όροφος',  'workshop','2026-04-25 15:10:00+03', '2026-04-25 16:50:00+03', 50,   NULL, 'slot-12'),
  ('aeras',           'aeRAS workshop',                         NULL, 'Αμφιθέατρο', 'workshop','2026-04-25 15:10:00+03', '2026-04-25 16:50:00+03', 200,  NULL, 'slot-12'),

  -- ── Spanning conflict: 17:00–18:00 (Embedded workshop spans both talks) ─
  ('eve-psalti',      'Eve Psalti',                             NULL, 'Αμφιθέατρο', 'seminar', '2026-04-25 17:00:00+03', '2026-04-25 17:30:00+03', 9999, NULL, 'slot-13-14'),
  ('renesas',         'Embedded workshop',                      NULL, 'Πρώτος Όροφος',  'workshop','2026-04-25 17:00:00+03', '2026-04-25 18:00:00+03', 30,   NULL, 'slot-13-14'),
  ('haris-ioannou',   'Haris Ioannou',                          NULL, 'Αμφιθέατρο', 'seminar', '2026-04-25 17:30:00+03', '2026-04-25 18:00:00+03', 9999, NULL, 'slot-13-14');
