export function LoadingState({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-white">{message}</div>
    </div>
  );
}