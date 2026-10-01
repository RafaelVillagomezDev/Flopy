import { ControlPlayer } from "./ControlPlayer";
import { PlayerOptions } from "./PlayerOptions";
import { ProgressTrackBar } from "./ProgressTrackBar";

export const PlayerBar: React.FC = () => {
    return (
    <div className="flex items-center justify-between w-full h-full ">
        <ControlPlayer isPlaying={false} onPlayToggle={function (): void {
            throw new Error("Function not implemented.")
        }} />
        <ProgressTrackBar/>
        <PlayerOptions/>
    </div>)
}