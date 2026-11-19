import Section from './Section';

const Contact = () => (
  <>
    <Section id="contact" label="05 — Contact" className="py-24 border-t border-ink">
      <div className="flex flex-col gap-6 max-w-[720px]">
        <p className="m-0 font-serif text-[34px] md:text-[44px] leading-[1.1] tracking-[-0.01em]">
          Got a problem worth untangling? I&apos;d like to hear about it.
        </p>
        <p className="m-0 text-ink-soft">
          Open to roles in AI product, growth and monetization, and payments. Based between the UAE and India, open to
          relocating or working remotely.
        </p>
        <div className="flex flex-wrap gap-x-8 gap-y-3 pt-2">
          <a href="mailto:atibshaikh12@gmail.com" className="link text-lg">atibshaikh12@gmail.com</a>
          <a href="https://www.linkedin.com/in/atibshaikh12/" target="_blank" rel="noopener noreferrer" className="link text-lg">
            LinkedIn
          </a>
          <a href="/resume.pdf" download="Atib_Shaikh_Resume.pdf" className="link text-lg">Resume (PDF)</a>
        </div>
      </div>
    </Section>
  </>
);

export const Footer = () => (
  <footer className="flex flex-wrap justify-between gap-4 py-8 border-t border-rule font-mono text-xs text-muted">
    <span>© {new Date().getFullYear()} Atib Shaikh</span>
    <span>Set in Newsreader and IBM Plex.</span>
  </footer>
);

export default Contact;
