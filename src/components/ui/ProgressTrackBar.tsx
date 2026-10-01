import type React from 'react';

interface ProgressTrackBarProps {
  srcImage?: string;
  trackName?: string;
  currentTrackMinutes?: number;
  trackDurationMinutes?: number;
  onSeek?: (percentage: number) => void;
}

export const ProgressTrackBar: React.FC<ProgressTrackBarProps> = ({
  srcImage,
  trackName = 'Canción desconocida',
  currentTrackMinutes = 0,
  trackDurationMinutes = 0,
  onSeek,
}) => {
  // Cálculo de porcentaje acotado entre 0 y 100
  const progressPercentage =
    trackDurationMinutes > 0
      ? Math.min(100, Math.max(0, (currentTrackMinutes / trackDurationMinutes) * 100))
      : 0;

  // Formato mm:ss para el tiempo
  const formatTime = (timeInSeconds: number) => {
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onSeek) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newPercentage = Math.min(100, Math.max(0, (clickX / rect.width) * 100));
    onSeek(newPercentage);
  };

  return (
    <div className="flex w-full h-full overflow-hidden rounded-2xl  bg-neutral-900 shadow-md">
     
      <div className="w-[120px] flex-shrink-0 bg-neutral-800">
        {srcImage ? (
          <img
            src={srcImage}
            alt={trackName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-neutral-800 text-neutral-600 text-xs">
            Sin carátula
          </div>
        )}
      </div>

      {/*  Div dinámico (resto del ancho) con título y progress bar */}
      <div className="flex-1 flex flex-col justify-center px-4 py-2 min-w-0">
        {/* Título de la pista */}
        <p className="text-white text-sm font-semibold truncate" title={trackName}>
          {trackName}
        </p>

        {/* Contenedor de la barra + tiempos */}
        <div className="mt-3 flex items-center gap-3 w-full">
          <span className="text-[11px] font-mono text-neutral-400 w-8 text-right select-none">
            {formatTime(currentTrackMinutes)}
          </span>

          {/* Riel gris con avance rojo */}
          <div
            onClick={handleBarClick}
            role="progressbar"
            aria-valuenow={Math.round(progressPercentage)}
            aria-valuemin={0}
            aria-valuemax={100}
            className="group relative flex-1 h-3 flex items-center cursor-pointer select-none"
          >
            {/* Riel base gris */}
            <div className="w-full h-1 bg-neutral-700 rounded-full overflow-hidden group-hover:h-1.5 transition-all">
              {/* Relleno rojo con el tiempo actual */}
              <div
                className="h-full bg-red-500 rounded-full transition-[width] duration-150 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            {/* Cabezal / Thumb blanco opcional visible en hover */}
            <div
              className="absolute h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow"
              style={{ left: `${progressPercentage}%` }}
            />
          </div>

          <span className="text-[11px] font-mono text-neutral-400 w-8 select-none">
            {formatTime(trackDurationMinutes)}
          </span>
        </div>
      </div>
    </div>
  );
};