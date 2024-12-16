import React, { KeyboardEvent } from 'react';

interface TerminalInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  type?: string;
}

export const TerminalInput: React.FC<TerminalInputProps> = ({
  label,
  value,
  onChange,
  onSubmit,
  type = 'text'
}) => {
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSubmit) {
      onSubmit();
    }
  };

  return (
    <div className="mb-2">
      <label className="block text-xs mb-1">
        <span className="text-terminal-green">{label}</span>
        <span className="animate-blink ml-1">_</span>
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        className="w-full bg-terminal-black border border-terminal-green p-1 text-terminal-green focus:outline-none focus:border-terminal-magenta text-sm"
      />
    </div>
  );
};