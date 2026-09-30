const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
app.use(express.json({ limit: '2mb' }));

const PORT = Number(process.env.PORT || 3000);
const DATA_DIR = path.join(__dirname, 'data');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
const PASSWORD_FILE = path.join(DATA_DIR, 'admin-password.json');
const PUBLIC_DIR = path.join(__dirname, 'public');

fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(PUBLIC_DIR, { recursive: true });

const DEFAULT_SETTINGS = {
  welcome_enabled: true,
  profile_photo_enabled: true,
  channel_title: 'SOHEL VAI OFFICIAL CHANNEL',
  welcome_text: `👋 স্বাগতম {first_name} ভাই 🇧🇩\n\n📢 আমাদের টেলিগ্রাম চ্যানেলে স্বাগতম!\n👑 SOHEL VAI OFFICIAL CHANNEL JOIN করতে ভুলবেন না 🚀\n\n📌 কোনো সমস্যা বা কোনো জানার প্রশ্ন থাকলে,\nআমাদের Official Channel-এ Join করতে ভুলবেন না আপনার অ্যাকাউন্ট সুরক্ষিত রাখুন।\n\nপ্রতিটি নতুন আপডেট পেতে আমাদের সাথে যুক্ত থাকুন কোনো ভুল বা কোনো সমস্যা এড়াতে আপনার প্রোফাইল নিরাপদ রাখুন 💯\n\n💬 নিয়মিত আপডেট পেতে আমাদের সাথেই থাকবেন।🤝🎉\n👑 ── SOHEL VAI ── 👑`,
  welcome_text_size: 'medium',
  duration: 300,
  video_file_id: '',
  video_filename: '',
  video_url: '',
  audio_file_id: '',
  audio_filename: '',
  audio_url: '',
  voice_text: '🎵 ব্রডকাস্টার ভয়েস মেসেজ 🎵🎵',
  voice_button_text: '🎵🎵 🔤🔠🔡🔣 🔤🔠🔢🔤 🎵🎵',
  main_buttons: [
    { enabled: true, text: '👑 🔤🔠🔡 🔤🔠🔡🔡 🔤🔠🔡🔤 👑', url: 'https://t.me/+WZR7nsATt1szNmRh' },
    { enabled: true, text: '🤖 🔤🔠 🔤🔠🔠🔠 🔠🔠🔠🔠 🔠🔠🔠🔠 🤖', url: 'https://t.me/sohel_ai_prediction_bot' },
    { enabled: true, text: '🚀 🔠🔠🔠🔠🔠🔠 🔠🔠🔠🔠🔠 ⏰', url: 'https://t.me/TRADER_SOHEL_BDT_TOP' }
  ],
  // video_buttons এর পরিবর্তে নতুন নাম media_buttons ব্যবহার করা হলো
  media_buttons: [
    { enabled: true, text: '🎬 🔤🔠🔠🔠🔠🟢🔠 🔤🔠🔠🔠🔠🔠🔠 🔤🔠🔠🔠🔠🔠🔠 🔤🔠🔠🔠🔠🟢', url: 'https://t.me/+gNZZwOIN72BjYzQ1' },
    { enabled: true, text: '📢 🔤🔠🔠🔠🔠 🔠🔠🔠🔠🔠🔠🔠 🔠🔠🔠🔠🔠🔠🔠 🔠🔠🔠🔠🔠🟢', url: 'https://t.me/EARNING_TEME_bd' }
  ]
};

const clone = obj => JSON.parse(JSON.stringify(obj));

function loadSettings() {
  if (!fs.existsSync(SETTINGS_FILE)) {
    const d = clone(DEFAULT_SETTINGS);
    saveSettings(d);
    return d;
  }

  try {
    const saved = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
    return { ...clone(DEFAULT_SETTINGS), ...saved };
  } catch (e) {
    console.error('SETTINGS LOAD ERROR:', e?.message || e);
    return clone(DEFAULT_SETTINGS);
  }
}

function saveSettings(settings) {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf8');
}

function hash(password) {
  return crypto.createHash('sha256').update(String(password)).digest('hex');
}

function loadPassword() {
  if (!fs.existsSync(PASSWORD_FILE)) {
    const h = hash(process.env.ADMIN_DEFAULT_PASSWORD || 'SOHEL@12345');
    fs.writeFileSync(PASSWORD_FILE, JSON.stringify({ password_hash: h }, null, 2));
    return h;
  }

  try {
    return JSON.parse(fs.readFileSync(PASSWORD_FILE, 'utf8')).password_hash;
  } catch (_) {
    return hash(process.env.ADMIN_DEFAULT_PASSWORD || 'SOHEL@12345');
  }
}

function savePassword(password) {
  fs.writeFileSync(
    PASSWORD_FILE,
    JSON.stringify({ password_hash: hash(password) }, null, 2),
    'utf8'
  );
}

function adminAuth(req, res, next) {
  const password = req.get('X-Admin-Password');
  if (!password || hash(password) !== loadPassword()) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' });
  }
  next();
}

const { bot, startBot, stopBot, setSettingsLoader } = require('./index.js');
setSettingsLoader(() => loadSettings());

app.get('/api/settings', adminAuth, (req, res) => {
  res.json({ ok: true, settings: loadSettings() });
});

app.post('/api/settings', adminAuth, (req, res) => {
  try {
    const incoming = req.body?.settings || req.body;
    if (!incoming || typeof incoming !== 'object') {
      return res.status(400).json({ ok: false, error: 'Invalid settings' });
    }

    const settings = { ...loadSettings(), ...incoming };
    settings.duration = Math.max(30, Math.min(900, Math.floor(Number(settings.duration) || 300)));

    if (!['small', 'medium', 'large'].includes(settings.welcome_text_size)) {
      settings.welcome_text_size = 'medium';
    }

    if (!Array.isArray(settings.main_buttons)) {
      settings.main_buttons = clone(DEFAULT_SETTINGS.main_buttons);
    }

    // ব্যাকএন্ড ভ্যালিডেশনে video_buttons এর বদলে media_buttons চেক করা হচ্ছে
    if (!Array.isArray(settings.media_buttons)) {
      settings.media_buttons = clone(DEFAULT_SETTINGS.media_buttons);
    }

    saveSettings(settings);
    res.json({ ok: true, settings });
  } catch (e) {
    console.error('SAVE SETTINGS ERROR:', e?.message || e);
    res.status(500).json({ ok: false, error: 'Save failed' });
  }
});

// 50 MB matches Telegram bot sendVideo/sendAudio limits.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }
});

function telegramError(e) {
  return e?.response?.description || e?.description || e?.message || String(e);
}

async function uploadToTelegramAndDelete(file, type) {
  if (!process.env.BOT_TOKEN) throw new Error('BOT_TOKEN is missing');

  const channelId = Number(process.env.CHANNEL_ID || -1003985236266);
  let sent;

  if (type === 'video') {
    sent = await bot.telegram.sendVideo(channelId, {
      source: file.buffer,
      filename: file.originalname
    });
  } else if (type === 'audio') {
    sent = await bot.telegram.sendAudio(channelId, {
      source: file.buffer,
      filename: file.originalname
    });
  } else {
    throw new Error('Invalid media type');
  }

  const fileId = type === 'video' ? sent?.video?.file_id : sent?.audio?.file_id;
  const messageId = Number(sent?.message_id || 0);

  if (!fileId) {
    throw new Error(`Telegram did not return ${type} file_id`);
  }

  console.log('MEDIA TEMP UPLOAD OK', {
    type,
    channelId,
    messageId,
    fileId: `${String(fileId).slice(0, 12)}...`
  });

  if (messageId) {
    try {
      await bot.telegram.deleteMessage(channelId, messageId);
      console.log('MEDIA TEMP MESSAGE DELETED', { type, messageId });
    } catch (e) {
      console.error('TEMP MEDIA DELETE FAILED:', telegramError(e));
    }
  }

  return fileId;
}

app.post('/api/upload', adminAuth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ ok: false, error: 'No file uploaded' });
    }

    const type = req.body?.media_type;
    if (type !== 'video' && type !== 'audio') {
      return res.status(400).json({ ok: false, error: 'Invalid media type' });
    }

    console.log('ADMIN MEDIA UPLOAD', {
      type,
      filename: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    });

    const fileId = await uploadToTelegramAndDelete(req.file, type);
    const settings = loadSettings();

    if (type === 'video') {
      settings.video_file_id = fileId;
      settings.video_filename = req.file.originalname;
      settings.video_url = '';
    } else {
      settings.audio_file_id = fileId;
      settings.audio_filename = req.file.originalname;
      settings.audio_url = '';
    }

    saveSettings(settings);

    res.json({
      ok: true,
      file_id: fileId,
      telegram_file_id: fileId,
      filename: req.file.originalname,
      media_type: type
    });
  } catch (e) {
    console.error('UPLOAD ERROR:', telegramError(e));
    res.status(500).json({ ok: false, error: telegramError(e) });
  }
});

app.post('/api/remove-media', adminAuth, (req, res) => {
  const type = req.body?.media_type;
  const settings = loadSettings();

  if (type === 'video') {
    settings.video_file_id = '';
    settings.video_filename = '';
    settings.video_url = '';
  } else if (type === 'audio') {
    settings.audio_file_id = '';
    settings.audio_filename = '';
    settings.audio_url = '';
  } else {
    return res.status(400).json({ ok: false, error: 'Invalid media type' });
  }

  saveSettings(settings);
  res.json({ ok: true, settings });
});

app.post('/api/reset', adminAuth, (req, res) => {
  const settings = clone(DEFAULT_SETTINGS);
  saveSettings(settings);
  res.json({ ok: true, settings });
});

app.post('/api/change-password', adminAuth, (req, res) => {
  const oldPassword = String(req.body?.old_password || '');
  const newPassword = String(req.body?.new_password || '');

  if (hash(oldPassword) !== loadPassword()) {
    return res.status(401).json({ ok: false, error: 'Current password incorrect' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ ok: false, error: 'Password must be at least 6 characters' });
  }

  savePassword(newPassword);
  res.json({ ok: true });
});

app.use(express.static(PUBLIC_DIR));
app.get('/', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'admin.html')));

const server = app.listen(PORT, () => {
  console.log(`Admin API running on port ${PORT}`);
});

startBot().catch(e => {
  console.error('BOT START FAILED:', telegramError(e));
  server.close(() => process.exit(1));
});

process.once('SIGINT', () => {
  stopBot('SIGINT');
  server.close(() => process.exit(0));
});

process.once('SIGTERM', () => {
  stopBot('SIGTERM');
  server.close(() => process.exit(0));
});
