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
// Bot-কে Telegram Channel-এর Administrator করতে হবে.
//
// ============================================================

const { Telegraf } = require("telegraf");

// আপনার টেলিগ্রাম বটের টোকেনটি এখানে বসিয়ে দিন
const bot = new Telegraf("8898220751:AAEQYaYOjnnn92-Z9O9qoTRQawrC-mGm9xg");

// ============================================================
// CONFIG
// ============================================================

const CONFIG = {

    // --------------------------------------------------------
    // CHANNEL
    // --------------------------------------------------------

    CHANNEL_ID: -1003985236266,

    CHANNEL_NAME: "SOHEL VAI OFFICIAL CHANNEL",

    WELCOME_ENABLED: true,


    // --------------------------------------------------------
    // ADMIN PANEL SETTINGS API
    // --------------------------------------------------------
    //
    // Admin Panel যদি একই NxCreate server-এ থাকে,
    // তাহলে এই URL ব্যবহার করুন:
    //
    // /api/settings
    //
    // অন্য server হলে সম্পূর্ণ URL দিতে হবে।
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
`👋 👤 {first_name} ⸙ 🇧🇩

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
                "👑 𝗩𝗜𝗣 𝗚𝗥𝗢𝗨𝗣 𝗙𝗔𝗦𝗧 𝗝𝗢𝗜𝗡 👑",

            url:
                "https://t.me/+WZR7nsATt1szNmRh"
        },

        {
            text:
                "😈 𝗔𝗜 𝗛𝗔𝗖𝗞 𝐋𝐈𝐍𝐊 𝐎𝐏𝐄𝐍 😈",

            url:
                "https://t.me/sohel_ai_prediction_bot"
        },

        {
            text:
                "💬 𝗦𝗨𝗣𝗣𝗢𝗥𝗧 𝗔𝗗𝗠𝗜𝗡 ☎️",

            url:
                "https://t.me/TRADER_SOHEL_BDT_TOP"
        }

    ],


    // ========================================================
    // VIDEO
    // ========================================================
    //
    // Telegram file_id থাকলে FILE_ID ব্যবহার হবে।
    //
    // FILE_ID না থাকলে VIDEO_URL ব্যবহার করার চেষ্টা করবে।
    //
    // Recommended:
    // Admin Panel থেকে upload করে Telegram file_id save করা।
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
                "🔵 𝗕𝗗𝗪𝗜𝗡𝟮𝟰 𝗢𝗳𝗳𝗶𝗰𝗶𝗮𝗹 𝗖𝗵𝗮𝗻𝗻𝗲𝗹 𝗝𝗢𝗜𝗡🎰",

            url:
                "https://t.me/+gNZZwOIN72BjYzQ1"
        },

        {
            text:
                "🟡 𝐃𝐊𝐖𝐈𝐍 𝗢𝗳𝗳𝗶𝗰𝗶𝗮𝗹 𝗖𝗵𝗮𝗻𝗻𝗲𝗹 𝗝𝗎𝗈𝗜𝗡🎰",

            url:
                "https://t.me/EARNING_TEME_bd"
        }

    ],


    // ========================================================
    // VOICE TEXT
    // ========================================================

    VOICE_TEXT:
        "🎶 গুরুত্বপূর্ণ ভয়েস শুনুন 🎵🎵",


    // ========================================================
    // VOICE BUTTON
    // ========================================================

    VOICE_BUTTON_TEXT:
        "🎶🎶 𝗢𝗣𝗘𝗡 𝗩𝗢𝗜𝗖𝗘 🎵🎵",


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
// PRIVATE MESSAGE OPTIONS
// ============================================================
//
// এই অংশটি NxCreate-এর private/ephemeral delivery-এর জন্য।
//
// উদ্দেশ্য:
// একজন Member-এর Welcome অন্য Member দেখতে পারবে না।
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

        if (
            !CONFIG.SETTINGS_URL
        ) {

            return;

        }


        const response =
            await fetch(
                CONFIG.SETTINGS_URL,
                {

                    method: "GET",

                    headers: {

                        "Accept":
                            "application/json"

                    }

                }
            );


        if (
            !response.ok
        ) {

            return;

        }


        const data =
            await response.json();


        if (
            !data ||
            typeof data !== "object"
        ) {

            return;

        }


        // ----------------------------------------------------
        // Welcome ON/OFF
        // ----------------------------------------------------

        if (
            typeof data.welcome_enabled ===
            "boolean"
        ) {

            RUNTIME.welcome_enabled =
                data.welcome_enabled;

        }


        // ----------------------------------------------------
        // Channel Title
        // ----------------------------------------------------

        if (
            data.channel_title
        ) {

            RUNTIME.channel_title =
                String(
                    data.channel_title
                );

        }


        // ----------------------------------------------------
        // Welcome Text
        // ----------------------------------------------------

        if (
            data.welcome_text
        ) {

            RUNTIME.welcome_text =
                String(
                    data.welcome_text
                );

        }


        // ----------------------------------------------------
        // Profile Photo
        // ----------------------------------------------------

        if (
            typeof data.profile_photo_enabled ===
            "boolean"
        ) {

            RUNTIME.profile_photo_enabled =
                data.profile_photo_enabled;

        }


        // ----------------------------------------------------
        // Delete Time
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
        // Video File ID
        // ----------------------------------------------------

        if (
            data.video_file_id
        ) {

            RUNTIME.video_file_id =
                String(
                    data.video_file_id
                );

        }


        // ----------------------------------------------------
        // Video URL
        // ----------------------------------------------------

        if (
            data.video_url
        ) {

            RUNTIME.video_url =
                String(
                    data.video_url
                );

        }


        // ----------------------------------------------------
        // Audio File ID
        // ----------------------------------------------------

        if (
            data.audio_file_id
        ) {

            RUNTIME.audio_file_id =
                String(
                    data.audio_file_id
                );

        }


        // ----------------------------------------------------
        // Audio URL
        // ----------------------------------------------------

        if (
            data.audio_url
        ) {

            RUNTIME.audio_url =
                String(
                    data.audio_url
                );

        }


        // ----------------------------------------------------
        // Voice Text
        // ----------------------------------------------------

        if (
            data.voice_text
        ) {

            RUNTIME.voice_text =
                String(
                    data.voice_text
                );

        }


        // ----------------------------------------------------
        // Voice Button Text
        // ----------------------------------------------------

        if (
            data.voice_button_text
        ) {

            RUNTIME.voice_button_text =
                String(
                    data.voice_button_text
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

        }
        else if (
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


    }
    catch (error) {

        console.log(
            "Admin settings load failed:",
            error?.message ||
            error
        );

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

                if (
                    bot.telegram.deleteEphemeralMessage
                ) {

                    await bot.telegram.deleteEphemeralMessage(

                        CONFIG.CHANNEL_ID,

                        Number(userId),

                        messageId

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


    PROCESSED_USERS.add(
        userId
    );


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