export const VolumenBar: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <input
        type="range"
        min="0"
        max="100"
        defaultValue="50"
        className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer
          bg-brand-red
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:h-3.5
          [&::-webkit-slider-thumb]:w-3.5
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-brand-red
          [&::-moz-range-thumb]:h-3.5
          [&::-moz-range-thumb]:w-3.5
          [&::-moz-range-thumb]:border-none
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:bg-brand-red"
      />
    </div>
  );
};