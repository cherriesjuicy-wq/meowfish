import React, { useState, useEffect } from 'react';

interface AdminPanelProps {
  characterLink: string;
  setCharacterLink: (link: string) => void;
  isLinkActive: boolean;
  setIsLinkActive: (active: boolean) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  characterLink,
  setCharacterLink,
  isLinkActive,
  setIsLinkActive,
}) => {
  const [tempLink, setTempLink] = useState(characterLink);
  const [tempActive, setTempActive] = useState(isLinkActive);
  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => {
    setTempLink(characterLink);
    setTempActive(isLinkActive);
  }, [characterLink, isLinkActive]);

  const handleSaveSettings = () => {
    localStorage.setItem('char_ai_link', tempLink);
    localStorage.setItem('char_ai_active', JSON.stringify(tempActive));

    setCharacterLink(tempLink);
    setIsLinkActive(tempActive);

    setSavedMsg('✨ Đã cập nhật link thành công!');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-6 p-6 bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border-2 border-rose-100 text-center">
      <h3 className="text-lg font-bold text-rose-600 mb-4 flex items-center justify-center gap-2">
        🔗 Quản Lý Link Google AI Studio Nhân Vật
      </h3>

      <div className="space-y-4 text-left max-w-md mx-auto">
        {/* Ô nhập đường link */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Đường link Google AI Studio:
          </label>
          <input
            type="text"
            placeholder="https://aistudio.google.com/..."
            value={tempLink}
            onChange={(e) => setTempLink(e.target.value)}
            className="w-full px-4 py-2 text-sm rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-300 bg-rose-50/30"
          />
        </div>

        {/* Nút Khóa / Mở Link */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs font-semibold text-gray-600">Trạng thái Nút Link:</span>
          <button
            type="button"
            onClick={() => setTempActive(!tempActive)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
              tempActive
                ? 'bg-emerald-400 hover:bg-emerald-500 text-white'
                : 'bg-rose-400 hover:bg-rose-500 text-white'
            }`}
          >
            {tempActive ? '🔓 ĐANG MỞ (Active)' : '🔒 ĐANG KHÓA (Locked)'}
          </button>
        </div>

        {/* Nút Lưu */}
        <button
          type="button"
          onClick={handleSaveSettings}
          className="w-full py-2.5 mt-2 bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-95"
        >
          💾 Lưu Cài Đặt
        </button>

        {savedMsg && (
          <p className="text-xs text-center font-medium text-emerald-500 animate-pulse mt-2">
            {savedMsg}
          </p>
        )}
      </div>
    </div>
  );
};
