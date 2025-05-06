"use client";
import React, { useEffect, useRef } from "react";

const HeroAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const updateSize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    // Create particles
    const particles: Particle[] = [];
    const particleCount = 50;

    interface Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      alpha: number;
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: `rgba(${Math.floor(Math.random() * 100 + 16)}, ${Math.floor(
          Math.random() * 100 + 180
        )}, ${Math.floor(Math.random() * 100 + 140)}, `,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw mockup of a messaging interface
      drawMessagingInterface(ctx, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x > canvas.width) particle.x = 0;
        else if (particle.x < 0) particle.x = canvas.width;

        if (particle.y > canvas.height) particle.y = 0;
        else if (particle.y < 0) particle.y = canvas.height;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color + particle.alpha + ")";
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    const drawMessagingInterface = (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number
    ) => {
      // Create a rounded rectangle for the phone mockup
      const phoneWidth = width * 0.85;
      const phoneHeight = height * 0.9;
      const phoneX = (width - phoneWidth) / 2;
      const phoneY = (height - phoneHeight) / 2;
      const phoneRadius = 20;

      // Phone outline
      ctx.fillStyle = "rgba(30, 30, 35, 0.8)";
      roundedRect(ctx, phoneX, phoneY, phoneWidth, phoneHeight, phoneRadius);
      ctx.fill();

      ctx.fillStyle = "rgba(20, 20, 25, 0.9)";
      roundedRect(
        ctx,
        phoneX + 10,
        phoneY + 30,
        phoneWidth - 20,
        phoneHeight - 40,
        phoneRadius - 5
      );
      ctx.fill();

      // Message bubbles
      drawMessageBubble(
        ctx,
        phoneX + 30,
        phoneY + 70,
        phoneWidth * 0.6,
        40,
        "right",
        "rgba(16, 185, 129, 0.8)"
      );
      drawMessageBubble(
        ctx,
        phoneX + phoneWidth - 30,
        phoneY + 130,
        phoneWidth * 0.6,
        60,
        "left",
        "rgba(40, 40, 45, 0.8)"
      );
      drawMessageBubble(
        ctx,
        phoneX + 30,
        phoneY + 210,
        phoneWidth * 0.7,
        50,
        "right",
        "rgba(16, 185, 129, 0.8)"
      );

      // Payment badge
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.font = "10px Arial";
      ctx.textAlign = "center";

      const badgeX = phoneX + phoneWidth - 80;
      const badgeY = phoneY + 130 - 15;

      ctx.beginPath();
      ctx.arc(badgeX, badgeY, 15, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "rgba(16, 185, 129, 1)";
      ctx.fillText("0.5 SOL", badgeX, badgeY + 1);

      // Draw a glowing circle around the 0.5 SOL badge
      ctx.beginPath();
      ctx.arc(badgeX, badgeY, 20, 0, Math.PI * 2);
      const gradient = ctx.createRadialGradient(
        badgeX,
        badgeY,
        15,
        badgeX,
        badgeY,
        30
      );
      gradient.addColorStop(0, "rgba(16, 185, 129, 0.4)");
      gradient.addColorStop(1, "rgba(16, 185, 129, 0)");
      ctx.fillStyle = gradient;
      ctx.fill();
    };

    const roundedRect = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      width: number,
      height: number,
      radius: number
    ) => {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.arcTo(x + width, y, x + width, y + height, radius);
      ctx.arcTo(x + width, y + height, x, y + height, radius);
      ctx.arcTo(x, y + height, x, y, radius);
      ctx.arcTo(x, y, x + width, y, radius);
      ctx.closePath();
    };

    const drawMessageBubble = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      width: number,
      height: number,
      align: "left" | "right",
      color: string
    ) => {
      const radius = 10;
      const bubbleX = align === "right" ? x : x - width;

      ctx.fillStyle = color;
      roundedRect(ctx, bubbleX, y, width, height, radius);
      ctx.fill();

      // Add message lines
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";

      if (height > 50) {
        // Multiple lines
        ctx.fillRect(bubbleX + 10, y + 15, width - 20, 2);
        ctx.fillRect(bubbleX + 10, y + 25, width - 30, 2);
        ctx.fillRect(bubbleX + 10, y + 35, width - 40, 2);
      } else {
        // Single line
        ctx.fillRect(bubbleX + 10, y + height / 2, width - 20, 2);
      }
    };

    animate();

    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  return (
    <div className="w-full aspect-square max-h-[600px] bg-neutral-900/30 rounded-xl border border-neutral-800 overflow-hidden glow-effect">
      <canvas ref={canvasRef} className="w-full h-full" />
      <style jsx global>{`
        .glow-effect {
          position: relative;
        }
        .glow-effect::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: -1;
          box-shadow: 0 0 80px 10px rgba(16, 185, 129, 0.2);
        }
      `}</style>
    </div>
  );
};

export default HeroAnimation;
