import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "../style/scroll.css"; // Create a separate CSS file for styling

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const threshold = 100; // Adjust this threshold as needed

      setIsVisible(scrollY > threshold);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scrolling
    });
  };

  return (
    <motion.button
      className={`scroll-to-top ${isVisible ? "visible" : ""}`}
      onClick={scrollToTop}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      Scroll to Top
    </motion.button>
  );
};

export default ScrollToTopButton;
