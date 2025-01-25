export function ErrorState({ error }: { error: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-red-500">Error: {error}</div>
    </div>
  );
}