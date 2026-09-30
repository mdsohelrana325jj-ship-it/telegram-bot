const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const {
    bot,
    startBot,
    stopBot,
    setSettingsLoader
} = require("./index.js");

const app = express();

const PORT =
    Number(process.env.PORT || 3000);

const CHANNEL_ID =
    Number(
        process.env.CHANNEL_ID ||
        "-1003985236266"
    );


// ============================================================
// BODY
// ============================================================

app.use(
    express.json({
        limit: "2mb"
    })
);


// ============================================================
// PATHS
// ============================================================

const DATA_DIR =
    path.join(
        __dirname,
        "data"
    );

const SETTINGS_FILE =
    path.join(
        DATA_DIR,
        "settings.json"
    );

const PASSWORD_FILE =
    path.join(
        DATA_DIR,
        "admin-password.json"
    );

const PUBLIC_DIR =
    path.join(
        __dirname,
        "public"
    );


fs.mkdirSync(
    DATA_DIR,
    {
        recursive: true
    }
);

fs.mkdirSync(
    PUBLIC_DIR,
    {
        recursive: true
    }
);


// ============================================================
// DEFAULT SETTINGS
// ============================================================

const DEFAULT_SETTINGS = {

    welcome_enabled: true,

    profile_photo_enabled: true,

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

    duration:
        30,

    duration_seconds:
        30,


    // ========================================================
    // VIDEO
    // ========================================================

    video_file_id:
        "",

    video_filename:
        "",

    video_url:
        "",


    // ========================================================
    // AUDIO
    // ========================================================

    audio_file_id:
        "",

    audio_filename:
        "",

    audio_url:
        "",


    voice_text:
        "🎶 গুরুত্বপূর্ণ ভয়েস শুনুন 🎵🎵",

    voice_button_text:
        "🎶🎶 𝗢𝗣𝗘𝗡 𝗩𝗢𝗜𝗖𝗘 🎵🎵",


    // ========================================================
    // MAIN BUTTONS
    // ========================================================

    main_buttons: [

        {
            enabled: true,
            text:
                "👑 𝗩𝗜𝗣 𝗚𝗥𝗢𝗨𝗣 𝗙𝗔𝗦𝗧 𝗝𝗢𝗜𝗡 👑",
            url:
                "https://t.me/+WZR7nsATt1szNmRh"
        },

        {
            enabled: true,
            text:
                "😈 𝗔𝗜 𝗛𝗔𝗖𝗞 𝐋𝐈𝐍𝐊 𝐎𝐏𝐄𝐍 😈",
            url:
                "https://t.me/sohel_ai_prediction_bot"
        },

        {
            enabled: true,
            text:
                "💬 𝗦𝗨𝗣𝗣𝗢𝗥𝗧 𝗔𝗗𝗠𝗜𝗡 ☎️",
            url:
                "https://t.me/TRADER_SOHEL_BDT_TOP"
        }

    ],


    // ========================================================
    // MEDIA BUTTONS
    // ========================================================

    video_buttons: [

        {
            enabled: true,
            text:
                "🔵 𝗕𝗗𝗪𝗜𝗡𝟮𝟰 𝗢𝗳𝗳𝗶𝗰𝗶𝗮𝗹 𝗖𝗵𝗮𝗻𝗻𝗲𝗹 𝗝𝗢𝗜𝗡🎰",
            url:
                "https://t.me/+gNZZwOIN72BjYzQ1"
        },

        {
            enabled: true,
            text:
                "🟡 𝐃𝐊𝐖𝐈𝐍 𝗢𝗳𝗳𝗶𝗰𝗶𝗮𝗹 𝗖𝗵𝗮𝗻𝗻𝗲𝗹 𝗝𝗎𝗈𝗜𝗡🎰",
            url:
                "https://t.me/EARNING_TEME_bd"
        }

    ]

};


// ============================================================
// CLONE
// ============================================================

function clone(value) {

    return JSON.parse(
        JSON.stringify(value)
    );

}


// ============================================================
// LOAD SETTINGS
// ============================================================

function loadSettings() {

    if (
        !fs.existsSync(
            SETTINGS_FILE
        )
    ) {

        const data =
            clone(
                DEFAULT_SETTINGS
            );

        saveSettings(data);

        return data;

    }


    try {

        const saved =
            JSON.parse(
                fs.readFileSync(
                    SETTINGS_FILE,
                    "utf8"
                )
            );


        return {

            ...clone(
                DEFAULT_SETTINGS
            ),

            ...(saved || {})

        };

    } catch (error) {

        console.error(
            "SETTINGS LOAD ERROR:",
            error
        );

        return clone(
            DEFAULT_SETTINGS
        );

    }

}


// ============================================================
// SAVE SETTINGS
// ============================================================

function saveSettings(
    settings
) {

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


// ============================================================
// PASSWORD HASH
// ============================================================

function hashPassword(
    password
) {

    return crypto
        .createHash("sha256")
        .update(
            String(password)
        )
        .digest("hex");

}


// ============================================================
// LOAD PASSWORD
// ============================================================

function loadPassword() {

    if (
        !fs.existsSync(
            PASSWORD_FILE
        )
    ) {

        const password =
            process.env
                .ADMIN_DEFAULT_PASSWORD ||
            "SOHEL@12345";


        const passwordHash =
            hashPassword(
                password
            );


        fs.writeFileSync(

            PASSWORD_FILE,

            JSON.stringify(
                {
                    password_hash:
                        passwordHash
                },
                null,
                2
            ),

            "utf8"

        );


        return passwordHash;

    }


    try {

        const data =
            JSON.parse(
                fs.readFileSync(
                    PASSWORD_FILE,
                    "utf8"
                )
            );


        if (
            data &&
            data.password_hash
        ) {

            return data.password_hash;

        }

    } catch (error) {

        console.error(
            "PASSWORD LOAD ERROR:",
            error
        );

    }


    return hashPassword(
        process.env
            .ADMIN_DEFAULT_PASSWORD ||
        "SOHEL@12345"
    );

}


// ============================================================
// SAVE PASSWORD
// ============================================================

function savePassword(
    password
) {

    fs.writeFileSync(

        PASSWORD_FILE,

        JSON.stringify(

            {
                password_hash:
                    hashPassword(
                        password
                    )
            },

            null,

            2

        ),

        "utf8"

    );

}


// ============================================================
// ADMIN AUTH
// ============================================================

function adminAuth(
    req,
    res,
    next
) {

    const password =
        req.get(
            "X-Admin-Password"
        );


    if (
        !password
    ) {

        return res
            .status(401)
            .json({

                ok: false,

                error:
                    "Unauthorized"

            });

    }


    if (
        hashPassword(
            password
        ) !==
        loadPassword()
    ) {

        return res
            .status(401)
            .json({

                ok: false,

                error:
                    "Unauthorized"

            });

    }


    next();

}


// ============================================================
// CONNECT SETTINGS LOADER TO BOT
// ============================================================

setSettingsLoader(
    async function() {

        return loadSettings();

    }
);


// ============================================================
// GET SETTINGS
// ============================================================

app.get(

    "/api/settings",

    adminAuth,

    function(req, res) {

        res.json({

            ok: true,

            settings:
                loadSettings()

        });

    }

);


// ============================================================
// SAVE SETTINGS
// ============================================================

app.post(

    "/api/settings",

    adminAuth,

    function(req, res) {

        try {

            const incoming =
                req.body &&
                (
                    req.body.settings ||
                    req.body
                );


            if (
                !incoming ||
                typeof incoming !==
                    "object" ||
                Array.isArray(
                    incoming
                )
            ) {

                return res
                    .status(400)
                    .json({

                        ok: false,

                        error:
                            "Invalid settings"

                    });

            }


            const current =
                loadSettings();


            const settings = {

                ...current,

                ...incoming

            };


            // ------------------------------------------------
            // Duration
            // ------------------------------------------------

            let duration =
                Number(
                    settings.duration
                );


            if (
                !Number.isFinite(
                    duration
                )
            ) {

                duration = 30;

            }


            settings.duration =
                Math.max(
                    30,
                    Math.min(
                        900,
                        Math.floor(
                            duration
                        )
                    )
                );


            settings.duration_seconds =
                settings.duration;


            // ------------------------------------------------
            // Text size
            // ------------------------------------------------

            if (
                ![
                    "small",
                    "medium",
                    "large"
                ].includes(
                    settings.welcome_text_size
                )
            ) {

                settings.welcome_text_size =
                    "medium";

            }


            // ------------------------------------------------
            // Buttons
            // ------------------------------------------------

            if (
                !Array.isArray(
                    settings.main_buttons
                )
            ) {

                settings.main_buttons =
                    clone(
                        DEFAULT_SETTINGS
                            .main_buttons
                    );

            }


            if (
                !Array.isArray(
                    settings.video_buttons
                )
            ) {

                settings.video_buttons =
                    clone(
                        DEFAULT_SETTINGS
                            .video_buttons
                    );

            }


            settings.main_buttons =
                settings.main_buttons
                    .slice(0, 3);


            settings.video_buttons =
                settings.video_buttons
                    .slice(0, 2);


            saveSettings(
                settings
            );


            console.log(
                "✅ SETTINGS SAVED"
            );


            res.json({

                ok: true,

                message:
                    "Settings saved successfully",

                settings

            });


        } catch (error) {

            console.error(
                "SAVE SETTINGS ERROR:",
                error
            );


            res
                .status(500)
                .json({

                    ok: false,

                    error:
                        "Save failed"

                });

        }

    }

);


// ============================================================
// MULTER
// ============================================================
//
// Maximum 50 MB.
// No Media Storage channel is used.
//
// IMPORTANT:
// Uploaded media is temporarily sent to the MAIN
// CHANNEL_ID only to obtain Telegram file_id.
// After file_id is obtained, the temporary message
// is immediately deleted.
// ============================================================

const upload =
    multer({

        storage:
            multer.memoryStorage(),

        limits: {

            fileSize:
                50 *
                1024 *
                1024

        }

    });


// ============================================================
// UPLOAD MEDIA DIRECTLY TO MAIN CHANNEL
// ============================================================

async function uploadToTelegram(
    file,
    mediaType
) {

    if (
        !file ||
        !file.buffer ||
        !file.buffer.length
    ) {

        throw new Error(
            "Media file is empty"
        );

    }


    if (
        mediaType !== "video" &&
        mediaType !== "audio"
    ) {

        throw new Error(
            "Invalid media type"
        );

    }


    console.log(
        "📤 TEMP MEDIA UPLOAD:",
        {

            type:
                mediaType,

            channel:
                CHANNEL_ID,

            filename:
                file.originalname,

            size:
                file.size

        }
    );


    let result;


    // ========================================================
    // VIDEO
    // ========================================================

    if (
        mediaType === "video"
    ) {

        result =
            await bot.telegram.sendVideo(

                CHANNEL_ID,

                {
                    source:
                        file.buffer,

                    filename:
                        file.originalname

                }

            );

    }


    // ========================================================
    // AUDIO
    // ========================================================

    if (
        mediaType === "audio"
    ) {

        result =
            await bot.telegram.sendAudio(

                CHANNEL_ID,

                {
                    source:
                        file.buffer,

                    filename:
                        file.originalname

                }

            );

    }


    if (
        !result
    ) {

        throw new Error(
            "Telegram upload returned no result"
        );

    }


    const mediaObject =
        mediaType === "video"
            ? result.video
            : result.audio;


    const fileId =
        mediaObject &&
        mediaObject.file_id;


    if (
        !fileId
    ) {

        throw new Error(
            "Telegram did not return file_id"
        );

    }


    console.log(
        "✅ TELEGRAM FILE ID RECEIVED:",
        {

            type:
                mediaType,

            fileId:
                fileId,

            temporaryMessageId:
                result.message_id

        }
    );


    // ========================================================
    // DELETE TEMPORARY CHANNEL MESSAGE
    // ========================================================

    if (
        result.message_id
    ) {

        try {

            await bot.telegram
                .deleteMessage(

                    CHANNEL_ID,

                    result.message_id

                );


            console.log(
                "🗑️ TEMP MEDIA MESSAGE DELETED:",
                result.message_id
            );


        } catch (deleteError) {

            console.error(
                "⚠️ TEMP MEDIA DELETE FAILED:",
                deleteError?.message ||
                deleteError
            );

        }

    }


    return fileId;

}


// ============================================================
// UPLOAD API
// ============================================================

app.post(

    "/api/upload",

    adminAuth,

    upload.single("file"),

    async function(req, res) {

        try {

            if (
                !req.file
            ) {

                return res
                    .status(400)
                    .json({

                        ok: false,

                        error:
                            "No file uploaded"

                    });

            }


            const mediaType =
                String(
                    req.body &&
                    req.body.media_type ||
                    ""
                )
                    .toLowerCase();


            if (
                mediaType !== "video" &&
                mediaType !== "audio"
            ) {

                return res
                    .status(400)
                    .json({

                        ok: false,

                        error:
                            "Invalid media type"

                    });

            }


            const fileId =
                await uploadToTelegram(

                    req.file,

                    mediaType

                );


            if (
                !fileId
            ) {

                throw new Error(
                    "file_id was not returned"
                );

            }


            const settings =
                loadSettings();


            // ------------------------------------------------
            // SAVE VIDEO
            // ------------------------------------------------

            if (
                mediaType === "video"
            ) {

                settings.video_file_id =
                    fileId;

                settings.video_filename =
                    req.file.originalname;

            }


            // ------------------------------------------------
            // SAVE AUDIO
            // ------------------------------------------------

            if (
                mediaType === "audio"
            ) {

                settings.audio_file_id =
                    fileId;

                settings.audio_filename =
                    req.file.originalname;

            }


            saveSettings(
                settings
            );


            console.log(
                "✅ MEDIA SETTINGS SAVED:",
                mediaType
            );


            res.json({

                ok: true,

                message:
                    "Media uploaded successfully",

                file_id:
                    fileId,

                telegram_file_id:
                    fileId,

                filename:
                    req.file.originalname,

                media_type:
                    mediaType

            });


        } catch (error) {

            console.error(
                "❌ MEDIA UPLOAD ERROR:",
                error
            );


            res
                .status(500)
                .json({

                    ok: false,

                    error:
                        error?.message ||
                        "Upload failed"

                });

        }

    }

);


// ============================================================
// REMOVE MEDIA
// ============================================================

app.post(

    "/api/remove-media",

    adminAuth,

    function(req, res) {

        try {

            const mediaType =
                String(
                    req.body &&
                    req.body.media_type ||
                    ""
                )
                    .toLowerCase();


            const settings =
                loadSettings();


            if (
                mediaType === "video"
            ) {

                settings.video_file_id =
                    "";

                settings.video_filename =
                    "";

                settings.video_url =
                    "";

            }

            else if (
                mediaType === "audio"
            ) {

                settings.audio_file_id =
                    "";

                settings.audio_filename =
                    "";

                settings.audio_url =
                    "";

            }

            else {

                return res
                    .status(400)
                    .json({

                        ok: false,

                        error:
                            "Invalid media type"

                    });

            }


            saveSettings(
                settings
            );


            res.json({

                ok: true,

                settings

            });


        } catch (error) {

            console.error(
                "REMOVE MEDIA ERROR:",
                error
            );


            res
                .status(500)
                .json({

                    ok: false,

                    error:
                        "Remove failed"

                });

        }

    }

);


// ============================================================
// RESET
// ============================================================

app.post(

    "/api/reset",

    adminAuth,

    function(req, res) {

        try {

            const settings =
                clone(
                    DEFAULT_SETTINGS
                );


            saveSettings(
                settings
            );


            res.json({

                ok: true,

                settings

            });


        } catch (error) {

            console.error(
                "RESET ERROR:",
                error
            );


            res
                .status(500)
                .json({

                    ok: false,

                    error:
                        "Reset failed"

                });

        }

    }

);


// ============================================================
// CHANGE PASSWORD
// ============================================================

app.post(

    "/api/change-password",

    adminAuth,

    function(req, res) {

        try {

            const oldPassword =
                String(
                    req.body &&
                    req.body.old_password ||
                    ""
                );


            const newPassword =
                String(
                    req.body &&
                    req.body.new_password ||
                    ""
                );


            if (
                hashPassword(
                    oldPassword
                ) !==
                loadPassword()
            ) {

                return res
                    .status(401)
                    .json({

                        ok: false,

                        error:
                            "Current password incorrect"

                    });

            }


            if (
                newPassword.length < 6
            ) {

                return res
                    .status(400)
                    .json({

                        ok: false,

                        error:
                            "Password must be at least 6 characters"

                    });

            }


            savePassword(
                newPassword
            );


            res.json({

                ok: true,

                message:
                    "Password changed successfully"

            });


        } catch (error) {

            console.error(
                "CHANGE PASSWORD ERROR:",
                error
            );


            res
                .status(500)
                .json({

                    ok: false,

                    error:
                        "Password change failed"

                });

        }

    }

);


// ============================================================
// STATIC ADMIN PANEL
// ============================================================

app.use(
    express.static(
        PUBLIC_DIR
    )
);


app.get(
    "/",
    function(req, res) {

        res.sendFile(
            path.join(
                PUBLIC_DIR,
                "admin.html"
            )
        );

    }
);


// ============================================================
// START SERVER
// ============================================================

const server =
    app.listen(

        PORT,

        function() {

            console.log(
                "================================================"
            );

            console.log(
                "🚀 SOHEL VAI ADMIN SERVER"
            );

            console.log(
                "PORT:",
                PORT
            );

            console.log(
                "CHANNEL_ID:",
                CHANNEL_ID
            );

            console.log(
                "MEDIA STORAGE:",
                "DISABLED"
            );

            console.log(
                "DIRECT MEDIA UPLOAD:",
                "ENABLED"
            );

            console.log(
                "================================================"
            );

        }

    );


// ============================================================
// START BOT
// ============================================================

startBot()
    .catch(
        function(error) {

            console.error(
                "❌ BOT START FAILED:",
                error
            );


            server.close(
                function() {

                    process.exit(
                        1
                    );

                }
            );

        }
    );


// ============================================================
// GRACEFUL STOP
// ============================================================

process.once(
    "SIGINT",
    function() {

        stopBot(
            "SIGINT"
        );

        server.close(
            function() {

                process.exit(
                    0
                );

            }
        );

    }
);


process.once(
    "SIGTERM",
    function() {

        stopBot(
            "SIGTERM"
        );

        server.close(
            function() {

                process.exit(
                    0
                );

            }
        );

    }
);
