import React, { useState, useEffect, useRef } from "react";
import "./notFound.scss";
import * as THREE from "three";

const NotFound = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const canvasRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      // Clean up Three.js objects
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("Submitting form:", { name, email, message });

    setName("");
    setEmail("");
    setMessage("");
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="form-container-main">
      <div className="form-container">
        <div className="form-image">
          <h1 className="montserrat">Get in touch</h1>
          <canvas ref={canvasRef}></canvas>
        </div>
        <div className="form">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              id="name"
              placeholder="Name"
              autoFocus
              value={name}
              onChange={handleNameChange}
            />
            <input
              type="email"
              id="mail"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
            />
            <textarea
              name="message"
              id="message"
              cols="30"
              rows="10"
              placeholder="Say Hello"
              value={message}
              onChange={handleMessageChange}
            />
            <div className="button-container">
              <button type="submit" className="send-button">
                Send
              </button>
              <button
                type="button"
                className="reset-button"
                id="reset-btn"
                onClick={handleReset}
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
