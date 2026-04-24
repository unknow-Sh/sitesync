import { useEffect, useRef } from "react";
import gsap from "gsap";

const Header = () => {
  const headerRef = useRef(null);
  const navRef = useRef(null);

  useEffect(() => {

    if (!headerRef.current || !navRef.current) return;
    
    gsap.from(headerRef.current, {
      y: -50,
      opacity: 0,
      duration: 1,
    });
    gsap.from(navRef.current.children, {
      y: -20,
      opacity: 0,
      stagger: 0.2,
    });
  }, []);

  return (
    <header
      ref={headerRef}
      style={{ padding: "20px", background: "black", color: "white" }}
    >
      <ul ref={navRef} style={{ display: "flex", gap: "20px" }}>
        <li>Home</li>
        <li>About</li>
        <li>Services</li>
      </ul>
    </header>
  );
};

export default Header;
