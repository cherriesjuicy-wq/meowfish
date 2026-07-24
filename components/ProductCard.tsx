import React, { useRef } from 'react';
import { Product } from '../types';
import { Bookmark, Sparkles, AlertCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  giftCount: number;
  hasVotedToday: boolean;
  onReadPlot: (p: Product) => void;
  onAiStudio: (p: Product) => void;
  onReportError: (p: Product) => void;
  onGiftFish: (p: Product, rect: DOMRect) => void;
}

export default function ProductCard({
  product,
  giftCount,
  hasVotedToday,
  onReadPlot,
  onAiStudio,
  onReportError,
  onGiftFish
}: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleGiftClick = () => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      onGiftFish(product, rect);
    }
  };

  return (
    <div
      ref={cardRef}
      id={`product-card-${product.id}`}
      className="glass-panel-card rounded-[25px] p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5 w-full relative overflow-visible group border border-white/50 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_15px_35px_rgba(255,182,193,0.55)]"
    >
      {/* Decorative background glow on hover */}
      <div className="absolute -inset-4 bg-gradient-to-r from-pink-200/20 to-orange-200/20 rounded-[29px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Left Column: Avatar & Character Info Details */}
      <div className="flex items-center gap-4 z-10 flex-1 min-w-[200px]">
        {/* Fish Avatar */}
        <div className="w-14 h-14 shrink-0 rounded-[18px] bg-gradient-to-br from-[#ffe4e1] to-[#fff5f5] border border-white flex items-center justify-center text-3xl shadow-inner group-hover:scale-108 transition-transform duration-300 select-none">
          {product.image}
        </div>
        <div className="flex flex-col gap-1 min-w-0">
          {/* Title (Font Playball written in uppercase gradient) */}
          <span 
            className="font-mali uppercase font-bold tracking-wider filter block"
            style={{ 
              fontFamily: 'Mali',
              fontSize: '13px',
              color: 'var(--card-area-color, #8c389a)'
            }}
          >
            {product.title}
          </span>

          {/* Character Name (Font Fraunces bold, warm brown) */}
          <h3 
            className="font-fraunces font-black leading-tight transition-colors duration-300"
            style={{ 
              fontSize: '25px', 
              color: 'var(--card-title-color, #504099)' 
            }}
          >
            {product.name}
          </h3>
 
          {/* Age & Category (Font Quicksand, small & soft color) */}
          <div 
            className="font-quicksand font-medium flex items-center gap-1.5 mt-0.5"
            style={{ fontSize: '12px' }}
          >
            <span style={{ color: '#fa6781', fontWeight: 'bold' }}>{product.age}</span>
            <span className="text-pink-300/60">•</span>
            <span style={{ color: '#fa6781', fontWeight: 'bold' }}>{product.category}</span>
          </div>
        </div>
      </div>
 
      {/* Middle Column: Character Description & Tags */}
      <div className="flex flex-col gap-3.5 z-10 flex-1 min-w-0 md:border-l md:border-white/20 md:pl-5 py-1">
        <p 
          className="font-quicksand leading-relaxed"
          style={{ 
            color: 'var(--card-text-color)',
            fontSize: '15px'
          }}
        >
          {product.description}
        </p>

        {/* Tags (Font Lexend, lowercase, pastel bubble, starting with 🐟) */}
        <div className="flex flex-wrap gap-1.5">
          {product.tags.map((tag, idx) => (
            <span
              key={idx}
              className="flex items-center gap-1 font-lexend text-xs py-1 px-3 rounded-full border whitespace-nowrap lowercase shadow-xs"
              style={{
                color: 'var(--card-tag-text)',
                backgroundColor: 'var(--card-tag-bg)',
                borderColor: 'var(--card-tag-border)',
                fontFamily: 'Lexend, sans-serif'
              }}
            >
              <span className="text-[11px] filter saturate-150">🐟</span>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Right Column: Tặng cá Button and Bottom Action Buttons */}
      <div className="flex flex-col sm:flex-row md:flex-col justify-between items-stretch sm:items-center md:items-end gap-3.5 z-10 shrink-0 min-w-[190px] md:border-l md:border-white/20 md:pl-5">
        {/* Floating/Inline Gift Fish Button */}
        <button
          onClick={handleGiftClick}
          title={hasVotedToday ? `Bé đã được tặng ${giftCount} chú cá! Bác đã bình chọn hôm nay rồi! 💝` : `Tặng cá cho em nó nè! (Hiện có ${giftCount} lượt tặng)`}
          className={`h-9 px-4 rounded-full flex items-center justify-center gap-1.5 transition-all duration-300 active:scale-90 hover:scale-108 shadow-sm font-sans text-xs font-black select-none cursor-pointer bg-transparent border-[5px] shrink-0 w-full sm:w-auto md:w-full ${
            hasVotedToday 
              ? "border-pink-300 text-pink-500 hover:bg-pink-100/15" 
              : "border-pink-300/80 hover:border-pink-400 text-pink-500 hover:bg-pink-50/10"
          }`}
          style={{
            touchAction: 'manipulation',
            paddingTop: '1px',
            marginTop: '0px',
            paddingLeft: '13px'
          }}
        >
          <span className="text-sm">
            {hasVotedToday ? "💝" : "🐟"}
          </span>
          <span>{giftCount}</span>
        </button>

        {/* Bottom Action Jelly Buttons (story, link gg ai, báo lỗi) */}
        <div className="grid grid-cols-3 gap-1.5 w-full">
          {/* story */}
          <button
            data-id={product.id}
            onClick={() => onReadPlot(product)}
            className="font-lexend text-[10px] font-bold lowercase rounded-full p-2 py-2 text-white bg-gradient-to-r from-[#F13E93] to-[#FF85BB] hover:from-[#db2c7d] hover:to-[#ff6da9] transition-all duration-300 border border-white/30 active:scale-95 shadow-xs hover:scale-105 text-center flex items-center justify-center gap-0.5 cursor-pointer"
            style={{ touchAction: 'manipulation' }}
          >
            <Bookmark size={11} className="stroke-[2.5]" />
            story
          </button>

          {/* link gg ai */}
          <a
            href="https://aistudio.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-lexend text-[10px] font-bold lowercase rounded-full p-2 py-2 text-white bg-gradient-to-r from-[#F13E93] to-[#FF85BB] hover:from-[#db2c7d] hover:to-[#ff6da9] transition-all duration-300 border border-white/30 active:scale-95 shadow-xs hover:scale-105 text-center flex items-center justify-center gap-0.5 cursor-pointer"
            style={{ touchAction: 'manipulation' }}
          >
            <Sparkles size={11} className="stroke-[2.5] fill-white" />
            link gg ai
          </a>

          {/* báo lỗi */}
          <button
            onClick={() => onReportError(product)}
            className="report-bug-btn font-lexend text-[10px] font-bold lowercase rounded-full p-2 py-2 text-white bg-gradient-to-r from-[#F13E93] to-[#FF85BB] hover:from-[#db2c7d] hover:to-[#ff6da9] transition-all duration-300 border border-white/30 active:scale-95 shadow-xs hover:scale-105 text-center flex items-center justify-center gap-0.5 cursor-pointer"
            style={{ touchAction: 'manipulation' }}
          >
            <AlertCircle size={11} className="stroke-[2.5]" />
            báo lỗi
          </button>
        </div>
      </div>
    </div>
  );
}
