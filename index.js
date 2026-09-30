// ============================================================
// SOHEL VAI OFFICIAL CHANNEL
// PRIVATE / EPHEMERAL WELCOME BOT
// FINAL NODE.JS VERSION
// ============================================================

const { Telegraf } = require("telegraf");


// ============================================================
// BOT TOKEN
// ============================================================

const BOT_TOKEN =
    String(process.env.BOT_TOKEN || "").trim();

if (!BOT_TOKEN) {

    throw new Error(
        "BOT_TOKEN environment variable is missing."
    );

}

const bot =
    new Telegraf(BOT_TOKEN);


// ============================================================
// CONFIG
// ============================================================

const CONFIG = {

    CHANNEL_ID:
        Number(
            process.env.CHANNEL_ID ||
            -1003985236266
        ),

    CHANNEL_NAME:
        "SOHEL VAI OFFICIAL CHANNEL",

    WELCOME_ENABLED:
        true,

    DELETE_AFTER_SECONDS:
        300,

    PROFILE_PHOTO_ENABLED:
        true,

    WELCOME_TEXT:
`প্রিয় {first_name} ভাই,

SOHEL VAI OFFICIAL CHANNEL এ আপনাকে স্বাগতম!

{channel_title}

আমাদের Official Channel-এ Join করার জন্য আপনাকে ধন্যবাদ।

নিয়মিত Update পেতে আমাদের Channel-এর সাথে যুক্ত থাকুন।

— SOHEL VAI`,

    MAIN_BUTTONS: [

        {
            enabled: true,
            text: "📢 OFFICIAL CHANNEL",
            url:
                "https://t.me/+WZR7nsATt1szNmRh"
        },

        {
            enabled: true,
            text: "🤖 SUPPORT BOT",
            url:
                "https://t.me/sohel_ai_prediction_bot"
        },

        {
            enabled: true,
            text: "🔗 BUTTON 3",
            url:
                "https://t.me/TRADER_SOHEL_BDT_TOP"
        }

    ],

    VIDEO_BUTTONS: [

        {
            enabled: true,
            text: "📺 VIDEO BUTTON 1",
            url:
                "https://t.me/+gNZZwOIN72BjYzQ1"
        },

        {
            enabled: true,
            text: "🔗 VIDEO BUTTON 2",
            url:
                "https://t.me/EARNING_TEME_bd"
        }

    ],

    VOICE_TEXT:
        "🎙️ আমাদের Voice Message শুনুন।",

    VOICE_BUTTON_TEXT:
        "🔊 AUDIO LINK",

    VIDEO_URL:
        "",

    AUDIO_URL:
        ""

};


// ============================================================
// RUNTIME SETTINGS
// ============================================================

let RUNTIME = {

    welcome_enabled:
        CONFIG.WELCOME_ENABLED,

    channel_title:
        CONFIG.CHANNEL_NAME,

    welcome_text:
        CONFIG.WELCOME_TEXT,

    profile_photo_enabled:
        CONFIG.PROFILE_PHOTO_ENABLED,

    delete_seconds:
        CONFIG.DELETE_AFTER_SECONDS,

    media_type:
        "none",

    video_file_id:
        "",

    video_filename:
        "",

    video_url:
        CONFIG.VIDEO_URL,

    audio_file_id:
        "",

    audio_filename:
        "",

    audio_url:
        CONFIG.AUDIO_URL,

    voice_text:
        CONFIG.VOICE_TEXT,

    voice_button_text:
        CONFIG.VOICE_BUTTON_TEXT,

    main_buttons:
        CONFIG.MAIN_BUTTONS,

    video_buttons:
        CONFIG.VIDEO_BUTTONS

};


// ============================================================
// DUPLICATE PROTECTION
// ============================================================

const PROCESSED_USERS =
    new Set();


// ============================================================
// SETTINGS LOADER
// ============================================================

let SETTINGS_LOADER = null;


function setSettingsLoader(loader) {

    if (
        typeof loader !== "function"
    ) {

        throw new TypeError(
            "setSettingsLoader expects a function"
        );

    }

    SETTINGS_LOADER =
        loader;

}


// ============================================================
// SAFE NUMBER
// ============================================================

function safeNumber(
    value,
    fallback
) {

    const number =
        Number(value);

    if (
        !Number.isFinite(number)
    ) {

        return fallback;

    }

    return number;

}


// ============================================================
// DELETE TIME
// ============================================================

function normalizeDeleteTime(
    value
) {

    let seconds =
        safeNumber(
            value,
            CONFIG.DELETE_AFTER_SECONDS
        );

    seconds =
        Math.max(
            30,
            Math.min(
                900,
                seconds
            )
        );

    return Math.floor(
        seconds
    );

}


// ============================================================
// KEYBOARD
// ============================================================

function makeKeyboard(
    buttons
) {

    if (
        !Array.isArray(buttons)
    ) {

        return {
            inline_keyboard: []
        };

    }

    const rows = [];

    for (
        const button of buttons
    ) {

        if (!button) {
            continue;
        }

        const text =
            String(
                button.text || ""
            ).trim();

        const url =
            String(
                button.url || ""
            ).trim();

        if (
            button.enabled === false ||
            !text ||
            !url
        ) {

            continue;

        }

        rows.push([
            {
                text,
                url
            }
        ]);

    }

    return {
        inline_keyboard:
            rows
    };

}


// ============================================================
// LOAD ADMIN SETTINGS
// ============================================================

async function loadAdminSettings() {

    try {

        if (
            typeof SETTINGS_LOADER !== "function"
        ) {

            return false;

        }

        const loaded =
            await SETTINGS_LOADER();

        const data =
            loaded &&
            loaded.settings &&
            typeof loaded.settings === "object"
                ? loaded.settings
                : loaded;

        if (
            !data ||
            typeof data !== "object"
        ) {

            return false;

        }


        // ----------------------------------------------------
        // BASIC
        // ----------------------------------------------------

        if (
            typeof data.welcome_enabled ===
            "boolean"
        ) {

            RUNTIME.welcome_enabled =
                data.welcome_enabled;

        }


        if (
            data.channel_title !== undefined
        ) {

            RUNTIME.channel_title =
                String(
                    data.channel_title || ""
                );

        }


        if (
            data.welcome_text !== undefined
        ) {

            RUNTIME.welcome_text =
                String(
                    data.welcome_text || ""
                );

        }


        if (
            typeof data.profile_photo_enabled ===
            "boolean"
        ) {

            RUNTIME.profile_photo_enabled =
                data.profile_photo_enabled;

        }


        // ----------------------------------------------------
        // DELETE TIME
        // ----------------------------------------------------

        if (
            data.duration !== undefined
        ) {

            RUNTIME.delete_seconds =
                normalizeDeleteTime(
                    data.duration
                );

        }

        if (
            data.delete_seconds !== undefined
        ) {

            RUNTIME.delete_seconds =
                normalizeDeleteTime(
                    data.delete_seconds
                );

        }


        // ----------------------------------------------------
        // MEDIA TYPE
        // ----------------------------------------------------

        if (
            data.media_type !== undefined
        ) {

            const mediaType =
                String(
                    data.media_type
                ).toLowerCase();

            if (
                mediaType === "audio" ||
                mediaType === "video"
            ) {

                RUNTIME.media_type =
                    mediaType;

            } else {

                RUNTIME.media_type =
                    "none";

            }

        }


        // ----------------------------------------------------
        // VIDEO
        // ----------------------------------------------------

        if (
            data.video_file_id !== undefined
        ) {

            RUNTIME.video_file_id =
                String(
                    data.video_file_id || ""
                );

        }

        if (
            data.video_filename !== undefined
        ) {

            RUNTIME.video_filename =
                String(
                    data.video_filename || ""
                );

        }

        if (
            data.video_url !== undefined
        ) {

            RUNTIME.video_url =
                String(
                    data.video_url || ""
                );

        }


        // ----------------------------------------------------
        // AUDIO
        // ----------------------------------------------------

        if (
            data.audio_file_id !== undefined
        ) {

            RUNTIME.audio_file_id =
                String(
                    data.audio_file_id || ""
                );

        }

        if (
            data.audio_filename !== undefined
        ) {

            RUNTIME.audio_filename =
                String(
                    data.audio_filename || ""
                );

        }

        if (
            data.audio_url !== undefined
        ) {

            RUNTIME.audio_url =
                String(
                    data.audio_url || ""
                );

        }


        // ----------------------------------------------------
        // VOICE
        // ----------------------------------------------------

        if (
            data.voice_text !== undefined
        ) {

            RUNTIME.voice_text =
                String(
                    data.voice_text || ""
                );

        }

        if (
            data.voice_button_text !== undefined
        ) {

            RUNTIME.voice_button_text =
                String(
                    data.voice_button_text || ""
                );

        }


        // ----------------------------------------------------
        // MAIN BUTTONS
        // ----------------------------------------------------

        if (
            Array.isArray(
                data.main_buttons
            )
        ) {

            RUNTIME.main_buttons =
                data.main_buttons;

        } else if (
            Array.isArray(
                data.buttons
            )
        ) {

            RUNTIME.main_buttons =
                data.buttons.slice(
                    0,
                    3
                );

        }


        // ----------------------------------------------------
        // VIDEO BUTTONS
        // ----------------------------------------------------

        if (
            Array.isArray(
                data.video_buttons
            )
        ) {

            RUNTIME.video_buttons =
                data.video_buttons;

        }


        return true;

    }
    catch (error) {

        console.log(
            "Admin settings load failed:",
            error?.message || error
        );

        return false;

    }

}


// ============================================================
// PROFILE PHOTO
// ============================================================

async function getProfilePhoto(
    userId
) {

    try {

        if (
            !RUNTIME.profile_photo_enabled
        ) {

            return null;

        }

        const result =
            await bot.telegram.getUserProfilePhotos(
                userId,
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

        const photos =
            result.photos[0];

        if (
            !photos ||
            !photos.length
        ) {

            return null;

        }

        return photos[
            photos.length - 1
        ].file_id;

    }
    catch (error) {

        console.log(
            "Profile photo error:",
            error?.message || error
        );

        return null;

    }

}


// ============================================================
// WELCOME TEXT
// ============================================================

function createWelcomeText(
    member
) {

    const firstName =
        String(
            member?.first_name ||
            member?.username ||
            "প্রিয় ভাই"
        );

    const channelName =
        String(
            RUNTIME.channel_title ||
            CONFIG.CHANNEL_NAME
        );

    let text =
        String(
            RUNTIME.welcome_text ||
            CONFIG.WELCOME_TEXT
        );

    text =
        text.replaceAll(
            "{first_name}",
            firstName
        );

    text =
        text.replaceAll(
            "{channel_title}",
            channelName
        );

    return text;

}


// ============================================================
// PRIVATE TEXT
// ============================================================

async function sendPrivateText(
    userId,
    text,
    keyboard = null
) {

    const options =
        {

            ephemeral_message_parameters: {
                receiver_user_id:
                    Number(userId)
            }

        };

    if (keyboard) {

        options.reply_markup =
            keyboard;

    }

    return await bot.telegram.sendMessage(
        CONFIG.CHANNEL_ID,
        text,
        options
    );

}


// ============================================================
// PRIVATE PHOTO
// ============================================================

async function sendPrivatePhoto(
    userId,
    photo,
    caption,
    keyboard = null
) {

    const options =
        {

            ephemeral_message_parameters: {
                receiver_user_id:
                    Number(userId)
            }

        };

    if (caption) {

        options.caption =
            caption;

    }

    if (keyboard) {

        options.reply_markup =
            keyboard;

    }

    return await bot.telegram.sendPhoto(
        CONFIG.CHANNEL_ID,
        photo,
        options
    );

}


// ============================================================
// PRIVATE VIDEO
// ============================================================

async function sendPrivateVideo(
    userId,
    video,
    keyboard = null
) {

    const options =
        {

            ephemeral_message_parameters: {
                receiver_user_id:
                    Number(userId)
            },

            supports_streaming:
                true

        };

    if (keyboard) {

        options.reply_markup =
            keyboard;

    }

    return await bot.telegram.sendVideo(
        CONFIG.CHANNEL_ID,
        video,
        options
    );

}


// ============================================================
// PRIVATE AUDIO
// ============================================================

async function sendPrivateAudio(
    userId,
    audio,
    keyboard = null
) {

    const options =
        {

            ephemeral_message_parameters: {
                receiver_user_id:
                    Number(userId)
            }

        };

    if (keyboard) {

        options.reply_markup =
            keyboard;

    }

    return await bot.telegram.sendAudio(
        CONFIG.CHANNEL_ID,
        audio,
        options
    );

}


// ============================================================
// DELETE EPHEMERAL
// ============================================================

async function deleteLater(
    userId,
    messageId,
    seconds
) {

    const delay =
        normalizeDeleteTime(
            seconds
        );

    setTimeout(
        async () => {

            try {

                if (
                    typeof bot.telegram
                        .deleteEphemeralMessage ===
                    "function"
                ) {

                    await bot.telegram
                        .deleteEphemeralMessage(
                            CONFIG.CHANNEL_ID,
                            Number(userId),
                            Number(messageId)
                        );

                } else {

                    await bot.telegram.callApi(
                        "deleteEphemeralMessage",
                        {
                            chat_id:
                                CONFIG.CHANNEL_ID,

                            user_id:
                                Number(userId),

                            message_id:
                                Number(messageId)
                        }
                    );

                }

            }
            catch (error) {

                console.log(
                    "Delete error:",
                    error?.message || error
                );

            }

        },
        delay * 1000
    );

}


// ============================================================
// SEND WELCOME
// ============================================================

async function sendWelcome(
    member
) {

    if (
        !member ||
        !member.id
    ) {

        return;

    }

    const userId =
        Number(
            member.id
        );


    // --------------------------------------------------------
    // PROFILE PHOTO
    // --------------------------------------------------------

    const profilePhoto =
        await getProfilePhoto(
            userId
        );


    // --------------------------------------------------------
    // TEXT
    // --------------------------------------------------------

    const welcomeText =
        createWelcomeText(
            member
        );


    // --------------------------------------------------------
    // MAIN BUTTONS
    // --------------------------------------------------------

    const mainKeyboard =
        makeKeyboard(
            RUNTIME.main_buttons
        );


    // --------------------------------------------------------
    // WELCOME MESSAGE
    // --------------------------------------------------------

    let welcomeMessage;

    if (profilePhoto) {

        welcomeMessage =
            await sendPrivatePhoto(
                userId,
                profilePhoto,
                welcomeText,
                mainKeyboard
            );

    } else {

        welcomeMessage =
            await sendPrivateText(
                userId,
                welcomeText,
                mainKeyboard
            );

    }


    if (
        welcomeMessage?.message_id
    ) {

        deleteLater(
            userId,
            welcomeMessage.message_id,
            RUNTIME.delete_seconds
        );

    }


    // ========================================================
    // MEDIA TYPE
    // ========================================================

    const mediaType =
        String(
            RUNTIME.media_type || "none"
        ).toLowerCase();


    // ========================================================
    // VIDEO
    // ========================================================

    if (
        mediaType === "video"
    ) {

        const video =
            RUNTIME.video_file_id ||
            RUNTIME.video_url;

        if (video) {

            try {

                const videoMessage =
                    await sendPrivateVideo(
                        userId,
                        video,
                        makeKeyboard(
                            RUNTIME.video_buttons
                        )
                    );

                if (
                    videoMessage?.message_id
                ) {

                    deleteLater(
                        userId,
                        videoMessage.message_id,
                        RUNTIME.delete_seconds
                    );

                }

            }
            catch (error) {

                console.log(
                    "Video send failed:",
                    error?.message || error
                );

            }

        }

    }


    // ========================================================
    // VOICE TEXT
    // ========================================================

    if (
        String(
            RUNTIME.voice_text || ""
        ).trim()
    ) {

        try {

            const voiceKeyboard =
                RUNTIME.audio_url
                    ? makeKeyboard([
                        {
                            enabled: true,
                            text:
                                RUNTIME.voice_button_text,
                            url:
                                RUNTIME.audio_url
                        }
                    ])
                    : null;

            const voiceTextMessage =
                await sendPrivateText(
                    userId,
                    RUNTIME.voice_text,
                    voiceKeyboard
                );

            if (
                voiceTextMessage?.message_id
            ) {

                deleteLater(
                    userId,
                    voiceTextMessage.message_id,
                    RUNTIME.delete_seconds
                );

            }

        }
        catch (error) {

            console.log(
                "Voice text error:",
                error?.message || error
            );

        }

    }


    // ========================================================
    // AUDIO
    // ========================================================

    if (
        mediaType === "audio"
    ) {

        const audio =
            RUNTIME.audio_file_id ||
            RUNTIME.audio_url;

        if (audio) {

            try {

                const audioMessage =
                    await sendPrivateAudio(
                        userId,
                        audio
                    );

                if (
                    audioMessage?.message_id
                ) {

                    deleteLater(
                        userId,
                        audioMessage.message_id,
                        RUNTIME.delete_seconds
                    );

                }

            }
            catch (error) {

                console.log(
                    "Audio send failed:",
                    error?.message || error
                );

            }

        }

    }

}


// ============================================================
// NEW MEMBER
// ============================================================

async function handleNewMember(
    member
) {

    if (
        !member ||
        !member.id
    ) {

        return;

    }

    const userId =
        Number(
            member.id
        );


    if (
        PROCESSED_USERS.has(
            userId
        )
    ) {

        return;

    }


    // Load latest settings BEFORE marking processed.
    await loadAdminSettings();


    if (
        !RUNTIME.welcome_enabled
    ) {

        return;

    }


    try {

        await sendWelcome(
            member
        );

        PROCESSED_USERS.add(
            userId
        );

    }
    catch (error) {

        console.log(
            "Welcome send error:",
            error?.message || error
        );

    }

}


// ============================================================
// CHAT MEMBER
// ============================================================

bot.on(
    "chat_member",
    async (ctx) => {

        try {

            const update =
                ctx.update?.chat_member;

            if (!update) {
                return;
            }


            if (
                Number(
                    update.chat?.id
                ) !==
                CONFIG.CHANNEL_ID
            ) {

                return;

            }


            const oldStatus =
                update.old_chat_member?.status;

            const newStatus =
                update.new_chat_member?.status;

            const user =
                update.new_chat_member?.user;


            if (!user) {
                return;
            }


            const wasOut =
                oldStatus === "left" ||
                oldStatus === "kicked";


            const isMember =
                newStatus === "member" ||
                newStatus === "administrator" ||
                newStatus === "creator";


            if (
                wasOut &&
                isMember
            ) {

                await handleNewMember(
                    user
                );

            }

        }
        catch (error) {

            console.log(
                "chat_member error:",
                error?.message || error
            );

        }

    }
);


// ============================================================
// FALLBACK
// ============================================================

bot.on(
    "new_chat_members",
    async (ctx) => {

        try {

            const members =
                ctx.message?.new_chat_members;

            if (
                !Array.isArray(members)
            ) {

                return;

            }

            for (
                const member of members
            ) {

                await handleNewMember(
                    member
                );

            }

        }
        catch (error) {

            console.log(
                "new_chat_members error:",
                error?.message || error
            );

        }

    }
);


// ============================================================
// TEST COMMAND
// ============================================================

bot.command(
    "welcome_test",
    async (ctx) => {

        try {

            await loadAdminSettings();

            if (ctx.from) {

                await sendWelcome(
                    ctx.from
                );

            }

        }
        catch (error) {

            console.log(
                "Welcome test error:",
                error?.message || error
            );

        }

    }
);


// ============================================================
// START BOT
// ============================================================

let BOT_STARTED =
    false;


async function startBot() {

    if (BOT_STARTED) {

        return;

    }


    try {

        await bot.telegram.deleteWebhook({
            drop_pending_updates: false
        });

    }
    catch (error) {

        console.log(
            "Webhook cleanup warning:",
            error?.message || error
        );

    }


    const me =
        await bot.telegram.getMe();


    console.log(
        "Telegram bot authenticated:",
        `@${me.username || me.first_name}`
    );


    await bot.launch({

        allowedUpdates: [
            "chat_member",
            "message"
        ],

        dropPendingUpdates:
            false

    });


    BOT_STARTED =
        true;


    // --------------------------------------------------------
    // PERMISSION CHECK
    // --------------------------------------------------------

    try {

        const member =
            await bot.telegram.getChatMember(
                CONFIG.CHANNEL_ID,
                me.id
            );

        console.log(
            "Channel bot status:",
            member?.status || "unknown"
        );

        if (
            member?.status ===
            "administrator"
        ) {

            console.log(
                "can_send_welcome_messages:",
                member?.can_send_welcome_messages
            );

        }

    }
    catch (error) {

        console.log(
            "Channel permission check warning:",
            error?.message || error
        );

    }


    console.log(
        "Telegram Welcome Bot polling started."
    );

}


// ============================================================
// STOP BOT
// ============================================================

function stopBot(
    reason = "shutdown"
) {

    if (!BOT_STARTED) {

        return;

    }

    try {

        bot.stop(
            reason
        );

    }
    catch (error) {

        console.log(
            "Bot stop warning:",
            error?.message || error
        );

    }
    finally {

        BOT_STARTED =
            false;

    }

}


// ============================================================
// ERROR HANDLER
// ============================================================

bot.catch(
    (error, ctx) => {

        console.error(
            "TELEGRAF ERROR:",
            error?.message || error,
            "update:",
            ctx?.update?.update_id
        );

    }
);


// ============================================================
// EXPORT
// ============================================================

module.exports = {

    bot,

    CONFIG,

    startBot,

    stopBot,

    setSettingsLoader,

    loadAdminSettings

};
