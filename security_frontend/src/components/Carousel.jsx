import React, { useRef, useEffect } from 'react';
import './Carousel.css'; 
import carousel1 from '../assets/images/carousel1.jpg';
import carousel2 from '../assets/images/carousel2.webp';
import carousel3 from '../assets/images/carousel3.jpeg';

const Carousel = () => {
  const carouselRef = useRef(null);
  const intervalRef = useRef(null);

  const slideLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.style.transform = `translateX(-100%)`;
    }
  };

  const slideRight = () => {
    if (carouselRef.current) {
      carouselRef.current.style.transform = `translateX(0%)`;
    }
  };

  const autoSlide = () => {
    if (carouselRef.current) {
      const items = carouselRef.current.children;
      let currentIndex = 0;

      intervalRef.current = setInterval(() => {
        currentIndex = (currentIndex + 1) % items.length;
        carouselRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;
      }, 3000);
    }
  };

  useEffect(() => {
    autoSlide();

    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="carousel-container">
      <div className="carousel" ref={carouselRef}>
        <div className="carousel-item">
          <img src={carousel1} alt="Slide 1" className="carousel-img" />
        </div>
        <div className="carousel-item">
          <img src={carousel2} alt="Slide 2" className="carousel-img" />
        </div>
        <div className="carousel-item">
          <img src={carousel3} alt="Slide 3" className="carousel-img" />
        </div>
      </div>
      <div className="carousel-buttons">
      </div>
    </div>
  );
};

export default Carousel;
