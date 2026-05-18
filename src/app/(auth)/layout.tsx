export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-brand-50/30 px-4 pt-20">
      <div className="w-full max-w-md animate-fade-in-up">{children}</div>
    </div>
  );
}
