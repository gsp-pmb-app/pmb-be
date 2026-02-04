export const sendTelegramMessage = async (chat_id, text) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token || !chat_id) return false;

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id,
          text,
          parse_mode: "Markdown",
          disable_web_page_preview: true,
        }),
      },
    );
    const data = await res.json();
    return data.ok === true;
  } catch (err) {
    console.log("Telegram error:", err);
    return false;
  }
};
