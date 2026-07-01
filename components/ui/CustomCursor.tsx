'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // High performance coordinate tracking using refs to persist state across renders
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const glowPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Check if device supports hover/fine pointer (Desktop only)
    const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isDesktop) return;

    // Direct DOM injection of custom cursor class to guarantee cursor safety
    document.documentElement.classList.add('custom-cursor-active');

    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    // Show cursor container
    wrapper.style.display = 'block';
    wrapper.style.opacity = '0';

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      
      // Make visible on first move
      if (wrapper.style.opacity === '0') {
        wrapper.style.opacity = '1';
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') || 
        target.closest('.interactive-card') ||
        target.closest('[role="button"]') ||
        target.classList.contains('cursor-pointer');

      const ring = ringRef.current;
      const dot = dotRef.current;

      if (isInteractive) {
        if (ring) {
          ring.style.width = '64px';
          ring.style.height = '64px';
          ring.style.borderColor = '#7c3aed';
          ring.style.backgroundColor = 'rgba(124, 58, 237, 0.05)';
        }
        if (dot) {
          dot.style.width = '14px';
          dot.style.height = '14px';
          dot.style.backgroundColor = '#7c3aed';
        }
      } else {
        if (ring) {
          ring.style.width = '40px';
          ring.style.height = '40px';
          ring.style.borderColor = '#4169e1';
          ring.style.backgroundColor = 'transparent';
        }
        if (dot) {
          dot.style.width = '10px';
          dot.style.height = '10px';
          dot.style.backgroundColor = '#4169e1';
        }
      }
    };

    const handleMouseLeave = () => {
      wrapper.style.opacity = '0';
    };

    const handleMouseEnter = () => {
      wrapper.style.opacity = '1';
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    let animationFrameId: number;

    // Fluid 60fps RequestAnimationFrame Loop
    const tick = () => {
      const currentMouseX = mousePos.current.x;
      const currentMouseY = mousePos.current.y;

      // 1. Instant dot tracking
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(calc(${currentMouseX}px - 50%), calc(${currentMouseY}px - 50%), 0)`;
      }

      // 2. Smooth ring chasing (lerp 0.1)
      ringPos.current.x += (currentMouseX - ringPos.current.x) * 0.1;
      ringPos.current.y += (currentMouseY - ringPos.current.y) * 0.1;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(calc(${ringPos.current.x}px - 50%), calc(${ringPos.current.y}px - 50%), 0)`;
      }

      // 3. Ultra-smooth glow spotlight (lerp 0.05)
      glowPos.current.x += (currentMouseX - glowPos.current.x) * 0.05;
      glowPos.current.y += (currentMouseY - glowPos.current.y) * 0.05;
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(calc(${glowPos.current.x}px - 50%), calc(${glowPos.current.y}px - 50%), 0)`;
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      ref={wrapperRef}
      className="fixed inset-0 pointer-events-none z-[99999] transition-opacity duration-300"
      style={{ display: 'none', opacity: 0 }}
    >
      {/* 1. Spotlight Glow */}
      <div 
        ref={glowRef}
        className="fixed top-0 left-0 w-[260px] h-[260px] rounded-full pointer-events-none select-none mix-blend-multiply opacity-15"
        style={{
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.4) 0%, rgba(65, 105, 225, 0.05) 50%, transparent 80%)',
          willChange: 'transform',
        }}
      />

      {/* 2. Trailing Glass Ring */}
      <div 
        ref={ringRef}
        className="fixed top-0 left-0 w-[40px] h-[40px] border-2 border-blue-500 bg-transparent rounded-full pointer-events-none select-none transition-[width,height,border-color,background-color] duration-300 ease-out"
        style={{
          willChange: 'transform',
        }}
      />

      {/* 3. Instant Dot Element */}
      <div 
        ref={dotRef}
        className="fixed top-0 left-0 w-[10px] h-[10px] bg-blue-600 rounded-full pointer-events-none select-none transition-[width,height,background-color] duration-200"
        style={{
          willChange: 'transform',
        }}
      />
    </div>
  );
}
