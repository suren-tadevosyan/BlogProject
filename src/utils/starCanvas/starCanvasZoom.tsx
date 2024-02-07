import "./star.css";
import React, { useState, useRef, Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
// @ts-ignore
import * as random from "maath/random/dist/maath-random.esm";

export const StarBackgroundZoom = (props: any) => {
  const ref: any = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(5000 * 10), { radius: 1.2 })
  );

  useEffect(() => {
    // Update camera position to create a zoom-in effect
    const interval = setInterval(() => {
      ref.current.position.z += 0.01; // Adjust the zoom speed as needed
    }, 10); // Adjust the interval for smoother animation if needed

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

// const StarsCanvasZoom = () => (
//   <div className="star" style={{ backgroundColor: "black" }}>
//     <Canvas camera={{ position: [0, 0, 1] }}>
//       <Suspense fallback={null}></Suspense>
//     </Canvas>
//   </div>
// );

// export default StarsCanvasZoom;
