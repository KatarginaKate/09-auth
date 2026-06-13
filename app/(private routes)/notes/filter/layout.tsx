export default function FilterLayout({
  children,
  sidebar,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", gap: "24px" }}>
      <aside style={{ width: "240px" }}>
        {sidebar}
      </aside>

      <main style={{ flexGrow: 1 }}>
        {children}
      </main>
    </div>
  );
}
