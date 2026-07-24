const foundations = [
  "Next.js App Router",
  "TypeScript",
  "Vercel-ready deployment",
  "Health-check API",
  "HighLevel integration scaffold",
  "Client configuration scaffold",
];

export default function Home() {
  return (
    <main className="shell">
      <section className="hero">
        <div className="eyebrow">BRIITELY</div>
        <h1>Dashboard Framework Ready</h1>
        <p>
          The reusable foundation for client dashboards, HighLevel reporting,
          revenue calculations, and embedded widgets.
        </p>
        <div className="status">
          <span className="statusDot" aria-hidden="true" />
          Framework online
        </div>
      </section>

      <section className="card">
        <h2>Foundation included</h2>
        <ul>
          {foundations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <a href="/api/health">Open health endpoint</a>
      </section>
    </main>
  );
}
