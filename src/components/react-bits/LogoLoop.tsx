"use client";

import { useRef, useEffect, useState, useCallback, type ReactNode } from "react";

interface Logo {
  node?: ReactNode;
  src?: string;
  alt?: string;
  title?: string;
  href?: string;
}

interface LogoLoopProps {
  logos: Logo[];
  speed?: number;
  direction?: "left" | "right";
  logoHeight?: number;
  gap?: number;
  hoverSpeed?: number;
  scaleOnHover?: boolean;
  fadeOut?: boolean;
  fadeOutColor?: string;
  ariaLabel?: string;
  useCustomRender?: boolean;
}

export default function LogoLoop({
  logos,
  speed = 100,
  direction = "left",
  logoHeight = 28,
  gap = 32,
  hoverSpeed = 0,
  scaleOnHover = true,
  fadeOut = true,
  fadeOutColor,
  ariaLabel,
  useCustomRender = false,
}: LogoLoopProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const animRef = useRef<number>(0);
  const offsetRef = useRef(0);
  const lastTimeRef = useRef<number>(0);

  const animate = useCallback(
    (time: number) => {
      if (!trackRef.current) return;
      if (lastTimeRef.current === 0) lastTimeRef.current = time;
      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;

      const currentSpeed = isHovered ? hoverSpeed : speed;
      const directionMultiplier = direction === "left" ? -1 : 1;
      offsetRef.current += (currentSpeed * delta * directionMultiplier) / 1000;

      const track = trackRef.current;
      const halfWidth = track.scrollWidth / 2;
      if (offsetRef.current < -halfWidth) offsetRef.current += halfWidth;
      if (offsetRef.current > 0) offsetRef.current -= halfWidth;

      track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
      animRef.current = requestAnimationFrame(animate);
    },
    [isHovered, speed, hoverSpeed, direction]
  );

  useEffect(() => {
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [animate]);

  const renderLogo = (logo: Logo, index: string | number) => {
    const content = logo.node ? (
      <span className="logoloop__node">{logo.node}</span>
    ) : logo.src ? (
      <img src={logo.src} alt={logo.alt || logo.title || ""} />
    ) : null;

    const wrapped = logo.href ? (
      <a
        href={logo.href}
        target="_blank"
        rel="noopener noreferrer"
        className="logoloop__link"
        title={logo.title}
      >
        {content}
      </a>
    ) : (
      content
    );

    return (
      <li key={index} className="logoloop__item">
        {wrapped}
      </li>
    );
  };

  const style: React.CSSProperties = {
    "--logoloop-gap": `${gap}px`,
    "--logoloop-logoHeight": `${logoHeight}px`,
    "--logoloop-fadeColor": fadeOutColor || undefined,
  } as React.CSSProperties;

  const classes = [
    "logoloop",
    fadeOut && "logoloop--fade",
    scaleOnHover && "logoloop--scale-hover",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={classes}
      style={style}
      aria-label={ariaLabel}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="logoloop__track" ref={trackRef}>
        <ul className="logoloop__list">
          {logos.map((logo, i) => renderLogo(logo, `a-${i}`))}
        </ul>
        <ul className="logoloop__list" aria-hidden>
          {logos.map((logo, i) => renderLogo(logo, `b-${i}`))}
        </ul>
      </div>
    </div>
  );
}
