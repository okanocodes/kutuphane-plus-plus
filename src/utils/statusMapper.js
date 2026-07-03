export const statusMapper = (status) => {
  const map = {
    available: { label: 'Müsait', color: 'success', bgClass: 'bg-success/20 text-success' },
    borrowed: { label: 'Ödünçte', color: 'error', bgClass: 'bg-error/20 text-error' },
    reserved: { label: 'Rezerve', color: 'accent-gold', bgClass: 'bg-accent-gold/20 text-accent-gold' },
    maintenance: { label: 'Bakımda', color: 'outline-variant', bgClass: 'bg-outline-variant/20 text-on-surface-variant' },
    lost: { label: 'Kayıp', color: 'error', bgClass: 'bg-error/30 text-error font-bold' }
  };
  return map[status] || { label: status, color: 'outline-variant', bgClass: 'bg-outline-variant/10 text-on-surface-variant' };
};

export default statusMapper;
