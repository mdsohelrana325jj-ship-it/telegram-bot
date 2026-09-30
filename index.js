const { Telegraf } = require("telegraf");

const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) throw new Error("BOT_TOKEN মালিকানাধীন বা অনুপস্থিত (BOT_TOKEN is missing)");

const CHANNEL_ID = Number(process.env.CHANNEL_ID || -1003985236266);
const bot = new Telegraf(BOT_TOKEN);
let SETTINGS_LOADER = null;
const PROCESSED_USERS = new Set();

const DEFAULTS = {
  welcome_enabled: true,
  profile_photo_enabled: true,
  channel_title: "SOHEL VAI OFFICIAL CHANNEL",
  welcome_text: `🎉 স্বাগতম {first_name} ভাই ❤️\n\n📢 আমাদের চ্যানেলে যুক্ত হওয়ার জন্য ধন্যবাদ!\n🔥 SOHEL VAI OFFICIAL CHANNEL JOIN করতে ভুলবেন না 🚀\n\n⭐ বিশেষ নির্দেশিকা ও নিয়মাবলী ⭐\nআপনার আইডি সুরক্ষিত রাখতে এবং অফিশিয়াল Channel-এ Join করতে ভুলবেন না যাতে কোনো আপডেট মিস না হয়।\n\nনিয়ম মেনে চলুন এবং কোনো প্রকার সমস্যা হলে এডমিনের সাথে যোগাযোগ করতে পারেন 🌸\n\n📌 নিয়মিত নতুন Update পেতে আমাদের সাথেই থাকুন!\n✨ ▬ SOHEL VAI ▬ ✨`,
  welcome_text_size: "medium",
  duration: 300,
  video_file_id: "",
  video_filename: "",
  video_url: "",
  audio_file_id: "",
  audio_filename: "",
  audio_url: "",
  voice_text: "🎙️️ ব্রডকাস্ট ভয়েস মেসেজ শুনুন 🎙️🎙️",
  voice_button_text: "🎙️️🎙️ ব্রডকাস্ট ভয়েস মেসেজ 🎙️🎙️",
  main_buttons: [
    { enabled:true, text:"🔥 সোয়েল এআই প্রেডিকশন চ্যানেল 🔥", url:"https://t.me/+WZR7nsATt1szNmRh" },
    { enabled:true, text:"🌟 ভিআইপি সিগন্যাল গ্রুপ 🌟", url:"https://t.me/sohel_ai_prediction_bot" },
    { enabled:true, text:"💎 ট্রেডার সোয়েল বিডি চ্যানেল 💎", url:"https://t.me/TRADER_SOHEL_BDT_TOP" }
  ],
  video_buttons: [
    { enabled:true, text:"📌 অফিশিয়াল সিগন্যাল গ্রুপ লিংক 📌", url:"https://t.me/+gNZZwOIN72BjYzQ1" },
    { enabled:true, text:"🎁 আর্নিং টিম বিডি গ্রুপ লিংক 🎁", url:"https://t.me/EARNING_TEME_bd" }
  ]
};

const copy = x => JSON.parse(JSON.stringify(x));
const normalize = raw => {
  const s = { ...copy(DEFAULTS), ...(raw || {}) };
  s.duration = Math.max(30, Math.min(900, Math.floor(Number(s.duration) || 300)));
  if (!['small','medium','large'].includes(s.welcome_text_size)) s.welcome_text_size = 'medium';
  s.main_buttons = Array.isArray(s.main_buttons) ? s.main_buttons.slice(0,3) : copy(DEFAULTS.main_buttons);
  s.video_buttons = Array.isArray(s.video_buttons) ? s.video_buttons.slice(0,2) : copy(DEFAULTS.video_buttons);
  while(s.main_buttons.length < 3) s.main_buttons.push({enabled:false,text:'',url:''});
  while(s.video_buttons.length < 2) s.video_buttons.push({enabled:false,text:'',url:''});
  return s;
};

function setSettingsLoader(loader){ SETTINGS_LOADER = loader; }
async function getSettings(){
  try { return normalize(SETTINGS_LOADER ? await SETTINGS_LOADER() : DEFAULTS); }
  catch(e){ console.error("Settings loader:", e?.message || e); return normalize(DEFAULTS); }
}
function privateOptions(userId){ return { ephemeral_message_parameters:{ receiver_user_id:Number(userId) } }; }
function keyboard(buttons){
  const rows=[];
  for(const b of Array.isArray(buttons)?buttons:[]){
    if(!b?.enabled || !String(b.text||'').trim() || !String(b.url||'').trim()) continue;
    rows.push([{text:String(b.text).trim(),url:String(b.url).trim()}]);
  }
  return {inline_keyboard:rows};
}
function deleteLater(userId,messageId,seconds){
  if(!messageId) return;
  setTimeout(async()=>{
    try{ if(bot.telegram.deleteEphemeralMessage) await bot.telegram.deleteEphemeralMessage(CHANNEL_ID,Number(userId),Number(messageId)); }
    catch(e){ console.log("Delete error:",e?.message||e); }
  },Math.max(30,Math.min(900,Number(seconds)||300))*1000);
}
function welcomeText(member,s){
  return String(s.welcome_text || DEFAULTS.welcome_text)
    .replaceAll('{first_name}',String(member?.first_name||member?.username||'প্রিয় ভাই'))
    .replaceAll('{channel_title}',String(s.channel_title||DEFAULTS.channel_title));
}
async function profilePhoto(userId,enabled){
  if(!enabled) return null;
  try{
    const r=await bot.telegram.getUserProfilePhotos(userId,0,1);
    const p=r?.photos?.[0];
    return p?.length ? p[p.length-1].file_id : null;
  }catch(e){ return null; }
}
async function sendText(userId,text,keys){
  const o=privateOptions(userId); if(keys?.inline_keyboard?.length) o.reply_markup=keys;
  return bot.telegram.sendMessage(CHANNEL_ID,text,o);
}
async function sendPhoto(userId,photo,caption,keys){
  const o=privateOptions(userId); o.caption=caption; if(keys?.inline_keyboard?.length)o.reply_markup=keys;
  return bot.telegram.sendPhoto(CHANNEL_ID,photo,o);
}
async function sendVideo(userId,video,keys){
  const o=privateOptions(userId); o.supports_streaming=true; if(keys?.inline_keyboard?.length)o.reply_markup=keys;
  return bot.telegram.sendVideo(CHANNEL_ID,video,o);
}
async function sendAudio(userId,audio,keys){
  const o=privateOptions(userId); if(keys?.inline_keyboard?.length)o.reply_markup=keys;
  return bot.telegram.sendAudio(CHANNEL_ID,audio,o);
}

async function sendWelcome(member){
  if(!member?.id) return;
  const userId=Number(member.id), s=await getSettings();
  if(!s.welcome_enabled) return;
  const ttl=s.duration;

  const photo=await profilePhoto(userId,s.profile_photo_enabled);
  const mainKeys=keyboard(s.main_buttons);
  const w=photo ? await sendPhoto(userId,photo,welcomeText(member,s),mainKeys) : await sendText(userId,welcomeText(member,s),mainKeys);
  deleteLater(userId,w?.message_id,ttl);

  const mediaKeys=keyboard(s.video_buttons);
  const video=s.video_file_id || s.video_url;
  const audio=s.audio_file_id || s.audio_url;
  let videoSent=false;

  if(video){
    try{
      const m=await sendVideo(userId,video, audio ? undefined : mediaKeys);
      videoSent=true;
      deleteLater(userId,m?.message_id,ttl);
    }catch(e){ console.error("VIDEO SEND FAILED:",e?.message||e); }
  }

  if(audio){
    try{
      const m=await sendAudio(userId,audio,mediaKeys);
      deleteLater(userId,m?.message_id,ttl);
    }catch(e){ console.error("AUDIO SEND FAILED:",e?.message||e); }
  }else if(!videoSent && mediaKeys.inline_keyboard.length){
    try{
      const m=await sendText(userId,"📌 ব্রডকাস্ট ব্রডকাস্ট লিংক",mediaKeys);
      deleteLater(userId,m?.message_id,ttl);
    }catch(e){ console.error("MEDIA BUTTON SEND FAILED:",e?.message||e); }
  }
}

async function handleNewMember(member,chatId){
  if(Number(chatId)!==CHANNEL_ID || !member?.id) return;
  const id=Number(member.id); if(PROCESSED_USERS.has(id)) return;
  try{ await sendWelcome(member); PROCESSED_USERS.add(id); }catch(e){ console.error("WELCOME SEND ERROR:",e?.message||e); }
}

bot.on('chat_member',async ctx=>{
  try{
    const u=ctx.update?.chat_member; if(!u || Number(u.chat?.id)!==CHANNEL_ID) return;
    const oldStatus=u.old_chat_member?.status, newStatus=u.new_chat_member?.status, user=u.new_chat_member?.user;
    if((oldStatus==='left'||oldStatus==='kicked') && ['member','administrator','creator'].includes(newStatus)) await handleNewMember(user,u.chat.id);
  }catch(e){ console.error('chat_member:',e?.message||e); }
});
bot.on('new_chat_members',async ctx=>{
  if(Number(ctx.chat?.id)!==CHANNEL_ID) return;
  for(const m of (ctx.message?.new_chat_members||[])) await handleNewMember(m,ctx.chat.id);
});
bot.command('welcome_test',async ctx=>{ try{ await sendWelcome(ctx.from); }catch(e){console.error('welcome_test:',e?.message||e);} });

async function startBot(){
  await bot.telegram.deleteWebhook({drop_pending_updates:false});
  const me=await bot.telegram.getMe();
  console.log('SOHEL VAI BOT:',`@${me.username}`,'CHANNEL:',CHANNEL_ID,'MEDIA_STORAGE:',process.env.MEDIA_STORAGE_CHAT_ID||'NOT SET');
  await bot.launch({allowedUpdates:['chat_member','message'],dropPendingUpdates:false});
}
function stopBot(reason='stop'){ try{bot.stop(reason);}catch{} }
module.exports={bot,startBot,stopBot,setSettingsLoader,sendWelcome,CONFIG:{CHANNEL_ID}};
