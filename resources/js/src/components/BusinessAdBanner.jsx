import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Pause, 
  Play, 
  Star, 
  ShieldCheck, 
  ArrowUpRight, 
  Flame, 
  Store,
  Megaphone,
  CheckCircle2
} from 'lucide-react';
import usePromotionsStore from '../store/usePromotionsStore';
import { MOCK_BUSINESSES } from '../data/mockData';

/**
 * Animated Horizontal Business Ad Banner for Servi-Go
 * 
 * Features:
 * - Seamless infinite marquee animation using CSS transform3d
 * - Prioritizes active paid promotions (⭐ Patrocinado / Destacado)
 * - Includes verified premier local businesses with authentic logos & slogans
 * - Accessible keyboard navigation & hover/focus pause behavior
 * - Manual Play / Pause toggle
 * - Direct integration with Promotion checkout modal
 * - Respects prefers-reduced-motion
 */
export default function BusinessAdBanner({ onOpenPromoModal }) {
  const [isPaused, setIsPaused] = useState(false);
  const [apiBusinesses, setApiBusinesses] = useState([]);
  const promotions = usePromotionsStore(state => state.promotions);

  // Fetch verified businesses from Laravel API on mount (with graceful fallback to mock data)
  useEffect(() => {
    let isMounted = true;
    fetch('/api/banner-ads')
      .then(res => {
        if (!res.ok) throw new Error('API banner ads error');
        return res.json();
      })
      .then(data => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setApiBusinesses(data);
        }
      })
      .catch(() => {
        // Fallback to local mock data is handled naturally
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Prepare & sort ads: Paid promotions first, followed by premier verified businesses
  const bannerAds = useMemo(() => {
    const list = [];

    // 1. Paid active promotions (< 24 hours)
    const activePromos = promotions.filter(
      p => (Date.now() - (p.createdAt || 0)) < 24 * 60 * 60 * 1000
    );

    activePromos.forEach(promo => {
      list.push({
        id: promo.id,
        link: `/provider/${promo.providerId}#${promo.id}`,
        businessName: promo.providerName,
        category: promo.categoryIcon === 'Hotel' ? 'Alojamiento' : (promo.categoryIcon === 'PenTool' ? 'Tatuajes & Arte' : 'Gastronomía'),
        title: promo.title,
        phrase: promo.description,
        image: promo.image || '/uploads/food_factory_cover.jpg',
        isSponsored: true,
        rating: '5.0',
        badgeText: '⭐ PATROCINADO',
        accentColor: 'from-[#ff6b00] to-[#ff3b00]',
        cardBorder: 'border-[#ff6b00]/40 hover:border-[#ff6b00]',
        glowShadow: 'shadow-[0_0_20px_rgba(255,107,0,0.18)]'
      });
    });

    // 2. Verified businesses from MOCK_BUSINESSES (curated showcase)
    const verifiedShowcase = MOCK_BUSINESSES
      .filter(b => b.verified)
      .slice(0, 8)
      .map(b => ({
        id: b.id,
        link: `/provider/${b.id}`,
        businessName: b.name,
        category: b.category,
        title: b.name,
        phrase: b.description || 'Calidad garantizada y atención personalizada en Yaguará.',
        image: b.avatar || b.image || '/uploads/food_factory_cover.jpg',
        coverImage: b.bannerImage || b.image,
        isSponsored: false,
        rating: b.rating || '5.0',
        badgeText: '✓ VERIFICADO',
        accentColor: 'from-[#131b26] to-[#0d141e]',
        cardBorder: 'border-white/10 hover:border-[#ff6b00]/50',
        glowShadow: 'shadow-lg hover:shadow-[0_4px_20px_rgba(255,107,0,0.15)]'
      }));

    // If API returned items not already present, append them
    apiBusinesses.forEach(ab => {
      if (!list.some(item => item.id === ab.id) && !verifiedShowcase.some(v => v.id === ab.id)) {
        list.push({
          id: ab.id,
          link: `/provider/${ab.id}`,
          businessName: ab.name,
          category: ab.category,
          title: ab.name,
          phrase: ab.description,
          image: ab.avatar || ab.image,
          isSponsored: false,
          rating: ab.rating || '5.0',
          badgeText: '✓ VERIFICADO',
          accentColor: 'from-[#131b26] to-[#0d141e]',
          cardBorder: 'border-white/10 hover:border-[#ff6b00]/50',
          glowShadow: 'shadow-lg hover:shadow-[0_4px_20px_rgba(255,107,0,0.15)]'
        });
      }
    });

    // Combine list
    const combined = [...list, ...verifiedShowcase];
    
    // Fallback if list is too small (duplicate to ensure smooth marquee loop)
    if (combined.length < 5) {
      return [...combined, ...combined];
    }

    return combined;
  }, [promotions, apiBusinesses]);

  // If no ads available, avoid rendering empty box
  if (bannerAds.length === 0) return null;

  return (
    <section 
      aria-label="Vitrina Comercial y Anuncios de Negocios"
      className="relative w-full rounded-2xl sm:rounded-3xl bg-[#090d16]/90 border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-xl group my-4 sm:my-6"
    >
      {/* Top Bar: Live Status & Controls */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 border-b border-white/[0.06] bg-black/25">
        <div className="flex items-center gap-2.5">
          {/* Live indicator dot */}
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff6b00] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ff6b00]"></span>
          </span>
          <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
            <Megaphone className="w-3.5 h-3.5 text-[#ff6b00]" />
            Vitrina Comercial Servi-Go
          </span>
          <span className="hidden md:inline-block text-[10px] text-zinc-400 font-medium border-l border-white/10 pl-2.5">
            Comercios & Servicios Destacados
          </span>
        </div>

        {/* Action Controls: Pause/Play & Pautar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Pause / Play button */}
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            title={isPaused ? "Reanudar desplazamiento" : "Pausar desplazamiento"}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6b00]"
            aria-pressed={isPaused}
          >
            {isPaused ? (
              <>
                <Play className="w-3 h-3 text-[#ff6b00] fill-[#ff6b00]" />
                <span className="hidden sm:inline">Reanudar</span>
              </>
            ) : (
              <>
                <Pause className="w-3 h-3 text-zinc-300" />
                <span className="hidden sm:inline">Pausar</span>
              </>
            )}
          </button>

          {/* CTA Pautar mi negocio */}
          {onOpenPromoModal && (
            <button
              type="button"
              onClick={onOpenPromoModal}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold text-white bg-gradient-to-r from-[#ff6b00] to-[#ff4500] hover:from-[#ff7700] hover:to-[#ff5500] shadow-[0_2px_10px_rgba(255,107,0,0.35)] transition-all hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6b00]"
            >
              <Sparkles className="w-3 h-3" />
              <span>Pautar aquí</span>
            </button>
          )}
        </div>
      </div>

      {/* Marquee Track Container with Gradient Edge Vignettes */}
      <div className="relative w-full py-4 sm:py-5 overflow-hidden">
        {/* Left Gradient Edge Mask */}
        <div 
          className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-[#090d16] via-[#090d16]/80 to-transparent z-20"
          aria-hidden="true"
        />

        {/* Right Gradient Edge Mask */}
        <div 
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-[#090d16] via-[#090d16]/80 to-transparent z-20"
          aria-hidden="true"
        />

        {/* Continuous Marquee Track (Double set for seamless infinite 0% -> -50% loop) */}
        <div 
          className={`animate-marquee-track flex gap-4 sm:gap-5 px-4 ${isPaused ? 'marquee-is-paused' : ''}`}
          role="region"
          aria-live="polite"
        >
          {/* Render 2 copies of the ads array for seamless loop */}
          {[...bannerAds, ...bannerAds].map((ad, index) => (
            <Link
              key={`${ad.id}-${index}`}
              to={ad.link}
              className={`group/card relative shrink-0 w-[290px] sm:w-[350px] p-3.5 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-300 bg-gradient-to-br from-[#121924] via-[#0e141e] to-[#0a0f16] border ${ad.cardBorder} ${ad.glowShadow} hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6b00] block`}
            >
              {/* Card Top: Badges & Rating */}
              <div className="flex items-center justify-between mb-2.5">
                {/* Category & Badge */}
                <div className="flex items-center gap-1.5 overflow-hidden">
                  {ad.isSponsored ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black tracking-wide bg-gradient-to-r from-[#ff6b00] to-[#ff3b00] text-white shadow-[0_2px_8px_rgba(255,107,0,0.5)]">
                      <Flame className="w-3 h-3 fill-white" />
                      <span>{ad.badgeText}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      <ShieldCheck className="w-3 h-3" />
                      <span>{ad.badgeText}</span>
                    </span>
                  )}
                  
                  <span className="text-[10px] text-zinc-400 font-medium truncate max-w-[110px]">
                    {ad.category}
                  </span>
                </div>

                {/* Rating score */}
                <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400 shrink-0">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{ad.rating}</span>
                </div>
              </div>

              {/* Card Body: Business Avatar + Name & Phrase */}
              <div className="flex items-center gap-3">
                {/* Logo / Thumbnail */}
                <div className="relative shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-black/40 border border-white/10 group-hover/card:border-[#ff6b00]/60 transition-colors shadow-inner">
                  <img
                    src={ad.image}
                    alt={ad.businessName}
                    className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/uploads/food_factory_cover.jpg';
                    }}
                  />
                  {ad.isSponsored && (
                    <div className="absolute inset-0 ring-1 ring-inset ring-[#ff6b00]/30 rounded-xl pointer-events-none" />
                  )}
                </div>

                {/* Name & Promo text */}
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm sm:text-[15px] font-bold text-white group-hover/card:text-[#ff6b00] transition-colors truncate">
                    {ad.businessName}
                  </h4>
                  <p className="text-xs text-zinc-300/90 line-clamp-2 leading-snug mt-0.5 font-normal">
                    {ad.phrase}
                  </p>
                </div>
              </div>

              {/* Card Footer: Action button */}
              <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-[11px] font-medium text-zinc-400 group-hover/card:text-zinc-200 transition-colors">
                  {ad.isSponsored ? 'Oferta exclusiva' : 'Servicio local'}
                </span>
                
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#ff6b00] group-hover/card:translate-x-0.5 transition-transform">
                  <span>Ver negocio</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
