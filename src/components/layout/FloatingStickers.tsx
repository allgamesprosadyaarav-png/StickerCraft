export function FloatingStickers() {
  const stickers = [
    { emoji: '⭐', delay: '0s', duration: '6s', top: '10%', left: '10%' },
    { emoji: '💖', delay: '2s', duration: '8s', top: '20%', left: '80%' },
    { emoji: '🌈', delay: '1s', duration: '7s', top: '40%', left: '15%' },
    { emoji: '✨', delay: '3s', duration: '6s', top: '60%', left: '85%' },
    { emoji: '🎨', delay: '0.5s', duration: '8s', top: '80%', left: '20%' },
    { emoji: '🦄', delay: '2.5s', duration: '7s', top: '30%', left: '70%' },
    { emoji: '🌸', delay: '1.5s', duration: '6s', top: '70%', left: '60%' },
    { emoji: '🍭', delay: '3.5s', duration: '8s', top: '50%', left: '40%' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {stickers.map((sticker, index) => (
        <div
          key={index}
          className="absolute text-4xl opacity-20"
          style={{
            top: sticker.top,
            left: sticker.left,
            animation: `float ${sticker.duration} ease-in-out ${sticker.delay} infinite`,
          }}
        >
          {sticker.emoji}
        </div>
      ))}
    </div>
  );
}
