import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { KRATHONG_COLLECTION } from '../../data/krathongs';
import { KrathongModel } from '../world/KrathongModel';
import { Sparkles, X, ChevronLeft, ChevronRight, Send } from 'lucide-react';

interface KrathongSelectorUIProps {
  isOpen: boolean;
  onClose: () => void;
  onRelease: (typeId: string, wishText: string) => void;
}

export const KrathongSelectorUI: React.FC<KrathongSelectorUIProps> = ({
  isOpen,
  onClose,
  onRelease
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [wish, setWish] = useState('');

  if (!isOpen) return null;

  const current = KRATHONG_COLLECTION[selectedIndex];

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % KRATHONG_COLLECTION.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + KRATHONG_COLLECTION.length) % KRATHONG_COLLECTION.length);
  };

  const handleConfirm = () => {
    onRelease(current.id, wish.trim() || 'ขอให้ชีวิตรุ่งเรือง สุขภาพแข็งแรง ไร้อุปสรรคทั้งปวง');
    setWish('');
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      backgroundColor: 'rgba(3, 7, 18, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '860px',
        maxHeight: '90vh',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        padding: '2rem',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'transparent',
            border: 'none',
            color: '#94A3B8',
            cursor: 'pointer',
            padding: '0.5rem'
          }}
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#F59E0B', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.1em' }}>
            <Sparkles size={16} /> CRAFT YOUR SACRED KRATHONG
          </div>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 700, margin: '0.25rem 0' }} className="gold-gradient-text">
            เลือกกระทงประจำค่ำคืนนี้
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.95rem' }}>
            เลือกสรรแบบกระทงที่คุณประทับใจ ร่วมส่งจิตอธิษฐานลอยสู่พระแม่คงคา
          </p>
        </div>

        {/* 3D Interactive Inspection Preview */}
        <div style={{
          position: 'relative',
          height: '280px',
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          borderRadius: '16px',
          border: '1px solid rgba(245, 158, 11, 0.2)',
          overflow: 'hidden'
        }}>
          <Canvas camera={{ position: [0, 2.5, 3.8], fov: 45 }}>
            <ambientLight intensity={1.2} />
            <directionalLight position={[5, 10, 5]} intensity={2.0} color="#FEF08A" />
            <Suspense fallback={null}>
              <KrathongModel typeId={current.id} scale={1.2} interactive={true} />
              <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2.0} />
            </Suspense>
          </Canvas>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              color: '#F59E0B',
              borderRadius: '50%',
              width: '42px',
              height: '42px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <ChevronLeft size={22} />
          </button>

          <button
            onClick={handleNext}
            style={{
              position: 'absolute',
              right: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              color: '#F59E0B',
              borderRadius: '50%',
              width: '42px',
              height: '42px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <ChevronRight size={22} />
          </button>

          {/* 3D Hint */}
          <div style={{
            position: 'absolute',
            bottom: '0.75rem',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '0.75rem',
            color: '#64748B',
            background: 'rgba(15, 23, 42, 0.7)',
            padding: '0.2rem 0.75rem',
            borderRadius: '999px'
          }}>
            หมุนคลิกเพื่อชมแบบกระทงรอบทิศทาง 360°
          </div>
        </div>

        {/* Krathong Details */}
        <div style={{
          backgroundColor: 'rgba(30, 41, 59, 0.5)',
          padding: '1.25rem',
          borderRadius: '12px',
          borderLeft: `4px solid ${current.accentColor}`
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {current.category}
              </span>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 600, color: '#F8FAFC', margin: '0.2rem 0' }}>
                {current.nameTh}
              </h3>
              <div style={{ fontSize: '0.85rem', color: '#94A3B8' }}>{current.name}</div>
            </div>
            <div style={{
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '999px',
              padding: '0.35rem 0.9rem',
              color: '#FDE047',
              fontSize: '0.85rem',
              fontWeight: 500
            }}>
              แบบที่ {selectedIndex + 1} / {KRATHONG_COLLECTION.length}
            </div>
          </div>
          <p style={{ color: '#CBD5E1', fontSize: '0.92rem', marginTop: '0.75rem', lineHeight: 1.6 }}>
            {current.description}
          </p>
        </div>

        {/* Wish Input Box */}
        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', color: '#FDE047', fontWeight: 500, marginBottom: '0.5rem' }}>
            คำอธิษฐานต่อพระแม่คงคา (Your Sacred Wish):
          </label>
          <input
            type="text"
            value={wish}
            onChange={(e) => setWish(e.target.value)}
            placeholder="เช่น ขอให้มีโชคลาภ สุขภาพแข็งแรง พบเจอความรักที่ดี..."
            style={{
              width: '100%',
              padding: '0.85rem 1rem',
              backgroundColor: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              borderRadius: '10px',
              color: '#F8FAFC',
              fontSize: '0.95rem',
              outline: 'none',
              fontFamily: 'inherit'
            }}
          />
        </div>

        {/* Release Button */}
        <button
          onClick={handleConfirm}
          className="gold-button"
          style={{
            padding: '1rem',
            borderRadius: '12px',
            fontSize: '1.05rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem'
          }}
        >
          <Send size={20} /> จุดประทีปและปล่อยกระทงลงสู่สายธาร
        </button>
      </div>
    </div>
  );
};

