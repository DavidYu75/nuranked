'use client';

import dynamic from 'next/dynamic';

const Spline = dynamic(() => import('@splinetool/react-spline'), { ssr: false });

export default function SplineIcon({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={className} style={style}>
      <Spline scene="https://prod.spline.design/4z25bj-TiundiGZq/scene.splinecode" />
    </div>
  );
}
