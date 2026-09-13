export default function Skeleton() {
  return (
    <div className="max-w-3xl mx-auto p-4 flex flex-col gap-4 animate-pulse" aria-busy="true" aria-label="Loading your character">
      <div className="pixel-border bg-dungeon-panel h-32" />
      <div className="pixel-border bg-dungeon-panel h-20" />
      <div className="pixel-border bg-dungeon-panel h-20" />
      <div className="pixel-border bg-dungeon-panel h-20" />
    </div>
  )
}
