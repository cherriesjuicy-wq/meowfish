import React, { useState } from 'react';
import { Product } from '../types';
import { X, Sparkles, AlertTriangle, MessageSquare, Heart, Coins } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CuteModalProps {
  type: 'plot' | 'ai' | 'report' | null;
  product: Product | null;
  onClose: () => void;
  onReward: (amount: number) => void;
  onAddReport?: (characterName: string, errorTypes: string[], details?: string) => void;
}

export default function CuteModal({ type, product, onClose, onReward, onAddReport }: CuteModalProps) {
  const [reasons, setReasons] = useState({
    ooc: false,
    nsfw: false,
    amnesia: false,
    other: false,
  });
  const [otherText, setOtherText] = useState('');
  const [reported, setReported] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPrediction, setAiPrediction] = useState('');

  if (!type || !product) return null;

  const handleSendReport = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedReasons: string[] = [];
    if (reasons.ooc) selectedReasons.push('Nhân vật bị nói lệch tính cách (OOC)');
    if (reasons.nsfw) selectedReasons.push('Lỗi nội dung/NSFW');
    if (reasons.amnesia) selectedReasons.push('Trở nên vô tri/Mất trí nhớ');
    if (reasons.other) selectedReasons.push('Khác');
    
    if (selectedReasons.length === 0) {
      alert("Bác ơi, vui lòng chọn ít nhất 1 loại lỗi nha! 💕");
      return;
    }

    if (reasons.other && !otherText.trim()) {
      alert("Bác ơi, vui lòng điền chi tiết lỗi khi chọn 'Khác' nhé! 💕");
      return;
    }

    if (onAddReport) {
      onAddReport(product.name, selectedReasons, reasons.other ? otherText.trim() : undefined);
    }

    alert('Cảm ơn bạn đã báo cáo, chủ tiệm sẽ xử lý ngay!');
    
    // Reset state & Close
    setReasons({ ooc: false, nsfw: false, amnesia: false, other: false });
    setOtherText('');
    onClose();
  };

  const runAiPrediction = () => {
    setAiLoading(true);
    setAiPrediction('');
    setTimeout(() => {
      const predictions = [
        `🔮 "Quẻ bói cá khô hôm nay dành cho bạn: Sự kết đôi ngọt ngào cùng ${product.name}! Bạn nên thưởng thức một chú cá khô dẻo mềm kèm trà sữa đào. Sự may mắn sẽ bùng nổ khi bạn chia sẻ chú cá này cho đứa bạn thân nhất cùng ao đó nha!" ✨🐟`,
        `💖 "Hệ thống AI Studio phân tích tần số vũ trụ phát hiện ra: Năng lượng của bạn hôm nay cực kỳ tương thích với tính cách '${product.tags[0]}' của ${product.name}. Dự kiến trong 3 giờ tới bạn sẽ nhận được một tin nhắn cực kỳ dễ thương!" 💌✨`,
        `🌈 "Lời khuyên vàng ngọc từ Trí tuệ Cá Khô: ${product.name} khuyên bạn đừng quá bận tâm chuyện phơi nắng hay phơi sương. Hãy thảnh thơi như em nó, ăn một chút ngọt, uống một chút mát, mọi mỏi mệt rồi sẽ bay biến hết!" 🐙⭐`,
        `🍀 "Chỉ số may mắn của bạn hôm nay là 99.9% khi đi cùng ${product.name}! Công thức giải nghiệp hôm nay: Thả tim cho tiệm cá khô, nướng chín cá trên bếp lửa hồng, và cười thật tươi một cái nha!" 🍥✨`
      ];
      setAiPrediction(predictions[Math.floor(Math.random() * predictions.length)]);
      setAiLoading(false);
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className={`fixed inset-0 ${type === 'plot' ? 'bg-black/50 backdrop-blur-[4px]' : 'bg-[#ffe4e1]/60 backdrop-blur-md'}`}
        />

        {/* Modal Panel */}
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className={type === 'plot'
            ? "bg-[#FFCEE3] rounded-xl max-w-[600px] w-full p-8 shadow-2xl border border-white/60 z-10 relative"
            : "glass-panel rounded-[35px] max-w-md w-full p-6 shadow-2xl border border-white/60 z-10 relative candy-glow-pink"
          }
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/60 hover:bg-pink-100 flex items-center justify-center text-[#7c5e55] hover:text-pink-600 transition-colors duration-200"
          >
            <X size={16} />
          </button>

          {/* Icon decoration */}
          <div className="flex justify-center mb-3">
            <span className="text-4xl filter drop-shadow-[0_4px_8px_rgba(255,105,180,0.3)] select-none">
              {product.image}
            </span>
          </div>

          {/* Modal Content depending on type */}
          {type === 'plot' && (
            <div className="text-center flex flex-col gap-4">
              <h2 className="font-coiny font-normal text-[#D6336C] text-2xl">
                Cốt truyện của {product.name}
              </h2>
              <div className="p-5 bg-white/70 rounded-lg border border-pink-200/40 text-left my-1 relative shadow-sm">
                <div className="story-scroll-content font-sans text-[1.1rem]">
                  <div dangerouslySetInnerHTML={{ __html: product.plot }} />
                  {product.openScene && (
                    <>
                      <h3 className="text-center font-bold font-fraunces text-[#D6336C] mt-8 mb-4 tracking-wider text-lg">
                        | OPEN-SCENE |
                      </h3>
                      <div dangerouslySetInnerHTML={{ __html: product.openScene }} />
                    </>
                  )}
                </div>
                {/* Cute quotes decoration */}
                <span className="absolute -bottom-3 -right-2 text-4xl text-pink-200/40 font-serif font-black">”</span>
              </div>

              <button
                onClick={onClose}
                className="font-lexend text-xs lowercase rounded-full p-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold transition-all duration-300 mt-2 hover:scale-105 active:scale-95 shadow-md self-center px-8"
              >
                đóng cửa sổ 💖
              </button>
            </div>
          )}

          {type === 'ai' && (
            <div className="text-center flex flex-col gap-3">
              <span className="font-playball text-orange-500 font-bold text-lg tracking-wider flex items-center justify-center gap-1">
                <Sparkles size={16} className="fill-orange-400 stroke-none animate-pulse" />
                Gemini AI Studio Predictor
                <Sparkles size={16} className="fill-orange-400 stroke-none animate-pulse" />
              </span>
              <h2 className="font-fraunces font-extrabold text-[#5c3e35] text-2xl leading-none">
                {product.name}
              </h2>
              <p className="font-quicksand text-xs text-[#8c6d62] mt-[-4px]">
                Trí tuệ nhân tạo dự đoán duyên số và chỉ số cá khô hôm nay!
              </p>

              <div className="min-h-[140px] flex items-center justify-center bg-white/40 p-4 rounded-2xl border border-orange-100/50 my-2">
                {aiLoading ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
                    <span className="font-itim text-xs text-pink-500 animate-pulse">
                      Đang kết nối thần giao cách cảm với cá khô...
                    </span>
                  </div>
                ) : aiPrediction ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-quicksand text-sm text-[#7c5e55] leading-relaxed text-left"
                  >
                    {aiPrediction}
                  </motion.div>
                ) : (
                  <div className="text-center flex flex-col items-center gap-2">
                    <span className="text-3xl">🔮</span>
                    <span className="font-itim text-sm text-[#7c5e55]">
                      Sẵn sàng bói duyên và vận mệnh của bạn?
                    </span>
                  </div>
                )}
              </div>

              {!aiLoading && !aiPrediction && (
                <button
                  onClick={runAiPrediction}
                  className="font-lexend text-xs lowercase rounded-full p-2.5 bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white font-semibold transition-all duration-300 hover:scale-105 active:scale-95 shadow-md"
                >
                  🔮 xin quẻ bói ngay!
                </button>
              )}

              {aiPrediction && (
                <button
                  onClick={onClose}
                  className="font-lexend text-xs lowercase rounded-full p-2.5 bg-gradient-to-r from-pink-400 to-orange-400 hover:from-pink-500 hover:to-orange-500 text-white font-semibold transition-all duration-300 hover:scale-105 active:scale-95 shadow-md"
                >
                  cảm ơn trí tuệ cá khô! 🐟✨
                </button>
              )}
            </div>
          )}

          {type === 'report' && (
            <div className="flex flex-col gap-3">
              <div className="text-center">
                <span className="font-playball text-pink-500 font-bold text-lg tracking-wider flex items-center justify-center gap-1">
                  <AlertTriangle size={16} className="text-pink-400 animate-bounce" />
                  Báo lỗi cho Chủ tiệm
                  <AlertTriangle size={16} className="text-pink-400 animate-bounce" />
                </span>
                <h2 className="font-fraunces font-extrabold text-[#5c3e35] text-2xl mt-1">
                  {product.name}
                </h2>
                <p className="font-quicksand text-xs text-[#8c6d62] mt-0.5">
                  Bác ơi, bé này làm gì sai khiến bác phiền lòng thế ạ? Hãy chọn các lỗi bên dưới nhé:
                </p>
              </div>

              <form onSubmit={handleSendReport} className="flex flex-col gap-3 my-2 text-[#7c5e55]">
                {/* Quick Select Checkboxes */}
                <div className="flex flex-col gap-2 bg-white/40 p-3 rounded-2xl border border-pink-100/50">
                  <label className="flex items-center gap-2.5 font-quicksand text-xs font-semibold cursor-pointer select-none py-1 hover:text-pink-600 transition-colors">
                    <input
                      type="checkbox"
                      checked={reasons.ooc}
                      onChange={(e) => setReasons({ ...reasons, ooc: e.target.checked })}
                      className="rounded text-pink-500 focus:ring-pink-400 border-pink-200"
                    />
                    <span>Nhân vật bị nói lệch tính cách (OOC)</span>
                  </label>

                  <label className="flex items-center gap-2.5 font-quicksand text-xs font-semibold cursor-pointer select-none py-1 hover:text-pink-600 transition-colors">
                    <input
                      type="checkbox"
                      checked={reasons.nsfw}
                      onChange={(e) => setReasons({ ...reasons, nsfw: e.target.checked })}
                      className="rounded text-pink-500 focus:ring-pink-400 border-pink-200"
                    />
                    <span>Lỗi nội dung/NSFW</span>
                  </label>

                  <label className="flex items-center gap-2.5 font-quicksand text-xs font-semibold cursor-pointer select-none py-1 hover:text-pink-600 transition-colors">
                    <input
                      type="checkbox"
                      checked={reasons.amnesia}
                      onChange={(e) => setReasons({ ...reasons, amnesia: e.target.checked })}
                      className="rounded text-pink-500 focus:ring-pink-400 border-pink-200"
                    />
                    <span>Trở nên vô tri/Mất trí nhớ</span>
                  </label>

                  <label className="flex items-center gap-2.5 font-quicksand text-xs font-semibold cursor-pointer select-none py-1 hover:text-pink-600 transition-colors">
                    <input
                      type="checkbox"
                      checked={reasons.other}
                      onChange={(e) => setReasons({ ...reasons, other: e.target.checked })}
                      className="rounded text-pink-500 focus:ring-pink-400 border-pink-200"
                    />
                    <span>Khác</span>
                  </label>

                  {reasons.other && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden flex flex-col gap-1 mt-1 pl-6"
                    >
                      <textarea
                        value={otherText}
                        onChange={(e) => setOtherText(e.target.value)}
                        placeholder="Nhập chi tiết lỗi bạn gặp phải tại đây..."
                        rows={2}
                        className="w-full p-2.5 font-quicksand text-xs rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder-[#c4b1aa] resize-none bg-white/70"
                      />
                    </motion.div>
                  )}
                </div>

                <button
                  type="submit"
                  className="font-lexend text-xs lowercase rounded-full p-2.5 bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 text-white font-semibold transition-all duration-300 hover:scale-105 active:scale-95 shadow-md flex items-center justify-center gap-1.5"
                >
                  🔨 gửi mắng vốn phạt bé ngay!
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
