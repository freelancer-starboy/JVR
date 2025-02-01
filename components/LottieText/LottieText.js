'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Preloader from '../elements/Preloader';

// Move the dynamic import outside the component
const Lottie = dynamic(() => import('lottie-react'), {
  ssr: false,
  loading: () => <Preloader />
});

// Import animation data inside the component
const LottieAnimation = () => {
  const [animationData, setAnimationData] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Import animation data on client side
    import("@/public/assets/css/images/jvr-lottie-3.json").then((data) => {
      setAnimationData(data.default);
    });
    setIsClient(true);
  }, []);

  if (!isClient || !animationData) return null;

  return (
    
      <Lottie
        animationData={animationData}
        style={{ width: "500px", height: "500px", marginBottom: "5rem" }}
        loop={true}
      />
  );
};

export default LottieAnimation;