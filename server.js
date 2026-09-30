const express=require('express');
const multer=require('multer');
const fs=require('fs');
const path=require('path');
const crypto=require('crypto');

const app=express();
app.use(express.json({limit:'2mb'}));
const PORT=Number(process.env.PORT||3000);
const DATA_DIR=path.join(__dirname,'data');
const SETTINGS_FILE=path.join(DATA_DIR,'settings.json');
const PASSWORD_FILE=path.join(DATA_DIR,'admin-password.json');
const PUBLIC_DIR=path.join(__dirname,'public');
fs.mkdirSync(DATA_DIR,{recursive:true});
fs.mkdirSync(PUBLIC_DIR,{recursive:true});

const DEFAULT_SETTINGS={
  welcome_enabled:true, profile_photo_enabled:true,
  channel_title:'SOHEL VAI OFFICIAL CHANNEL',
  welcome_text:`🎉 স্বাগতম {first_name} ভাই 🇧🇩\n\n📢 আমাদের চ্যানেল জয়েন করার জন্য ধন্যবাদ 👑\n\nএখান থেকে নিয়মিত নতুন Update পাবেন.\n\nআমাদের সাথে যুক্ত থাকুন আশা করি কোনো না কোনো দিন আপনার উপকারে আসবো ইনশাআল্লাহ 🥰`,
  welcome_text_size:'medium', duration:300,
  video_file_id:'',video_filename:'',video_url:'',
  audio_file_id:'',audio_filename:'',audio_url:'',
  voice_text:'🎵 ব্রাদার্স মিক্সড ভয়েস মেসেজ 🎵🎵',voice_button_text:'🎵🎵 𝐒𝐎𝐇𝐄𝐋 𝐕𝐀𝐈 🎵🎵',
  main_buttons:[
    {enabled:true,text:'👑 𝐎𝐅𝐅𝐈𝐂𝐈𝐀𝐋 𝐆𝐑𝐎𝐔𝐏 𝐉𝐎𝐈𝐍 👑',url:'https://t.me/+WZR7nsATt1szNmRh'},
    {enabled:true,text:'🤖 AI PREDICTION VIP HACK 🤖',url:'https://t.me/sohel_ai_prediction_bot'},
    {enabled:true,text:'⚡ TRADER SOHEL BDT TOP ⭐⏱️',url:'https://t.me/TRADER_SOHEL_BDT_TOP'}
  ],
  video_buttons:[
    {enabled:true,text:'🎥 𝐕𝐈𝐏 𝐂𝐇𝐀𝐍𝐍𝐄𝐋 𝐉𝐎𝐈𝐍 𝐋𝐈𝐍𝐊 🏓',url:'https://t.me/+gNZZwOIN72BjYzQ1'},
    {enabled:true,text:'🚀 𝐄𝐀𝐑𝐍𝐈𝐍𝐆 𝐓𝐄𝐌𝐄 𝐉𝐎𝐈𝐍 𝐋𝐈𝐍𝐊 🏓',url:'https://t.me/EARNING_TEME_bd'}
  ]
};
const clone=o=>JSON.parse(JSON.stringify(o));
function loadSettings(){
  if(!fs.existsSync(SETTINGS_FILE)){const d=clone(DEFAULT_SETTINGS);saveSettings(d);return d;}
  try{return {...clone(DEFAULT_SETTINGS),...JSON.parse(fs.readFileSync(SETTINGS_FILE,'utf8'))};}
  catch(e){console.error('SETTINGS LOAD ERROR',e);return clone(DEFAULT_SETTINGS);}
}
function saveSettings(s){fs.writeFileSync(SETTINGS_FILE,JSON.stringify(s,null,2),'utf8');}
function hash(p){return crypto.createHash('sha256').update(String(p)).digest('hex');}
function loadPassword(){
  if(!fs.existsSync(PASSWORD_FILE)){const h=hash(process.env.ADMIN_DEFAULT_PASSWORD||'SOHEL@12345');fs.writeFileSync(PASSWORD_FILE,JSON.stringify({password_hash:h},null,2));return h;}
  try{return JSON.parse(fs.readFileSync(PASSWORD_FILE,'utf8')).password_hash;}catch{return hash(process.env.ADMIN_DEFAULT_PASSWORD||'SOHEL@12345');}
}
function savePassword(p){fs.writeFileSync(PASSWORD_FILE,JSON.stringify({password_hash:hash(p)},null,2));}
function adminAuth(req,res,next){const p=req.get('X-Admin-Password');if(!p||hash(p)!==loadPassword())return res.status(401).json({ok:false,error:'Unauthorized'});next();}

const {bot,startBot,stopBot,setSettingsLoader}=require('./index.js');
setSettingsLoader(()=>loadSettings());

app.get('/api/settings',adminAuth,(req,res)=>res.json({ok:true,settings:loadSettings()}));
app.post('/api/settings',adminAuth,(req,res)=>{
  try{
    const incoming=req.body?.settings||req.body;
    if(!incoming||typeof incoming!=='object')return res.status(400).json({ok:false,error:'Invalid settings'});
    const s={...loadSettings(),...incoming};
    s.duration=Math.max(30,Math.min(900,Math.floor(Number(s.duration)||300)));
    if(!['small','medium','large'].includes(s.welcome_text_size))s.welcome_text_size='medium';
    if(!Array.isArray(s.main_buttons))s.main_buttons=clone(DEFAULT_SETTINGS.main_buttons);
    if(!Array.isArray(s.video_buttons))s.video_buttons=clone(DEFAULT_SETTINGS.video_buttons);
    saveSettings(s);res.json({ok:true,settings:s});
  }catch(e){console.error(e);res.status(500).json({ok:false,error:'Save failed'});}
});

const upload=multer({storage:multer.memoryStorage(),limits:{fileSize:50*1024*1024}});
async function uploadToTelegram(file,type){
  const chatId=process.env.MEDIA_STORAGE_CHAT_ID;
  if(!chatId)throw new Error('MEDIA_STORAGE_CHAT_ID is missing');
  if(type==='video'){
    const r=await bot.telegram.sendVideo(chatId,{source:file.buffer,filename:file.originalname});
    return r?.video?.file_id||'';
  }
  if(type==='audio'){
    const r=await bot.telegram.sendAudio(chatId,{source:file.buffer,filename:file.originalname});
    return r?.audio?.file_id||'';
  }
  throw new Error('Invalid media type');
}
app.post('/api/upload',adminAuth,upload.single('file'),async(req,res)=>{
  try{
    if(!req.file)return res.status(400).json({ok:false,error:'No file uploaded'});
    const type=req.body?.media_type;
    if(type!=='video'&&type!=='audio')return res.status(400).json({ok:false,error:'Invalid media type'});
    const fileId=await uploadToTelegram(req.file,type);if(!fileId)throw new Error('Telegram did not return file_id');
    const s=loadSettings();
    if(type==='video'){s.video_file_id=fileId;s.video_filename=req.file.originalname;}
    else{s.audio_file_id=fileId;s.audio_filename=req.file.originalname;}
    saveSettings(s);
    res.json({ok:true,file_id:fileId,telegram_file_id:fileId,filename:req.file.originalname,media_type:type});
  }catch(e){console.error('UPLOAD ERROR',e);res.status(500).json({ok:false,error:e.message||'Upload failed'});}
});

app.post('/api/remove-media',adminAuth,(req,res)=>{
  const type=req.body?.media_type,s=loadSettings();
  if(type==='video'){s.video_file_id='';s.video_filename='';s.video_url='';}
  else if(type==='audio'){s.audio_file_id='';s.audio_filename='';s.audio_url='';}
  else return res.status(400).json({ok:false,error:'Invalid media type'});
  saveSettings(s);res.json({ok:true,settings:s});
});
app.post('/api/reset',adminAuth,(req,res)=>{const s=clone(DEFAULT_SETTINGS);saveSettings(s);res.json({ok:true,settings:s});});
app.post('/api/change-password',adminAuth,(req,res)=>{
  const oldP=String(req.body?.old_password||''),newP=String(req.body?.new_password||'');
  if(hash(oldP)!==loadPassword())return res.status(401).json({ok:false,error:'Current password incorrect'});
  if(newP.length<6)return res.status(400).json({ok:false,error:'Password must be at least 6 characters'});
  savePassword(newP);res.json({ok:true});
});

app.use(express.static(PUBLIC_DIR));
app.get('/',(req,res)=>res.sendFile(path.join(PUBLIC_DIR,'admin.html')));

const server=app.listen(PORT,()=>console.log('Admin API running on port',PORT));
startBot().catch(e=>{console.error('BOT START FAILED:',e);server.close(()=>process.exit(1));});
process.once('SIGINT',()=>{stopBot('SIGINT');server.close(()=>process.exit(0));});
process.once('SIGTERM',()=>{stopBot('SIGTERM');server.close(()=>process.exit(0));});
