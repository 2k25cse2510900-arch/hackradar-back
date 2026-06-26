export function Divider() {
  return (
    <div className="flex items-center gap-4 py-2">
      <div className="h-px flex-1 bg-border" />
      <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
        Or continue with email
      </span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}
