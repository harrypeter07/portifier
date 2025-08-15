'use client';

import { useState, useEffect } from 'react';

export default function PortfolioUrlDisplay({ username }) {
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  return (
    <span className="text-gray-500 dark:text-gray-400">
      {origin || 'Loading...'}/{username || "username"}
    </span>
  );
}
