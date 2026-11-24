import React from 'react';
import { CameraViewMode, Contestant, QualityLevel } from '../../types/game';
import { Flame, Sparkles, Volume2, VolumeX, Menu, Map, Heart } from 'lucide-react';

interface HUDProps {
  viewMode: CameraViewMode;
  onViewModeChange: (mode: CameraViewMode) => void;
  onOpenKrathongSelector: () => void;
  onOpenMenu: () => void;
  onOpenMap: () => void;
  onLaunchFireworks: () => void;
  onCheerContestant: () => void;
  currentContestant: Contestant | null;
  krathongCount: number;
  isMuted: boolean;
  onToggleMute: () => void;
  quality: QualityLevel;
  onQualityChange: (q: QualityLevel) => void;
}

export const HUD: React.FC<HUDProps> = ({
  viewMode,
  onViewModeChange,
  onOpenKrathongSelector,
  onOpenMenu,
  onOpenMap,
  onLaunchFireworks,
  onCheerContestant,
  currentContestant,
  krathongCount,
  isMuted,
  onToggleMute
}) => {
  const views: { id: CameraViewMode; label: string; icon: string }[] = [
    { id: 'exploration', label: 'เดินสำรวจ (WASD)', icon: '🚶' },
    { id: 'pageant', label: 'เวทีนางงาม', icon: '👑' },
    { id: 'riverside', label: 'ท่าน้ำลอยกระทง', icon: '🌊' },
    { id: 'temple', label: 'วัดไทย', icon: '🛕' },
    { id: 'cemetery', label: 'ป่าช้าลี้ลับ', icon: '🌲' }
  ];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 40,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '1.5rem'
    }}>
      {/* Top Header Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        pointerEvents: 'auto'
      }}>
        {/* Brand & Menu Button */}
        <div className="glass-panel" style={{
          padding: '0.6rem 1.2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.8rem'
        }}>
          <button
            onClick={onOpenMenu}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#F59E0B',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '0.2rem'
            }}
            title="เมนูหลัก"
          >
            <Menu size={20} />
          </button>
          <div>
            <div style={{ fontFamily: 'Cinzel, serif', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '0.08em' }} className="gold-gradient-text">
              LUMINA
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
              The Festival of Lights
            </div>
          </div>
        </div>

        {/* Current Active Contestant Badge (Live Runway Feed with Cheer button) */}
        {currentContestant && (
          <div className="glass-panel" style={{
            padding: '0.6rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            border: '1px solid rgba(236, 72, 153, 0.4)',
            boxShadow: '0 0 20px rgba(236, 72, 153, 0.2)'
          }}>
            <div style={{ fontSize: '1.4rem' }}>👑</div>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#EC4899', fontWeight: 600, letterSpacing: '0.05em' }}>
                ON RUNWAY STAGE • หมายเลข {currentContestant.id}
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#F8FAFC' }}>
                {currentContestant.name} ({currentContestant.province})
              </div>
              <div style={{ fontSize: '0.75rem', color: '#FEF08A' }}>
                {currentContestant.signaturePose}
              </div>
            </div>
            {/* Cheer & Vote Button */}
            <button
              onClick={onCheerContestant}
              style={{
                background: 'linear-gradient(135deg, #EC4899 0%, #BE185D 100%)',
                border: 'none',
                color: '#FFF',
                borderRadius: '8px',
                padding: '0.4rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                marginLeft: '0.4rem'
              }}
            >
              <Heart size={14} fill="#FFF" /> เชียร์
            </button>
          </div>
        )}

        {/* Floating Krathong Counter, Map, Audio Settings */}
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          {/* Map Button */}
          <button
            onClick={onOpenMap}
            className="glass-panel"
            style={{
              padding: '0.6rem 0.9rem',
              color: '#38BDF8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.85rem',
              fontWeight: 500
            }}
            title="เปิดแผนที่งานเทศกาล"
          >
            <Map size={16} /> แผนที่
          </button>

          {/* Fireworks Button */}
          <button
            onClick={onLaunchFireworks}
            className="glass-panel"
            style={{
              padding: '0.6rem 0.9rem',
              color: '#EC4899',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.85rem',
              fontWeight: 500
            }}
            title="จุดพลุเฉลิมฉลอง"
          >
            <Sparkles size={16} /> จุดพลุ
          </button>

          {/* Floating Krathong Counter */}
          <div className="glass-panel" style={{
            padding: '0.6rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.88rem',
            color: '#FEF08A'
          }}>
            <Flame size={16} color="#F59E0B" />
            <span>กระทงในน้ำ: <b>{krathongCount}</b></span>
          </div>

          {/* Audio Mute/Unmute */}
          <button
            onClick={onToggleMute}
            className="glass-panel"
            style={{
              padding: '0.6rem',
              color: isMuted ? '#EF4444' : '#F59E0B',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title={isMuted ? 'เปิดเสียง' : 'ปิดเสียง'}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </div>

      {/* Bottom Action Area */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        pointerEvents: 'auto'
      }}>
        {/* Release Krathong Big Action Button */}
        <button
          onClick={onOpenKrathongSelector}
          className="gold-button"
          style={{
            padding: '0.9rem 2.2rem',
            borderRadius: '999px',
            fontSize: '1.1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem'
          }}
        >
          <Sparkles size={20} /> จุดประทีป & ปล่อยกระทงขอพร (Release Krathong)
        </button>

        {/* View Camera Switcher Pill Bar */}
        <div className="glass-panel" style={{
          display: 'flex',
          gap: '0.4rem',
          padding: '0.4rem',
          borderRadius: '999px'
        }}>
          {views.map((v) => (
            <button
              key={v.id}
              onClick={() => onViewModeChange(v.id)}
              style={{
                background: viewMode === v.id ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : 'transparent',
                color: viewMode === v.id ? '#0F172A' : '#CBD5E1',
                border: 'none',
                borderRadius: '999px',
                padding: '0.45rem 1.1rem',
                fontSize: '0.85rem',
                fontWeight: viewMode === v.id ? 600 : 400,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s ease'
              }}
            >
              <span>{v.icon}</span>
              <span>{v.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
