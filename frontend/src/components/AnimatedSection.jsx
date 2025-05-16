// components/AnimatedSection.jsx or .tsx
import { useState, useEffect, useRef } from "react";

const AnimatedSection = ({ children, className = "" }) => {
  const ref = useRef();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry])=>{
        if(entry.isIntersecting){
            setIsVisible(true)
            observer.unobserve(entry.target)
        }
    },{
        threshold: 0.2
    })
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className={`transition-all duration-700 ease-out transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
    >
      {children}
    </section>
  );
};

export default AnimatedSection;
