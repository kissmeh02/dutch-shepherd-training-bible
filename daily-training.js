(function () {
  'use strict';

  // Add compact layout automatically when embedded in an iframe (ex: Notion).
  const isEmbeddedFrame = window.self !== window.top;
  const forceEmbedMode = new URLSearchParams(window.location.search).get('embed') === '1';
  if (isEmbeddedFrame || forceEmbedMode) {
    document.body.classList.add('embed-mode');
  }

  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Core weekly schedule provided by user (training week).
  const SCHEDULE = {
    Mon: [
      { time: '5:00 AM', end: '5:15 AM', label: 'Wake + Hydrate + Animals', icon: '💧', desc: 'Big glass water. Dutchie potty. Cat TUBE feed. Scoop litter. Fresh water all bowls (change #1).', reminder: 'Scoop litter\nCats: tube feed\nWater change #1\nDutchie potty + water', work: false },
      { time: '5:15 AM', end: '5:45 AM', label: 'Dutchie Workout (30)', icon: '🔥', desc: 'HIIT: flirt pole / fetch / hill sprints with Sit-Down drills between reps', work: false },
      { time: '5:45 AM', end: '6:00 AM', label: 'Dutchie Feed (working meal)', icon: '🦴', desc: 'Hand-fed during command practice or puzzle toy', work: false },
      { time: '6:00 AM', end: '6:25 AM', label: 'Warm-up Block', icon: '⚡', desc: 'Jump rope, shadowboxing, dynamic stretch', work: false },
      { time: '6:25 AM', end: '7:10 AM', label: 'Muay Thai (45)', icon: '🦵', desc: 'Week A: solo drilling / Week B: coach pads & combinations', reminder: 'Wrap hands\nElectrolytes', work: false },
      { time: '7:10 AM', end: '7:55 AM', label: 'Shower + Eat + Get Ready', icon: '🍳', desc: 'Only shower of the day. Big recovery breakfast (protein + carbs).', reminder: 'Vitamins + creatine\nGlass 1 & 2\nProtein target', work: false },
      { time: '8:10 AM', end: '10:30 AM', label: 'Deep Office Work (Extended)', icon: '🧠', desc: 'Bonus 50 min since workout ended early. Phone on DND.', reminder: 'Glass 3\nDND\nTop priority first', work: true },
      { time: '10:30 AM', end: '10:45 AM', label: 'Dutchie Walk + Snack', icon: '🐕', desc: 'Quick break walk. Grab a snack.', work: false },
      { time: '10:45 AM', end: '12:45 PM', label: 'Office Work', icon: '📞', desc: 'Meetings, emails, CEO tasks. Snack at desk around 11:30.', reminder: 'Glass 4,5,6\nSnack 11:30', work: true },
      { time: '12:45 PM', end: '1:00 PM', label: 'Cat Midday Feed + Prep Walk', icon: '🐱', desc: 'Cats canned food before walk. Grab Dutchie gear.', work: false },
      { time: '1:00 PM', end: '2:00 PM', label: 'Dutchie Power Walk (1 hr)', icon: '🚶', desc: '20 sniff / 15 skills drills / 25 precision heel', reminder: '15 min trainer homework drills', work: false },
      { time: '2:00 PM', end: '5:00 PM', label: 'Production / CEO Work', icon: '🏭', desc: 'Afternoon block. Snack at desk around 3:30.', reminder: 'Glass 7\nAfternoon snack', work: true },
      { time: '5:00 PM', end: '5:30 PM', label: 'Dinner + Cat + Dutchie Evening Feed', icon: '🍽️', desc: 'Your main meal. Cats protein meal. Dutchie working meal. Water change #2.', reminder: 'Supplements\nCats protein meal\nDutchie dinner\nWater change #2', work: false },
      { time: '5:30 PM', end: '5:45 PM', label: 'Dutchie Walk', icon: '🐕', desc: 'Post-dinner walk', work: false },
      { time: '5:45 PM', end: '8:00 PM', label: 'Work (final block)', icon: '📋', desc: 'Wrap-up, admin, CEO review, plan tomorrow top 3.', reminder: 'Glass 8\nTop 3 tomorrow', work: true },
      { time: '8:00 PM', end: '9:00 PM', label: 'Night Training Block', icon: '🏋️', desc: 'S&C + neck protocol + yoga cooldown', reminder: 'Massage gun: quads, calves, hips, shoulders', work: false },
      { time: '9:00 PM', end: '9:10 PM', label: 'Dutchie Sniffari + Lights Out', icon: '🌙', desc: 'Short decompression walk, dog to crate for sleep', work: false },
      { time: '9:10 PM', end: '9:30 PM', label: 'Steam + Night Routine + Bed', icon: '♨️', desc: 'Steam shower 10 min, screens off, bed.', reminder: 'No screens\n7.5 hrs to 5 AM', work: false }
    ],
    Tue: [
      { time: '5:00 AM', end: '5:15 AM', label: 'Wake + Hydrate + Animals', icon: '💧', desc: 'Water, Dutchie potty, cat tube feed, litter, water change #1.', reminder: 'Scoop litter\nCats tube feed\nWater #1', work: false },
      { time: '5:15 AM', end: '5:45 AM', label: 'Dutchie Workout (30)', icon: '🔥', desc: 'HIIT with Sit-Down drills', work: false },
      { time: '5:45 AM', end: '6:00 AM', label: 'Dutchie Feed', icon: '🦴', desc: 'Working meal', work: false },
      { time: '6:00 AM', end: '6:20 AM', label: 'Prep Block', icon: '⚡', desc: 'Jump rope + Sambo prep drills', work: false },
      { time: '6:20 AM', end: '7:20 AM', label: 'Combat Sambo w/ Coach', icon: '🥋', desc: 'Coached session: entries, takedowns, ground control.', reminder: 'Wrap wrists/hands\nElectrolytes', work: false },
      { time: '7:20 AM', end: '7:50 AM', label: 'Yoga (30)', icon: '🧘', desc: 'Hip flexors, shoulders, deep recovery flow', work: false },
      { time: '7:50 AM', end: '8:35 AM', label: 'Shower + Eat + Ready', icon: '🍳', desc: 'Only shower of day. Recovery meal.', reminder: 'Vitamins + creatine\nGlass 1 & 2', work: false },
      { time: '8:50 AM', end: '10:30 AM', label: 'Deep Office Work', icon: '🧠', desc: 'Strategic work', reminder: 'Glass 3\nDND', work: true },
      { time: '10:30 AM', end: '10:45 AM', label: 'Dutchie Walk + Snack', icon: '🐕', desc: 'Break walk + desk snack', work: false },
      { time: '10:45 AM', end: '12:45 PM', label: 'Office Work', icon: '📞', desc: 'Meetings and calls. Snack at 11:30.', reminder: 'Glass 4,5,6\nSnack 11:30', work: true },
      { time: '12:45 PM', end: '1:00 PM', label: 'Cat Midday Feed', icon: '🐱', desc: 'Cats canned food. Prep Dutchie walk gear.', work: false },
      { time: '1:00 PM', end: '2:00 PM', label: 'Dutchie Power Walk', icon: '🚶', desc: '20 sniff / 15 skills / 25 heel', reminder: '15 min skills drills', work: false },
      { time: '2:00 PM', end: '5:00 PM', label: 'Production / CEO Work', icon: '🏭', desc: 'Afternoon block.', reminder: 'Glass 7\nAfternoon snack', work: true },
      { time: '5:00 PM', end: '5:30 PM', label: 'Dinner + Cat + Dutchie + Water', icon: '🍽️', desc: 'Meal + cat protein + Dutchie dinner + water #2.', reminder: 'Supplements\nCats protein\nDutchie dinner\nWater #2', work: false },
      { time: '5:45 PM', end: '8:00 PM', label: 'Work (final block)', icon: '📋', desc: 'Wrap-up and admin.', reminder: 'Glass 8\nTop 3 tomorrow', work: true },
      { time: '8:00 PM', end: '9:00 PM', label: 'Recovery Yoga (60)', icon: '🧘', desc: 'Deep yin yoga. Long holds.', work: false },
      { time: '9:00 PM', end: '9:30 PM', label: 'Night Shutdown', icon: '🌙', desc: 'Sniffari, steam shower, and sleep routine.', reminder: '7.5 hrs to 5 AM', work: false }
    ],
    Wed: [
      { time: '5:00 AM', end: '5:15 AM', label: 'Wake + Animals + Water #1', icon: '💧', desc: 'Standard morning home routine.', work: false },
      { time: '5:15 AM', end: '5:45 AM', label: 'Dutchie LIGHT Workout', icon: '🐕', desc: 'Light only to keep Dutchie fresh for bite night.', reminder: 'Save energy for evening', work: false },
      { time: '5:45 AM', end: '6:00 AM', label: 'Dutchie Feed', icon: '🦴', desc: 'Working meal', work: false },
      { time: '6:00 AM', end: '7:10 AM', label: 'Muay Thai Morning Block', icon: '🥊', desc: 'Jump rope, shadowboxing, mobility, 45 min Muay Thai.', reminder: 'Wrap hands\nElectrolytes', work: false },
      { time: '7:10 AM', end: '7:55 AM', label: 'Shower + Breakfast', icon: '🍳', desc: 'Only shower of day. Recovery meal.', work: false },
      { time: '8:10 AM', end: '10:30 AM', label: 'Deep Office Work (Extended)', icon: '🧠', desc: 'Strategic work block.', reminder: 'Glass 3\nDND', work: true },
      { time: '10:45 AM', end: '12:45 PM', label: 'Office Work', icon: '📞', desc: 'Meetings and emails.', reminder: 'Glass 4,5,6', work: true },
      { time: '1:00 PM', end: '2:00 PM', label: 'Pure Dutchie Decompression', icon: '🚶', desc: 'No skills today. Sniff and decompress only.', reminder: 'No training, fresh dog', work: false },
      { time: '2:00 PM', end: '4:30 PM', label: 'Production / CEO Work', icon: '🏭', desc: 'Compressed afternoon before bite night.', work: true },
      { time: '4:30 PM', end: '5:00 PM', label: 'Half Dutchie Dinner + Cat + Water #2', icon: '🦴', desc: 'Half portion for bloat safety before bite night.', reminder: 'Half dog portion\nCats protein\nWater #2', work: false },
      { time: '5:30 PM', end: '6:00 PM', label: 'Wrap-up + Gear Prep', icon: '📋', desc: 'Close work and prep bite gear.', reminder: 'Glass 8\nPack gear', work: true },
      { time: '6:30 PM', end: '8:30 PM', label: 'Bite Night (2 hrs)', icon: '🦮', desc: 'Protection sport training with decoy.', reminder: 'Post-session dog check', work: false },
      { time: '8:30 PM', end: '9:30 PM', label: 'Cool-down + Steam + Bed', icon: '♨️', desc: 'Post-bite cooldown, short steam, immediate sleep.', reminder: 'Straight to bed', work: false }
    ],
    Thu: [
      { time: '5:00 AM', end: '5:15 AM', label: 'Wake + Animals + Water #1', icon: '💧', desc: 'Morning home routine.', work: false },
      { time: '5:15 AM', end: '5:45 AM', label: 'Dutchie Workout', icon: '🔥', desc: 'HIIT with Sit-Down drills.', work: false },
      { time: '5:45 AM', end: '6:00 AM', label: 'Dutchie Feed', icon: '🦴', desc: 'Working meal', work: false },
      { time: '6:00 AM', end: '7:20 AM', label: 'Sambo Morning', icon: '🥋', desc: 'Warm-up + full coached Combat Sambo session.', reminder: 'Wrap hands/wrists\nElectrolytes', work: false },
      { time: '7:20 AM', end: '8:05 AM', label: 'Shower + Recovery Breakfast', icon: '🍳', desc: 'Only shower of day.', work: false },
      { time: '8:20 AM', end: '10:30 AM', label: 'Deep Office Work (Extended)', icon: '🧠', desc: 'Strategic work.', work: true },
      { time: '10:45 AM', end: '12:45 PM', label: 'Office Work', icon: '📞', desc: 'Meetings and calls.', work: true },
      { time: '1:00 PM', end: '2:00 PM', label: 'Dutchie Power Walk', icon: '🚶', desc: 'Sniff + skills + heel structure.', work: false },
      { time: '2:00 PM', end: '5:00 PM', label: 'Production / CEO Work', icon: '🏭', desc: 'Afternoon block.', work: true },
      { time: '5:00 PM', end: '5:30 PM', label: 'Dinner + Cat + Dutchie + Water #2', icon: '🍽️', desc: 'Evening feeds and hydration reset.', work: false },
      { time: '5:45 PM', end: '8:00 PM', label: 'Final Work Block', icon: '📋', desc: 'Wrap-up and planning.', work: true },
      { time: '8:00 PM', end: '9:00 PM', label: 'Night S&C + Neck + Yoga', icon: '🏋️', desc: '40 min S&C + 10 neck + 10 yoga.', work: false },
      { time: '9:00 PM', end: '9:30 PM', label: 'Night Shutdown', icon: '🌙', desc: 'Sniffari, steam, and bed.', work: false }
    ],
    Fri: [
      { time: '5:00 AM', end: '5:15 AM', label: 'Wake + Animals + Water #1', icon: '💧', desc: 'Morning home routine.', work: false },
      { time: '5:15 AM', end: '5:45 AM', label: 'Dutchie Workout', icon: '🔥', desc: 'HIIT with drills.', work: false },
      { time: '5:45 AM', end: '6:00 AM', label: 'Dutchie Feed', icon: '🦴', desc: 'Working meal.', work: false },
      { time: '6:00 AM', end: '7:49 AM', label: 'Boxing Block', icon: '🥊', desc: 'Warm-up, vision drills, 12 rounds, speed bag, double-end bag, reflex bag, cooldown.', reminder: 'Wrap hands tight\nElectrolytes', work: false },
      { time: '7:49 AM', end: '7:54 AM', label: 'Contrast Shower', icon: '🚿', desc: 'Cold/hot intervals. This is the daily shower.', work: false },
      { time: '7:54 AM', end: '8:25 AM', label: 'Breakfast + Ready', icon: '🍳', desc: 'Big recovery breakfast.', reminder: 'Vitamins + creatine\nGlass 1 & 2', work: false },
      { time: '8:40 AM', end: '10:30 AM', label: 'Deep Office Work', icon: '🧠', desc: 'Strategic work.', work: true },
      { time: '10:45 AM', end: '12:45 PM', label: 'Office Work', icon: '📞', desc: 'End-of-week meetings/emails.', work: true },
      { time: '1:00 PM', end: '2:00 PM', label: 'Dutchie Power Walk', icon: '🚶', desc: 'Sniff + skills + heel.', work: false },
      { time: '2:00 PM', end: '5:00 PM', label: 'Production / CEO Work', icon: '🏭', desc: 'Friday wrap block.', work: true },
      { time: '5:00 PM', end: '5:30 PM', label: 'Dinner + Cat + Dutchie + Water #2', icon: '🍽️', desc: 'Evening feed routine.', work: false },
      { time: '5:45 PM', end: '8:00 PM', label: 'CEO Weekly Wrap-Up', icon: '📋', desc: 'Close week + Monday prep.', work: true },
      { time: '8:00 PM', end: '9:00 PM', label: 'Yoga + Massage Gun', icon: '🧘', desc: '45 yoga + 15 massage gun.', work: false },
      { time: '9:00 PM', end: '9:30 PM', label: 'Night Shutdown', icon: '🌙', desc: 'Sniffari, steam, bed.', work: false }
    ],
    Sat: [
      { time: '5:00 AM', end: '5:15 AM', label: 'Wake + Animals + Water #1', icon: '💧', desc: 'Morning home routine + grooming week check.', reminder: 'Bi-weekly grooming check', work: false },
      { time: '5:15 AM', end: '5:45 AM', label: 'Dutchie Workout (Light)', icon: '🐕', desc: 'Active play, not heavy.', work: false },
      { time: '5:45 AM', end: '6:00 AM', label: 'Dutchie Feed', icon: '🦴', desc: 'Working meal.', work: false },
      { time: '6:00 AM', end: '8:45 AM', label: 'Recovery Stack', icon: '🧘', desc: 'Light walk/cycling, foam rolling, massage gun, contrast shower, yin yoga.', work: false },
      { time: '9:00 AM', end: '12:30 PM', label: 'CEO Review + Admin', icon: '📊', desc: 'KPIs, financial review, admin and compliance.', work: true },
      { time: '12:45 PM', end: '1:45 PM', label: 'Dutchie Walk + Lunch', icon: '🚶', desc: 'Walk first then lunch.', work: false },
      { time: '1:45 PM', end: '3:45 PM', label: 'CEO Strategic Work', icon: '♟️', desc: 'Partnerships and week prep.', work: true },
      { time: '5:00 PM', end: '5:30 PM', label: 'Dinner + Cat + Water #2 + Gear', icon: '🍽️', desc: 'Dinner + protein feed + pack dog training gear.', work: false },
      { time: '5:30 PM', end: '7:15 PM', label: 'Dutch Shepherd Training', icon: '🦮', desc: 'Weekly trainer session: obedience and handler audit.', work: false },
      { time: '7:15 PM', end: '9:30 PM', label: 'Post-Training + Family + Bed', icon: '🌙', desc: 'Dog care, personal/family time, sniffari, steam, bed.', work: false }
    ],
    Sun: [
      { time: '5:00 AM', end: '5:15 AM', label: 'Wake + Animals + Water #1', icon: '💧', desc: 'Morning home routine.', work: false },
      { time: '5:15 AM', end: '5:45 AM', label: 'Dutchie Light Pre-Hike', icon: '🐕', desc: 'Easy warm-up walk.', work: false },
      { time: '5:45 AM', end: '6:00 AM', label: 'Dutchie Feed (Light)', icon: '🦴', desc: 'Smaller portion before hike.', work: false },
      { time: '6:30 AM', end: '9:30 AM', label: 'Long Hike with Dutchie (3h)', icon: '🐕‍🦺', desc: 'Endurance and bonding block.', reminder: 'Hydrate throughout\nGPS on dog', work: false },
      { time: '9:30 AM', end: '10:30 AM', label: 'Recovery Brunch + Stretch', icon: '🍲', desc: 'Post-hike recovery meal and cooldown.', work: false },
      { time: '10:30 AM', end: '11:30 AM', label: 'Worship / Spiritual Time', icon: '⛪', desc: 'Church / prayer / meditation.', work: false },
      { time: '11:30 AM', end: '1:30 PM', label: 'Sunday Work Block (2h)', icon: '💼', desc: 'Light strategic planning for week ahead.', work: true },
      { time: '1:45 PM', end: '2:15 PM', label: 'Dutchie Midday Walk', icon: '🐕', desc: 'Easy walk after hike day.', work: false },
      { time: '2:15 PM', end: '5:00 PM', label: 'Relax + Personal Time', icon: '🛋️', desc: 'Decompress completely.', work: false },
      { time: '5:00 PM', end: '6:00 PM', label: 'Cat Evening Feed + Meal Prep', icon: '🐱', desc: 'Cats protein meal, water #2, continue prep.', work: false },
      { time: '6:00 PM', end: '9:00 PM', label: 'Family Dinner + Movie Time', icon: '🎬', desc: 'No-phone family block.', work: false },
      { time: '9:00 PM', end: '9:30 PM', label: 'Night Shutdown', icon: '🌙', desc: 'Sniffari, steam, Monday-ready bedtime.', reminder: 'Screens off\n7.5 hrs before Monday', work: false }
    ]
  };

  function parseTime(value) {
    if (!value) return 0;
    const [time, period] = value.split(' ');
    let [hours, mins] = time.split(':').map(Number);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return hours + mins / 60;
  }

  function calcWorkHours(blocks) {
    return blocks.reduce((sum, block) => {
      if (!block.work || !block.time || !block.end) return sum;
      return sum + (parseTime(block.end) - parseTime(block.time));
    }, 0);
  }

  function calcBlockHours(blocks) {
    return blocks.reduce((sum, block) => {
      if (!block.time || !block.end) return sum;
      return sum + (parseTime(block.end) - parseTime(block.time));
    }, 0);
  }

  function isTrainingRelevantBlock(block) {
    const text = `${block.label || ''} ${block.desc || ''}`.toLowerCase();
    if (/(office|production|ceo|admin|meeting|emails|work block|deep office)/.test(text)) return false;
    return /(dutchie|dog|bite|sniffari|hike|crate|heel|obedience|walk|decompression|training|muay|sambo|boxing|s&c|yoga|recovery|shadowboxing|jump rope)/.test(text);
  }

  function blockFocus(block) {
    const text = `${block.label || ''} ${block.desc || ''}`.toLowerCase();
    const dog = /(dutchie|dog|bite|sniffari|hike|crate|heel|obedience|walk|feed|decompression|trainer session)/.test(text);
    const handler = /(muay|sambo|boxing|shadowboxing|jump rope|s&c|yoga|recovery|stretch|foam|massage gun|contrast shower|night training block)/.test(text);
    if (dog && handler) return 'both';
    if (dog) return 'dog';
    return 'handler';
  }

  function coachPlan(block) {
    const text = `${block.label || ''} ${block.desc || ''}`.toLowerCase();

    if (/night training block|night s&c|yoga \+ massage gun/.test(text)) {
      return 'Handler-only block:\n- Dog: crate/place with chew, calm music, no drills\n- You: complete your training session fully\n- After session: 2-3 min calm check-in only, then lights out';
    }
    if (/wake|hydrate|animals|water #1/.test(text)) {
      return 'Start-of-day standards:\n- Potty break before stimulation\n- 60-90 sec leash manners at door/gate\n- Quick body scan: paws, eyes, stool quality, hydration';
    }
    if (/dutchie workout/.test(text)) {
      return 'Working focus:\n- 5 min engagement: name game, eye contact, reward marker timing\n- 15-18 min drive work: flirt/fetch/sprint with impulse resets\n- 7-10 min obedience under arousal: Sit, Down, Place, Recall';
    }
    if (/dutchie feed|working meal|half dutchie dinner|dutchie dinner/.test(text)) {
      return 'Feeding protocol:\n- Hand-feed 30-50% through command reps\n- Use food for calm transitions (marker -> reward -> release)\n- Protection days: keep pre-session meal lighter to reduce bloat risk';
    }
    if (/power walk|dutchie walk|midday walk|decompression|sniffari/.test(text)) {
      return 'Walk structure:\n- Segment 1 (sniff decompression): long line, no pressure\n- Segment 2 (skills): heel entries, turns, down in motion, recall\n- Segment 3 (settle): loose lead, neutral exposure, calm finish';
    }
    if (/bite night|dutch shepherd training|protection sport/.test(text)) {
      return 'Protection progression:\n- Pre-session: arousal check, obedience warm-up, neutral focus\n- Main: controlled grips, clear outs, re-engagement on cue only\n- Post: decompression walk + hydration + paw/mouth check + notes';
    }
    if (/hike/.test(text)) {
      return 'Endurance + environmental confidence:\n- Start with loose-lead position and check-ins\n- Add controlled recalls every 15-20 minutes\n- Practice neutrality around people/dogs/wildlife';
    }
    if (/recovery|yoga|stretch|foam|massage/.test(text)) {
      return 'Recovery intent:\n- Keep dog work low-pressure and confidence-based\n- Prioritize handler recovery to protect consistency next day\n- End with calm crate/place routine';
    }
    if (/shower|breakfast|night shutdown|steam/.test(text)) {
      return 'Home routine standards:\n- Dog settles in crate/place while you reset\n- No high-drive games in this block\n- Keep transitions calm and predictable';
    }
    return 'Training intent:\n- Keep criteria clear\n- Reward precision, not speed\n- End each block with calm and a clear release cue';
  }

  function escapeHtml(text) {
    return String(text || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function initDailyTraining() {
    const root = document.getElementById('dailyTrainingApp');
    if (!root) return;

    const state = {
      dayIndex: 0,
      expandedIndex: null,
      checked: {}
    };

    function switchDay(index) {
      state.dayIndex = index;
      state.expandedIndex = null;
      state.checked = {};
      render();
    }

    function toggleChecked(index) {
      state.checked[index] = !state.checked[index];
      render();
    }

    function toggleExpanded(index) {
      state.expandedIndex = state.expandedIndex === index ? null : index;
      render();
    }

    function currentBlocks() {
      return (SCHEDULE[DAYS[state.dayIndex]] || []).filter(isTrainingRelevantBlock);
    }

    function render() {
      const blocks = currentBlocks();
      const doneCount = Object.values(state.checked).filter(Boolean).length;
      const progressPercent = blocks.length ? Math.round((doneCount / blocks.length) * 100) : 0;
      const dayHours = calcBlockHours(blocks);
      const weeklyHours = DAYS.reduce((sum, day) => sum + calcBlockHours((SCHEDULE[day] || []).filter(isTrainingRelevantBlock)), 0);

      root.innerHTML = `
        <div class="dtp-headline">Protector Program · Weekly Planner</div>
        <div class="dtp-days">
          ${DAYS.map((day, index) => `<button type="button" class="dtp-day-btn ${index === state.dayIndex ? 'active' : ''}" data-day="${index}">${day}</button>`).join('')}
        </div>
        <div class="dtp-summary">
          <div class="dtp-tile"><div class="k">Day Training Hours</div><div class="v">${dayHours.toFixed(1)} hrs</div></div>
          <div class="dtp-tile"><div class="k">Week Training Hours</div><div class="v">${weeklyHours.toFixed(1)} hrs</div></div>
          <div class="dtp-tile"><div class="k">Progress</div><div class="v">${doneCount}/${blocks.length} (${progressPercent}%)</div></div>
        </div>
        <div class="dtp-list-head">
          <span>Done</span>
          <span>Time</span>
          <span>Training Block</span>
          <span>More</span>
        </div>
        <div class="dtp-list">
          ${blocks.map((block, index) => {
            const isExpanded = state.expandedIndex === index;
            const isChecked = Boolean(state.checked[index]);
            const focus = blockFocus(block);
            const focusLabel = focus === 'both' ? 'Dog + Handler' : (focus === 'dog' ? 'Dog Focus' : 'Handler Focus');
            const plan = coachPlan(block);
            return `
              <article class="dtp-item" data-index="${index}">
                <div class="dtp-row" data-expand="${index}">
                  <div class="dtp-check ${isChecked ? 'on' : ''}" data-check="${index}"></div>
                  <div class="dtp-time">${escapeHtml(block.time)}${block.end ? `<br>${escapeHtml(block.end)}` : ''}</div>
                  <div class="dtp-label">${escapeHtml(block.icon || '')} ${escapeHtml(block.label)} <span class="dtp-focus ${focus}">${focusLabel}</span></div>
                  <div class="dtp-expand">${isExpanded ? '▲' : '▼'}</div>
                </div>
                ${isExpanded ? `
                  <div class="dtp-desc">
                    ${escapeHtml(block.desc)}
                    <div class="dtp-coach">${escapeHtml(plan)}</div>
                    ${block.reminder ? `<div class="dtp-reminder">${escapeHtml(block.reminder)}</div>` : ''}
                  </div>
                ` : ''}
              </article>
            `;
          }).join('')}
        </div>
      `;
    }

    root.addEventListener('click', (event) => {
      const dayButton = event.target.closest('[data-day]');
      if (dayButton) {
        switchDay(Number(dayButton.getAttribute('data-day')));
        return;
      }

      const checkBox = event.target.closest('[data-check]');
      if (checkBox) {
        event.stopPropagation();
        toggleChecked(Number(checkBox.getAttribute('data-check')));
        return;
      }

      const expandRow = event.target.closest('[data-expand]');
      if (expandRow) {
        toggleExpanded(Number(expandRow.getAttribute('data-expand')));
      }
    });

    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDailyTraining);
  } else {
    initDailyTraining();
  }
})();

