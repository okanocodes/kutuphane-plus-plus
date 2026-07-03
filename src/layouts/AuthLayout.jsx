import { Outlet, Link } from 'react-router-dom';

export const AuthLayout = () => {
  return (
    <div className="w-full min-h-screen relative flex items-center justify-center bg-[#0d0e13] text-on-surface px-4 py-12 overflow-hidden">
      {/* Ambient Glowing Blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] aspect-square rounded-full bg-vivid-purple/15 blur-[120px] animate-float"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] aspect-square rounded-full bg-ember-orange/10 blur-[120px] animate-float" style={{ animationDelay: '-3s' }}></div>
      <div className="absolute top-[30%] right-[10%] w-[25%] aspect-square rounded-full bg-accent-pink/10 blur-[90px] animate-float" style={{ animationDelay: '-1.5s' }}></div>

      <div className="relative z-10 w-full max-w-[480px] shrink-0 space-y-6 bg-surface-container/60 backdrop-blur-xl p-8 md:p-10 rounded-2xl border border-outline-variant/30 shadow-[0_0_50px_rgba(91,33,182,0.15)]">
        <div className="text-center space-y-xs">
          <Link to="/" className="font-display-lg text-4xl font-bold bg-gradient-to-r from-ember-orange to-accent-pink bg-clip-text text-transparent hover:scale-105 transition-transform inline-block">
            Kütüphane++
          </Link>
          <p className="font-body-md text-xs text-on-surface-variant uppercase tracking-widest font-semibold opacity-75">Bilgi Portalı</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
