import React from 'react';

interface GameLogProps {
  messages: string[];
}

const GameLog: React.FC<GameLogProps> = ({ messages }) => {
  const endRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="gamelog">
      {messages.map((msg, i) => (
        <p
          key={i}
          className={i === messages.length - 1 ? 'gamelog__line--latest' : 'gamelog__line--old'}
        >
          {msg}
        </p>
      ))}
      <div ref={endRef} />
    </div>
  );
};

export default GameLog;
