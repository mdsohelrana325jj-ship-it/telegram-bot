const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const app = express();

app.use(express.json({ limit: "2mb" }));

const PORT =
    Number(process.env.PORT || 3000);


/* =========================================================
   PATHS
========================================================= */

const DATA_DIR =
    path.join(__dirname, "data");

const SETTINGS_FILE =
    path.join(DATA_DIR, "settings.json");

const PASSWORD_FILE =
    path.join(DATA_DIR, "admin-password.json");

const PUBLIC_DIR =
    path.join(__dirname, "public");


if(!fs.existsSync(DATA_DIR)){
    fs.mkdirSync(DATA_DIR, {
        recursive:true
    });
}

if(!fs.existsSync(PUBLIC_DIR)){
    fs.mkdirSync(PUBLIC_DIR, {
        recursive:true
    });
}


/* =========================================================
   DEFAULT SETTINGS
========================================================= */

const DEFAULT_SETTINGS = {

    welcome_enabled:true,

    profile_photo_enabled:true,

    channel_title:
        "SOHEL VAI OFFICIAL CHANNEL",

    welcome_text:
`👋 👤 {first_name} ⸙ 🇧🇩

🎉 আপনাকে স্বাগতম!
👑 SOHEL VAI OFFICIAL CHANNEL JOIN করার জন্য 💖

❤️ আসসালামু আলাইকুম প্রিয় ভাই ❤️
আমাদের Official Channel-এ Join করার জন্য আপনাকে আন্তরিক ধন্যবাদ।

প্রিয় ভাই আমাদের সাথেই থাকুন আশা করি কোন না কোন একদিন অবশ্যই আপনার উপকারে আসবোই ইনশাআল্লাহ 🥰

📢 নিয়মিত নতুন Update পেতে আমাদের সাথে থাকুন।🫶😘
👑 — SOHEL VAI — 👑`,

    welcome_text_size:
        "medium",

    duration:300,

    video_file_id:"",
    video_filename:"",

    audio_file_id:"",
    audio_filename:"",

    voice_text:
        "🎶 গুরুত্বপূর্ণ ভয়েস শুনুন 🎵🎵",

    voice_button_text:
        "🎶🎶 𝗢𝗣𝗘𝗡 𝗩𝗢𝗜𝗖𝗘 🎵🎵",

    main_buttons:[

        {
            enabled:true,
            text:"👑 𝗩𝗜𝗣 𝗚𝗥𝗢𝗨𝗣 𝗙𝗔𝗦𝗧 𝗝𝗢𝗜𝗡 👑",
            url:"https://t.me/+WZR7nsATt1szNmRh"
        },

        {
            enabled:true,
            text:"😈 𝗔𝗜 𝗛𝗔𝗖𝗞 𝐋𝐈𝐍𝐊 𝐎𝐏𝐄𝐍 😈",
            url:"https://t.me/sohel_ai_prediction_bot"
        },

        {
            enabled:true,
            text:"💬 𝗦𝗨𝗣𝗣𝗢𝗥𝗧 𝗔𝗗𝗠𝗜𝗡 ☎️",
            url:"https://t.me/TRADER_SOHEL_BDT_TOP"
        }

    ],

    video_buttons:[

        {
            enabled:true,
            text:"🔵 𝗕𝗗𝗪𝗜𝗡𝟮𝟰 𝗢𝗳𝗳𝗶𝗰𝗶𝗮𝗹 𝗖𝗵𝗮𝗻𝗻𝗲𝗹 𝗝𝗢𝗜𝗡🎰",
            url:"https://t.me/+gNZZwOIN72BjYzQ1"
        },

        {
            enabled:true,
            text:"🟡 𝐃𝐊𝐖𝐈𝐍 𝗢𝗳𝗳𝗶𝗰𝗶𝗮𝗹 𝗖𝗵𝗮𝗻𝗻𝗲𝗹 𝗝𝗎𝗈𝗜𝗡🎰",
            url:"https://t.me/EARNING_TEME_bd"
        }

    ]

};


/* =========================================================
   SETTINGS
========================================================= */

function cloneDefault(){

    return JSON.parse(
        JSON.stringify(
            DEFAULT_SETTINGS
        )
    );

}


function loadSettings(){

    if(
        !fs.existsSync(
            SETTINGS_FILE
        )
    ){

        const defaults =
            cloneDefault();

        saveSettings(
            defaults
        );

        return defaults;
    }


    try{

        const saved =
            JSON.parse(
                fs.readFileSync(
                    SETTINGS_FILE,
                    "utf8"
                )
            );


        return {
            ...cloneDefault(),
            ...saved
        };

    }catch(error){

        console.error(
            "SETTINGS LOAD ERROR:",
            error
        );

        return cloneDefault();

    }

}


function saveSettings(settings){

    fs.writeFileSync(
        SETTINGS_FILE,
        JSON.stringify(
            settings,
            null,
            2
        ),
        "utf8"
    );

}


function getSettings(){

    return loadSettings();

}


/* =========================================================
   PASSWORD
========================================================= */

function hashPassword(password){

    return crypto
        .createHash("sha256")
        .update(
            String(password)
        )
        .digest("hex");

}


function loadPassword(){

    if(
        !fs.existsSync(
            PASSWORD_FILE
        )
    ){

        const defaultHash =
            hashPassword(
                "SOHEL@12345"
            );


        fs.writeFileSync(
            PASSWORD_FILE,
            JSON.stringify({
                password_hash:
                    defaultHash
            },null,2)
        );


        return defaultHash;
    }


    const data =
        JSON.parse(
            fs.readFileSync(
                PASSWORD_FILE,
                "utf8"
            )
        );


    return data.password_hash;

}


function savePassword(password){

    fs.writeFileSync(
        PASSWORD_FILE,
        JSON.stringify({

            password_hash:
                hashPassword(password)

        },null,2)
    );

}


function checkPassword(password){

    return (
        hashPassword(password) ===
        loadPassword()
    );

}


/* =========================================================
   AUTH MIDDLEWARE
========================================================= */

function adminAuth(
    req,
    res,
    next
){

    const password =
        req.header(
            "X-Admin-Password"
        );


    if(
        !password ||
        !checkPassword(password)
    ){

        return res
            .status(401)
            .json({

                ok:false,

                error:
                    "Unauthorized"

            });

    }


    next();

}


/* =========================================================
   GET SETTINGS
========================================================= */

app.get(
    "/api/settings",
    adminAuth,
    (req,res)=>{

        res.json({

            ok:true,

            settings:
                getSettings()

        });

    }
);


/* =========================================================
   SAVE SETTINGS
========================================================= */

app.post(
    "/api/settings",
    adminAuth,
    (req,res)=>{

        try{

            const incoming =
                req.body &&
                req.body.settings;


            if(
                !incoming ||
                typeof incoming !== "object"
            ){

                return res
                    .status(400)
                    .json({

                        ok:false,

                        error:
                            "Invalid settings"

                    });

            }


            const current =
                getSettings();


            const merged = {

                ...current,

                ...incoming

            };


            let duration =
                Number(
                    merged.duration
                );


            if(
                !Number.isFinite(duration)
            ){

                duration = 300;

            }


            duration =
                Math.max(
                    30,
                    Math.min(
                        900,
                        Math.floor(duration)
                    )
                );


            merged.duration =
                duration;


            if(
                ![
                    "small",
                    "medium",
                    "large"
                ].includes(
                    merged.welcome_text_size
                )
            ){

                merged.welcome_text_size =
                    "medium";

            }


            saveSettings(
                merged
            );


            res.json({

                ok:true,

                settings:
                    merged

            });

        }catch(error){

            console.error(error);

            res
            .status(500)
            .json({

                ok:false,

                error:
                    "Save failed"

            });

        }

    }
);


/* =========================================================
   MULTER
========================================================= */

const upload =
    multer({

        storage:
            multer.memoryStorage(),

        limits:{

            fileSize:
                200 * 1024 * 1024

        }

    });


/* =========================================================
   TELEGRAM UPLOAD
========================================================= */

/*
   IMPORTANT:

   NxCreate-এর environment-এ আপনার existing `bot`
   object থাকলে এই function-এ সেই bot ব্যবহার করতে হবে।

   Telegram file_id bot-specific।
*/

async function uploadToTelegram(
    file,
    mediaType
){

    if(
        typeof bot === "undefined"
    ){

        throw new Error(
            "NxCreate bot object is not available"
        );

    }


    /*
       এখানে আপনার NxCreate-এর Telegram upload
       capability ব্যবহার করতে হবে।

       Standard Telegraf হলে সাধারণত Buffer upload
       এইভাবে করা যায়:
    */

    let result;


    if(
        mediaType === "video"
    ){

        result =
            await bot.telegram.sendVideo(
                process.env.MEDIA_STORAGE_CHAT_ID,
                {
                    source:
                        file.buffer,

                    filename:
                        file.originalname
                }
            );

        return (
            result &&
            result.video &&
            result.video.file_id
        );

    }


    if(
        mediaType === "audio"
    ){

        result =
            await bot.telegram.sendAudio(
                process.env.MEDIA_STORAGE_CHAT_ID,
                {
                    source:
                        file.buffer,

                    filename:
                        file.originalname
                }
            );

        return (
            result &&
            result.audio &&
            result.audio.file_id
        );

    }


    throw new Error(
        "Unsupported media type"
    );

}


/* =========================================================
   UPLOAD API
========================================================= */

app.post(
    "/api/upload",
    adminAuth,
    upload.single("file"),
    async (req,res)=>{

        try{

            if(!req.file){

                return res
                    .status(400)
                    .json({

                        ok:false,

                        error:
                            "No file uploaded"

                    });

            }


            const mediaType =
                req.body.media_type;


            if(
                mediaType !== "video" &&
                mediaType !== "audio"
            ){

                return res
                    .status(400)
                    .json({

                        ok:false,

                        error:
                            "Invalid media type"

                    });

            }


            const fileId =
                await uploadToTelegram(
                    req.file,
                    mediaType
                );


            if(!fileId){

                throw new Error(
                    "Telegram did not return file_id"
                );

            }


            const settings =
                getSettings();


            if(
                mediaType === "video"
            ){

                settings.video_file_id =
                    fileId;

                settings.video_filename =
                    req.file.originalname;

            }else{

                settings.audio_file_id =
                    fileId;

                settings.audio_filename =
                    req.file.originalname;

            }


            saveSettings(
                settings
            );


            res.json({

                ok:true,

                file_id:
                    fileId,

                telegram_file_id:
                    fileId,

                filename:
                    req.file.originalname,

                media_type:
                    mediaType

            });

        }catch(error){

            console.error(
                "UPLOAD ERROR:",
                error
            );

            res
            .status(500)
            .json({

                ok:false,

                error:
                    error.message ||
                    "Upload failed"

            });

        }

    }
);


/* =========================================================
   REMOVE MEDIA
========================================================= */

app.post(
    "/api/remove-media",
    adminAuth,
    (req,res)=>{

        try{

            const type =
                req.body &&
                req.body.media_type;


            const settings =
                getSettings();


            if(type === "video"){

                settings.video_file_id = "";
                settings.video_filename = "";

            }else if(type === "audio"){

                settings.audio_file_id = "";
                settings.audio_filename = "";

            }else{

                return res
                    .status(400)
                    .json({

                        ok:false,

                        error:
                            "Invalid media type"

                    });

            }


            saveSettings(
                settings
            );


            res.json({

                ok:true,

                settings

            });

        }catch(error){

            res
            .status(500)
            .json({

                ok:false,

                error:
                    "Remove failed"

            });

        }

    }
);


/* =========================================================
   RESET
========================================================= */

app.post(
    "/api/reset",
    adminAuth,
    (req,res)=>{

        const defaults =
            cloneDefault();


        saveSettings(
            defaults
        );


        res.json({

            ok:true,

            settings:
                defaults

        });

    }
);


/* =========================================================
   PASSWORD CHANGE
========================================================= */

app.post(
    "/api/change-password",
    adminAuth,
    (req,res)=>{

        const oldPassword =
            String(
                req.body.old_password ||
                ""
            );


        const newPassword =
            String(
                req.body.new_password ||
                ""
            );


        if(
            !checkPassword(
                oldPassword
            )
        ){

            return res
                .status(401)
                .json({

                    ok:false,

                    error:
                        "Current password incorrect"

                });

        }


        if(
            newPassword.length < 6
        ){

            return res
                .status(400)
                .json({

                    ok:false,

                    error:
                        "Password must be at least 6 characters"

                });

        }


        savePassword(
            newPassword
        );


        res.json({

            ok:true

        });

    }
);


/* =========================================================
   ADMIN HTML
========================================================= */

app.use(
    express.static(
        PUBLIC_DIR
    )
);


app.get(
    "/",
    (req,res)=>{

        res.sendFile(
            path.join(
                PUBLIC_DIR,
                "admin.html"
            )
        );

    }
);


/* =========================================================
   START
========================================================= */

app.listen(
    PORT,
    ()=>{
        console.log(
            "SOHEL VAI ADMIN API running on port",
            PORT
        );
    }
);