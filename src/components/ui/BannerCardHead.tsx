import React from 'react';
import { NavHistory } from '@components/layout/NavHistory';

interface BannerCardProps {
  bannerImg?: string | null;
  children?: React.ReactNode;
}

export const BannerCardHead: React.FC<BannerCardProps> = ({ bannerImg, children }) => {
  return (
    <header className="relative w-full overflow-hidden bg-[#121212] px-6 pt-10 pb-8 text-white select-none min-h-[120px] flex flex-col items-end">
      <NavHistory className="relative z-20 text-white" />
      {bannerImg && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">

          <img
            src={bannerImg}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover blur-3xl opacity-40 scale-125"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/60 to-black/30" />
        </div>


      )}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex items-end gap-6">
        {children}
      </div>
    </header>
  );
};