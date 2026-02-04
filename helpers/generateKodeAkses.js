export const generateKodeAkses = () => {
  return Math.random().toString(36).slice(-6).toUpperCase();
};
