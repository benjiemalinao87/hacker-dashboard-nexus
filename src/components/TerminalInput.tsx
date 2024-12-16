import React from 'react';

interface TerminalInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}

export const TerminalInput: React.FC<TerminalInputProps> = ({
  label,
  value,
  onChange,
  type = 'text'
}) => {
  return (
    <div className="mb-4">
      <label className="block mb-2">
        <span className="text-terminal-green">{'>'} {label}:</span>
        <span className="animate-blink ml-1">_</span>
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-terminal-black border border-terminal-green p-2 text-terminal-green focus:outline-none focus:border-terminal-magenta"
      />
    </div>
  );
};