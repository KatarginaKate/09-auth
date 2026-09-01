export default function FilterLayout({
  children,
  sidebar,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: "24px",
        minHeight: "100%",
        flex: 1,
      }}
    >
      <aside style={{ width: "240px" }}>
        {sidebar}
      </aside>

      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {children}
      </main>
    </div>
  );
}
