export default function AuthShell({ children }) {
  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <img src="/images/ceremony.jpg" alt="" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1b15]/85 via-[#0d1b15]/20 to-transparent" />
        <p className="absolute bottom-12 left-12 max-w-sm font-serif text-4xl italic leading-tight text-white">Every great wedding starts with the right people.</p>
      </div>
      <div className="flex items-center justify-center px-4 py-12">{children}</div>
    </div>
  );
}
