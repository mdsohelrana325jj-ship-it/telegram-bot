
// ============================================================
// SOHEL VAI WELCOME CHANNEL BOT
// FINAL RENDER VERSION
// ============================================================
//
// FEATURES
// ✅ New member detection
// ✅ Private / Ephemeral Welcome
// ✅ Member profile photo
// ✅ Custom welcome text
// ✅ 3 Main Buttons
// ✅ Video
// ✅ Audio
// ✅ Video -> Audio sequence
// ✅ 2 Media Buttons under final media
// ✅ 30 sec - 15 min auto delete
// ✅ BOT_TOKEN + CHANNEL_ID only
// ❌ No Media Storage Channel
// ❌ No MEDIA_STORAGE_CHAT_ID
//
// This version is based on the previously working
// Termux / NxCreate media sending logic.
// ============================================================

const { Telegraf } = require("telegraf");


// ============================================================
// CONFIG
// ============================================================

const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
    throw new Error("BOT_TOKEN is missing");
}

const CHANNEL_ID = Number(
    process.env.CHANNEL_ID || "-1003985236266"
);

const bot = new Telegraf(BOT_TOKEN);


// ============================================================
// SETTINGS LOADER
// server.js will connect this to data/settings.json
// ============================================================

let SETTINGS_LOADER = null;

function setSettingsLoader(loader) {
    SETTINGS_LOADER = loader;
}


// ============================================================
// DEFAULT SETTINGS
// ============================================================

const DEFAULT_SETTINGS = {

    welcome_enabled: true,

    profile_photo_enabled: true,

    channel_title:
        "SOHEL VAI OFFICIAL CHANNEL",

    duration: 30,

    duration_seconds: 30,

    welcome_text:
`👋 {first_name}

🎉 আপনাকে স্বাগতম!

👑 {channel_title} JOIN করার জন্য আপনাকে আন্তরিক ধন্যবাদ।

❤️ আসসালামু আলাইকুম প্রিয় ভাই ❤️

আমাদের Official Channel-এ Join করার জন্য আপনাকে আন্তরিক ধন্যবাদ।

প্রিয় ভাই আমাদের সাথেই থাকুন। আশা করি কোন না কোন একদিন অবশ্যই আপনার উপকারে আসবোই ইনশাআল্লাহ 🥰

📢 নিয়মিত নতুন Update পেতে আমাদের সাথে থাকুন।`,

    text_size: "normal",

    welcome_text_size: "medium",


    // New structure
    video_file_id: "",
    video_filename: "",
    video_url: "",

    audio_file_id: "",
    audio_filename: "",
    audio_url: "",


    // Old structure support
    media_type: "none",
    media_file_id: "",


    main_buttons: [

        {
            enabled: true,
            text: "👑 𝗩𝗜𝗣 𝗚𝗥𝗢𝗨𝗣 𝗙𝗔𝗦𝗧 𝗝𝗢𝗜𝗡 👑",
            url: "https://t.me/"
        },

        {
            enabled: true,
            text: "😈 𝗔𝗜 𝗛𝗔𝗖𝗞 𝐋𝐈𝐍𝐊 𝐎𝐏𝐄𝐍 😈",
            url: "https://t.me/"
        },

        {
            enabled: true,
            text: "💬 𝗦𝗨𝗣𝗣𝗢𝗥𝗧 𝗔𝗃𝗆𝗂𝗇 ☎️",
            url: "https://t.me/"
        }

    ],


    // New media button structure
    video_buttons: [

        {
            enabled: true,
            text: "🔵 𝗢𝗙𝗙𝗜𝗖𝗜𝗔𝗟 𝗖𝗛𝗔𝗡𝗡𝗘𝗟 𝗝𝗢𝗜𝗡 🎰",
            url: "https://t.me/"
        },

        {
            enabled: true,
            text: "🟡 𝗢𝗙𝗙𝗜𝗖𝗜𝗔𝗟 𝗖𝗛𝗔𝗡𝗡𝗘𝗟 𝗝𝗢𝗜𝗡 🎰",
            url: "https://t.me/"
        }

    ],


    // Old button structure support
    buttons: [

        {
            enabled: true,
            text: "Telegram",
            url: "https://t.me/"
        },

        {
            enabled: false,
            text: "Button 2",
            url: ""
        },

        {
            enabled: false,
            text: "Button 3",
            url: ""
        }

    ]

};


// ============================================================
// HELPERS
// ============================================================

function clone(value) {

    return JSON.parse(
        JSON.stringify(value)
    );

}


// ============================================================
// NORMALIZE BUTTON
// ============================================================

function normalizeButton(button) {

    button =
        button &&
        typeof button === "object"
            ? button
            : {};

    return {

        enabled:
            button.enabled === true,

        text:
            String(
                button.text || ""
            )
                .trim()
                .slice(0, 200),

        url:
            String(
                button.url || ""
            )
                .trim()
                .slice(0, 2000)

    };

}


// ============================================================
// NORMALIZE SETTINGS
// ============================================================

function normalizeSettings(raw) {

    const input =
        raw &&
        typeof raw === "object"
            ? raw
            : {};

    const settings = {

        ...clone(DEFAULT_SETTINGS),

        ...input

    };


    // --------------------------------------------------------
    // Duration
    // --------------------------------------------------------

    let duration = Number(
        input.duration_seconds ??
        input.duration ??
        30
    );

    if (!Number.isFinite(duration)) {

        duration = 30;

    }

    duration =
        Math.floor(duration);

    duration =
        Math.max(
            30,
            Math.min(
                900,
                duration
            )
        );


    settings.duration = duration;

    settings.duration_seconds = duration;


    // --------------------------------------------------------
    // Welcome enabled
    // --------------------------------------------------------

    settings.welcome_enabled =
        input.welcome_enabled !== false;


    // --------------------------------------------------------
    // Profile photo
    // --------------------------------------------------------

    settings.profile_photo_enabled =
        input.profile_photo_enabled !== false;


    // --------------------------------------------------------
    // Channel title
    // --------------------------------------------------------

    settings.channel_title =
        String(
            input.channel_title ||
            DEFAULT_SETTINGS.channel_title
        );


    // --------------------------------------------------------
    // Welcome text
    // --------------------------------------------------------

    settings.welcome_text =
        String(
            input.welcome_text ||
            DEFAULT_SETTINGS.welcome_text
        );


    // --------------------------------------------------------
    // Text size
    // --------------------------------------------------------

    if (
        ![
            "small",
            "normal",
            "medium",
            "large"
        ].includes(
            settings.text_size
        )
    ) {

        settings.text_size = "normal";

    }


    // --------------------------------------------------------
    // MAIN BUTTONS
    // --------------------------------------------------------

    let mainButtons =
        Array.isArray(
            input.main_buttons
        )
            ? input.main_buttons
            : Array.isArray(input.buttons)
                ? input.buttons
                : clone(
                    DEFAULT_SETTINGS.main_buttons
                );


    mainButtons =
        mainButtons
            .slice(0, 3)
            .map(normalizeButton);


    while (
        mainButtons.length < 3
    ) {

        mainButtons.push({

            enabled: false,

            text: "",

            url: ""

        });

    }


    settings.main_buttons =
        mainButtons;


    // --------------------------------------------------------
    // MEDIA BUTTONS
    // --------------------------------------------------------

    let mediaButtons =
        Array.isArray(
            input.video_buttons
        )
            ? input.video_buttons
            : [];


    mediaButtons =
        mediaButtons
            .slice(0, 2)
            .map(normalizeButton);


    while (
        mediaButtons.length < 2
    ) {

        mediaButtons.push({

            enabled: false,

            text: "",

            url: ""

        });

    }


    settings.video_buttons =
        mediaButtons;


    // --------------------------------------------------------
    // FILE IDS
    // --------------------------------------------------------

    settings.video_file_id =
        String(
            input.video_file_id || ""
        ).trim();


    settings.audio_file_id =
        String(
            input.audio_file_id || ""
        ).trim();


    // --------------------------------------------------------
    // URLS
    // --------------------------------------------------------

    settings.video_url =
        String(
            input.video_url || ""
        ).trim();


    settings.audio_url =
        String(
            input.audio_url || ""
        ).trim();


    // --------------------------------------------------------
    // OLD MEDIA STRUCTURE SUPPORT
    // --------------------------------------------------------

    settings.media_type =
        String(
            input.media_type || "none"
        );


    settings.media_file_id =
        String(
            input.media_file_id || ""
        ).trim();


    // If old system has media_file_id,
    // automatically convert it into the new structure.

    if (
        !settings.video_file_id &&
        !settings.audio_file_id &&
        settings.media_file_id
    ) {

        if (
            settings.media_type === "video"
        ) {

            settings.video_file_id =
                settings.media_file_id;

        }

        if (
            settings.media_type === "audio"
        ) {

            settings.audio_file_id =
                settings.media_file_id;

        }

    }


    return settings;

}


// ============================================================
// GET SETTINGS
// ============================================================

async function getSettings() {

    try {

        if (
            typeof SETTINGS_LOADER ===
            "function"
        ) {

            const loaded =
                await SETTINGS_LOADER();

            return normalizeSettings(
                loaded
            );

        }

    } catch (error) {

        console.error(
            "SETTINGS LOAD ERROR:",
            error?.message ||
            error
        );

    }


    return normalizeSettings(
        DEFAULT_SETTINGS
    );

}


// ============================================================
// HTML ESCAPE
// ============================================================

function escapeHtml(value) {

    return String(
        value || ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#39;"
        );

}


// ============================================================
// FORMAT WELCOME TEXT
// ============================================================

function formatWelcomeText(
    text,
    firstName,
    channelTitle
) {

    return String(
        text || ""
    )

        .replace(
            /\{first_name\}/g,
            escapeHtml(
                firstName ||
                "বন্ধু"
            )
        )

        .replace(
            /\{channel_title\}/g,
            escapeHtml(
                channelTitle ||
                "SOHEL VAI OFFICIAL CHANNEL"
            )
        );

}


// ============================================================
// VALID URL
// ============================================================

function validUrl(url) {

    return /^(https?|tg):\/\//i.test(
        String(url || "").trim()
    );

}


// ============================================================
// BUILD MAIN BUTTONS
// 2 buttons first row
// 1 button second row
// ============================================================

function buildMainKeyboard(
    settings
) {

    const source =
        Array.isArray(
            settings.main_buttons
        )
            ? settings.main_buttons
            : [];


    const valid =
        source
            .filter(
                button =>
                    button &&
                    button.enabled === true &&
                    String(
                        button.text || ""
                    ).trim() &&
                    validUrl(
                        button.url
                    )
            )
            .slice(0, 3);


    if (!valid.length) {

        return null;

    }


    const rows = [];


    if (valid.length >= 1) {

        rows.push(
            valid
                .slice(0, 2)
                .map(
                    button => ({
                        text:
                            String(
                                button.text
                            ).trim(),

                        url:
                            String(
                                button.url
                            ).trim()
                    })
                )
        );

    }


    if (valid.length >= 3) {

        rows.push([
            {

                text:
                    String(
                        valid[2].text
                    ).trim(),

                url:
                    String(
                        valid[2].url
                    ).trim()

            }
        ]);

    }


    return {

        inline_keyboard:
            rows

    };

}


// ============================================================
// BUILD MEDIA BUTTONS
// ============================================================

function buildMediaKeyboard(
    settings
) {

    const source =
        Array.isArray(
            settings.video_buttons
        )
            ? settings.video_buttons
            : [];


    const valid =
        source
            .filter(
                button =>
                    button &&
                    button.enabled === true &&
                    String(
                        button.text || ""
                    ).trim() &&
                    validUrl(
                        button.url
                    )
            )
            .slice(0, 2);


    if (!valid.length) {

        return null;

    }


    return {

        inline_keyboard:

            valid.map(
                button => ([

                    {

                        text:
                            String(
                                button.text
                            ).trim(),

                        url:
                            String(
                                button.url
                            ).trim()

                    }

                ])
            )

    };

}


// ============================================================
// EPHEMERAL OPTIONS
// ============================================================

function getEphemeralOptions(
    userId
) {

    return {

        ephemeral_message_parameters: {

            receiver_user_id:
                Number(userId)

        }

    };

}


// ============================================================
// GET PROFILE PHOTO
// ============================================================

async function getMemberProfilePhoto(
    userId
) {

    try {

        const result =
            await bot.telegram
                .getUserProfilePhotos(
                    Number(userId),
                    0,
                    1
                );


        if (
            !result ||
            !result.photos ||
            !result.photos.length
        ) {

            return null;

        }


        const sizes =
            result.photos[0];


        if (
            !sizes ||
            !sizes.length
        ) {

            return null;

        }


        return sizes[
            sizes.length - 1
        ].file_id || null;


    } catch (error) {

        console.error(
            "PROFILE PHOTO ERROR:",
            error?.message ||
            error
        );

        return null;

    }

}


// ============================================================
// SEND PHOTO
// ============================================================

async function sendEphemeralPhoto(
    userId,
    photo,
    caption,
    keyboard
) {

    const payload = {

        chat_id:
            CHANNEL_ID,

        photo:
            photo,

        caption:
            caption,

        parse_mode:
            "HTML",

        ...getEphemeralOptions(
            userId
        )

    };


    if (keyboard) {

        payload.reply_markup =
            keyboard;

    }


    return await bot.telegram
        .callApi(
            "sendPhoto",
            payload
        );

}


// ============================================================
// SEND TEXT
// ============================================================

async function sendEphemeralText(
    userId,
    text,
    keyboard
) {

    const payload = {

        chat_id:
            CHANNEL_ID,

        text:
            text,

        parse_mode:
            "HTML",

        ...getEphemeralOptions(
            userId
        )

    };


    if (keyboard) {

        payload.reply_markup =
            keyboard;

    }


    return await bot.telegram
        .callApi(
            "sendMessage",
            payload
        );

}


// ============================================================
// SEND VIDEO
// ============================================================

async function sendEphemeralVideo(
    userId,
    video,
    keyboard
) {

    if (!video) {

        throw new Error(
            "VIDEO FILE ID / URL IS EMPTY"
        );

    }


    const payload = {

        chat_id:
            CHANNEL_ID,

        video:
            video,

        supports_streaming:
            true,

        ...getEphemeralOptions(
            userId
        )

    };


    if (keyboard) {

        payload.reply_markup =
            keyboard;

    }


    console.log(
        "🎬 SENDING VIDEO:",
        {
            userId,
            source:
                String(video)
                    .slice(0, 40)
        }
    );


    const result =
        await bot.telegram.callApi(
            "sendVideo",
            payload
        );


    console.log(
        "✅ VIDEO SENT:",
        {
            userId,

            ephemeral_message_id:
                result?.ephemeral_message_id
        }
    );


    return result;

}


// ============================================================
// SEND AUDIO
// ============================================================

async function sendEphemeralAudio(
    userId,
    audio,
    keyboard
) {

    if (!audio) {

        throw new Error(
            "AUDIO FILE ID / URL IS EMPTY"
        );

    }


    const payload = {

        chat_id:
            CHANNEL_ID,

        audio:
            audio,

        ...getEphemeralOptions(
            userId
        )

    };


    if (keyboard) {

        payload.reply_markup =
            keyboard;

    }


    console.log(
        "🎵 SENDING AUDIO:",
        {
            userId,
            source:
                String(audio)
                    .slice(0, 40)
        }
    );


    const result =
        await bot.telegram.callApi(
            "sendAudio",
            payload
        );


    console.log(
        "✅ AUDIO SENT:",
        {
            userId,

            ephemeral_message_id:
                result?.ephemeral_message_id
        }
    );


    return result;

}


// ============================================================
// DELETE EPHEMERAL MESSAGE
// ============================================================

function deleteEphemeralLater(
    userId,
    ephemeralMessageId,
    seconds
) {

    if (
        !ephemeralMessageId
    ) {

        console.log(
            "⚠️ NO EPHEMERAL MESSAGE ID"
        );

        return;

    }


    const safeSeconds =
        Math.max(
            30,
            Math.min(
                900,
                Number(seconds) || 30
            )
        );


    console.log(
        "⏳ DELETE SCHEDULED:",
        {
            userId,
            ephemeralMessageId,
            after:
                safeSeconds +
                " seconds"
        }
    );


    setTimeout(
        async () => {

            try {

                await bot.telegram
                    .callApi(
                        "deleteEphemeralMessage",
                        {

                            chat_id:
                                CHANNEL_ID,

                            receiver_user_id:
                                Number(
                                    userId
                                ),

                            ephemeral_message_id:
                                Number(
                                    ephemeralMessageId
                                )

                        }
                    );


                console.log(
                    "🗑️ EPHEMERAL DELETED:",
                    {
                        userId,
                        ephemeralMessageId
                    }
                );


            } catch (error) {

                console.error(
                    "❌ EPHEMERAL DELETE ERROR:",
                    {
                        userId,

                        ephemeralMessageId,

                        error:
                            error?.message ||
                            error
                    }
                );

            }

        },

        safeSeconds * 1000

    );

}


// ============================================================
// SEND WELCOME
// ============================================================

async function sendWelcome(
    user
) {

    if (
        !user ||
        !user.id ||
        user.is_bot
    ) {

        return;

    }


    const settings =
        await getSettings();


    if (
        settings.welcome_enabled !== true
    ) {

        console.log(
            "WELCOME DISABLED"
        );

        return;

    }


    const userId =
        Number(user.id);


    const firstName =
        user.first_name ||
        user.username ||
        "বন্ধু";


    const welcomeText =
        formatWelcomeText(

            settings.welcome_text,

            firstName,

            settings.channel_title

        );


    const mainKeyboard =
        buildMainKeyboard(
            settings
        );


    const mediaKeyboard =
        buildMediaKeyboard(
            settings
        );


    const duration =
        settings.duration;


    console.log(
        "================================================"
    );

    console.log(
        "👋 NEW WELCOME"
    );

    console.log(
        "USER:",
        firstName,
        userId
    );

    console.log(
        "VIDEO:",
        !!(
            settings.video_file_id ||
            settings.video_url
        )
    );

    console.log(
        "AUDIO:",
        !!(
            settings.audio_file_id ||
            settings.audio_url
        )
    );

    console.log(
        "DURATION:",
        duration
    );

    console.log(
        "================================================"
    );


    // ========================================================
    // 1. PROFILE PHOTO + WELCOME
    // ========================================================

    let welcomeResult =
        null;


    if (
        settings.profile_photo_enabled
    ) {

        const photo =
            await getMemberProfilePhoto(
                userId
            );


        if (photo) {

            try {

                welcomeResult =
                    await sendEphemeralPhoto(

                        userId,

                        photo,

                        welcomeText,

                        mainKeyboard

                    );

            } catch (photoError) {

                console.error(
                    "PHOTO WELCOME FAILED:",
                    photoError?.message ||
                    photoError
                );


                welcomeResult =
                    await sendEphemeralText(

                        userId,

                        welcomeText,

                        mainKeyboard

                    );

            }

        } else {

            welcomeResult =
                await sendEphemeralText(

                    userId,

                    welcomeText,

                    mainKeyboard

                );

        }

    } else {

        welcomeResult =
            await sendEphemeralText(

                userId,

                welcomeText,

                mainKeyboard

            );

    }


    if (
        welcomeResult?.ephemeral_message_id
    ) {

        deleteEphemeralLater(

            userId,

            welcomeResult.ephemeral_message_id,

            duration

        );

    }


    // ========================================================
    // 2. VIDEO
    // ========================================================

    const video =
        settings.video_file_id ||
        settings.video_url ||
        "";


    if (video) {

        try {

            const videoResult =
                await sendEphemeralVideo(

                    userId,

                    video,

                    // Buttons ONLY when there is
                    // no audio. Otherwise buttons
                    // go under final Audio.

                    settings.audio_file_id ||
                    settings.audio_url
                        ? null
                        : mediaKeyboard

                );


            if (
                videoResult?.ephemeral_message_id
            ) {

                deleteEphemeralLater(

                    userId,

                    videoResult.ephemeral_message_id,

                    duration

                );

            }

        } catch (error) {

            console.error(
                "❌ VIDEO SEND FAILED:",
                {
                    userId,

                    error:
                        error?.message ||
                        error
                }
            );

        }

    } else {

        console.log(
            "⚠️ VIDEO NOT CONFIGURED"
        );

    }


    // ========================================================
    // 3. AUDIO
    // ========================================================

    const audio =
        settings.audio_file_id ||
        settings.audio_url ||
        "";


    if (audio) {

        try {

            const audioResult =
                await sendEphemeralAudio(

                    userId,

                    audio,

                    mediaKeyboard

                );


            if (
                audioResult?.ephemeral_message_id
            ) {

                deleteEphemeralLater(

                    userId,

                    audioResult.ephemeral_message_id,

                    duration

                );

            }

        } catch (error) {

            console.error(
                "❌ AUDIO SEND FAILED:",
                {
                    userId,

                    error:
                        error?.message ||
                        error
                }
            );

        }

    } else {

        console.log(
            "⚠️ AUDIO NOT CONFIGURED"
        );

    }


    console.log(
        "✅ WELCOME PROCESS FINISHED:",
        userId
    );

}


// ============================================================
// NEW MEMBER DETECTION
// ============================================================

bot.on(
    "chat_member",
    async ctx => {

        try {

            const update =
                ctx.update?.chat_member;


            if (!update) {

                return;

            }


            const chat =
                update.chat;


            if (
                Number(chat?.id) !==
                CHANNEL_ID
            ) {

                return;

            }


            const oldMember =
                update.old_chat_member;


            const newMember =
                update.new_chat_member;


            const user =
                newMember?.user;


            if (!user) {

                return;

            }


            const oldStatus =
                oldMember?.status ||
                "left";


            const newStatus =
                newMember?.status;


            const wasOutside =
                oldStatus === "left" ||
                oldStatus === "kicked";


            const becameMember =
                newStatus === "member" ||
                newStatus === "administrator" ||
                newStatus === "creator";


            if (
                !wasOutside ||
                !becameMember
            ) {

                return;

            }


            if (user.is_bot) {

                return;

            }


            console.log(
                "👋 CHAT MEMBER JOIN:",
                {
                    id: user.id,
                    name:
                        user.first_name
                }
            );


            await sendWelcome(
                user
            );


        } catch (error) {

            console.error(
                "❌ CHAT_MEMBER ERROR:",
                error?.message ||
                error
            );

        }

    }
);


// ============================================================
// OPTIONAL TEST COMMAND
// ============================================================

bot.command(
    "welcome_test",
    async ctx => {

        try {

            console.log(
                "🧪 WELCOME TEST:",
                ctx.from?.id
            );


            await sendWelcome(
                ctx.from
            );


        } catch (error) {

            console.error(
                "❌ WELCOME TEST ERROR:",
                error?.message ||
                error
            );

        }

    }
);


// ============================================================
// START BOT
// ============================================================

async function startBot() {

    try {

        await bot.telegram
            .deleteWebhook({
                drop_pending_updates:
                    false
            });


        const me =
            await bot.telegram.getMe();


        console.log(
            "================================================"
        );

        console.log(
            "🚀 SOHEL VAI BOT STARTED"
        );

        console.log(
            "BOT:",
            "@" + me.username
        );

        console.log(
            "CHANNEL:",
            CHANNEL_ID
        );

        console.log(
            "MEDIA STORAGE:",
            "DISABLED"
        );

        console.log(
            "VIDEO + AUDIO:",
            "ENABLED"
        );

        console.log(
            "EPHEMERAL:",
            "ENABLED"
        );

        console.log(
            "AUTO DELETE:",
            "ENABLED"
        );

        console.log(
            "================================================"
        );


        await bot.launch({

            allowedUpdates: [
                "chat_member",
                "message"
            ],

            dropPendingUpdates:
                false

        });


    } catch (error) {

        console.error(
            "❌ BOT START ERROR:",
            error?.message ||
            error
        );

        throw error;

    }

}


// ============================================================
// STOP BOT
// ============================================================

function stopBot(
    reason = "stop"
) {

    try {

        bot.stop(
            reason
        );

    } catch (error) {

        console.error(
            "BOT STOP ERROR:",
            error?.message ||
            error
        );

    }

}


// ============================================================
// EXPORT
// ============================================================

module.exports = {

    bot,

    startBot,

    stopBot,

    setSettingsLoader,

    sendWelcome,

    CONFIG: {

        CHANNEL_ID

    }

};

