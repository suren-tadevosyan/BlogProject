import "./star.css";
import React, { useState, useRef, useEffect } from "react";

import { Points, PointMaterial } from "@react-three/drei";

import * as random from "maath/random/dist/maath-random.esm";

export const StarBackgroundZoom = (props: any) => {
  const ref: any = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(5000 * 10), { radius: 1.2 })
  );

  useEffect(() => {
    const interval = setInterval(() => {
      ref.current.position.z += 0.01;
    }, 10);

    return () => clearInterval(interval);
  }, []);

  return (
    <group rotation={[0, 0, Math.PI / 4]} ref={ref}>
      <Points positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="$fff"
          size={0.002}
          sizeAttenuation={true}
          dethWrite={false}
        />
      </Points>
    </group>
  );
};
