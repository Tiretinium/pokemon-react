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
    <div className="bg-gray-900 border-2 border-gray-600 rounded-xl p-3 h-28 overflow-y-auto shadow-inner">
      {messages.map((msg, i) => (
        <p
          key={i}
          className={`text-sm ${i === messages.length - 1 ? 'text-white font-semibold' : 'text-gray-400'}`}
        >
          {msg}
        </p>
      ))}
      <div ref={endRef} />
    </div>
  );
};

export default GameLog;
