import React, { useState, useEffect } from 'react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  characterLink: string;
  setCharacterLink: (link: string) => void;
  isLinkActive: boolean;
  setIsLinkActive: (active: boolean) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
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
  }, [characterLink, isLinkActive, isOpen]);

  const handleSaveSettings = () => {
    localStorage.setItem('char_ai_link', tempLink);
    localStorage.setItem('char_ai_active', JSON.stringify(tempActive));

    setCharacterLink(tempLink);
    setIsLinkActive(tempActive);

    setSavedMsg('✨ Đã lưu cài đặt!');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  if (!isOpen) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, color: '#2d3436' }}>⚙️ Admin Panel - Tiệm Cá Khô</h3>
          <button onClick={onClose} style={closeBtnStyle}>✖</button>
        </div>

        <div style={sectionStyle}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '6px', fontSize: '14px' }}>
            🔗 Đường link Google AI Studio:
          </label>
          <input
            type="text"
            placeholder="https://aistudio.google.com/..."
            value={tempLink}
            onChange={(e) => setTempLink(e.target.value)}
            style={inputStyle}
          />

          <div style={{ margin: '15px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 'bold', fontSize: '14px' }}>🔓 Bật/Khóa Nút Link:</span>
            <button
              type="button"
              onClick={() => setTempActive(!tempActive)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                border: 'none',
                fontWeight: 'bold',
                cursor: 'pointer',
                backgroundColor: tempActive ? '#2ed573' : '#ff4757',
                color: '#fff',
                transition: '0.2s'
              }}
            >
              {tempActive ? 'ĐANG MỞ' : 'ĐANG KHÓA'}
            </button>
          </div>

          <button onClick={handleSaveSettings} style={saveBtnStyle}>
            💾 Lưu Cài Đặt
          </button>
          {savedMsg && <p style={{ color: '#2ed573', marginTop: '8px', fontSize: '13px', textAlign: 'center' }}>{savedMsg}</p>}
        </div>
      </div>
    </div>
  );
};

const overlayStyle: React.CSSProperties = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
  justifyContent: 'center', alignItems: 'center', zIndex: 9999
};

const modalStyle: React.CSSProperties = {
  background: '#fff5f7', padding: '20px', borderRadius: '16px',
  width: '90%', maxWidth: '420px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
  fontFamily: 'sans-serif'
};

const sectionStyle: React.CSSProperties = {
  background: '#fff', padding: '15px', borderRadius: '12px',
  marginTop: '15px', border: '2px solid #ffe1e8'
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px', borderRadius: '8px',
  border: '1px solid #ddd', boxSizing: 'border-box'
};

const saveBtnStyle: React.CSSProperties = {
  background: '#ff6b81', color: '#fff', border: 'none',
  padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
  fontWeight: 'bold', width: '100%', marginTop: '5px'
};

const closeBtnStyle: React.CSSProperties = {
  background: 'transparent', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#888'
};
