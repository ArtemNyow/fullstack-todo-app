import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <section className="not-found-card">
        <span className="not-found-code">404</span>
        <h1>Page not found</h1>
        <p>The page you are looking for does not exist or has moved.</p>
        <Link className="primary-button not-found-link" href="/">
          Go to TaskFlow
        </Link>
      </section>
    </main>
  );
}
