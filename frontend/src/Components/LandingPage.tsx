import {
    ArrowRight,
    Cloud,
    FileCheck,
    LockKeyhole,
    ShieldCheck,
    Upload,
    Zap,
  } from "lucide-react";
  
import "./LandingPage.css";

  interface LandingPageProps {
    onLogin: () => void;
    onSignup: () => void;
  }
  
  export function LandingPage({
    onLogin,
    onSignup,
  }: LandingPageProps) {
    return (
      <main className="landing-page">
  
        {/* ================= NAVBAR ================= */}
  
        <nav className="landing-nav">
          <div className="landing-logo">
            <div className="landing-logo-icon">
              <Cloud size={18} />
            </div>
  
            <span>lumen</span>
          </div>
  
          <div className="landing-nav-actions">
            <button
              type="button"
              className="landing-login"
              onClick={onLogin}
            >
              Log in
            </button>
  
            <button
              type="button"
              className="landing-nav-cta"
              onClick={onSignup}
            >
              Get started
              <ArrowRight size={16} />
            </button>
          </div>
        </nav>
  
  
        {/* ================= HERO ================= */}
  
        <section className="landing-hero">
  
          <div className="hero-background-orb hero-orb-one" />
          <div className="hero-background-orb hero-orb-two" />
  
          <div className="hero-content">
  
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              Secure distributed file storage
            </div>
  
            <h1>
              Your files.
              <br />
  
              <span>Securely stored.</span>
            </h1>
  
            <p className="hero-description">
              Store, manage and access your files from one secure
              workspace. Built with distributed cloud storage
              architecture for reliability and control.
            </p>
  
            <div className="hero-actions">
  
              <button
                type="button"
                className="hero-primary-button"
                onClick={onSignup}
              >
                Get started for free
                <ArrowRight size={18} />
              </button>
  
              <button
                type="button"
                className="hero-secondary-button"
                onClick={onLogin}
              >
                Log in
              </button>
  
            </div>
  
            <div className="hero-trust">
  
              <div>
                <ShieldCheck size={16} />
                Secure access
              </div>
  
              <div>
                <LockKeyhole size={16} />
                Private files
              </div>
  
              <div>
                <Zap size={16} />
                Fast uploads
              </div>
  
            </div>
  
          </div>
  
  
          {/* ================= STORAGE PREVIEW ================= */}
  
          <div className="storage-preview">
  
            <div className="storage-preview-glow" />
  
            <div className="storage-window">
  
              <div className="storage-window-header">
  
                <div className="window-dots">
                  <span />
                  <span />
                  <span />
                </div>
  
                <div className="storage-window-title">
                  My workspace
                </div>
  
                <div className="storage-status">
                  <span />
                  Secure
                </div>
  
              </div>
  
  
              <div className="storage-window-body">
  
                <div className="storage-sidebar">
  
                  <div className="sidebar-active">
                    <Cloud size={16} />
                    My files
                  </div>
  
                  <div>
                    <Upload size={16} />
                    Uploads
                  </div>
  
                  <div>
                    <ShieldCheck size={16} />
                    Security
                  </div>
  
                </div>
  
  
                <div className="file-area">
  
                  <div className="file-area-heading">
                    <div>
                      <p>My files</p>
                      <span>3 files · 24.8 MB</span>
                    </div>
  
                    <button type="button">
                      <Upload size={15} />
                      Upload
                    </button>
                  </div>
  
  
                  <div className="file-list">
  
                    <div className="file-item">
  
                      <div className="file-icon pdf">
                        <FileCheck size={19} />
                      </div>
  
                      <div className="file-info">
                        <strong>project-report.pdf</strong>
                        <span>8.4 MB · PDF</span>
                      </div>
  
                      <div className="file-secure">
                        <LockKeyhole size={14} />
                      </div>
  
                    </div>
  
  
                    <div className="file-item">
  
                      <div className="file-icon spreadsheet">
                        <FileCheck size={19} />
                      </div>
  
                      <div className="file-info">
                        <strong>analytics.xlsx</strong>
                        <span>4.2 MB · Spreadsheet</span>
                      </div>
  
                      <div className="file-secure">
                        <LockKeyhole size={14} />
                      </div>
  
                    </div>
  
  
                    <div className="file-item">
  
                      <div className="file-icon image">
                        <FileCheck size={19} />
                      </div>
  
                      <div className="file-info">
                        <strong>presentation.png</strong>
                        <span>12.2 MB · Image</span>
                      </div>
  
                      <div className="file-secure">
                        <LockKeyhole size={14} />
                      </div>
  
                    </div>
  
                  </div>
  
                </div>
  
              </div>
  
            </div>
  
          </div>
  
        </section>
  
  
        {/* ================= FEATURES ================= */}
  
        <section className="features-section">
  
          <div className="section-heading">
  
            <span>WHY LUMEN</span>
  
            <h2>
              Everything you need to manage
              <br />
              your files.
            </h2>
  
            <p>
              Simple on the surface. Powerful underneath.
            </p>
  
          </div>
  
  
          <div className="features-grid">
  
            <FeatureCard
              icon={<ShieldCheck />}
              title="Secure by design"
              description="Every file belongs to its authenticated owner, keeping private data isolated between users."
            />
  
            <FeatureCard
              icon={<Upload />}
              title="Direct uploads"
              description="Upload files directly to cloud storage using secure presigned URLs without routing the file through your application server."
            />
  
            <FeatureCard
              icon={<Zap />}
              title="Fast and reliable"
              description="Cloud-backed storage gives your files reliable availability while keeping the application lightweight."
            />
  
          </div>
  
        </section>
  
  
        {/* ================= ARCHITECTURE ================= */}
  
        <section className="architecture-section">
  
          <div className="architecture-copy">
  
            <span>BUILT DIFFERENTLY</span>
  
            <h2>
              Your application handles
              <br />
              the workflow.
            </h2>
  
            <p>
              Files are stored independently from your application
              server. Authentication, metadata and cloud storage
              work together to give you a clean and scalable
              architecture.
            </p>
  
            <button
              type="button"
              className="architecture-button"
              onClick={onSignup}
            >
              Create your workspace
              <ArrowRight size={17} />
            </button>
  
          </div>
  
  
          <div className="architecture-diagram">
  
            <ArchitectureNode
              icon={<LockKeyhole />}
              title="Your account"
              subtitle="Authenticated access"
            />
  
            <div className="architecture-line">
              <span />
              <span />
            </div>
  
            <ArchitectureNode
              icon={<FileCheck />}
              title="File metadata"
              subtitle="DynamoDB"
            />
  
            <div className="architecture-line">
              <span />
              <span />
            </div>
  
            <ArchitectureNode
              icon={<Cloud />}
              title="File storage"
              subtitle="Amazon S3"
            />
  
          </div>
  
        </section>
  
  
        {/* ================= CTA ================= */}
  
        <section className="final-cta">
  
          <div className="final-cta-glow" />
  
          <div className="final-cta-content">
  
            <span>READY WHEN YOU ARE</span>
  
            <h2>
              Give your files
              <br />
              a better home.
            </h2>
  
            <p>
              Create your workspace and start securely storing
              your files today.
            </p>
  
            <button
              type="button"
              className="final-cta-button"
              onClick={onSignup}
            >
              Get started
              <ArrowRight size={18} />
            </button>
  
          </div>
  
        </section>
  
  
        {/* ================= FOOTER ================= */}
  
        <footer className="landing-footer">
  
          <div className="landing-logo">
  
            <div className="landing-logo-icon">
              <Cloud size={16} />
            </div>
  
            <span>lumen</span>
  
          </div>
  
          <p>
            Secure distributed file storage.
          </p>
  
          <span>
            © 2026 Lumen
          </span>
  
        </footer>
  
      </main>
    );
  }
  
  
  /* ================= FEATURE CARD ================= */
  
  function FeatureCard({
    icon,
    title,
    description,
  }: {
    icon: React.ReactNode;
    title: string;
    description: string;
  }) {
    return (
      <div className="feature-card">
  
        <div className="feature-icon">
          {icon}
        </div>
  
        <h3>{title}</h3>
  
        <p>{description}</p>
  
        <div className="feature-arrow">
          <ArrowRight size={16} />
        </div>
  
      </div>
    );
  }
  
  
  /* ================= ARCHITECTURE NODE ================= */
  
  function ArchitectureNode({
    icon,
    title,
    subtitle,
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
  }) {
    return (
      <div className="architecture-node">
  
        <div className="architecture-node-icon">
          {icon}
        </div>
  
        <div>
          <strong>{title}</strong>
          <span>{subtitle}</span>
        </div>
  
      </div>
    );
  }