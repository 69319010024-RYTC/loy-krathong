import React, { useState, useEffect } from 'react';
import { FortuneCardData } from '../../types/game';
import { Sparkles, X, Heart, Shield, Compass, Award, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FortuneCardUIProps {
  card: FortuneCardData | null;
  onClose: () => void;
}

export const FortuneCardUI: React.FC<FortuneCardUIProps> = ({
  card,
  onClose
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (card) {
      setIsFlipped(false);
      // Automatically trigger flip animation after card floats up
      const timer = setTimeout(() => {
        setIsFlipped(true);
        // Throw celebratory golden sparkles
        confetti({
          particleCount: 45,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#FDE047', '#EC4899', '#8B5CF6']
        });
      }, 700);

      return () => clearTimeout(timer);
    }
  }, [card]);

  if (!card) return null;

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Love': return <Heart size={14} color="#F43F5E" />;
      case 'Wealth': return <Award size={14} color="#FBBF24" />;
      case 'Protection': return <Shield size={14} color="#10B981" />;
      case 'Destiny': return <Compass size={14} color="#8B5CF6" />;
      default: return <Star size={14} color="#38BDF8" />;
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 60,
      backgroundColor: 'rgba(5, 8, 22, 0.88)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div style={{
        perspective: '1200px',
        width: '100%',
        maxWidth: '440px',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '-2.5rem',
            right: 0,
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            color: '#F8FAFC',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <X size={20} />
        </button>

        {/* 3D Flipping Card Container */}
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          style={{
            width: '100%',
            height: '620px',
            position: 'relative',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.9s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            cursor: 'pointer'
          }}
        >
          {/* Card Back (Mystical Gypsy Tarot Backing) */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            borderRadius: '24px',
            background: 'linear-gradient(145deg, #1E1B4B 0%, #0F172A 50%, #2E1065 100%)',
            border: '2px solid rgba(245, 158, 11, 0.5)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 35px rgba(139, 92, 246, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            textAlign: 'center'
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <div style={{ fontSize: '4.5rem', marginBottom: '1rem' }}>🔮</div>
              <h3 className="gold-gradient-text" style={{ fontSize: '1.6rem', fontWeight: 700, letterSpacing: '0.1em' }}>
                LUMINA ORACLE
              </h3>
              <p style={{ color: '#C084FC', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                ไพ่ยิปซีคำทำนายแห่งสายน้ำ
              </p>
              <div style={{
                marginTop: '2rem',
                fontSize: '0.8rem',
                color: '#FEF08A',
                background: 'rgba(245, 158, 11, 0.15)',
                padding: '0.4rem 1rem',
                borderRadius: '999px',
                border: '1px solid rgba(245, 158, 11, 0.3)'
              }}>
                แตะเพื่อพลิกชมคำทำนาย
              </div>
            </div>
          </div>

          {/* Card Front (Revealed Artwork & Fortune) */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            borderRadius: '24px',
            background: 'linear-gradient(150deg, #0F172A 0%, #1E1B4B 60%, #030712 100%)',
            border: `2px solid ${card.accentColor}`,
            boxShadow: `0 25px 60px rgba(0,0,0,0.8), 0 0 45px ${card.accentColor}40`,
            padding: '1.8rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            {/* Top Bar: Roman Numeral & Category Badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{
                fontFamily: 'Cinzel, serif',
                fontSize: '1.3rem',
                fontWeight: 800,
                color: card.accentColor
              }}>
                {card.romanNumeral}
              </span>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'rgba(15, 23, 42, 0.8)',
                border: `1px solid ${card.accentColor}60`,
                padding: '0.3rem 0.75rem',
                borderRadius: '999px',
                fontSize: '0.78rem',
                color: '#F8FAFC'
              }}>
                {getCategoryIcon(card.category)}
                <span>{card.category}</span>
              </div>
            </div>

            {/* Central Symbolic Icon Frame */}
            <div style={{
              height: '160px',
              borderRadius: '16px',
              background: `radial-gradient(circle at center, ${card.accentColor}30 0%, rgba(15, 23, 42, 0.7) 70%)`,
              border: `1px solid ${card.accentColor}40`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0.8rem 0'
            }}>
              <div style={{ fontSize: '4rem', filter: 'drop-shadow(0 0 20px rgba(245, 158, 11, 0.4))' }}>
                {card.symbolIcon}
              </div>
              <div style={{
                fontSize: '1.15rem',
                fontWeight: 700,
                color: '#F8FAFC',
                marginTop: '0.4rem',
                fontFamily: 'Cinzel, serif',
                letterSpacing: '0.05em'
              }}>
                {card.nameEn}
              </div>
            </div>

            {/* Card Thai Title */}
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 700, color: '#FEF08A' }}>
                {card.nameTh}
              </h3>
              {/* Keywords Tag Pill */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', justifyContent: 'center', marginTop: '0.4rem' }}>
                {card.keywords.map((kw, i) => (
                  <span key={i} style={{
                    fontSize: '0.72rem',
                    color: '#CBD5E1',
                    background: 'rgba(255,255,255,0.06)',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '4px'
                  }}>
                    #{kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Fortune Meaning */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              padding: '0.85rem',
              borderRadius: '10px',
              fontSize: '0.88rem',
              color: '#E2E8F0',
              lineHeight: 1.5,
              marginTop: '0.5rem'
            }}>
              {card.meaning}
            </div>

            {/* Sacred River Blessing */}
            <div style={{
              borderLeft: `3px solid ${card.accentColor}`,
              paddingLeft: '0.75rem',
              fontSize: '0.82rem',
              color: '#FDE047',
              fontStyle: 'italic',
              marginTop: '0.5rem'
            }}>
              ✨ {card.blessing}
            </div>

            {/* Done Button */}
            <button
              onClick={onClose}
              className="gold-button"
              style={{
                marginTop: '0.8rem',
                padding: '0.7rem',
                borderRadius: '10px',
                fontSize: '0.92rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem'
              }}
            >
              <Sparkles size={16} /> น้อมรับพรและเดินทางต่อ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

