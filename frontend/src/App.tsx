import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import logo from './assets/logo.png'; // Fixed extension back to .jpg as requested earlier, modify if needed

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const generateDropTees = (category: 'Men' | 'Women') =>
  Array.from({ length: 16 }).map((_, i) => ({
    id: `${category.toLowerCase()}-tee-${i}`,
    name: `${category === 'Men' ? 'Oversized Heavy' : 'Cropped Boxy'} Drop Tee 0${i + 1}`,
    price: '1,190.00',
    description:
      'Experience premium comfort and performance with our Player Edition Jersey, designed with a slim athletic fit similar to what professional players wear on the field. Made with lightweight and breathable fabric, it offers a stylish look, comfort, and flexibility for everyday wear or match days.\n\n• Material: 100% Premium 240GSM Heavyweight Cotton\n• Fit: Model is 6\'1" wearing a size Large for a relaxed, boxy drape.',
    images:
      category === 'Men'
        ? [
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=800&auto=format&fit=crop',
          ]
        : [
            'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1434389678232-04ce6c4cd42b?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=800&auto=format&fit=crop',
          ],
  }));

const mensDropTees = generateDropTees('Men');
const womensDropTees = generateDropTees('Women');
const allMockProducts = [...mensDropTees, ...womensDropTees];

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Inter:wght@300;400;500;600;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --cream: #F8F5F0;
      --ink: #0D0D0D;
      --stone: #8C8680;
      --warm-mid: #E8E3DC;
      --accent: #C9A96E;
    }

    html { scroll-behavior: smooth; }

    body {
      font-family: 'Inter', sans-serif;
      background: var(--cream);
      color: var(--ink);
      overflow-x: hidden;
    }

    /* Page transition */
    .page-enter { animation: pageIn 0.6s cubic-bezier(0.22,1,0.36,1) forwards; }
    @keyframes pageIn {
      from { opacity: 0; transform: translateY(18px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* Reveal on scroll */
    .reveal {
      opacity: 0;
      transform: translateY(32px);
      transition: opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1);
    }
    .reveal.visible { opacity: 1; transform: translateY(0); }
    .reveal-delay-1 { transition-delay: 0.1s; }
    .reveal-delay-2 { transition-delay: 0.2s; }
    .reveal-delay-3 { transition-delay: 0.3s; }
    .reveal-delay-4 { transition-delay: 0.4s; }

    /* Marquee */
    @keyframes marquee {
      from { transform: translateX(0); }
      to   { transform: translateX(-50%); }
    }
    .marquee-track { animation: marquee 18s linear infinite; }
    .marquee-track:hover { animation-play-state: paused; }

    /* Image zoom */
    .img-zoom { transition: transform 0.9s cubic-bezier(0.22,1,0.36,1); }
    .img-zoom:hover { transform: scale(1.06); }

    /* Gold shimmer button */
    .btn-shimmer {
      position: relative;
      overflow: hidden;
      background: var(--ink);
      color: #fff;
      transition: background 0.3s;
    }
    .btn-shimmer::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(105deg, transparent 40%, rgba(201,169,110,0.35) 50%, transparent 60%);
      transform: translateX(-100%);
      transition: transform 0.55s ease;
    }
    .btn-shimmer:hover::after { transform: translateX(100%); }

    /* Underline grow */
    .link-grow {
      position: relative;
      text-decoration: none;
    }
    .link-grow::after {
      content: '';
      position: absolute;
      bottom: -2px; left: 0;
      width: 0; height: 1px;
      background: currentColor;
      transition: width 0.35s cubic-bezier(0.22,1,0.36,1);
    }
    .link-grow:hover::after { width: 100%; }

    /* Cart badge pulse */
    @keyframes badgePop {
      0%   { transform: scale(1); }
      50%  { transform: scale(1.5); }
      100% { transform: scale(1); }
    }
    .badge-pop { animation: badgePop 0.35s cubic-bezier(0.22,1,0.36,1); }

    /* Hero word reveal */
    @keyframes wordReveal {
      from { clip-path: inset(0 100% 0 0); }
      to   { clip-path: inset(0 0% 0 0); }
    }
    .hero-word {
      display: inline-block;
      animation: wordReveal 0.9s cubic-bezier(0.22,1,0.36,1) forwards;
      clip-path: inset(0 100% 0 0);
    }
    .hero-word-1 { animation-delay: 0.1s; }
    .hero-word-2 { animation-delay: 0.35s; }
    .hero-word-3 { animation-delay: 0.6s; }
    .hero-word-4 { animation-delay: 0.85s; }

    /* Parallax hero image */
    .hero-parallax { transition: transform 0.1s linear; will-change: transform; }

    /* Quick add slide */
    .quick-add {
      transform: translateY(100%);
      transition: transform 0.38s cubic-bezier(0.22,1,0.36,1);
    }
    .product-card:hover .quick-add { transform: translateY(0); }

    /* Nav glass */
    .nav-glass {
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      background: rgba(248,245,240,0.88);
      border-bottom: 1px solid rgba(140,134,128,0.15);
    }

    /* Search overlay */
    @keyframes overlayIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    .overlay-in { animation: overlayIn 0.3s ease forwards; }

    /* Stagger grid items */
    .grid-item {
      opacity: 0;
      transform: translateY(24px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .grid-item.visible { opacity: 1; transform: translateY(0); }

    /* Cursor dot */
    #cursor-dot {
      position: fixed;
      width: 8px; height: 8px;
      background: var(--ink);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      transition: transform 0.08s linear, width 0.3s, height 0.3s, background 0.3s;
    }
    #cursor-ring {
      position: fixed;
      width: 36px; height: 36px;
      border: 1px solid rgba(13,13,13,0.4);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9998;
      transform: translate(-50%, -50%);
      transition: left 0.12s ease, top 0.12s ease, width 0.35s, height 0.35s, border-color 0.35s;
    }
    body:has(a:hover) #cursor-ring,
    body:has(button:hover) #cursor-ring {
      width: 56px; height: 56px;
      border-color: var(--accent);
    }

    /* Announcement bar ticker */
    .ticker-wrap { overflow: hidden; white-space: nowrap; }

    /* Product image selector */
    .thumb-active { border: 2px solid var(--ink); }

    /* Toast */
    @keyframes toastIn {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes toastOut {
      from { opacity: 1; transform: translateY(0); }
      to   { opacity: 0; transform: translateY(-16px); }
    }
    .toast-in  { animation: toastIn 0.4s cubic-bezier(0.22,1,0.36,1) forwards; }
    .toast-out { animation: toastOut 0.4s ease forwards; }

    /* Signup split layout */
    @media (min-width: 900px) {
      .signup-left { display: block !important; flex: 1; }
    }
  `}</style>
);

// ─── HOOKS ────────────────────────────────────────────────────────────────────

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { (e.target as HTMLElement).classList.add('visible'); io.unobserve(e.target); } }),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}

function useGridReveal() {
  useEffect(() => {
    const items = document.querySelectorAll('.grid-item');
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e, idx) => {
          if (e.isIntersecting) {
            setTimeout(() => (e.target as HTMLElement).classList.add('visible'), idx * 60);
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.08 }
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}

// ─── CURSOR ───────────────────────────────────────────────────────────────────

const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (dotRef.current) { dotRef.current.style.left = e.clientX + 'px'; dotRef.current.style.top = e.clientY + 'px'; }
      if (ringRef.current) { ringRef.current.style.left = e.clientX + 'px'; ringRef.current.style.top = e.clientY + 'px'; }
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <>
      <div id="cursor-dot" ref={dotRef} />
      <div id="cursor-ring" ref={ringRef} />
    </>
  );
};

// ─── TOAST ────────────────────────────────────────────────────────────────────

const Toast = ({ message, onDone }: { message: string; onDone: () => void }) => {
  const [leaving, setLeaving] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setLeaving(true), 2200);
    const t2 = setTimeout(() => onDone(), 2700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  return (
    <div className={leaving ? 'toast-out' : 'toast-in'} style={{
      position: 'fixed', bottom: 32, right: 32, zIndex: 9999,
      background: 'var(--ink)', color: '#fff',
      padding: '14px 22px', fontSize: 13, letterSpacing: '0.08em',
      fontFamily: 'Inter, sans-serif', textTransform: 'uppercase',
      boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      {message}
    </div>
  );
};

// ─── ANNOUNCEMENT BAR ─────────────────────────────────────────────────────────

const AnnouncementBar = () => {
  const text = '✦  Unapologetic style for the modern landscape  ✦  Free shipping on orders over BDT 3,000  ✦  New drops every Friday  ';
  return (
    <div style={{ background: 'var(--ink)', color: '#fff', padding: '10px 0', overflow: 'hidden' }}>
      <div className="ticker-wrap">
        <span className="marquee-track" style={{ display: 'inline-block', fontSize: 11, letterSpacing: '0.18em', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
          {text}{text}{text}{text}
        </span>
      </div>
    </div>
  );
};

// ─── NAVBAR ───────────────────────────────────────────────────────────────────

const Navbar = ({ cartCount, openSearch }: { cartCount: number; openSearch: () => void }) => {
  const [scrolled, setScrolled] = useState(false);
  const prevCount = useRef(cartCount);
  const [badgePop, setBadgePop] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (cartCount > prevCount.current) { setBadgePop(true); setTimeout(() => setBadgePop(false), 400); }
    prevCount.current = cartCount;
  }, [cartCount]);

  return (
    <nav className={`nav-glass`} style={{
      position: 'sticky', top: 0, zIndex: 50,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: scrolled ? '12px 48px' : '18px 48px',
      transition: 'padding 0.4s ease',
    }}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <img src={logo} alt="WICXA Logo" style={{ height: 52, width: 'auto', objectFit: 'contain', display: 'block' }} />
      </Link>

      <div style={{ display: 'flex', gap: 36, fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
        {[['/', 'Home'], ['/men', 'Men'], ['/women', 'Women'], ['/about', 'About']].map(([to, label]) => (
          <Link key={to} to={to} className="link-grow" style={{ color: 'var(--ink)', textDecoration: 'none' }}>{label}</Link>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
        <button onClick={openSearch} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink)', padding: 4 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        </button>
        <Link to="/signup" style={{ color: 'var(--ink)', padding: 4, display: 'flex' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </Link>
        <Link to="/cart" style={{ position: 'relative', color: 'var(--ink)', padding: 4 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          {cartCount > 0 && (
            <span className={badgePop ? 'badge-pop' : ''} style={{
              position: 'absolute', top: -2, right: -6,
              background: 'var(--accent)', color: '#fff',
              fontSize: 9, fontWeight: 700,
              width: 16, height: 16,
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{cartCount}</span>
          )}
        </Link>
      </div>
    </nav>
  );
};

// ─── SEARCH OVERLAY ───────────────────────────────────────────────────────────

const SearchOverlay = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  useEffect(() => { if (!isOpen) setQuery(''); }, [isOpen]);
  if (!isOpen) return null;

  const results = query.trim() === ''
    ? []
    : allMockProducts.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));

  const suggested = allMockProducts.slice(0, 4);

  return (
    <div className="overlay-in" style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(248,245,240,0.98)',
      backdropFilter: 'blur(24px)',
      display: 'flex', flexDirection: 'column',
      overflowY: 'auto',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 48px', borderBottom: '1px solid var(--warm-mid)',
      }}>
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--stone)' }}>Search</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--stone)', display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' }}>
          Close
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <div style={{ padding: '32px 48px 24px', borderBottom: '1px solid var(--warm-mid)', display: 'flex', alignItems: 'center', gap: 14 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--stone)" strokeWidth="1.5" style={{ flexShrink: 0 }}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input
          autoFocus
          placeholder="Search for products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            flex: 1, fontSize: 18, fontFamily: 'Inter, sans-serif',
            fontWeight: 400, background: 'transparent',
            border: 'none', outline: 'none',
            color: 'var(--ink)', letterSpacing: '0.01em',
          }}
        />
        {query && (
          <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--stone)', padding: 4, display: 'flex' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        )}
      </div>

      <div style={{ padding: '36px 48px 60px', maxWidth: 1200, width: '100%', margin: '0 auto', flex: 1 }}>
        {query && results.length === 0 && (
          <p style={{ fontSize: 13, color: 'var(--stone)', fontFamily: 'Inter, sans-serif', paddingTop: 8 }}>
            No results for "<strong style={{ color: 'var(--ink)' }}>{query}</strong>" — try a different keyword.
          </p>
        )}

        {results.length > 0 && (
          <div>
            <p style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: 20, fontFamily: 'Inter, sans-serif' }}>
              {results.length} result{results.length !== 1 ? 's' : ''}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '20px 16px' }}>
              {results.map((p) => (
                <div key={p.id} onClick={() => { onClose(); navigate(`/product/${p.id}`); }} style={{ cursor: 'pointer' }}>
                  <div style={{ overflow: 'hidden', aspectRatio: '4/5', background: 'var(--warm-mid)', marginBottom: 10 }}>
                    <img src={p.images[0]} alt={p.name} className="img-zoom" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.02em', lineHeight: 1.4, fontFamily: 'Inter, sans-serif' }}>{p.name}</p>
                  <p style={{ fontSize: 11, color: 'var(--stone)', marginTop: 4, fontFamily: 'Inter, sans-serif' }}>BDT {p.price}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {!query && (
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 64 }}>
            <div>
              <p style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: 18, fontFamily: 'Inter, sans-serif' }}>Quick Links</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {([["Men's Collection", '/men'], ["Women's Collection", '/women'], ['New Arrivals', '/men'], ['Bestsellers', '/men']] as [string,string][]).map(([label, to]) => (
                  <Link key={label} to={to} onClick={onClose} className="link-grow" style={{ fontSize: 14, color: 'var(--ink)', textDecoration: 'none', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>{label}</Link>
                ))}
              </div>
            </div>
            <div>
              <p style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: 18, fontFamily: 'Inter, sans-serif' }}>Suggested</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px 14px' }}>
                {suggested.map((p) => (
                  <div key={p.id} onClick={() => { onClose(); navigate(`/product/${p.id}`); }} style={{ cursor: 'pointer' }}>
                    <div style={{ overflow: 'hidden', aspectRatio: '4/5', background: 'var(--warm-mid)', marginBottom: 10 }}>
                      <img src={p.images[0]} alt={p.name} className="img-zoom" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <p style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.4, fontFamily: 'Inter, sans-serif' }}>{p.name}</p>
                    <p style={{ fontSize: 11, color: 'var(--stone)', marginTop: 4, fontFamily: 'Inter, sans-serif' }}>BDT {p.price}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── FOOTER ───────────────────────────────────────────────────────────────────

const Footer = () => (
  <footer style={{ borderTop: '1px solid var(--warm-mid)', padding: '80px 48px 40px', background: 'var(--cream)', color: 'var(--ink)' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px 60px', marginBottom: 60 }}>
      {/* Brand Column */}
      <div style={{ paddingRight: 40 }}>
        <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 32, fontWeight: 300, letterSpacing: '0.28em', display: 'block', marginBottom: 20 }}>WICXA</span>
        <p style={{ fontSize: 13, color: 'var(--stone)', lineHeight: 1.6, fontFamily: 'Inter, sans-serif' }}>
          Garments built for those who move through the world on their own terms. Unapologetic style for the modern landscape.
        </p>
      </div>
      
      {/* Support Links */}
      <div>
        <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 24, color: 'var(--ink)' }}>Support</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Link to="/contact" className="link-grow" style={{ fontSize: 13, color: 'var(--stone)', textDecoration: 'none', width: 'fit-content' }}>Contact Us</Link>
          <Link to="/faq" className="link-grow" style={{ fontSize: 13, color: 'var(--stone)', textDecoration: 'none', width: 'fit-content' }}>FAQ</Link>
        </div>
      </div>

      {/* Legal Links */}
      <div>
        <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 24, color: 'var(--ink)' }}>Legal</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Link to="/terms" className="link-grow" style={{ fontSize: 13, color: 'var(--stone)', textDecoration: 'none', width: 'fit-content' }}>Terms & Conditions</Link>
          <Link to="/privacy" className="link-grow" style={{ fontSize: 13, color: 'var(--stone)', textDecoration: 'none', width: 'fit-content' }}>Privacy Policy</Link>
        </div>
      </div>

      {/* Social Links */}
      <div>
        <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 24, color: 'var(--ink)' }}>Social</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="link-grow" style={{ fontSize: 13, color: 'var(--stone)', textDecoration: 'none', width: 'fit-content' }}>Instagram</a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="link-grow" style={{ fontSize: 13, color: 'var(--stone)', textDecoration: 'none', width: 'fit-content' }}>Facebook</a>
          <a href="https://wa.me/8801300017080" target="_blank" rel="noopener noreferrer" className="link-grow" style={{ fontSize: 13, color: 'var(--stone)', textDecoration: 'none', width: 'fit-content' }}>WhatsApp</a>
        </div>
      </div>
    </div>
    
    <div style={{ display: 'flex', justifyContent: 'center', borderTop: '1px solid var(--warm-mid)', paddingTop: 32 }}>
      <p style={{ fontSize: 11, color: 'var(--stone)', letterSpacing: '0.1em' }}>© 2026 WICXA. All rights reserved.</p>
    </div>
  </footer>
);

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────

const ProductCard = ({ product, addToCart, index }: any) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="product-card grid-item"
      style={{ transitionDelay: `${(index % 4) * 80}ms`, cursor: 'pointer' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '4/5', background: 'var(--warm-mid)', marginBottom: 14 }}>
        <Link to={`/product/${product.id}`}>
          <img
            src={hovered && product.images[1] ? product.images[1] : product.images[0]}
            alt={product.name}
            className="img-zoom"
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.9s cubic-bezier(0.22,1,0.36,1), opacity 0.4s ease' }}
          />
        </Link>
        <button
          className="quick-add btn-shimmer"
          onClick={() => addToCart(product, 'L', 1)}
          style={{
            position: 'absolute', bottom: 0, left: 0, width: '100%',
            padding: '14px 0', fontSize: 11, fontWeight: 600,
            letterSpacing: '0.2em', textTransform: 'uppercase', border: 'none', cursor: 'pointer',
          }}
        >
          Quick Add +
        </button>
      </div>
      <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.04em', lineHeight: 1.4 }}>{product.name}</p>
        <p style={{ fontSize: 12, color: 'var(--stone)', marginTop: 5 }}>BDT {product.price}</p>
      </Link>
    </div>
  );
};

// ─── PRODUCT GRID ─────────────────────────────────────────────────────────────

const ProductGrid = ({ title, products, addToCart }: any) => {
  useGridReveal();
  return (
    <section style={{ padding: '80px 48px', borderTop: '1px solid var(--warm-mid)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48 }}>
        <h2 className="reveal" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 36, fontWeight: 300, letterSpacing: '0.12em' }}>{title}</h2>
        <span className="reveal reveal-delay-1" style={{ fontSize: 11, color: 'var(--stone)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>{products.length} pieces</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px 20px' }}>
        {products.map((p: any, i: number) => <ProductCard key={p.id} product={p} addToCart={addToCart} index={i} />)}
      </div>
    </section>
  );
};

// ─── HOME PAGE ────────────────────────────────────────────────────────────────

const HomePage = ({ addToCart }: any) => {
  useReveal();
  useGridReveal();
  const heroRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (imgRef.current) {
        imgRef.current.style.transform = `translateY(${window.scrollY * 0.28}px)`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="page-enter">
      {/* Hero */}
      <header ref={heroRef} style={{ position: 'relative', height: '92vh', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', paddingBottom: 80, paddingLeft: 64 }}>
        <img
          ref={imgRef}
          src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=2565&auto=format&fit=crop"
          alt="Hero"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '110%', objectFit: 'cover', top: '-5%' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,13,13,0.72) 0%, transparent 55%)' }} />
        <div style={{ position: 'relative', zIndex: 2, color: '#fff', maxWidth: 700 }}>
          <p style={{ fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: 18, fontFamily: 'Inter, sans-serif' }}>
            New Drop — SS26
          </p>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 64, lineHeight: 1.06, letterSpacing: '0.04em' }}>
            <span className="hero-word hero-word-1" style={{ display: 'block' }}>Unapologetic</span>
            <span className="hero-word hero-word-2" style={{ display: 'block' }}>style for the</span>
            <span className="hero-word hero-word-3" style={{ display: 'block', fontStyle: 'italic' }}>modern landscape.</span>
          </h1>
          <div style={{ display: 'flex', gap: 16, marginTop: 40 }}>
            <Link to="/men" className="btn-shimmer" style={{ padding: '14px 36px', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>
              Shop Men
            </Link>
            <Link to="/women" style={{
              padding: '14px 36px', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600,
              border: '1px solid rgba(255,255,255,0.5)', color: '#fff', textDecoration: 'none',
              transition: 'border-color 0.3s, background 0.3s',
            }}>
              Shop Women
            </Link>
          </div>
        </div>

        {/* scroll indicator */}
        <div style={{ position: 'absolute', bottom: 32, right: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.5)' }}>
          <span style={{ fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', writingMode: 'vertical-rl', fontFamily: 'Inter, sans-serif' }}>Scroll</span>
          <div style={{ width: 1, height: 48, background: 'rgba(255,255,255,0.3)' }} />
        </div>
      </header>

      {/* Marquee divider */}
      <div style={{ background: 'var(--accent)', padding: '13px 0', overflow: 'hidden' }}>
        <div className="marquee-track" style={{ display: 'inline-flex', gap: 64, whiteSpace: 'nowrap' }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} style={{ fontSize: 11, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#fff', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
              Heavyweight Cotton ✦ 240GSM ✦ Limited Edition ✦ Boxy Fit ✦ SS26 Collection ✦
            </span>
          ))}
        </div>
      </div>

      {/* Categories */}
      <section style={{ padding: '100px 48px' }}>
        <div className="reveal" style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 56 }}>
          <div style={{ height: 1, background: 'var(--warm-mid)', flex: 1 }} />
          <span style={{ fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--stone)', whiteSpace: 'nowrap' }}>Explore Categories</span>
          <div style={{ height: 1, background: 'var(--warm-mid)', flex: 1 }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            { to: '/men', label: 'Men', img: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=800&auto=format&fit=crop' },
            { to: '/women', label: 'Women', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop' },
            { to: '/men', label: 'Jerseys', img: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=800&auto=format&fit=crop' },
            { to: '/men', label: 'Heritage', img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop' },
          ].map(({ to, label, img }, i) => (
            <Link
              key={label}
              to={to}
              className={`grid-item reveal-delay-${i + 1}`}
              style={{
                display: 'block', position: 'relative',
                aspectRatio: '3/4', overflow: 'hidden',
                background: 'var(--warm-mid)', textDecoration: 'none',
              }}
            >
              <img src={img} alt={label} className="img-zoom" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,13,13,0.55) 0%, transparent 50%)' }} />
              <span style={{
                position: 'absolute', bottom: 24, left: 24,
                color: '#fff', fontFamily: 'Cormorant Garamond, serif',
                fontSize: 28, fontWeight: 400, letterSpacing: '0.12em',
              }}>{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products strip */}
      <section style={{ padding: '0 0 100px', borderTop: '1px solid var(--warm-mid)' }}>
        <ProductGrid title="Featured Drops" products={mensDropTees.slice(0, 8)} addToCart={addToCart} />
      </section>

      {/* Brand statement */}
      <section className="reveal" style={{ padding: '100px 48px', textAlign: 'center', borderTop: '1px solid var(--warm-mid)' }}>
        <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 48, fontWeight: 300, letterSpacing: '0.06em', lineHeight: 1.3, maxWidth: 800, margin: '0 auto', fontStyle: 'italic', color: 'var(--ink)' }}>
          "Garments built for those who move through the world on their own terms."
        </p>
        <div style={{ width: 40, height: 1, background: 'var(--accent)', margin: '40px auto 0' }} />
      </section>
    </div>
  );
};

// ─── COLLECTION PAGES ─────────────────────────────────────────────────────────

const CollectionPage = ({ gender, addToCart }: { gender: 'Men' | 'Women'; addToCart: any }) => {
  useReveal();
  const products = gender === 'Men' ? mensDropTees : womensDropTees;
  const img = gender === 'Men'
    ? 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=2000&auto=format&fit=crop'
    : 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2000&auto=format&fit=crop';

  return (
    <div className="page-enter">
      <header style={{ position: 'relative', height: '40vh', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', paddingBottom: 48, paddingLeft: 64 }}>
        <img src={img} alt={gender} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(13,13,13,0.52)' }} />
        <h1 className="hero-word hero-word-1" style={{
          position: 'relative', zIndex: 2,
          fontFamily: 'Cormorant Garamond, serif', fontWeight: 300,
          fontSize: 56, color: '#fff', letterSpacing: '0.1em',
        }}>{gender}'s Collection</h1>
      </header>
      <ProductGrid title="Drop Tees" products={products} addToCart={addToCart} />
    </div>
  );
};

// ─── PRODUCT DETAIL ───────────────────────────────────────────────────────────

const ProductDetailPage = ({ addToCart }: any) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState('M');
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [sizeChart, setSizeChart] = useState(false);
  useReveal();

  const product = allMockProducts.find((p) => p.id === id) || allMockProducts[0];
  const sizes = ['S', 'M', 'L', 'XL', '2XL'];

  return (
    <div className="page-enter" style={{ maxWidth: 1400, margin: '0 auto', padding: '60px 48px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 60 }}>
        {/* Images */}
        <div>
          <div style={{ overflow: 'hidden', aspectRatio: '4/5', background: 'var(--warm-mid)', marginBottom: 12 }}>
            <img src={product.images[activeImg]} alt={product.name} className="img-zoom" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {product.images.map((img, i) => (
              <button key={i} onClick={() => setActiveImg(i)} style={{
                padding: 0, border: i === activeImg ? '2px solid var(--ink)' : '2px solid transparent',
                cursor: 'pointer', overflow: 'hidden', aspectRatio: '4/5', background: 'var(--warm-mid)',
                transition: 'border-color 0.3s',
              }}>
                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div style={{ position: 'sticky', top: 100, alignSelf: 'start' }}>
          <p className="reveal" style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: 12 }}>WICXA — SS26</p>
          <h1 className="reveal reveal-delay-1" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 38, fontWeight: 300, lineHeight: 1.15, marginBottom: 16 }}>{product.name}</h1>
          <p className="reveal reveal-delay-2" style={{ fontSize: 22, fontFamily: 'Cormorant Garamond, serif', marginBottom: 36 }}>BDT {product.price}</p>

          {/* Size */}
          <div className="reveal reveal-delay-3" style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--stone)' }}>Size — {selectedSize}</span>
              <button onClick={() => setSizeChart(true)} style={{ fontSize: 11, color: 'var(--stone)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', letterSpacing: '0.08em' }}>Size Guide</button>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {sizes.map((s) => (
                <button key={s} onClick={() => setSelectedSize(s)} style={{
                  padding: '10px 20px', fontSize: 12, letterSpacing: '0.12em',
                  border: s === selectedSize ? '1.5px solid var(--ink)' : '1.5px solid var(--warm-mid)',
                  background: s === selectedSize ? 'var(--ink)' : 'transparent',
                  color: s === selectedSize ? '#fff' : 'var(--ink)',
                  cursor: 'pointer', transition: 'all 0.25s ease', fontFamily: 'Inter, sans-serif',
                }}>{s}</button>
              ))}
            </div>
          </div>

          {/* Qty + Add */}
          <div className="reveal reveal-delay-4" style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--warm-mid)', padding: '0 18px', gap: 18, background: '#fff' }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--stone)' }}>−</button>
              <span style={{ fontSize: 14, minWidth: 20, textAlign: 'center' }}>{qty}</span>
              <button onClick={() => setQty(qty + 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--stone)' }}>+</button>
            </div>
            <button
              className="btn-shimmer"
              onClick={() => addToCart(product, selectedSize, qty)}
              style={{ flex: 1, padding: '14px 0', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, border: 'none', cursor: 'pointer' }}
            >
              Add to Bag
            </button>
          </div>

          <button
            onClick={() => { addToCart(product, selectedSize, qty); navigate('/cart'); }}
            style={{ width: '100%', padding: '14px 0', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, background: 'transparent', border: '1.5px solid var(--ink)', cursor: 'pointer', transition: 'background 0.25s, color 0.25s', fontFamily: 'Inter, sans-serif', color: 'var(--ink)' }}
            onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.background = 'var(--ink)'; (e.target as HTMLButtonElement).style.color = '#fff'; }}
            onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.background = 'transparent'; (e.target as HTMLButtonElement).style.color = 'var(--ink)'; }}
          >
            Buy Now
          </button>

          <div style={{ marginTop: 40, paddingTop: 32, borderTop: '1px solid var(--warm-mid)' }}>
            <p style={{ fontSize: 13, lineHeight: 1.8, color: 'var(--stone)', whiteSpace: 'pre-line' }}>{product.description}</p>
          </div>
        </div>
      </div>

      {/* Size chart modal */}
      {sizeChart && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(13,13,13,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: 'var(--cream)', padding: 48, maxWidth: 520, width: '100%', position: 'relative' }}>
            <button onClick={() => setSizeChart(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--stone)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 28, fontWeight: 400, letterSpacing: '0.1em', marginBottom: 28 }}>Size Guide</h2>
            <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--warm-mid)' }}>
                  {['Size', 'Chest', 'Length'].map((h) => <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--stone)', fontWeight: 500 }}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {[['S','36"','26"'],['M','38"','27"'],['L','40"','28"'],['XL','42"','29"'],['2XL','44"','30"']].map(([s,c,l], i) => (
                  <tr key={s} style={{ borderBottom: '1px solid var(--warm-mid)', background: i % 2 === 0 ? 'transparent' : 'rgba(232,227,220,0.4)' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>{s}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--stone)' }}>{c}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--stone)' }}>{l}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── CART PAGE ────────────────────────────────────────────────────────────────

const CartPage = ({ cartItems }: { cartItems: any[] }) => {
  useReveal();
  const total = cartItems.reduce((s, i) => s + parseFloat(i.price.replace(/,/g, '')), 0);
  return (
    <div className="page-enter" style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 48px', minHeight: '60vh' }}>
      <h1 className="reveal" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 48, fontWeight: 300, letterSpacing: '0.1em', marginBottom: 48, borderBottom: '1px solid var(--warm-mid)', paddingBottom: 24 }}>
        Your Bag
      </h1>
      {cartItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 28, color: 'var(--stone)', fontStyle: 'italic', marginBottom: 32 }}>Your bag is empty.</p>
          <Link to="/" className="btn-shimmer" style={{ padding: '14px 40px', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 60 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {cartItems.map((item, i) => (
              <div key={i} className="reveal" style={{ display: 'flex', gap: 24, paddingBottom: 28, borderBottom: '1px solid var(--warm-mid)' }}>
                <img src={item.images?.[0] || item.image} style={{ width: 90, height: 120, objectFit: 'cover', background: 'var(--warm-mid)' }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{item.name}</p>
                  <p style={{ fontSize: 12, color: 'var(--stone)', letterSpacing: '0.08em' }}>Size: {item.selectedSize} · Qty: {item.quantity}</p>
                </div>
                <p style={{ fontWeight: 600, fontSize: 14 }}>BDT {item.price}</p>
              </div>
            ))}
          </div>
          <div className="reveal" style={{ background: '#fff', padding: 36, border: '1px solid var(--warm-mid)', alignSelf: 'start' }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, fontWeight: 400, marginBottom: 24 }}>Order Summary</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontSize: 13, color: 'var(--stone)' }}>
              <span>Subtotal</span><span>BDT {total.toLocaleString('en-BD', { minimumFractionDigits: 2 })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 15, borderTop: '1px solid var(--warm-mid)', paddingTop: 20, marginTop: 8, marginBottom: 28 }}>
              <span>Total</span><span>BDT {total.toLocaleString('en-BD', { minimumFractionDigits: 2 })}</span>
            </div>
            <button className="btn-shimmer" style={{ width: '100%', padding: '16px 0', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
              Checkout Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


// ─── SIGN UP PAGE ─────────────────────────────────────────────────────────────

const SignUpPage = () => {
  useReveal();
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' });
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [loading, setLoading] = useState(false);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const errs: Record<string,string> = {};
    if (!form.firstName.trim()) errs.firstName = 'Required';
    if (!form.lastName.trim()) errs.lastName = 'Required';
    if (!form.email.includes('@')) errs.email = 'Enter a valid email';
    if (form.password.length < 8) errs.password = 'Min 8 characters';
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match';
    if (!agreed) errs.agreed = 'You must agree to continue';
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    
    setLoading(true);
    
    // Simulate a network request for account creation
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  const inputStyle = (field: string): React.CSSProperties => ({
    width: '100%', padding: '14px 16px', fontSize: 14,
    fontFamily: 'Inter, sans-serif', background: '#fff',
    border: `1.5px solid ${errors[field] ? '#c0392b' : 'var(--warm-mid)'}`,
    outline: 'none', color: 'var(--ink)', borderRadius: 2,
    transition: 'border-color 0.2s',
    boxSizing: 'border-box' as any,
  });

  if (submitted) return (
    <div className="page-enter" style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', textAlign: 'center' }}>
      <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28 }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 38, fontWeight: 300, marginBottom: 14 }}>Welcome to WICXA</h2>
      <p style={{ fontSize: 14, color: 'var(--stone)', marginBottom: 36, maxWidth: 360, lineHeight: 1.7 }}>
        Your account has been created. Start exploring the collection.
      </p>
      <button onClick={() => navigate('/')} className="btn-shimmer" style={{ padding: '14px 40px', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
        Shop Now
      </button>
    </div>
  );

  return (
    <div className="page-enter" style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Left panel — image */}
      <div style={{ flex: 1, display: 'none', position: 'relative', overflow: 'hidden' }} className="signup-left">
        <img
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop"
          alt="WICXA Members"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,13,13,0.7) 0%, transparent 60%)' }} />
        <div style={{ position: 'absolute', bottom: 56, left: 48, right: 48 }}>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 36, fontWeight: 300, color: '#fff', lineHeight: 1.2, fontStyle: 'italic' }}>
            "Style is a way to say who you are without having to speak."
          </p>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 16, letterSpacing: '0.18em', textTransform: 'uppercase' }}>— WICXA Members</p>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{ width: '100%', maxWidth: 520, margin: '0 auto', padding: '60px 48px 80px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none', marginBottom: 48, display: 'block' }}>
          <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, fontWeight: 600, letterSpacing: '0.22em', color: 'var(--ink)' }}>WICXA</span>
        </Link>

        <div className="reveal">
          <p style={{ fontSize: 10, letterSpacing: '0.26em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: 10 }}>Member Access</p>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 40, fontWeight: 300, lineHeight: 1.1, marginBottom: 8 }}>Create your account</h1>
          <p style={{ fontSize: 13, color: 'var(--stone)', marginBottom: 36, lineHeight: 1.6 }}>
            Join WICXA for early access to new drops, exclusive member pricing, and order history.
          </p>
        </div>

        {/* Form fields */}
        <div className="reveal reveal-delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <input placeholder="First name" value={form.firstName} onChange={set('firstName')} style={inputStyle('firstName')} />
              {errors.firstName && <p style={{ fontSize: 11, color: '#c0392b', marginTop: 4 }}>{errors.firstName}</p>}
            </div>
            <div>
              <input placeholder="Last name" value={form.lastName} onChange={set('lastName')} style={inputStyle('lastName')} />
              {errors.lastName && <p style={{ fontSize: 11, color: '#c0392b', marginTop: 4 }}>{errors.lastName}</p>}
            </div>
          </div>

          <div>
            <input type="email" placeholder="Email address" value={form.email} onChange={set('email')} style={inputStyle('email')} />
            {errors.email && <p style={{ fontSize: 11, color: '#c0392b', marginTop: 4 }}>{errors.email}</p>}
          </div>

          <div>
            <input type="password" placeholder="Password" value={form.password} onChange={set('password')} style={inputStyle('password')} />
            {errors.password && <p style={{ fontSize: 11, color: '#c0392b', marginTop: 4 }}>{errors.password}</p>}
          </div>

          <div>
            <input type="password" placeholder="Confirm password" value={form.confirm} onChange={set('confirm')} style={inputStyle('confirm')} />
            {errors.confirm && <p style={{ fontSize: 11, color: '#c0392b', marginTop: 4 }}>{errors.confirm}</p>}
          </div>

          {/* Checkbox */}
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer', marginTop: 4 }}>
            <div
              onClick={() => setAgreed(!agreed)}
              style={{
                width: 18, height: 18, border: `1.5px solid ${errors.agreed ? '#c0392b' : 'var(--warm-mid)'}`,
                background: agreed ? 'var(--ink)' : '#fff', flexShrink: 0, marginTop: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                transition: 'background 0.2s, border-color 0.2s', borderRadius: 2,
              }}
            >
              {agreed && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
            </div>
            <span style={{ fontSize: 12, color: 'var(--stone)', lineHeight: 1.6 }}>
              I agree to the <a href="#" style={{ color: 'var(--ink)', textDecoration: 'underline' }}>Terms of Service</a> and <a href="#" style={{ color: 'var(--ink)', textDecoration: 'underline' }}>Privacy Policy</a>
            </span>
          </label>
          {errors.agreed && <p style={{ fontSize: 11, color: '#c0392b', marginTop: -8 }}>{errors.agreed}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-shimmer"
            style={{ marginTop: 8, padding: '15px 0', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', borderRadius: 2, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>

          <p style={{ fontSize: 12, color: 'var(--stone)', textAlign: 'center', marginTop: 8 }}>
            Already a member?{' '}
            <Link to="/" style={{ color: 'var(--ink)', textDecoration: 'underline', fontWeight: 500 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

// ─── ABOUT PAGE ───────────────────────────────────────────────────────────────

const AboutPage = () => {
  useReveal();

  return (
    <div className="page-enter">
      {/* Hero */}
      <header style={{
        position: 'relative', height: '52vh', overflow: 'hidden',
        display: 'flex', alignItems: 'flex-end',
        paddingBottom: 64, paddingLeft: 64,
      }}>
        <img
          src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=2565&auto=format&fit=crop"
          alt="About WICXA"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '115%', objectFit: 'cover', top: '-5%' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,13,13,0.78) 0%, rgba(13,13,13,0.2) 60%, transparent 100%)' }} />
        <div style={{ position: 'relative', zIndex: 2, color: '#fff' }}>
          <p style={{ fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginBottom: 14, fontFamily: 'Inter, sans-serif' }}>
            Our Story
          </p>
          <h1 className="hero-word hero-word-1" style={{
            fontFamily: 'Cormorant Garamond, serif', fontWeight: 300,
            fontSize: 60, letterSpacing: '0.06em', lineHeight: 1.1,
          }}>
            Where Passion<br /><em>Meets Purpose</em>
          </h1>
        </div>
      </header>

      {/* Mission */}
      <section style={{ padding: '100px 48px', maxWidth: 900, margin: '0 auto' }}>
        <p className="reveal" style={{
          fontSize: 11, letterSpacing: '0.26em', textTransform: 'uppercase',
          color: 'var(--stone)', marginBottom: 28, fontFamily: 'Inter, sans-serif',
        }}>
          What We Stand For
        </p>
        <p className="reveal reveal-delay-1" style={{
          fontFamily: 'Cormorant Garamond, serif', fontSize: 30,
          fontWeight: 300, lineHeight: 1.65, color: 'var(--ink)',
          marginBottom: 36,
        }}>
          We are dedicated to redefining your everyday wardrobe by providing the best premium, comfortable wear for daily use at an accessible, mid-range price point.
        </p>
        <p className="reveal reveal-delay-2" style={{
          fontSize: 15, lineHeight: 1.9, color: 'var(--stone)',
          fontFamily: 'Inter, sans-serif', fontWeight: 400,
          maxWidth: 720,
        }}>
          Our mission is built on an unwavering commitment to unmatched design and the personal comfort of every customer, ensuring that you never have to choose between luxury and practicality. By blending thoughtful aesthetics with premium materials, we create pieces that elevate your routine.
        </p>

        {/* Divider quote */}
        <div className="reveal reveal-delay-3" style={{
          margin: '64px 0', borderLeft: '3px solid var(--accent)',
          paddingLeft: 32,
        }}>
          <p style={{
            fontFamily: 'Cormorant Garamond, serif', fontSize: 26,
            fontStyle: 'italic', fontWeight: 400, lineHeight: 1.5, color: 'var(--ink)',
          }}>
            "We don't just sell dresses — we provide quality and premium-ness."
          </p>
          <p style={{ fontSize: 11, color: 'var(--stone)', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 14, fontFamily: 'Inter, sans-serif' }}>
            — The WICXA Promise
          </p>
        </div>
      </section>

      {/* Pillars */}
      <section style={{ background: 'var(--ink)', padding: '80px 48px', marginBottom: 40 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p className="reveal" style={{
            fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.4)', marginBottom: 48,
            fontFamily: 'Inter, sans-serif', textAlign: 'center',
          }}>
            What Drives Us
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40 }}>
            {[
              {
                label: 'Design First',
                body: "Every cut, every stitch is considered. We obsess over proportion and silhouette so you don't have to think twice about what you're putting on.",
              },
              {
                label: 'Premium Materials',
                body: '240GSM heavyweight cotton. Garments that hold their shape, feel substantial, and improve with every wash.',
              },
              {
                label: 'Accessible Luxury',
                body: "Premium doesn't have to mean unattainable. We price our pieces so quality is within reach for everyone who values it.",
              },
            ].map(({ label, body }, i) => (
              <div key={label} className={`reveal reveal-delay-${i + 1}`} style={{
                borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: 32,
              }}>
                <h3 style={{
                  fontFamily: 'Cormorant Garamond, serif', fontSize: 24,
                  fontWeight: 400, color: '#fff', marginBottom: 16, letterSpacing: '0.06em',
                }}>
                  {label}
                </h3>
                <p style={{ fontSize: 13, lineHeight: 1.8, color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter, sans-serif' }}>
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// ─── CONTACT PAGE ─────────────────────────────────────────────────────────────

const ContactPage = () => {
  useReveal();
  return (
    <div className="page-enter" style={{ minHeight: '70vh', padding: '120px 48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', width: '100%' }}>
        <p className="reveal" style={{
          fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase',
          color: 'var(--stone)', marginBottom: 18, fontFamily: 'Inter, sans-serif',
        }}>
          Get In Touch
        </p>
        <h2 className="reveal reveal-delay-1" style={{
          fontFamily: 'Cormorant Garamond, serif', fontSize: 44,
          fontWeight: 300, letterSpacing: '0.06em', marginBottom: 48,
        }}>
          We'd love to hear from you.
        </h2>

        <div className="reveal reveal-delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
          {/* Email */}
          <a
            href="mailto:wicxa.official@gmail.com"
            style={{
              display: 'flex', alignItems: 'center', gap: 20,
              textDecoration: 'none', color: 'var(--ink)',
              padding: '22px 32px', border: '1px solid var(--warm-mid)',
              width: '100%', maxWidth: 440,
              transition: 'border-color 0.3s, background 0.3s',
              background: 'transparent',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--ink)'; (e.currentTarget as HTMLAnchorElement).style.background = '#fff'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--warm-mid)'; (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; }}
          >
            <div style={{ width: 42, height: 42, background: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </div>
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: 5, fontFamily: 'Inter, sans-serif' }}>Email Us</p>
              <p style={{ fontSize: 14, fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>wicxa.official@gmail.com</p>
            </div>
          </a>

          {/* Phone */}
          <a
            href="tel:+8801300017080"
            style={{
              display: 'flex', alignItems: 'center', gap: 20,
              textDecoration: 'none', color: 'var(--ink)',
              padding: '22px 32px', border: '1px solid var(--warm-mid)',
              width: '100%', maxWidth: 440,
              transition: 'border-color 0.3s, background 0.3s',
              background: 'transparent',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--ink)'; (e.currentTarget as HTMLAnchorElement).style.background = '#fff'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--warm-mid)'; (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; }}
          >
            <div style={{ width: 42, height: 42, background: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.83a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z"/></svg>
            </div>
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: 5, fontFamily: 'Inter, sans-serif' }}>Call Us</p>
              <p style={{ fontSize: 14, fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>+880 1300 017080</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

// ─── SIMPLE TEXT PAGE COMPONENT (For Legal/FAQ) ───────────────────────────────

const SimpleTextPage = ({ title, children }: { title: string, children: React.ReactNode }) => {
  useReveal();
  return (
    <div className="page-enter" style={{ padding: '120px 48px', maxWidth: 800, margin: '0 auto', minHeight: '70vh' }}>
      <h1 className="reveal" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 44, fontWeight: 300, letterSpacing: '0.04em', marginBottom: 48, textAlign: 'center' }}>{title}</h1>
      <div className="reveal reveal-delay-1" style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--stone)', fontFamily: 'Inter, sans-serif' }}>
        {children}
      </div>
    </div>
  );
}

const TermsPage = () => (
  <SimpleTextPage title="Terms & Conditions">
    <p style={{ marginBottom: 24 }}>Welcome to WICXA. These terms and conditions outline the rules and regulations for the use of our website and services. By accessing this website we assume you accept these terms and conditions. Do not continue to use WICXA if you do not agree to take all of the terms and conditions stated on this page.</p>
    <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, color: 'var(--ink)', marginBottom: 12, marginTop: 32 }}>1. General Conditions</h3>
    <p style={{ marginBottom: 24 }}>We reserve the right to refuse service to anyone for any reason at any time. You understand that your content (not including credit card information), may be transferred unencrypted and involve transmissions over various networks.</p>
    <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, color: 'var(--ink)', marginBottom: 12, marginTop: 32 }}>2. Products or Services</h3>
    <p style={{ marginBottom: 24 }}>Certain products or services may be available exclusively online through the website. These products or services may have limited quantities and are subject to return or exchange only according to our Return Policy. We have made every effort to display as accurately as possible the colors and images of our products that appear at the store.</p>
  </SimpleTextPage>
);

const PrivacyPage = () => (
  <SimpleTextPage title="Privacy Policy">
    <p style={{ marginBottom: 24 }}>This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from WICXA.</p>
    <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, color: 'var(--ink)', marginBottom: 12, marginTop: 32 }}>Personal Information We Collect</h3>
    <p style={{ marginBottom: 24 }}>When you visit the Site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device. Additionally, as you browse the Site, we collect information about the individual web pages or products that you view.</p>
    <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, color: 'var(--ink)', marginBottom: 12, marginTop: 32 }}>How Do We Use Your Personal Information?</h3>
    <p style={{ marginBottom: 24 }}>We use the Order Information that we collect generally to fulfill any orders placed through the Site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations).</p>
  </SimpleTextPage>
);

const FAQPage = () => (
  <SimpleTextPage title="Frequently Asked Questions">
    <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, color: 'var(--ink)', marginBottom: 12, marginTop: 32 }}>How long does shipping take?</h3>
    <p style={{ marginBottom: 24 }}>Estimated delivery time is 5-9 business days depending on your location within Bangladesh. You will receive a tracking number once your order has been dispatched.</p>
    
    <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, color: 'var(--ink)', marginBottom: 12, marginTop: 32 }}>What is your return policy?</h3>
    <p style={{ marginBottom: 24 }}>We accept returns within 7 days of delivery as long as the garment is unworn, unwashed, and still has all original tags attached. Please contact us via email to initiate a return.</p>

    <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, color: 'var(--ink)', marginBottom: 12, marginTop: 32 }}>How should I wash my WICXA garments?</h3>
    <p style={{ marginBottom: 24 }}>To maintain the premium 240GSM heavyweight cotton, we recommend machine washing cold with similar colors and hanging to dry. Do not tumble dry.</p>
  </SimpleTextPage>
);


// ─── PAGE TRANSITION WRAPPER ──────────────────────────────────────────────────

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  return <div key={location.pathname}>{children}</div>;
};

// ─── APP ──────────────────────────────────────────────────────────────────────

const App = () => {
  const [cart, setCart] = useState<any[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const addToCart = useCallback((product: any, selectedSize = 'L', quantity = 1) => {
    setCart((prev) => [...prev, { ...product, selectedSize, quantity }]);
    setToast(`${product.name.split(' ').slice(0, 3).join(' ')} added to bag`);
  }, []);

  return (
    <Router>
      <GlobalStyles />
      <CustomCursor />
      <div style={{ minHeight: '100vh', background: 'var(--cream)', color: 'var(--ink)', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif', overflowX: 'hidden' }}>
        <AnnouncementBar />
        <Navbar cartCount={cart.length} openSearch={() => setSearchOpen(true)} />
        <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
        {toast && <Toast message={toast} onDone={() => setToast(null)} />}
        <main style={{ flex: 1 }}>
          <PageWrapper>
            <Routes>
              <Route path="/" element={<HomePage addToCart={addToCart} />} />
              <Route path="/men" element={<CollectionPage gender="Men" addToCart={addToCart} />} />
              <Route path="/women" element={<CollectionPage gender="Women" addToCart={addToCart} />} />
              <Route path="/cart" element={<CartPage cartItems={cart} />} />
              <Route path="/product/:id" element={<ProductDetailPage addToCart={addToCart} />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/about" element={<AboutPage />} />
              {/* New Pages */}
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/faq" element={<FAQPage />} />
            </Routes>
          </PageWrapper>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;