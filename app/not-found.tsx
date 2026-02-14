export default function NotFound() {
  return (
    <main style={{ padding: 24, maxWidth: 720, margin: "0 auto" }}>
      <h1>This product is still in development</h1>
      <p>
        The page you tried to open doesn’t exist yet — we’re still building this product listing.
      </p>
      <ul>
        <li><a href="/products">Back to the catalog</a></li>
        <li><a href="/contact">Request a print / ask a question</a></li>
      </ul>
    </main>
  );
}
