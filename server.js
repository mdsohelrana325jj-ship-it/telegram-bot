const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const app =
    express();


// ============================================================
// SERVER
// ============================================================

const PORT =
    Number(
        process.env.PORT || 3000
    );


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


if (
    !fs.existsSync(DATA_DIR)
) {

    fs.mkdirSync(
        DATA_DIR,
        {
            recursive: true
        }
    );

}


if (
    !fs.existsSync(PUBLIC_DIR)
) {

    fs.mkdirSync(
        PUBLIC_DIR,
        {
            recursive: true
        }
    );

}


// ============================================================
// TELEGRAM BOT MODULE
// ============================================================

const {

    bot,

    setSettingsLoader,

    startBot,

    stopBot

} =
    require("./index.js");


// ============================================================
// DEFAULT SETTINGS
// ============================================================

const DEFAULT_SETTINGS = {

    welcome_enabled:
        true,

    profile_photo_enabled:
        true,

    channel_title:
        "SOHEL VAI OFFICIAL CHANNEL",

    welcome_text:
`প্রিয় {first_name} ভাই,

SOHEL VAI OFFICIAL CHANNEL এ আপনাকে স্বাগতম!

{channel_title}

আমাদের Official Channel-এ Join করার জন্য আপনাকে ধন্যবাদ।

নিয়মিত Update পেতে আমাদের Channel-এর সাথে যুক্ত থাকুন।

— SOHEL VAI`,

    welcome_text_size:
        "medium",

    duration:
        300,

    media_type:
        "none",

    video_file_id:
        "",

    video_filename:
        "",

    audio_file_id:
        "",

    audio_filename:
        "",

    video_url:
        "",

    audio_url:
        "",

    voice_text:
        "🎙️ আমাদের Voice Message শুনুন।",

    voice_button_text:
        "🔊 AUDIO LINK",

    main_buttons: [

        {
            enabled: true,
            text:
                "📢 OFFICIAL CHANNEL",
            url:
                "https://t.me/+WZR7nsATt1szNmRh"
        },

        {
            enabled: true,
            text:
                "🤖 SUPPORT BOT",
            url:
                "https://t.me/sohel_ai_prediction_bot"
        },

        {
            enabled: true,
            text:
                "🔗 BUTTON 3",
            url:
                "https://t.me/TRADER_SOHEL_BDT_TOP"
        }

    ],

    video_buttons: [

        {
            enabled: true,
            text:
                "📺 VIDEO BUTTON 1",
            url:
                "https://t.me/+gNZZwOIN72BjYzQ1"
        },

        {
            enabled: true,
            text:
                "🔗 VIDEO BUTTON 2",
            url:
                "https://t.me/EARNING_TEME_bd"
        }

    ]

};


// ============================================================
// CLONE DEFAULT
// ============================================================

function cloneDefault() {

    return JSON.parse(
        JSON.stringify(
            DEFAULT_SETTINGS
        )
    );

}


// ============================================================
// NORMALIZE SETTINGS
// ============================================================

function normalizeSettings(
    data
) {

    const settings = {

        ...cloneDefault(),

        ...(data || {})

    };


    // --------------------------------------------------------
    // MEDIA TYPE
    // --------------------------------------------------------

    const mediaType =
        String(
            settings.media_type ||
            "none"
        ).toLowerCase();


    if (
        mediaType === "audio" ||
        mediaType === "video"
    ) {

        settings.media_type =
            mediaType;

    } else {

        settings.media_type =
            "none";

    }


    // --------------------------------------------------------
    // DURATION
    // --------------------------------------------------------

    let duration =
        Number(
            settings.duration
        );

    if (
        !Number.isFinite(duration)
    ) {

        duration =
            DEFAULT_SETTINGS.duration;

    }

    settings.duration =
        Math.max(
            30,
            Math.min(
                900,
                Math.floor(duration)
            )
        );


    // --------------------------------------------------------
    // TEXT SIZE
    // --------------------------------------------------------

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


    // --------------------------------------------------------
    // BUTTONS
    // --------------------------------------------------------

    if (
        !Array.isArray(
            settings.main_buttons
        )
    ) {

        settings.main_buttons =
            cloneDefault().main_buttons;

    }

    if (
        !Array.isArray(
            settings.video_buttons
        )
    ) {

        settings.video_buttons =
            cloneDefault().video_buttons;

    }


    // --------------------------------------------------------
    // MEDIA DATA
    // --------------------------------------------------------

    settings.video_file_id =
        String(
            settings.video_file_id || ""
        );

    settings.video_filename =
        String(
            settings.video_filename || ""
        );

    settings.audio_file_id =
        String(
            settings.audio_file_id || ""
        );

    settings.audio_filename =
        String(
            settings.audio_filename || ""
        );

    settings.video_url =
        String(
            settings.video_url || ""
        );

    settings.audio_url =
        String(
            settings.audio_url || ""
        );


    return settings;

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

        const defaults =
            cloneDefault();

        saveSettings(
            defaults
        );

        return defaults;

    }


    try {

        const saved =
            JSON.parse(
                fs.readFileSync(
                    SETTINGS_FILE,
                    "utf8"
                )
            );

        return normalizeSettings(
            saved
        );

    }
    catch (error) {

        console.error(
            "SETTINGS LOAD ERROR:",
            error
        );

        return cloneDefault();

    }

}


// ============================================================
// SAVE SETTINGS
// ============================================================

function saveSettings(
    settings
) {

    const normalized =
        normalizeSettings(
            settings
        );

    fs.writeFileSync(
        SETTINGS_FILE,
        JSON.stringify(
            normalized,
            null,
            2
        ),
        "utf8"
    );

}


// ============================================================
// GET SETTINGS
// ============================================================

function getSettings() {

    return loadSettings();

}


// ============================================================
// PASSWORD
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


function loadPassword() {

    if (
        !fs.existsSync(
            PASSWORD_FILE
        )
    ) {

        const defaultHash =
            hashPassword(
                "SOHEL@12345"
            );

        fs.writeFileSync(
            PASSWORD_FILE,
            JSON.stringify(
                {
                    password_hash:
                        defaultHash
                },
                null,
                2
            )
        );

        return defaultHash;

    }


    try {

        const data =
            JSON.parse(
                fs.readFileSync(
                    PASSWORD_FILE,
                    "utf8"
                )
            );

        return data.password_hash;

    }
    catch (error) {

        console.error(
            "PASSWORD LOAD ERROR:",
            error
        );

        return hashPassword(
            "SOHEL@12345"
        );

    }

}


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
        )
    );

}


function checkPassword(
    password
) {

    return (
        hashPassword(
            password
        ) ===
        loadPassword()
    );

}


// ============================================================
// AUTH
// ============================================================

function adminAuth(
    req,
    res,
    next
) {

    const password =
        req.header(
            "X-Admin-Password"
        );


    if (
        !password ||
        !checkPassword(password)
    ) {

        return res
            .status(401)
            .json({

                ok:
                    false,

                error:
                    "Unauthorized"

            });

    }


    next();

}


// ============================================================
// GET SETTINGS
// ============================================================

app.get(
    "/api/settings",
    adminAuth,
    (req, res) => {

        res.json({

            ok:
                true,

            settings:
                getSettings()

        });

    }
);


// ============================================================
// SAVE SETTINGS
// ============================================================

app.post(
    "/api/settings",
    adminAuth,
    (req, res) => {

        try {

            /*
             Supports BOTH:

             1.
             {
                 "settings": {...}
             }

             2.
             {
                 "welcome_enabled": true,
                 ...
             }
            */

            let incoming =
                req.body?.settings;

            if (
                !incoming ||
                typeof incoming !== "object"
            ) {

                incoming =
                    req.body;

            }


            if (
                !incoming ||
                typeof incoming !== "object"
            ) {

                return res
                    .status(400)
                    .json({

                        ok:
                            false,

                        error:
                            "Invalid settings"

                    });

            }


            const current =
                getSettings();


            const merged =
                normalizeSettings({

                    ...current,

                    ...incoming

                });


            saveSettings(
                merged
            );


            res.json({

                ok:
                    true,

                settings:
                    merged

            });

        }
        catch (error) {

            console.error(
                "SAVE SETTINGS ERROR:",
                error
            );

            res
                .status(500)
                .json({

                    ok:
                        false,

                    error:
                        "Save failed"

                });

        }

    }
);


// ============================================================
// MULTER
// ============================================================

const upload =
    multer({

        storage:
            multer.memoryStorage(),

        limits: {

            fileSize:
                200 * 1024 * 1024

        }

    });


// ============================================================
// TELEGRAM MEDIA UPLOAD
// ============================================================

async function uploadToTelegram(
    file,
    mediaType
) {

    const storageChatId =
        String(
            process.env.MEDIA_STORAGE_CHAT_ID ||
            ""
        ).trim();


    if (!storageChatId) {

        throw new Error(
            "MEDIA_STORAGE_CHAT_ID environment variable is missing."
        );

    }


    if (
        !file ||
        !file.buffer
    ) {

        throw new Error(
            "Uploaded file buffer is missing."
        );

    }


    let result;


    // --------------------------------------------------------
    // VIDEO
    // --------------------------------------------------------

    if (
        mediaType === "video"
    ) {

        result =
            await bot.telegram.sendVideo(
                storageChatId,
                {
                    source:
                        file.buffer,

                    filename:
                        file.originalname
                }
            );


        if (
            result?.video?.file_id
        ) {

            return result.video.file_id;

        }

    }


    // --------------------------------------------------------
    // AUDIO
    // --------------------------------------------------------

    if (
        mediaType === "audio"
    ) {

        result =
            await bot.telegram.sendAudio(
                storageChatId,
                {
                    source:
                        file.buffer,

                    filename:
                        file.originalname
                }
            );


        if (
            result?.audio?.file_id
        ) {

            return result.audio.file_id;

        }

    }


    throw new Error(
        "Telegram did not return file_id."
    );

}


// ============================================================
// UPLOAD API
// ============================================================

app.post(
    "/api/upload",
    adminAuth,
    upload.single("file"),
    async (req, res) => {

        try {

            if (!req.file) {

                return res
                    .status(400)
                    .json({

                        ok:
                            false,

                        error:
                            "No file uploaded"

                    });

            }


            const mediaType =
                String(
                    req.body?.media_type ||
                    ""
                ).toLowerCase();


            if (
                mediaType !== "video" &&
                mediaType !== "audio"
            ) {

                return res
                    .status(400)
                    .json({

                        ok:
                            false,

                        error:
                            "Invalid media type"

                    });

            }


            // ------------------------------------------------
            // UPLOAD TO TELEGRAM
            // ------------------------------------------------

            const fileId =
                await uploadToTelegram(
                    req.file,
                    mediaType
                );


            if (!fileId) {

                throw new Error(
                    "Telegram file_id unavailable."
                );

            }


            const settings =
                getSettings();


            // ------------------------------------------------
            // VIDEO
            // ------------------------------------------------

            if (
                mediaType === "video"
            ) {

                settings.media_type =
                    "video";

                settings.video_file_id =
                    fileId;

                settings.video_filename =
                    req.file.originalname;


                /*
                 Old Python system behaviour:
                 Video active = Audio inactive
                */

                settings.audio_file_id =
                    "";

                settings.audio_filename =
                    "";

            }


            // ------------------------------------------------
            // AUDIO
            // ------------------------------------------------

            if (
                mediaType === "audio"
            ) {

                settings.media_type =
                    "audio";

                settings.audio_file_id =
                    fileId;

                settings.audio_filename =
                    req.file.originalname;


                /*
                 Old Python system behaviour:
                 Audio active = Video inactive
                */

                settings.video_file_id =
                    "";

                settings.video_filename =
                    "";

            }


            saveSettings(
                settings
            );


            res.json({

                ok:
                    true,

                file_id:
                    fileId,

                telegram_file_id:
                    fileId,

                filename:
                    req.file.originalname,

                media_type:
                    mediaType,

                settings:
                    getSettings()

            });

        }
        catch (error) {

            console.error(
                "UPLOAD ERROR:",
                error
            );

            res
                .status(500)
                .json({

                    ok:
                        false,

                    error:
                        error.message ||
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
    (req, res) => {

        try {

            const settings =
                getSettings();


            /*
             Supports:

             {
                 "media_type": "video"
             }

             or

             {
                 "type": "video"
             }

             If no type is supplied,
             remove currently active media.
            */

            let type =
                req.body?.media_type ||
                req.body?.type ||
                settings.media_type;


            type =
                String(
                    type || ""
                ).toLowerCase();


            if (
                type !== "video" &&
                type !== "audio"
            ) {

                return res
                    .status(400)
                    .json({

                        ok:
                            false,

                        error:
                            "Invalid media type"

                    });

            }


            if (
                type === "video"
            ) {

                settings.video_file_id =
                    "";

                settings.video_filename =
                    "";

            }


            if (
                type === "audio"
            ) {

                settings.audio_file_id =
                    "";

                settings.audio_filename =
                    "";

            }


            // If removing active media,
            // switch to none.

            if (
                settings.media_type === type
            ) {

                settings.media_type =
                    "none";

            }


            saveSettings(
                settings
            );


            res.json({

                ok:
                    true,

                settings:
                    getSettings()

            });

        }
        catch (error) {

            console.error(
                "REMOVE MEDIA ERROR:",
                error
            );

            res
                .status(500)
                .json({

                    ok:
                        false,

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
    (req, res) => {

        try {

            const defaults =
                cloneDefault();

            saveSettings(
                defaults
            );

            res.json({

                ok:
                    true,

                settings:
                    getSettings()

            });

        }
        catch (error) {

            res
                .status(500)
                .json({

                    ok:
                        false,

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
    (req, res) => {

        try {

            const oldPassword =
                String(
                    req.body?.old_password ||
                    ""
                );

            const newPassword =
                String(
                    req.body?.new_password ||
                    ""
                );


            if (
                !checkPassword(
                    oldPassword
                )
            ) {

                return res
                    .status(401)
                    .json({

                        ok:
                            false,

                        error:
                            "Current password incorrect"

                    });

            }


            if (
                newPassword.length <
                6
            ) {

                return res
                    .status(400)
                    .json({

                        ok:
                            false,

                        error:
                            "Password must be at least 6 characters"

                    });

            }


            savePassword(
                newPassword
            );


            res.json({

                ok:
                    true

            });

        }
        catch (error) {

            res
                .status(500)
                .json({

                    ok:
                        false,

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
    (req, res) => {

        res.sendFile(
            path.join(
                PUBLIC_DIR,
                "admin.html"
            )
        );

    }
);


// ============================================================
// CONNECT SETTINGS LOADER
// ============================================================

setSettingsLoader(
    () => getSettings()
);


// ============================================================
// START SERVER
// ============================================================

const httpServer =
    app.listen(
        PORT,
        async () => {

            console.log(
                "=============================================="
            );

            console.log(
                "SOHEL VAI ADMIN SERVER"
            );

            console.log(
                "Port:",
                PORT
            );

            console.log(
                "=============================================="
            );


            try {

                await startBot();

            }
            catch (error) {

                console.error(
                    "=============================================="
                );

                console.error(
                    "TELEGRAM BOT START ERROR:"
                );

                console.error(
                    error?.message ||
                    error
                );

                console.error(
                    "=============================================="
                );

            }

        }
    );


// ============================================================
// GRACEFUL SHUTDOWN
// ============================================================

function gracefulShutdown(
    signal
) {

    console.log(
        `Received ${signal}. Shutting down...`
    );


    stopBot(
        signal
    );


    httpServer.close(
        () => {

            process.exit(
                0
            );

        }
    );


    setTimeout(
        () => {

            process.exit(
                0
            );

        },
        10000
    ).unref();

}


process.once(
    "SIGINT",
    () =>
        gracefulShutdown(
            "SIGINT"
        )
);


process.once(
    "SIGTERM",
    () =>
        gracefulShutdown(
            "SIGTERM"
        )
);
