import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <div className="card">
        <h1>AI Resume Editor</h1>
        <p className="muted">
          Upload your CV, get ATS score, apply AI suggestions line-by-line, and watch score updates live.
        </p>
        <div className="row">
          <Link href="/auth/signup"><button>Sign up</button></Link>
          <Link href="/auth/login"><button className="secondary">Login</button></Link>
        </div>
      </div>
    </main>
  );
}
