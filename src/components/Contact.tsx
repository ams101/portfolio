const Contact = () => (
  <section id="contact" aria-labelledby="contact-heading" className="scroll-mt-24 py-20 md:py-24 border-t border-ink">
    <div className="flex flex-col gap-6 max-w-[720px]">
      <h2
        id="contact-heading"
        className="m-0 font-display font-medium text-[32px] md:text-[44px] leading-[1.05] tracking-[-0.02em] [text-wrap:balance]"
      >
        Open to AI product, growth, monetization and payments roles
      </h2>
      <p className="m-0 text-ink-soft">
        Based between the UAE and India, open to relocating or working remotely.
      </p>
      <div className="flex flex-wrap gap-x-8 gap-y-3 pt-2">
        <a href="mailto:atibshaikh12@gmail.com" className="link text-lg">atibshaikh12@gmail.com</a>
        <a href="https://www.linkedin.com/in/atibshaikh12/" target="_blank" rel="noopener noreferrer" className="link text-lg">
          LinkedIn
        </a>
        <a href="/resume.pdf" download="Atib_Shaikh_Resume.pdf" className="link text-lg">Resume (PDF)</a>
      </div>
    </div>
  </section>
);

export const Footer = () => (
  <footer className="flex flex-wrap justify-between gap-4 py-8 border-t border-rule text-[13px] text-muted">
    <span>© {new Date().getFullYear()} Atib Shaikh</span>
    <a href="#/" className="text-muted no-underline hover:text-ink transition-colors">Back to top</a>
  </footer>
);

export default Contact;
