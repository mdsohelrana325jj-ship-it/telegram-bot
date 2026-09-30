// ============================================================
// SOHEL VAI OFFICIAL CHANNEL
// NxCreate PRIVATE WELCOME SYSTEM
// FINAL VERSION
// ============================================================
//
// SYSTEM:
//
// 1. Member Profile Photo
// 2. Member Name
// 3. Channel Name
// 4. Welcome Text
// 5. 3 Main Buttons
// 6. Automatic Video
// 7. 2 Video Buttons
// 8. Voice Text
// 9. Audio Voice
// 10. Private/Ephemeral Welcome
// 11. Auto Delete 30 Seconds - 15 Minutes
// 12. Admin Panel Settings Support
//
// IMPORTANT:
// বটটি Telegram Channel-এর Administrator হতে হবে।
//
// ============================================================

const { Telegraf } = require("telegraf");

// পরিবেশ থেকে টেলিগ্রাম বট টোকেন রিড বা প্রসেস করা হচ্ছে
const BOT_TOKEN = String(process.env.BOT_TOKEN || "").trim();

if (!BOT_TOKEN) {
    throw new Error(
        "BOT_TOKEN environment variable is missing. Add your Telegram bot token in Render Environment Variables."
    );
}

const bot = new Telegraf(BOT_TOKEN);

// ============================================================
// CONFIG
// ============================================================

const CONFIG = {

    // --------------------------------------------------------
    // CHANNEL
    // --------------------------------------------------------

    CHANNEL_ID: Number(process.env.CHANNEL_ID || -1003985236266),

    CHANNEL_NAME: "SOHEL VAI OFFICIAL CHANNEL",

    WELCOME_ENABLED: true,


    // --------------------------------------------------------
    // ADMIN PANEL SETTINGS API
    // --------------------------------------------------------
    //
    // Admin Panel থেকে কোনো NxCreate server-এ থাকলে,
    // সেটির URL ব্যবহার করতে হবে:
    //
    // /api/settings
    //
    // এর পর server হিসেবে সঠিক URL দিতে হবে।
    //
    // --------------------------------------------------------

    SETTINGS_URL: "/api/settings",


    // --------------------------------------------------------
    // DEFAULT DELETE TIME
    //
    // Minimum 30 seconds
    // Maximum 900 seconds = 15 minutes
    // --------------------------------------------------------

    DELETE_AFTER_SECONDS: 300,


    // --------------------------------------------------------
    // PROFILE PHOTO
    // --------------------------------------------------------

    PROFILE_PHOTO_ENABLED: true,


    // ========================================================
    // DEFAULT WELCOME TEXT
    // ========================================================

    WELCOME_TEXT:
`👋 👤 স্বাগতম {first_name} ভাই 

🎉 আপনাকে স্বাগতম!
👑 SOHEL VAI OFFICIAL CHANNEL JOIN করার জন্য 💖

❤️ আসসালামু আলাইকুম প্রিয় ভাই ❤️
আমাদের Official Channel-এ Join করার জন্য আপনাকে আন্তরিক ধন্যবাদ।

প্রিয় ভাই আমাদের সাথেই থাকুন আশা করি কোন না কোন একদিন অবশ্যই আপনার উপকারে আসবোই ইনশাআল্লাহ 🥰

📢 নিয়মিত নতুন Update পেতে আমাদের সাথে থাকুন।🫶😘
👑 — SOHEL VAI — 👑`,


    // ========================================================
    // MAIN BUTTONS
    // ========================================================

    MAIN_BUTTONS: [

        {
            text:
                "👑 𝗦𝗢𝗛𝗘𝗟 𝗩𝗔𝗜 𝗢𝗙𝗙𝗜𝗖𝗜𝗔𝗟 𝗖𝗛𝗔𝗡𝗡𝗘𝗟 👑",

            url:
                "https://t.me/+WZR7nsATt1szNmRh"
        },

        {
            text:
                "🚨 𝗦𝗢𝗛𝗘𝗟 𝗔𝗜 𝗣𝗥𝗘𝗗𝗜𝗖𝗧𝗜𝗢𝗡 𝗕𝗢𝗧 🚨",

            url:
                "https://t.me/sohel_ai_prediction_bot"
        },

        {
            text:
                "💎 𝗧𝗥𝗔𝗗𝗜𝗡𝗚 𝗖𝗛𝗔𝗡𝗡𝗘𝗟 𝗕𝗗 ⭐️প",

            url:
                "https://t.me/TRADER_SOHEL_BDT_TOP"
        }

    ],


    // ========================================================
    // VIDEO
    // ========================================================
    //
    // Telegram file_id ব্যবহার করে FILE_ID ব্যবহার করতে হবে।
    //
    // FILE_ID না থাকলে VIDEO_URL ব্যবহার করতে চয়েস করতে পারেন।
    //
    // Recommended:
    // Admin Panel থেকে upload করে Telegram file_id save করুন।
    //
    // ========================================================

    VIDEO_FILE_ID: "",

    VIDEO_URL:
        "https://raw.githubusercontent.com/mdsohelrana325jj-ship-it/my-media/refs/heads/main/VID_20260912_181613_200.mp4",


    // ========================================================
    // VIDEO BUTTONS
    // ========================================================

    VIDEO_BUTTONS: [

        {
            text:
                "🎁 𝗖𝗢𝗨𝗣𝗢𝗡 𝗖𝗢𝗗𝗘 𝗩𝗜𝗗𝗘𝗢 𝗗𝗘𝗧𝗔𝗜𝗟𝗦 𝗣𝗔𝗚𝗘🌸",

            url:
                "https://t.me/+gNZZwOIN72BjYzQ1"
        },

        {
            text:
                "🎉 𝗧𝗘𝗔𝗠 𝗩𝗜𝗗𝗘𝗢 𝗗𝗘𝗧𝗔𝗜𝗟𝗦 𝗣𝗔𝗚𝗘 𝗢𝗙𝗙𝗜𝗖𝗜𝗔𝗟🌸",

            url:
                "https://t.me/EARNING_TEME_bd"
        }

    ],


    // ========================================================
    // VOICE TEXT
    // ========================================================

    VOICE_TEXT:
        "🎙 ভয়েসমেসেস টেস্ট ভরিভিশন 🎶🎶",


    // ========================================================
    // VOICE BUTTON
    // ========================================================

    VOICE_BUTTON_TEXT:
        "🎙🎙 𝗦𝗢𝗛𝗘𝗟 𝗩𝗔𝗜 𝗩𝗢𝗜𝗖𝗘 𝗠𝗘𝗦𝗦𝗔𝗚𝗘 🎶🎶",


    // ========================================================
    // AUDIO
    // ========================================================

    AUDIO_FILE_ID: "",

    AUDIO_URL:
        "https://raw.githubusercontent.com/mdsohelrana325jj-ship-it/my-media/refs/heads/main/audio_example%20(1).mp3"

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

    video_file_id:
        CONFIG.VIDEO_FILE_ID,

    video_url:
        CONFIG.VIDEO_URL,

    audio_file_id:
        CONFIG.AUDIO_FILE_ID,

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

const PROCESSED_USERS = new Set();


// ============================================================
// SHARED SETTINGS LOADER
// ============================================================
// server.js injects its local getSettings() function here.
// This keeps the Bot and Admin API in the same process and
// removes the old HTTP/auth mismatch completely.

let SETTINGS_LOADER = null;

function setSettingsLoader(loader) {

    if (typeof loader !== "function") {

        throw new TypeError(
            "setSettingsLoader expects a function"
        );

    }

    SETTINGS_LOADER = loader;

}


// ============================================================
// PRIVATE MESSAGE OPTIONS
// ============================================================
//
// এই ফিচারটি NxCreate-এর private/ephemeral delivery-এর জন্য।
//
// কার্যপদ্ধতি:
// কোনো Member-কে Welcome দেওয়ার পর Member নিজে দেখতে পারে না।
//
// ============================================================

function privateOptions(userId) {

    return {

        ephemeral_message_parameters: {

            receiver_user_id:
                Number(userId)

        }

    };

}


// ============================================================
// SAFE NUMBER
// ============================================================

function safeNumber(value, fallback) {

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
//
// Minimum = 30 sec
// Maximum = 900 sec
//
// ============================================================

function normalizeDeleteTime(value) {

    let seconds =
        safeNumber(
            value,
            CONFIG.DELETE_AFTER_SECONDS
        );

    if (seconds < 30) {

        seconds = 30;

    }

    if (seconds > 900) {

        seconds = 900;

    }

    return Math.floor(seconds);

}


// ============================================================
// BUILD KEYBOARD
// ============================================================

function makeKeyboard(buttons) {

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

                text: text,

                url: url

            }

        ]);

    }


    return {

        inline_keyboard:
            rows

    };

}


// ============================================================
// LOAD ADMIN PANEL SETTINGS
// ============================================================

async function loadAdminSettings() {

    try {

        if (typeof SETTINGS_LOADER !== "function") {

            return false;

        }


        const loaded = await SETTINGS_LOADER();


        const data =
            loaded &&
            loaded.settings &&
            typeof loaded.settings === "object"
                ? loaded.settings
                : loaded;


        if (!data || typeof data !== "object") {

            return false;

        }


        // ----------------------------------------------------
        // Welcome ON/OFF
        // ----------------------------------------------------

        if (typeof data.welcome_enabled === "boolean") {

            RUNTIME.welcome_enabled = data.welcome_enabled;

        }


        // ----------------------------------------------------
        // Channel Title
        // ----------------------------------------------------

        if (data.channel_title !== undefined) {

            RUNTIME.channel_title = String(data.channel_title || "");

        }


        // ----------------------------------------------------
        // Welcome Text
        // ----------------------------------------------------

        if (data.welcome_text !== undefined) {

            RUNTIME.welcome_text = String(data.welcome_text || "");

        }


        // ----------------------------------------------------
        // Profile Photo
        // ----------------------------------------------------

        if (typeof data.profile_photo_enabled === "boolean") {

            RUNTIME.profile_photo_enabled = data.profile_photo_enabled;

        }


        // ----------------------------------------------------
        // Delete Time
        // ----------------------------------------------------

        if (data.duration !== undefined) {

            RUNTIME.delete_seconds = normalizeDeleteTime(data.duration);

        }

        if (data.delete_seconds !== undefined) {

            RUNTIME.delete_seconds = normalizeDeleteTime(data.delete_seconds);

        }


        // ----------------------------------------------------
        // Video
        // ----------------------------------------------------

        if (data.video_file_id !== undefined) {

            RUNTIME.video_file_id = String(data.video_file_id || "");

        }

        if (data.video_url) {

            RUNTIME.video_url = String(data.video_url);

        }


        // ----------------------------------------------------
        // Audio
        // ----------------------------------------------------

        if (data.audio_file_id !== undefined) {

            RUNTIME.audio_file_id = String(data.audio_file_id || "");

        }

        if (data.audio_url) {

            RUNTIME.audio_url = String(data.audio_url);

        }


        // ----------------------------------------------------
        // Voice Text / Button
        // ----------------------------------------------------

        if (data.voice_text !== undefined) {

            RUNTIME.voice_text = String(data.voice_text || "");

        }

        if (data.voice_button_text !== undefined) {

            RUNTIME.voice_button_text = String(data.voice_button_text || "");

        }


        // ----------------------------------------------------
        // Main Buttons
        // ----------------------------------------------------

        if (Array.isArray(data.main_buttons)) {

            RUNTIME.main_buttons = data.main_buttons;

        } else if (Array.isArray(data.buttons)) {

            RUNTIME.main_buttons = data.buttons.slice(0, 3);

        }


        // ----------------------------------------------------
        // Video Buttons
        // ----------------------------------------------------

        if (Array.isArray(data.video_buttons)) {

            RUNTIME.video_buttons = data.video_buttons;

        }


        return true;

    } catch (error) {

        console.log(
            "Admin settings load failed:",
            error?.message || error
        );

        return false;

    }

}


// ============================================================
// GET MEMBER PROFILE PHOTO
// ============================================================

async function getProfilePhoto(userId) {

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
            error?.message ||
            error
        );

        return null;

    }

}


// ============================================================
// CREATE WELCOME TEXT
// ============================================================

function createWelcomeText(member) {

    const firstName =
        String(
            member?.first_name ||
            member?.username ||
            "ржкрзНрж░рж┐рзЯ ржнрж╛ржЗ"
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
// SEND PRIVATE TEXT
// ============================================================

async function sendPrivateText(
    userId,
    text,
    keyboard = null
) {

    const options =
        privateOptions(
            userId
        );


    if (
        keyboard
    ) {

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
// SEND PRIVATE PHOTO
// ============================================================

async function sendPrivatePhoto(
    userId,
    photoFileId,
    caption,
    keyboard = null
) {

    const options =
        privateOptions(
            userId
        );


    if (
        caption
    ) {

        options.caption =
            caption;

    }


    if (
        keyboard
    ) {

        options.reply_markup =
            keyboard;

    }


    return await bot.telegram.sendPhoto(
        CONFIG.CHANNEL_ID,
        photoFileId,
        options
    );

}


// ============================================================
// SEND PRIVATE VIDEO
// ============================================================

async function sendPrivateVideo(
    userId,
    video,
    keyboard = null
) {

    const options =
        privateOptions(
            userId
        );


    options.supports_streaming =
        true;


    if (
        keyboard
    ) {

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
// SEND PRIVATE AUDIO
// ============================================================

async function sendPrivateAudio(
    userId,
    audio,
    keyboard = null
) {

    const options =
        privateOptions(
            userId
        );


    if (
        keyboard
    ) {

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
// DELETE EPHEMERAL MESSAGE
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

                // Telegraf 4.16.3 predates the new helper method,
                // so call the current Bot API method directly when needed.
                if (typeof bot.telegram.deleteEphemeralMessage === "function") {

                    await bot.telegram.deleteEphemeralMessage(
                        CONFIG.CHANNEL_ID,
                        Number(userId),
                        messageId
                    );

                } else {

                    await bot.telegram.callApi(
                        "deleteEphemeralMessage",
                        {
                            chat_id: CONFIG.CHANNEL_ID,
                            user_id: Number(userId),
                            message_id: Number(messageId)
                        }
                    );

                }

            }
            catch (error) {

                console.log(
                    "Delete error:",
                    error?.message ||
                    error
                );

            }

        },

        delay * 1000

    );

}


// ============================================================
// SEND WELCOME SYSTEM
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
    // WELCOME TEXT
    // --------------------------------------------------------

    const welcomeText =
        createWelcomeText(
            member
        );


    // --------------------------------------------------------
    // MAIN KEYBOARD
    // --------------------------------------------------------

    const mainKeyboard =
        makeKeyboard(
            RUNTIME.main_buttons
        );


    let welcomeMessage;


    // --------------------------------------------------------
    // PROFILE PHOTO + TEXT
    // --------------------------------------------------------

    if (
        profilePhoto
    ) {

        welcomeMessage =
            await sendPrivatePhoto(

                userId,

                profilePhoto,

                welcomeText,

                mainKeyboard

            );

    }
    else {

        welcomeMessage =
            await sendPrivateText(

                userId,

                welcomeText,

                mainKeyboard

            );

    }


    // --------------------------------------------------------
    // DELETE WELCOME
    // --------------------------------------------------------

    if (
        welcomeMessage &&
        welcomeMessage.message_id
    ) {

        deleteLater(

            userId,

            welcomeMessage.message_id,

            RUNTIME.delete_seconds

        );

    }


    // ========================================================
    // VIDEO
    // ========================================================

    const video =
        RUNTIME.video_file_id ||
        RUNTIME.video_url;


    if (
        video
    ) {

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
                videoMessage &&
                videoMessage.message_id
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
                error?.message ||
                error
            );

        }

    }


    // ========================================================
    // VOICE TEXT
    // ========================================================

    try {

        const voiceTextMessage =
            await sendPrivateText(

                userId,

                RUNTIME.voice_text,

                makeKeyboard([

                    {

                        text:
                            RUNTIME.voice_button_text,

                        url:
                            RUNTIME.audio_url

                    }

                ])

            );


        if (
            voiceTextMessage &&
            voiceTextMessage.message_id
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
            error?.message ||
            error
        );

    }


    // ========================================================
    // AUDIO
    // ========================================================

    const audio =
        RUNTIME.audio_file_id ||
        RUNTIME.audio_url;


    if (
        audio
    ) {

        try {

            const audioMessage =
                await sendPrivateAudio(

                    userId,

                    audio

                );


            if (
                audioMessage &&
                audioMessage.message_id
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
                error?.message ||
                error
            );

        }

    }

}


// ============================================================
// NEW MEMBER HANDLER
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


    // --------------------------------------------------------
    // DUPLICATE CHECK
    // --------------------------------------------------------

    if (
        PROCESSED_USERS.has(
            userId
        )
    ) {

        return;

    }


    // --------------------------------------------------------
    // Load latest Admin Panel settings
    // --------------------------------------------------------

    await loadAdminSettings();


    // --------------------------------------------------------
    // Welcome OFF
    // --------------------------------------------------------

    if (
        !RUNTIME.welcome_enabled
    ) {

        return;

    }


    // --------------------------------------------------------
    // Send
    // --------------------------------------------------------

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
            error?.message ||
            error
        );

    }

}


// ============================================================
// CHAT MEMBER UPDATE
// ============================================================

bot.on(
    "chat_member",
    async (ctx) => {

        try {

            const update =
                ctx.update?.chat_member;


            if (
                !update
            ) {

                return;

            }


            const newStatus =
                update.new_chat_member?.status;


            const oldStatus =
                update.old_chat_member?.status;


            const user =
                update.new_chat_member?.user;


            if (
                !user
            ) {

                return;

            }


            // ------------------------------------------------
            // JOIN DETECTION
            // ------------------------------------------------

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
                error?.message ||
                error
            );

        }

    }
);


// ============================================================
// NEW CHAT MEMBERS FALLBACK
// ============================================================

bot.on(
    "new_chat_members",
    async (ctx) => {

        try {

            const members =
                ctx.message?.new_chat_members;


            if (
                !Array.isArray(
                    members
                )
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
                error?.message ||
                error
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


            const user =
                ctx.from;


            if (
                !user
            ) {

                return;

            }


            await sendWelcome(
                user
            );

        }
        catch (error) {

            console.log(
                "Test welcome error:",
                error?.message ||
                error
            );

        }

    }
);


// ============================================================
// BOT START / STOP
// ============================================================

let BOT_STARTED = false;

async function startBot() {

    if (BOT_STARTED) {

        return;

    }


    // Remove any old webhook so polling can receive chat_member updates.
    try {

        await bot.telegram.deleteWebhook({
            drop_pending_updates: false
        });

    } catch (error) {

        console.log(
            "Webhook cleanup warning:",
            error?.message || error
        );

    }


    const me = await bot.telegram.getMe();


    console.log(
        "Telegram bot authenticated:",
        `@${me.username || me.first_name}`
    );


    // Telegram requires chat_member to be explicitly allowed.
    await bot.launch({
        allowedUpdates: [
            "chat_member",
            "message"
        ],
        dropPendingUpdates: false
    });


    BOT_STARTED = true;


    // Helpful startup permission check. It does not stop the bot.
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

        if (member?.status === "administrator") {

            console.log(
                "can_send_welcome_messages:",
                member?.can_send_welcome_messages
            );

            if (member?.can_send_welcome_messages === false) {

                console.log(
                    "WARNING: Bot does not have can_send_welcome_messages permission."
                );

            }

        }

    } catch (error) {

        console.log(
            "Channel permission check warning:",
            error?.message || error
        );

    }


    console.log(
        "Telegram Welcome Bot polling started."
    );

}


function stopBot(reason = "shutdown") {

    if (!BOT_STARTED) {

        return;

    }

    try {

        bot.stop(reason);

    } catch (error) {

        console.log(
            "Bot stop warning:",
            error?.message || error
        );

    } finally {

        BOT_STARTED = false;

    }

}


bot.catch((error, ctx) => {

    console.error(
        "TELEGRAF ERROR:",
        error?.message || error,
        "update:",
        ctx?.update?.update_id
    );

});


// ============================================================
// START LOG
// ============================================================

console.log(
    "=============================================="
);

console.log(
    "SOHEL VAI PRIVATE WELCOME BOT"
);

console.log(
    "Channel ID:",
    CONFIG.CHANNEL_ID
);

console.log(
    "Delete Time:",
    RUNTIME.delete_seconds,
    "seconds"
);

console.log(
    "Private Welcome: ENABLED"
);

console.log(
    "Admin Settings:",
    CONFIG.SETTINGS_URL
);

console.log(
    "=============================================="
);

// ============================================================
// MODULE EXPORTS
// ============================================================

module.exports = {
    bot,
    CONFIG,
    startBot,
    stopBot,
    setSettingsLoader,
    loadAdminSettings
};
