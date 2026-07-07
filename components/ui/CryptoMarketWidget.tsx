'use client';

import { useEffect, useRef } from 'react';

export default function CryptoMarketWidget() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any previous widget contents
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-screener.js';
    script.type = 'text/javascript';
    script.async = true;
    
    script.innerHTML = JSON.stringify({
      width: '100%',
      height: 490,
      defaultColumn: 'overview',
      screener_type: 'crypto_mkt',
      displayCurrency: 'USD',
      colorTheme: 'dark',
      locale: 'en',
      isTransparent: true,
    });

    containerRef.current.appendChild(script);
  }, []);

  return (
    <div className="tradingview-widget-container w-full h-[490px]" ref={containerRef}>
      <div className="tradingview-widget-container__widget w-full h-full"></div>
    </div>
  );
}
