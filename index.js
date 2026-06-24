const TelegramBot = require('node-telegram-bot-api/src/telegram');
const express = require('express');
const app = express();

app.use(express.json());

// Thong tin Bot cua ban da duoc cau hinh san
const token = '8818459095:AAH4uzwQSnoGWbsGERcAc0gy8AtrWafiSNQ';
const VIDEO_FILE_ID = 'BAACAgUAAxkBAAMDajumkxcIZOuTw3lSGg2tehqXAvgAAqQnAAJGXdlVevfiXp-Joe48BA';

const bot = new TelegramBot(token);

// Route kiem tra server hoat dong (Health Check)
app.get('/', (req, res) => {
    res.send('Bot Demo dang hoat dong truc tuyen!');
});

// Route nhan tin nhan tu Telegram chuyen ve
app.post(`/bot${token}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

// Xu ly khi nguoi dung an /start hoặc nut Start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const firstName = msg.from.first_name || 'ban';

    // Bot tu dong ban video tu Cloud Telegram sang cho User
    bot.sendVideo(chatId, VIDEO_FILE_ID, {
        caption: `Chao ${firstName}! Cam on ban da quan tam den Bot Demo. Duoi day la video gioi thieu danh cho ban! 🚀`
    }).catch((error) => {
        console.error("Loi gui video:", error.message);
    });
});

// Khoi dong Express Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`Server dang chay tai port ${PORT}`);

    // Tu dong cau hinh Webhook khi deploy len Render
    if (process.env.RENDER_EXTERNAL_URL) {
        const webhookUrl = `${process.env.RENDER_EXTERNAL_URL}/bot${token}`;
        await bot.setWebHook(webhookUrl);
        console.log(`Da thiet lap Webhook thanh cong: ${webhookUrl}`);
    }
});