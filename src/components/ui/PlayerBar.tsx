import { ControlPlayer } from "./ControlPlayer";

export const PlayerBar: React.FC = () => {
    return (
    <div className="flex items-center justify-between">
        <ControlPlayer isPlaying={false} onPlayToggle={function (): void {
            throw new Error("Function not implemented.")
        }} />
    </div>)
}