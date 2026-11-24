import React from 'react';
import { Sparkles, Compass, Eye, Volume2, VolumeX, Flame } from 'lucide-react';
import { QualityLevel } from '../../types/game';

interface MainMenuProps {
  onStart: () => void;
  quality: QualityLevel;
  onQualityChange: (q: QualityLevel) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStart,
  quality,
  onQualityChange,
  isMuted,
  onToggleMute
}) => {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      backgroundColor: 'rgba(3, 7, 18, 0.72)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '680px',
        width: '100%',
        padding: '3rem 2.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem',
        border: '1px solid rgba(245, 158, 11, 0.35)',
        boxShadow: '0 30px 80px rgba(0, 0, 0, 0.8), 0 0 40px rgba(245, 158, 11, 0.15)'
      }}>
        {/* Top Sacred Symbol */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.6rem',
          color: '#F59E0B',
          fontSize: '0.88rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          fontWeight: 600
        }}>
          <Flame size={18} className="animate-pulse-glow" /> SACRED THAI LOY KRATHONG FESTIVAL
        </div>

        {/* Title */}
        <div>
          <h1 style={{
            fontFamily: 'Cinzel, serif',
            fontSize: '3.6rem',
            fontWeight: 900,
            letterSpacing: '0.08em',
            lineHeight: 1.1,
            margin: '0.2rem 0'
          }} className="gold-gradient-text">
            LUMINA
          </h1>
          <div style={{
            fontSize: '1.15rem',
            letterSpacing: '0.25em',
            color: '#E2E8F0',
            fontWeight: 500,
            textTransform: 'uppercase'
          }}>
            THE FESTIVAL OF LIGHTS
          </div>
          <p style={{
            color: '#94A3B8',
            fontSize: '0.95rem',
            marginTop: '0.6rem',
            lineHeight: 1.6
          }}>
            สัมผัสค่ำคืนวันเพ็ญเดือนสิบสองริมสายธารอันศักดิ์สิทธิ์ ปล่อยกระทงประทีปวิจิตร ชมการประกวดนางงามริมน้ำ ตลาดงานวัด และค้นพบคำทำนายจากไพ่ยิปซี
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          width: '100%',
          marginTop: '0.5rem'
        }}>
          <div style={{
            background: 'rgba(30, 41, 59, 0.4)',
            padding: '0.9rem',
            borderRadius: '12px',
            border: '1px solid rgba(245, 158, 11, 0.15)'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>🪷</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FEF08A' }}>6 กระทงวิจิตร</div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>3D Preview & ฟิสิกส์ลอยน้ำ</div>
          </div>

          <div style={{
            background: 'rgba(30, 41, 59, 0.4)',
            padding: '0.9rem',
            borderRadius: '12px',
            border: '1px solid rgba(245, 158, 11, 0.15)'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>👑</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FEF08A' }}>เวทีนางงามริมน้ำ</div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>6 Contestants & LED Rig</div>
          </div>

          <div style={{
            background: 'rgba(30, 41, 59, 0.4)',
            padding: '0.9rem',
            borderRadius: '12px',
            border: '1px solid rgba(245, 158, 11, 0.15)'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>🔮</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FEF08A' }}>22 ไพ่ยิปซีทำนาย</div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>รับคำทำนายทุกครั้งที่ลอย</div>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={onStart}
          className="gold-button"
          style={{
            width: '100%',
            padding: '1.15rem',
            borderRadius: '14px',
            fontSize: '1.2rem',
            letterSpacing: '0.05em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            marginTop: '0.5rem'
          }}
        >
          <Sparkles size={22} /> เริ่มต้นสัมผัสเทศกาล (START EXPERIENCE)
        </button>

        {/* Controls & Settings Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          paddingTop: '0.75rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          fontSize: '0.85rem',
          color: '#94A3B8'
        }}>
          {/* Quality Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Eye size={16} />
            <span>กราฟิก:</span>
            {(['low', 'medium', 'high'] as QualityLevel[]).map((lvl) => (
              <button
                key={lvl}
                onClick={() => onQualityChange(lvl)}
                style={{
                  background: quality === lvl ? 'rgba(245, 158, 11, 0.3)' : 'transparent',
                  border: `1px solid ${quality === lvl ? '#F59E0B' : 'rgba(255,255,255,0.1)'}`,
                  color: quality === lvl ? '#FEF08A' : '#94A3B8',
                  borderRadius: '6px',
                  padding: '0.2rem 0.6rem',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  textTransform: 'uppercase'
                }}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleMute}
            style={{
              background: 'transparent',
              border: 'none',
              color: isMuted ? '#EF4444' : '#F59E0B',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.85rem'
            }}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            <span>{isMuted ? 'ปิดเสียง' : 'เปิดเสียง'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

