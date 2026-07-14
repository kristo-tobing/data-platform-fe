export default function AuthPage({ onLogin }) {
  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">⬢</div>
          <div className="auth-logo-text">Data<span>Platform</span></div>
        </div>
        <div className="auth-hl">Sign in to your account</div>
        <div className="auth-sub">Manage BigQuery pipelines, track deployments, and review data schemas.</div>
        
        <button className="btn-sso" onClick={() => onLogin('k.tobing')}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
          </svg>
          Login with JumpCloud SSO
        </button>
        
        <div className="auth-divider">
          <hr /><span>or sign in with email</span><hr />
        </div>
        
        <div className="auth-fg">
          <label className="auth-label">Email address</label>
          <input type="email" placeholder="you@company.com" defaultValue="k.tobing@company.com" />
        </div>
        <div className="auth-fg">
          <label className="auth-label">Password</label>
          <input type="password" placeholder="••••••••" defaultValue="password123" />
        </div>
        
        <button className="btn-signin" onClick={() => onLogin('k.tobing')}>Sign In</button>
        
        <div className="auth-foot">By signing in, you agree to the internal data policy.</div>
      </div>
    </div>
  );
}
