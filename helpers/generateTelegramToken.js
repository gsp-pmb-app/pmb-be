export const generateTelegramToken = () => {
  return "PMB-" + Math.random().toString(36).slice(2, 8).toUpperCase();
};
