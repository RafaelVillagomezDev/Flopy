export const PlayerOptions: React.FC = () => {
  return (
    <div className="flex items-center justify-between w-full h-full px-4 py-2">
      <div className="flex items-center gap-4">
        <button className="bg-neutral-800 text-white hover:bg-neutral-700 rounded-full p-2">
          <span className="sr-only">Shuffle</span>
          {/* Icono de shuffle */}
          shufle
        </button>
        <button className="bg-neutral-800 text-white hover:bg-neutral-700 rounded-full p-2">
          <span className="sr-only">Repeat</span>
          {/* Icono de repeat */}
          repe
        </button>
      </div>
      <div className="flex items-center gap-4">
        <button className="bg-neutral-800 text-white hover:bg-neutral-700 rounded-full p-2">
          <span className="sr-only">Volume</span>
          {/* Icono de volumen */}
          volumen
        </button>
        <button className="bg-neutral-800 text-white hover:bg-neutral-700 rounded-full p-2">
          <span className="sr-only">Settings</span>
          {/* Icono de configuración */}
          options
        </button>
      </div>
    </div>
  );
};