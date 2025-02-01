'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Move the dynamic import outside the component
const Lottie = dynamic(() => import('lottie-react'), {
  ssr: false,
  loading: () => <div>Loading...</div>
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
    <div className="custom-login-left">
      <Lottie
        animationData={animationData}
        style={{ width: "700px", height: "700px", marginBottom: "5rem" }}
        loop={true}
      />
    </div>
  );
};

export default LottieAnimation;