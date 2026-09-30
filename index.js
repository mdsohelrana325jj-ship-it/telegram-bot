const { Telegraf } = require('telegraf');

const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) throw new Error('BOT_TOKEN is missing');

const CHANNEL_ID = Number(process.env.CHANNEL_ID || -1003985236266);
const bot = new Telegraf(BOT_TOKEN);
let SETTINGS_LOADER = null;
const PROCESSED_USERS = new Set();

const DEFAULTS = {
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
  voice_text: '🎙️ ব্রডকাস্টার ভয়েস মেসেজ হুবহু 🎙️🎙️',
  voice_button_text: '🎙️🎙️ 🔤🔠🔡🔣 🔤🔠🔢🔤 🎙️🎙️',
  main_buttons: [
    { enabled: true, text: '👑 🔤🔠🔡 🔤🔠🔡🔡 🔤🔠🔡🔤 👑', url: 'https://t.me/+WZR7nsATt1szNmRh' },
    { enabled: true, text: '🤖 🔤🔠 🔤🔠🔠🔠 🔠🔠🔠🔠 🔠🔠🔠🔠 🤖', url: 'https://t.me/sohel_ai_prediction_bot' },
    { enabled: true, text: '🚀 🔠🔠🔠🔠🔠🔠 🔠🔠🔠🔠🔠 ⏰', url: 'https://t.me/TRADER_SOHEL_BDT_TOP' }
  ],
  video_buttons: [
    { enabled: true, text: '🎬 🔤🔠🔠🔠🔠🟢🔠 🔤🔠🔠🔠🔠🔠🔠 🔠🔠🔠🔠🔠🔠🔠 🔠🔠🔠🔠🔠🟢', url: 'https://t.me/+gNZZwOIN72BjYzQ1' },
    { enabled: true, text: '📢 🔤🔠🔠🔠🔠 🔠🔠🔠🔠🔠🔠🔠 🔠🔠🔠🔠🔠🔠🔠 🔠🔠🔠🔠🔠🟢', url: 'https://t.me/EARNING_TEME_bd' }
  ]
};

const clone = x => JSON.parse(JSON.stringify(x));

function normalize(raw) {
  const s = { ...clone(DEFAULTS), ...(raw || {}) };
  s.duration = Math.max(30, Math.min(900, Math.floor(Number(s.duration) || 300)));
  if (!['small', 'medium', 'large'].includes(s.welcome_text_size)) s.welcome_text_size = 'medium';
  s.main_buttons = Array.isArray(s.main_buttons) ? s.main_buttons.slice(0, 3) : clone(DEFAULTS.main_buttons);
  s.video_buttons = Array.isArray(s.video_buttons) ? s.video_buttons.slice(0, 2) : clone(DEFAULTS.video_buttons);
  while (s.main_buttons.length < 3) s.main_buttons.push({ enabled: false, text: '', url: '' });
  while (s.video_buttons.length < 2) s.video_buttons.push({ enabled: false, text: '', url: '' });
  return s;
}

function setSettingsLoader(loader) {
  SETTINGS_LOADER = loader;
}

async function getSettings() {
  try {
    return normalize(SETTINGS_LOADER ? await SETTINGS_LOADER() : DEFAULTS);
  } catch (e) {
    console.error('SETTINGS LOADER ERROR:', e?.message || e);
    return normalize(DEFAULTS);
  }
}

function privateOptions(userId) {
  return {
    ephemeral_message_parameters: {
      receiver_user_id: Number(userId)
    }
  };
}

function keyboard(buttons) {
  const rows = [];
  for (const b of Array.isArray(buttons) ? buttons : []) {
    if (!b?.enabled) continue;
    const text = String(b.text || '').trim();
    const url = String(b.url || '').trim();
    if (!text || !url) continue;
    rows.push([{ text, url }]);
  }
  return { inline_keyboard: rows };
}

function rememberTimer(userId, timer) {
  if (!rememberTimer.map) rememberTimer.map = new Map();
  const old = rememberTimer.map.get(Number(userId)) || [];
  old.push(timer);
  rememberTimer.map.set(Number(userId), old);
}

function deleteLater(userId, ephemeralMessageId, seconds, label) {
  const eid = Number(ephemeralMessageId || 0);
  if (!eid) {
    console.error('NO EPHEMERAL MESSAGE ID - CANNOT SCHEDULE DELETE', { userId, label });
    return;
  }

  const delay = Math.max(30, Math.min(900, Number(seconds) || 300)) * 1000;
  const timer = setTimeout(async () => {
    try {
      const result = await bot.telegram.callApi('deleteEphemeralMessage', {
        chat_id: CHANNEL_ID,
        receiver_user_id: Number(userId),
        ephemeral_message_id: eid
      });
      console.log('EPHEMERAL DELETED', { userId, eid, label, result });
    } catch (e) {
      console.error('DELETE EPHEMERAL FAILED', {
        userId,
        eid,
        label,
        error: e?.response?.description || e?.message || e
      });
    }
  }, delay);

  rememberTimer(userId, timer);
  console.log('DELETE SCHEDULED', { userId, eid, label, afterSeconds: delay / 1000 });
}

function welcomeText(member, settings) {
  return String(settings.welcome_text || DEFAULTS.welcome_text)
    .replaceAll('{first_name}', String(member?.first_name || member?.username || 'প্রিয় সদস্য'))
    .replaceAll('{channel_title}', String(settings.channel_title || DEFAULTS.channel_title));
}

async function getProfilePhotoFileId(userId, enabled) {
  if (!enabled) return null;
  try {
    const r = await bot.telegram.getUserProfilePhotos(userId, 0, 1);
    const photo = r?.photos?.[0];
    if (!photo?.length) return null;
    return photo[photo.length - 1].file_id;
  } catch (e) {
    console.error('PROFILE PHOTO ERROR:', e?.message || e);
    return null;
  }
}

async function sendEphemeralMessage(userId, text, replyMarkup) {
  const payload = {
    chat_id: CHANNEL_ID,
    text,
    ...privateOptions(userId)
  };
  if (replyMarkup?.inline_keyboard?.length) payload.reply_markup = replyMarkup;
  return bot.telegram.callApi('sendMessage', payload);
}

async function sendEphemeralPhoto(userId, photo, caption, replyMarkup) {
  const payload = {
    chat_id: CHANNEL_ID,
    photo,
    caption,
    ...privateOptions(userId)
  };
  if (replyMarkup?.inline_keyboard?.length) payload.reply_markup = replyMarkup;
  return bot.telegram.callApi('sendPhoto', payload);
}

async function sendEphemeralVideo(userId, video, replyMarkup) {
  const payload = {
    chat_id: CHANNEL_ID,
    video,
    supports_streaming: true,
    ...privateOptions(userId)
  };
  if (replyMarkup?.inline_keyboard?.length) payload.reply_markup = replyMarkup;
  return bot.telegram.callApi('sendVideo', payload);
}

async function sendEphemeralAudio(userId, audio, replyMarkup) {
  const payload = {
    chat_id: CHANNEL_ID,
    audio,
    ...privateOptions(userId)
  };
  if (replyMarkup?.inline_keyboard?.length) payload.reply_markup = replyMarkup;
  return bot.telegram.callApi('sendAudio', payload);
}

function shortFileId(id) {
  const s = String(id || '');
  return s ? `${s.slice(0, 12)}...` : '';
}

async function sendWelcome(member) {
  if (!member?.id) return;

  const userId = Number(member.id);
  const settings = await getSettings();
  if (!settings.welcome_enabled) return;

  const ttl = settings.duration;
  const mainKeys = keyboard(settings.main_buttons);
  const mediaKeys = keyboard(settings.video_buttons);

  console.log('WELCOME START', {
    userId,
    channelId: CHANNEL_ID,
    duration: ttl,
    videoFileId: shortFileId(settings.video_file_id),
    audioFileId: shortFileId(settings.audio_file_id),
    videoUrl: Boolean(settings.video_url),
    audioUrl: Boolean(settings.audio_url)
  });

  // 1) Welcome + profile photo + 3 main buttons
  try {
    const photo = await getProfilePhotoFileId(userId, settings.profile_photo_enabled);
    const result = photo
      ? await sendEphemeralPhoto(userId, photo, welcomeText(member, settings), mainKeys)
      : await sendEphemeralMessage(userId, welcomeText(member, settings), mainKeys);

    console.log('WELCOME SENT', {
      userId,
      ephemeralMessageId: result?.ephemeral_message_id,
      rawMessageId: result?.message_id
    });

    deleteLater(userId, result?.ephemeral_message_id, ttl, 'welcome');
  } catch (e) {
    console.error('WELCOME SEND FAILED:', e?.response?.description || e?.message || e);
  }

  // 2) Video
  let videoSent = false;
  const video = settings.video_file_id || String(settings.video_url || '').trim();

  if (video) {
    try {
      const result = await sendEphemeralVideo(
        userId,
        video,
        settings.audio_file_id || settings.audio_url ? null : mediaKeys
      );

      videoSent = true;
      console.log('VIDEO SENT', {
        userId,
        source: settings.video_file_id ? 'file_id' : 'url',
        ephemeralMessageId: result?.ephemeral_message_id,
        rawMessageId: result?.message_id
      });

      deleteLater(userId, result?.ephemeral_message_id, ttl, 'video');
    } catch (e) {
      console.error('VIDEO SEND FAILED:', e?.response?.description || e?.message || e);
    }
  } else {
    console.log('VIDEO SKIPPED: no video_file_id and no video_url');
  }

  // 3) Audio; if both video+audio exist, buttons go under the final audio
  const audio = settings.audio_file_id || String(settings.audio_url || '').trim();

  if (audio) {
    try {
      const result = await sendEphemeralAudio(userId, audio, mediaKeys);

      console.log('AUDIO SENT', {
        userId,
        source: settings.audio_file_id ? 'file_id' : 'url',
        ephemeralMessageId: result?.ephemeral_message_id,
        rawMessageId: result?.message_id
      });

      deleteLater(userId, result?.ephemeral_message_id, ttl, 'audio');
    } catch (e) {
      console.error('AUDIO SEND FAILED:', e?.response?.description || e?.message || e);
    }
  } else {
    console.log('AUDIO SKIPPED: no audio_file_id and no audio_url');

    // If there is no audio but there is a video, keep the 2 media buttons under video.
    if (videoSent) {
      // The video was intentionally sent without buttons only when audio existed.
      // If audio is absent, video already received mediaKeys above.
    } else if (mediaKeys.inline_keyboard.length) {
      try {
        const result = await sendEphemeralMessage(userId, '📌 মিডিয়া বাটন লিংক', mediaKeys);
        console.log('MEDIA BUTTONS SENT', { userId, ephemeralMessageId: result?.ephemeral_message_id });
        deleteLater(userId, result?.ephemeral_message_id, ttl, 'media-buttons');
      } catch (e) {
        console.error('MEDIA BUTTON SEND FAILED:', e?.response?.description || e?.message || e);
      }
    }
  }

  console.log('WELCOME FINISHED', { userId });
}

async function handleNewMember(member, chatId) {
  if (Number(chatId) !== CHANNEL_ID || !member?.id) return;

  const id = Number(member.id);
  if (PROCESSED_USERS.has(id)) {
    console.log('WELCOME ALREADY PROCESSED IN THIS SERVER SESSION', { userId: id });
    return;
  }

  try {
    await sendWelcome(member);
    PROCESSED_USERS.add(id);
  } catch (e) {
    console.error('WELCOME HANDLER ERROR:', e?.message || e);
  }
}

bot.on('chat_member', async ctx => {
  try {
    const u = ctx.update?.chat_member;
    if (!u || Number(u.chat?.id) !== CHANNEL_ID) return;

    const oldStatus = u.old_chat_member?.status;
    const newStatus = u.new_chat_member?.status;
    const user = u.new_chat_member?.user;

    const joined =
      (oldStatus === 'left' || oldStatus === 'kicked') &&
      ['member', 'administrator', 'creator'].includes(newStatus);

    if (joined) await handleNewMember(user, u.chat.id);
  } catch (e) {
    console.error('chat_member ERROR:', e?.response?.description || e?.message || e);
  }
});

// Kept for compatibility with group/supergroup joins.
bot.on('new_chat_members', async ctx => {
  if (Number(ctx.chat?.id) !== CHANNEL_ID) return;
  for (const member of ctx.message?.new_chat_members || []) {
    await handleNewMember(member, ctx.chat.id);
  }
});

// Send the full welcome privately to the person who runs this command.
bot.command('welcome_test', async ctx => {
  try {
    console.log('WELCOME TEST FROM', ctx.from?.id);
    await sendWelcome(ctx.from);
  } catch (e) {
    console.error('welcome_test ERROR:', e?.response?.description || e?.message || e);
  }
});

async function startBot() {
  await bot.telegram.deleteWebhook({ drop_pending_updates: false });
  const me = await bot.telegram.getMe();

  console.log('==========================================');
  console.log('SOHEL VAI BOT:', `@${me.username}`);
  console.log('CHANNEL_ID:', CHANNEL_ID);
  console.log('MEDIA_STORAGE_CHAT_ID: NOT USED');
  console.log('MEDIA SYSTEM: Telegram file_id / direct URL');
  console.log('==========================================');

  await bot.launch({
    allowedUpdates: ['chat_member', 'message'],
    dropPendingUpdates: false
  });
}

function stopBot(reason = 'stop') {
  try { bot.stop(reason); } catch (_) {}
}

module.exports = {
  bot,
  startBot,
  stopBot,
  setSettingsLoader,
  sendWelcome,
  CONFIG: { CHANNEL_ID }
};
