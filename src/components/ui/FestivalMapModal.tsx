import React from 'react';
import { X, MapPin, Sparkles } from 'lucide-react';
import { CameraViewMode } from '../../types/game';

interface FestivalMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectZone: (zone: CameraViewMode) => void;
  currentZone: CameraViewMode;
}

export const FestivalMapModal: React.FC<FestivalMapModalProps> = ({
  isOpen,
  onClose,
  onSelectZone,
  currentZone
}) => {
  if (!isOpen) return null;

  const locations = [
    {
      id: 'riverside' as CameraViewMode,
      name: 'ท่าน้ำลอยกระทง (Riverside Steps)',
      desc: 'บันไดหินกว้างสำหรับจุดประทีปและปล่อยกระทงลงสู่สายธาร',
      icon: '🌊',
      x: 38,
      y: 50,
      color: '#38BDF8'
    },
    {
      id: 'pageant' as CameraViewMode,
      name: 'เวทีประกวดนางงาม (Miss Lumina Stage)',
      desc: 'เวทีรันเวย์ริมน้ำ จอ LED แสงสีอลังการ และ 6 สาวงาม',
      icon: '👑',
      x: 68,
      y: 42,
      color: '#EC4899'
    },
    {
      id: 'temple' as CameraViewMode,
      name: 'วัดไทยวิหารทอง (Sacred Thai Temple)',
      desc: 'อุโบสถช่อฟ้าใบระกาสีทอง ลานประทีปเวียนเทียนขอพร',
      icon: '🛕',
      x: 22,
      y: 35,
      color: '#F59E0B'
    },
    {
      id: 'cemetery' as CameraViewMode,
      name: 'ป่าช้าและป่าทึบลี้ลับ (Haunted Cemetery)',
      desc: 'สุสานโบราณหลังวัด หมอกหนายามราตรี และเงามนตรา',
      icon: '🌲',
      x: 18,
      y: 18,
      color: '#A855F7'
    },
    {
      id: 'exploration' as CameraViewMode,
      name: 'ตลาดงานวัด (Festival Night Market)',
      desc: 'ถนนคนเดิน ร้านอาหารสตรีทฟู้ด ควันย่างสะเต๊ะ และของที่ระลึก',
      icon: '🍢',
      x: 75,
      y: 72,
      color: '#10B981'
    }
  ];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 60,
      backgroundColor: 'rgba(3, 7, 18, 0.85)',
      backdropFilter: 'blur(14px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '720px',
        width: '100%',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.2rem',
            right: '1.2rem',
            background: 'transparent',
            border: 'none',
            color: '#94A3B8',
            cursor: 'pointer'
          }}
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#F59E0B', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.15em' }}>
            <Sparkles size={16} /> FESTIVAL SPATIAL DIRECTORY
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0.2rem 0' }} className="gold-gradient-text">
            แผนที่เทศกาลลอยกระทง LUMINA
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
            เลือกจุดหมายเพื่อเดินทางวาร์ปไปยังสถานที่ต่างๆ ได้ทันที
          </p>
        </div>

        {/* Visual Map Overview Canvas Box */}
        <div style={{
          position: 'relative',
          height: '240px',
          borderRadius: '16px',
          background: 'radial-gradient(ellipse at center, #0F172A 0%, #030712 100%)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          overflow: 'hidden'
        }}>
          {/* Central Blue River Line */}
          <div style={{
            position: 'absolute',
            left: '46%',
            top: 0,
            bottom: 0,
            width: '8%',
            background: 'linear-gradient(180deg, #0369A1 0%, #0891B2 50%, #0284C7 100%)',
            boxShadow: '0 0 25px rgba(14, 165, 233, 0.4)'
          }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%) rotate(-90deg)',
              color: '#BAE6FD',
              fontSize: '0.72rem',
              fontWeight: 600,
              letterSpacing: '0.15em',
              whiteSpace: 'nowrap'
            }}>
              คลองสายหลัก (CANAL)
            </div>
          </div>

          {/* Interactive Map Waypoints */}
          {locations.map((loc) => {
            const isSelected = currentZone === loc.id;
            return (
              <button
                key={loc.id}
                onClick={() => {
                  onSelectZone(loc.id);
                  onClose();
                }}
                style={{
                  position: 'absolute',
                  left: `${loc.x}%`,
                  top: `${loc.y}%`,
                  transform: 'translate(-50%, -50%)',
                  background: isSelected ? loc.color : 'rgba(15, 23, 42, 0.85)',
                  border: `2px solid ${loc.color}`,
                  color: isSelected ? '#0F172A' : '#F8FAFC',
                  borderRadius: '999px',
                  padding: '0.35rem 0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: `0 0 15px ${loc.color}60`,
                  transition: 'transform 0.2s ease'
                }}
              >
                <span>{loc.icon}</span>
                <span>{loc.name.split(' (')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Location List Details */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.75rem'
        }}>
          {locations.map((loc) => (
            <div
              key={loc.id}
              onClick={() => {
                onSelectZone(loc.id);
                onClose();
              }}
              style={{
                background: currentZone === loc.id ? 'rgba(245, 158, 11, 0.15)' : 'rgba(30, 41, 59, 0.4)',
                border: `1px solid ${currentZone === loc.id ? '#F59E0B' : 'rgba(255,255,255,0.08)'}`,
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: '#FEF08A' }}>
                <span>{loc.icon}</span>
                <span>{loc.name}</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '0.25rem' }}>
                {loc.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

