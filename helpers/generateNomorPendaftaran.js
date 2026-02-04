export const generateNomorPendaftaran = () => {
  const t = Date.now().toString();
  const rnd = Math.floor(Math.random() * 900) + 100;
  return `PMB${t.slice(-6)}${rnd}`;
};
