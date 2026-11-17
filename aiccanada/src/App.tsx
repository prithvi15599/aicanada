import { FormEvent, useEffect, useState } from 'react';
import { getRegistrationStatus, RegistrationPayload, RegistrationStatus, submitRegistration } from './registration';
import { canadaOutline } from './canadaPath';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About AIC', href: '/about' },
  { label: 'The Challenge', href: '/challenge' },
  { label: 'Timeline', href: '/timeline' },
  { label: 'Prizes', href: '/prizes' },
  { label: 'FAQ', href: '/faq' }
];

const processSteps = [
  { number: '01', title: 'Form a team', body: 'Bring together 2–4 students with different ways of thinking.' },
  { number: '02', title: 'Register', body: 'Tell us who is on your team and where you are learning.' },
  { number: '03', title: 'Develop a solution', body: 'Work through an assigned real-world challenge with intent.' },
  { number: '04', title: 'Submit', body: 'Turn your thinking into a clear report, prototype or presentation.' },
  { number: '05', title: 'Finalist presentations', body: 'Selected teams make the case for their solution to judges.' },
  { number: '06', title: 'Awards', body: 'Celebrate the teams whose ideas moved the conversation forward.' }
];

const timelineItems = [
  { label: 'Registration', date: 'Until April 10', note: 'Organizer-provided deadline', accent: 'cobalt' },
  { label: 'Challenge session', date: 'May 1', note: 'Virtual competition day', accent: 'coral' },
  { label: 'Submission deadline', date: 'Tentative', note: 'Organizer submission deadline to be announced', accent: 'ink' },
  { label: 'Judging', date: 'Tentative', note: 'Judging period to be announced', accent: 'ink' },
  { label: 'Finalist presentations', date: 'Tentative', note: 'Selected teams present to judges', accent: 'cobalt' },
  { label: 'Awards', date: 'Tentative', note: 'Recognition details to be announced', accent: 'coral' }
];

const faqs = [
  ['Who can participate?', 'Any eligible student in Grades 9–12 can participate with their teammates. AIC is virtual and open across every Canadian province and territory.'],
  ['Is AIC open across Canada?', 'Yes. AIC is a virtual competition for eligible students across Canada, including every province and territory.'],
  ['Can students from different schools form a team?', 'Yes. Students from different schools can form a team together.'],
  ['Is the competition virtual?', 'Yes. AIC is designed to be completed virtually.'],
  ['How do I register?', 'Register online through the AIC registration portal. The form asks for a designated team contact and basic team details.'],
  ['How many students can be on a team?', 'Teams are made up of 2–4 students.'],
  ['What happens after registration?', 'Teams attend the session, with 6 hours to design, 2 hours of mentorship and a 1-hour break.'],
  ['How are submissions judged?', 'The judging rubric will be provided closer to the competition date.'],
  ['Are there prizes?', 'A Certificate of Participation is planned for all team members. Recognition details for finalist and winning teams will be announced as the inaugural competition is finalized.'],
  ['Can I participate without prior coding or AI experience?', 'Of course. AIC rewards thoughtful problem solving, collaboration and clear communication—not only technical experience.']
] as const;

type PagePath = '/' | '/about' | '/challenge' | '/timeline' | '/prizes' | '/faq' | '/register';

function currentPath(): PagePath {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  return (['/', '/about', '/challenge', '/timeline', '/prizes', '/faq', '/register'] as string[]).includes(path) ? path as PagePath : '/';
}

export default function App() {
  const [path, setPath] = useState<PagePath>(currentPath());
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onPopState = () => setPath(currentPath());
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('popstate', onPopState);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    setMenuOpen(false);
    const title = path === '/' ? 'Applied Intelligence Challenge | Think beyond the classroom' : `${navItems.find(item => item.href === path)?.label || 'Register'} | Applied Intelligence Challenge`;
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', path === '/register'
      ? 'Register your Grade 9–12 team for the virtual Applied Intelligence Challenge across Canada.'
      : 'The Applied Intelligence Challenge is a virtual Canada-wide competition for Grades 9–12 teams solving real-world problems through technology, mathematics, engineering and business.');
  }, [path]);

  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>('.reveal');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      nodes.forEach(node => node.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('is-visible')), { threshold: 0.12 });
    nodes.forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, [path]);

  const navigate = (href: string) => {
    if (href.startsWith('#')) {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    window.history.pushState({}, '', href);
    setPath(currentPath());
  };

  return <div className="site-shell">
    <Header path={path} scrolled={scrolled} menuOpen={menuOpen} setMenuOpen={setMenuOpen} navigate={navigate} />
    <main>
      {path === '/' && <Home navigate={navigate} />}
      {path === '/about' && <About navigate={navigate} />}
      {path === '/challenge' && <Challenge navigate={navigate} />}
      {path === '/timeline' && <TimelinePage navigate={navigate} />}
      {path === '/prizes' && <Prizes navigate={navigate} />}
      {path === '/faq' && <FAQPage navigate={navigate} />}
      {path === '/register' && <RegisterPage navigate={navigate} />}
    </main>
    <Footer navigate={navigate} />
  </div>;
}

function Header({ path, scrolled, menuOpen, setMenuOpen, navigate }: { path: PagePath; scrolled: boolean; menuOpen: boolean; setMenuOpen: (value: boolean) => void; navigate: (href: string) => void }) {
  return <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
    <div className="header-inner">
      <button className="brand" onClick={() => navigate('/')} aria-label="AIC home">
        <span className="brand-mark" aria-hidden="true"><span /><span /><i /></span>
        <span><strong>AIC</strong><small>Applied Intelligence Challenge</small></span>
      </button>
      <button className={`menu-toggle ${menuOpen ? 'is-open' : ''}`} aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span /></button>
      <nav className={`primary-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
        {navItems.map(item => <a key={item.href} href={item.href} className={path === item.href ? 'is-active' : ''} onClick={(event) => { event.preventDefault(); navigate(item.href); }}>{item.label}</a>)}
        <a href="/register" className="nav-register" onClick={(event) => { event.preventDefault(); navigate('/register'); }}>Register <Arrow /></a>
      </nav>
    </div>
  </header>;
}

function Home({ navigate }: { navigate: (href: string) => void }) {
  return <>
    <section className="hero section-dark">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-inner container">
        <div className="hero-copy reveal">
          <p className="eyebrow light"><span className="eyebrow-dot" />Open to Canadian high school students · Grades 9–12</p>
          <div className="announcement-pill reveal"><span>Registration open now</span></div>
          <h1>Think Beyond<br /><em>the Classroom.</em><br />Solve What’s Next.</h1>
          <p className="hero-lede">The Applied Intelligence Challenge brings together high school students across Canada to solve real-world problems through artificial intelligence, mathematics, computer science, engineering and business.</p>
          <div className="hero-actions">
            <Button onClick={() => navigate('/register')}>Register Now <Arrow /></Button>
            <Button variant="text-light" onClick={() => navigate('/about')}>How It Works <Arrow /></Button>
          </div>
        </div>
        <HeroVisual navigate={navigate} />
      </div>
      <div className="hero-bottom container"><span>Canada → next</span><span className="scroll-note">Scroll to explore <i /></span></div>
    </section>

    <section className="signal-strip"><div className="container signal-inner"><span>AI</span><span>Mathematics</span><span>Computer science</span><span>Engineering</span><span>Business</span></div></section>

    <section className="section section-paper intro-section" id="about">
      <div className="container split-intro">
        <div className="intro-aside">
          <div className="section-kicker reveal"><span>01</span><span>About AIC</span></div>
          <QuestionMarkVisual />
        </div>
        <div className="intro-copy reveal">
          <h2>Start with the question you cannot stop thinking about.</h2>
          <p>AIC gives high school students a platform to take classroom knowledge into the real world. Teams collaborate, develop ideas, work through a challenge and present their solution to judges.</p>
          <p>It is not about having the perfect answer on day one. It is about making the next thoughtful move—and showing your work.</p>
          <a className="inline-link" href="/about" onClick={(event) => { event.preventDefault(); navigate('/about'); }}>Read the AIC story <Arrow /></a>
        </div>
      </div>
    </section>

    <section className="section section-paper benefits-section">
      <div className="container">
        <div className="section-heading centered reveal">
          <p className="eyebrow">Why participate</p>
          <h2>Make your thinking visible to others.</h2>
        </div>
        <div className="benefit-layout">
          <div className="benefit-feature reveal">
            <span className="big-index">01</span>
            <h3>Apply what you learn to what matters.</h3>
            <p>Move beyond exercises with a real-world problem that asks for research, judgement and a solution people can understand.</p>
            <div className="benefit-rule" />
          </div>
          <div className="benefit-list reveal">
            <Benefit number="02" title="Think critically" body="Learn to frame a problem before you rush to solve it." />
            <Benefit number="03" title="Build together" body="Collaboration is part of the method—not just the final slide." />
            <Benefit number="04" title="Present with purpose" body="Practice making a clear case for your team’s idea to industry professionals." />
            <Benefit number="05" title="Learn from experienced judges" body="Receive feedback from people who have seen ideas move from first draft to real work." />
            <Benefit number="06" title="Meet the real world" body="Connect your thinking to innovation, technology and entrepreneurship." />
          </div>
        </div>
      </div>
    </section>

    <section className="section section-ink eligibility-section">
      <div className="container eligibility-grid">
        <div className="eligibility-copy reveal">
          <p className="eyebrow light">Who can participate</p>
          <h2>One country.<br />Many ways<br />to make your mark.</h2>
          <p>Any eligible student in Grades 9–12 can participate with their teammates. AIC is virtual and open across every Canadian province and territory.</p>
          <div className="registration-badges">
            <span className="status-badge">Registration open now</span>
            <button className="ghost-button" onClick={() => navigate('/register')}>Check your eligibility <Arrow /></button>
          </div>
        </div>
        <div className="map-panel reveal" aria-label="Abstract map of Canada made from connected points">
          <div className="map-image-wrap">
            <MapGrid />
          </div>
          <div className="promo-visual">
            <img src="https://kommodo.ai/i/RQdgKnOi34zvcZ2YHjz2" alt="AIC registration graphic" />
          </div>
        </div>
      </div>
    </section>

    <ProcessSection navigate={navigate} />
    <TimelinePreview navigate={navigate} />
    <PrizesPreview navigate={navigate} />
    <CtaBand navigate={navigate} />
  </>;
}

function About({ navigate }: { navigate: (href: string) => void }) {
  return <><PageHero number="02" eyebrow="About AIC" title={<>Make school<br /><em>matter</em> outside it.</>} lede="AIC is a national stage for high school students who want to connect knowledge with the world around them." visual="about" />
    <section className="section section-paper"><div className="container narrative-grid"><div className="section-kicker reveal"><span>Why AIC exists</span><span>01 / 03</span></div><div className="narrative-copy reveal"><p>The world is full of problems that do not fit neatly into one subject. They ask for numbers and stories, systems and empathy, prototypes and business cases.</p><p>AIC brings those ways of thinking into one virtual competition. Teams receive the real-world challenge on competition day, get a focused window to work, and have a stage to explain what they built and why it matters.</p><p>It is the kind of work that rewards curiosity before certainty—and collaboration over performance.</p></div></div></section>
  </>;
}

function Challenge({ navigate }: { navigate: (href: string) => void }) {
  return <><PageHero number="03" eyebrow="The Challenge" title={<>We bring the problem.<br /><em>You bring the team.</em></>} lede="AIC gives every team the same real-world problem on competition day, then brings together artificial intelligence, mathematics, computer science, engineering and business for one applied problem-solving sprint." visual="challenge" />
    <section className="section section-paper"><div className="container"><div className="discipline-grid reveal"><Discipline index="01" title="Artificial intelligence" copy="Look for patterns, make responsible predictions and question the data." /><Discipline index="02" title="Mathematics" copy="Use models, logic and quantitative reasoning to understand trade-offs." /><Discipline index="03" title="Computer science" copy="Design systems and prototypes that make an idea tangible." /><Discipline index="04" title="Engineering" copy="Work within constraints and turn a concept into something workable." /><Discipline index="05" title="Business" copy="Ask who it serves, how it could scale and what success means." /></div></div></section>
  </>;
}

function TimelinePage({ navigate }: { navigate: (href: string) => void }) {
  return <><PageHero number="04" eyebrow="Timeline" title={<>A clear path<br /><em>from spark to stage.</em></>} lede="The dates below separate organizer-provided information from details that are still being finalized." visual="timeline" />
    <section className="section section-paper"><div className="container timeline-page"><div className="timeline-callout reveal"><span className="status-dot" /> <strong>Tentative schedule</strong><span>Items marked tentative will be confirmed by the organizers.</span></div><div className="timeline-list">{timelineItems.map((item, index) => <TimelineItem key={item.label} item={item} index={index} />)}</div></div></section>
  </>;
}

function Prizes({ navigate }: { navigate: (href: string) => void }) {
  return <><PageHero number="05" eyebrow="Prizes & recognition" title={<>A certificate can<br /><em>carry a story.</em></>} lede="The inaugural AIC recognizes the teams who make thoughtful, ambitious work—and makes it clear to others." visual="prizes" />
    <section className="section section-paper"><div className="container prize-wrap"><div className="certificate-card reveal"><div className="certificate-top"><span>AIC / 2025</span><span>Inaugural year</span></div><div className="certificate-mark"><span className="brand-mark" aria-hidden="true"><span /><span /><i /></span></div><p className="eyebrow">Certificate of Participation</p><h2>For showing your work.</h2><div className="certificate-line" /></div><div className="prize-list reveal"><PrizeRow index="01" title="First place" note="Recognition details to be announced" /><PrizeRow index="02" title="Second place" note="Recognition details to be announced" /><PrizeRow index="03" title="Third place" note="Recognition details to be announced" /><PrizeRow index="04" title="Special recognition" note="For a contribution worth calling out" /></div></div></section>
  </>;
}

function FAQPage({ navigate }: { navigate: (href: string) => void }) {
  return <><PageHero number="06" eyebrow="Frequently asked" title={<>Start with the<br /><em>questions.</em></>} lede="AIC is new. Here is what we can say clearly now—and what we will confirm later." visual="faq" />
    <section className="section section-paper"><div className="container faq-page"><div className="faq-index reveal"><p className="eyebrow">Index / 10 answers</p><h2>Everything you need to find your footing.</h2><p>Still unsure? The registration form is built for the designated team contact, not a perfect plan.</p><a className="inline-link" href="/register" onClick={(event) => { event.preventDefault(); navigate('/register'); }}>Go to registration <Arrow /></a></div><FAQList /></div></section>
  </>;
}

function RegisterPage({ navigate }: { navigate: (href: string) => void }) {
  return <><PageHero number="07" eyebrow="Register your team" title={<>Your AIC journey<br /><em>starts here.</em></>} lede="Ready to challenge yourself? Register your team for the Applied Intelligence Challenge and join students from across Canada." visual="register" />
    <section className="section section-paper"><div className="container registration-layout"><div className="register-side reveal"><p className="eyebrow">Before you begin</p><div className="register-facts"><Fact label="Who" value="Grades 9–12" /><Fact label="Where" value="Across Canada" /><Fact label="Format" value="Virtual competition" /><Fact label="Competition" value="May 1st" /><Fact label="Register by" value="April 10th" /></div><div className="privacy-note"><span className="lock-icon">✦</span><div><strong>Private by design.</strong><p>We only ask for the information needed to organize the competition. Your details are used for AIC registration and coordination.</p></div></div></div><RegistrationForm /></div></section>
  </>;
}

function RegistrationForm() {
  const initial: RegistrationPayload = { fullName: '', email: '', phone: '', school: '', grade: '', teamName: '', teamSize: '', additionalInfo: '', website: '' };
  const [form, setForm] = useState<RegistrationPayload>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<RegistrationStatus>('idle');
  const [setup, setSetup] = useState<'checking' | 'ready' | 'not-ready' | 'unknown'>('checking');

  useEffect(() => {
    getRegistrationStatus().then(result => setSetup(result.configured ? 'ready' : 'not-ready')).catch(() => setSetup('unknown'));
  }, []);

  const setField = (field: keyof RegistrationPayload, value: string) => {
    setForm(current => ({ ...current, [field]: value }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.fullName.trim()) next.fullName = 'Enter the designated team contact’s full name.';
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = 'Enter a valid email address.';
    if (!form.school.trim()) next.school = 'Enter your school.';
    if (!form.grade) next.grade = 'Choose a grade from 9 to 12.';
    if (!form.teamName.trim()) next.teamName = 'Enter your team name.';
    if (!form.teamSize) next.teamSize = 'Choose a team size from 2 to 4.';
    return next;
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (status === 'submitting') return;
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length || setup !== 'ready') return;
    setStatus('submitting');
    try {
      await submitRegistration(form);
      setStatus('success');
    } catch (error) {
      setStatus('error');
      setErrors({ form: (error as Error).message });
    }
  };

  if (status === 'success') {
    return <div className="registration-card reveal is-visible success-card"><div className="success-seal">✓</div><p className="eyebrow">Registration received</p><h2>You’re registered!</h2><p>Your AIC registration has been successfully received. Thank you for joining the Applied Intelligence Challenge.</p></div>;
  }

  return <form className="registration-card reveal is-visible" onSubmit={onSubmit} noValidate>
    <div className="form-card-head"><div><p className="eyebrow">Team contact</p><h2>Tell us how to reach you.</h2></div><span className="required-note">* Required</span></div>
    {setup !== 'ready' && <div className={`setup-alert ${setup === 'unknown' ? 'warning' : ''}`} role="status"><span className="alert-symbol">i</span><div><strong>{setup === 'checking' ? 'Checking registration setup…' : 'Registration is in setup mode.'}</strong><p>{setup === 'checking' ? 'We are checking whether the organizer’s secure registration connection is ready.' : 'The organizer has not connected the secure Google Sheets registration system yet. Your information will not be submitted until it is connected.'}</p></div></div>}
    {errors.form && <div className="form-error" role="alert">{errors.form}</div>}
    <div className="form-grid">
      <FormField label="Full name" required error={errors.fullName}><input value={form.fullName} onChange={event => setField('fullName', event.target.value)} placeholder="Your full name" autoComplete="name" aria-invalid={Boolean(errors.fullName)} /></FormField>
      <FormField label="Email address" required error={errors.email}><input type="email" value={form.email} onChange={event => setField('email', event.target.value)} placeholder="you@example.com" autoComplete="email" aria-invalid={Boolean(errors.email)} /></FormField>
      <FormField label="Phone" hint="Optional" error={errors.phone}><input value={form.phone} onChange={event => setField('phone', event.target.value)} placeholder="A number we can use if needed" autoComplete="tel" aria-invalid={Boolean(errors.phone)} /></FormField>
      <FormField label="School" required error={errors.school}><input value={form.school} onChange={event => setField('school', event.target.value)} placeholder="Your high school" autoComplete="organization" aria-invalid={Boolean(errors.school)} /></FormField>
      <FormField label="Grade" required error={errors.grade}><select value={form.grade} onChange={event => setField('grade', event.target.value)} aria-invalid={Boolean(errors.grade)}><option value="">Select your grade</option><option value="Grade 9">Grade 9</option><option value="Grade 10">Grade 10</option><option value="Grade 11">Grade 11</option><option value="Grade 12">Grade 12</option></select></FormField>
      <FormField label="Number of team members" required error={errors.teamSize}><select value={form.teamSize} onChange={event => setField('teamSize', event.target.value)} aria-invalid={Boolean(errors.teamSize)}><option value="">Choose team size</option><option value="2">2 students</option><option value="3">3 students</option><option value="4">4 students</option></select></FormField>
      <FormField label="Team name" required error={errors.teamName} wide><input value={form.teamName} onChange={event => setField('teamName', event.target.value)} placeholder="Give your team a name" aria-invalid={Boolean(errors.teamName)} /></FormField>
      <FormField label="Additional information" hint="Optional" error={errors.additionalInfo} wide><textarea value={form.additionalInfo} onChange={event => setField('additionalInfo', event.target.value)} placeholder="Anything the organizers should know?" rows={4} /></FormField>
    </div>
    <label className="honeypot" aria-hidden="true">Leave this field empty<input tabIndex={-1} autoComplete="off" value={form.website} onChange={event => setField('website', event.target.value)} /></label>
    <div className="form-footer"><p>By registering, you agree that AIC may use these details to coordinate your team’s participation. We do not ask for unnecessary personal information.</p><button className="button button-primary submit-button" disabled={status === 'submitting' || setup !== 'ready'}>{status === 'submitting' ? 'Sending…' : setup === 'ready' ? 'Submit registration' : 'Awaiting secure connection'} <Arrow /></button></div>
  </form>;
}

function ProcessSection({ navigate }: { navigate: (href: string) => void }) {
  const [selected, setSelected] = useState(0);
  const step = processSteps[selected];
  return <section className="section section-paper process-section"><div className="container"><div className="process-head"><div className="section-heading reveal"><p className="eyebrow">How it works</p><h2>Start with the prompt.<br />Leave with a case.</h2></div><div className="process-note reveal"><span>02–06</span><p>One challenge, given on competition day. Six connected moves. Select a stage to see what happens next.</p></div></div><div className="process-rail">{processSteps.map((item, index) => <button key={item.number} className={`process-step reveal ${selected === index ? 'is-selected' : ''}`} onClick={() => setSelected(index)} aria-pressed={selected === index}><span className="process-number">{item.number}</span><span className="process-line" style={{ ['--step-delay' as any]: `${index * 90}ms` }} /><h3>{item.title}</h3><p>{item.body}</p></button>)}</div><div className="process-detail reveal is-visible" aria-live="polite"><span>{step.number} / AIC method</span><strong>{step.title}</strong><p>{step.body}</p></div></div></section>;
}

function TimelinePreview({ navigate }: { navigate: (href: string) => void }) {
  return <section className="section section-sand timeline-preview"><div className="container"><div className="timeline-head"><div className="section-heading reveal"><p className="eyebrow">The road ahead</p><h2>Know what happens<br />next.</h2></div><div className="tentative-label reveal"><span className="status-dot" /> Schedule items marked tentative will be confirmed by AIC.</div></div><div className="timeline-list compact">{timelineItems.slice(0, 4).map((item, index) => <TimelineItem key={item.label} item={item} index={index} />)}</div><a className="inline-link" href="/timeline" onClick={(event) => { event.preventDefault(); navigate('/timeline'); }}>View the full timeline <Arrow /></a></div></section>;
}

function PrizesPreview({ navigate }: { navigate: (href: string) => void }) {
  return <section className="section section-paper prizes-preview"><div className="container prizes-preview-grid"><div className="prize-statement reveal"><p className="eyebrow">Recognition</p><h2>Make work<br /><em>worth remembering.</em></h2><p>All team members can receive a Certificate of Participation. Winning team recognition details will be announced as they are finalized.</p><a className="inline-link" href="/prizes" onClick={(event) => { event.preventDefault(); navigate('/prizes'); }}>See recognition <Arrow /></a></div><div className="prize-stamp reveal"><span className="stamp-top">AIC / INAUGURAL YEAR</span><strong>Show<br />your work.</strong><span className="stamp-bottom">Certificates of participation<br />for all team members</span></div></div></section>;
}

function CtaBand({ navigate }: { navigate: (href: string) => void }) {
  return <section className="cta-band section-dark"><div className="cta-grid" aria-hidden="true" /><div className="container cta-inner reveal"><p className="eyebrow light">The stage is open</p><h2>Your ideas deserve<br /><em>a bigger stage.</em></h2><p>Bring your team. Take on a real-world problem. Show what you can create.</p><Button onClick={() => navigate('/register')}>Register for AIC <Arrow /></Button></div></section>;
}

function PageHero({ number, eyebrow, title, lede, visual }: { number: string; eyebrow: string; title: React.ReactNode; lede: string; visual: string }) {
  return <section className={`page-hero section-dark page-hero-${visual}`}><div className="hero-grid" aria-hidden="true" /><div className="container page-hero-inner"><div className="page-hero-copy reveal"><p className="eyebrow light"><span className="eyebrow-number">{number}</span>{eyebrow}</p><h1>{title}</h1><p>{lede}</p></div><div className="page-hero-art reveal"><HeroMiniGraphic type={visual} /></div></div></section>;
}

function HeroVisual({ navigate }: { navigate: (href: string) => void }) {
  const nodes = [
    { x: 92, y: 126, number: '01', label: 'About AIC', href: '/about' },
    { x: 454, y: 124, number: '02', label: 'The challenge', href: '/challenge' },
    { x: 470, y: 292, number: '03', label: 'Timeline', href: '/timeline' },
    { x: 405, y: 438, number: '04', label: 'Prizes', href: '/prizes' },
    { x: 174, y: 452, number: '05', label: 'FAQ', href: '/faq' },
    { x: 82, y: 294, number: '06', label: 'Register', href: '/register' }
  ];

  return <div className="hero-visual reveal" aria-label="Interactive AIC navigation constellation"><svg viewBox="0 0 560 560" role="img"><defs><pattern id="heroGrid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="#ffffff" strokeOpacity="0.09" /></pattern><linearGradient id="heroGlow" x1="0" x2="1"><stop offset="0" stopColor="#2357e6" /><stop offset="1" stopColor="#f37b5a" /></linearGradient></defs><circle cx="280" cy="280" r="208" fill="url(#heroGrid)" stroke="#ffffff" strokeOpacity="0.16" /><circle cx="280" cy="280" r="160" fill="none" stroke="#2357e6" strokeOpacity="0.24" strokeDasharray="2 18" /><path d="M92 126 280 280 454 124M280 280 470 292M405 438 280 280 174 452M82 294 280 280" fill="none" stroke="url(#heroGlow)" strokeWidth="2.5" strokeOpacity="0.8" strokeDasharray="3 7" />
      {nodes.map(node => <a key={node.number} className="hero-node" href={node.href} onClick={(event) => { event.preventDefault(); navigate(node.href); }} aria-label={node.label}><circle cx={node.x} cy={node.y} r="16" fill="#10192f" stroke="#f5efe6" strokeWidth="2" /><circle cx={node.x} cy={node.y} r="5" fill={node.number === '06' ? '#f37b5a' : '#f5efe6'} /><text className="hero-node-number" x={node.x + 22} y={node.y + 4} fill="#f5efe6" fontFamily="DM Sans" fontSize="10" letterSpacing="1.3">{node.number}</text><text className="hero-node-label" x={node.x + 22} y={node.y + 22} fill="#f5efe6" fontFamily="DM Sans" fontSize="9" letterSpacing="1.2">{node.label.toUpperCase()}</text></a>)}
      <g><circle cx="280" cy="280" r="28" fill="#f37b5a" opacity="0.12" /><circle cx="280" cy="280" r="19" fill="#f5efe6" /><text x="280" y="286" textAnchor="middle" fill="#10192f" fontFamily="DM Sans" fontWeight="700" fontSize="12" letterSpacing="2">AIC</text></g></svg></div>;
}

function HeroMiniGraphic({ type }: { type: string }) {
  if (type === 'about') return <AboutSystemGraphic />;
  if (type === 'challenge') return <PromptGraphic />;
  if (type === 'timeline') return <TimelineGraphic />;
  if (type === 'prizes') return <PrizesGraphic />;
  return <svg viewBox="0 0 420 360" role="img" aria-label="AIC mini graphic"><rect x="18" y="18" width="384" height="324" fill="none" stroke="#ffffff" strokeOpacity="0.18" /><path d="M42 274 126 116l82 92 78-138 84 188" fill="none" stroke="#9bb4ff" strokeWidth="2" /><circle cx="126" cy="116" r="9" fill="#f37b5a" /><circle cx="208" cy="208" r="9" fill="#f5efe6" /><circle cx="286" cy="70" r="9" fill="#2357e6" /><circle cx="370" cy="258" r="9" fill="#f5efe6" /></svg>;
}

function TimelineGraphic() {
  const steps = [{ x: 58, code: '01', label: 'REGISTER' }, { x: 138, code: '02', label: 'CHALLENGE' }, { x: 218, code: '03', label: 'SUBMIT' }, { x: 298, code: '04', label: 'JUDGE' }, { x: 378, code: '05', label: 'AWARDS' }];
  return <svg className="timeline-graphic" viewBox="0 0 420 360" role="img" aria-label="AIC competition timeline from registration to awards"><defs><linearGradient id="timelineLine" x1="0" x2="1"><stop offset="0" stopColor="#f37b5a" /><stop offset="0.5" stopColor="#9bb4ff" /><stop offset="1" stopColor="#f37b5a" /></linearGradient></defs><rect x="18" y="18" width="384" height="324" fill="none" stroke="#ffffff" strokeOpacity="0.18" /><path className="timeline-signal" d="M58 178H378" stroke="url(#timelineLine)" strokeWidth="4" strokeLinecap="round" /><path d="M58 178C95 111 109 224 138 178S196 111 218 178 276 111 298 178 356 111 378 178" fill="none" stroke="#9bb4ff" strokeOpacity="0.6" strokeWidth="1.5" strokeDasharray="4 7" />
    {steps.map(step => <g key={step.code} className="timeline-hero-node"><circle cx={step.x} cy="178" r="16" fill="#10192f" stroke={step.code === '01' ? '#f37b5a' : '#f5efe6'} strokeWidth="2" /><circle cx={step.x} cy="178" r="5" fill={step.code === '01' ? '#f37b5a' : '#f5efe6'} /><text x={step.x} y="145" textAnchor="middle" fill="#f5efe6" fontFamily="DM Sans" fontSize="9" letterSpacing="1.4">{step.code}</text><text x={step.x} y="220" textAnchor="middle" fill="#9bb4ff" fontFamily="DM Sans" fontSize="8" letterSpacing="1.2">{step.label}</text></g>)}
    <text x="42" y="54" fill="#f5efe6" fontFamily="DM Sans" fontSize="11" letterSpacing="3">THE AIC ROADMAP</text></svg>;
}

function PrizesGraphic() {
  return <svg className="prizes-graphic" viewBox="0 0 420 360" role="img" aria-label="AIC certificate and recognition seal"><defs><radialGradient id="prizeGlow"><stop offset="0" stopColor="#2357e6" stopOpacity="0.55" /><stop offset="1" stopColor="#2357e6" stopOpacity="0" /></radialGradient></defs><rect x="18" y="18" width="384" height="324" fill="none" stroke="#ffffff" strokeOpacity="0.18" /><circle cx="215" cy="163" r="112" fill="url(#prizeGlow)" /><circle cx="215" cy="163" r="57" fill="#10192f" stroke="#f5efe6" strokeOpacity="0.8" strokeWidth="2" /><text x="215" y="157" textAnchor="middle" fill="#f5efe6" fontFamily="Fraunces" fontSize="25">AIC</text><text x="215" y="177" textAnchor="middle" fill="#9bb4ff" fontFamily="DM Sans" fontSize="8" letterSpacing="2">RECOGNITION</text><path d="M215 71v-20M215 255v20M123 163h-20M317 163h20" stroke="#f37b5a" strokeWidth="2" /><rect x="58" y="270" width="304" height="32" fill="none" stroke="#9bb4ff" strokeOpacity="0.7" /><text x="210" y="290" textAnchor="middle" fill="#f5efe6" fontFamily="DM Sans" fontSize="10" letterSpacing="2">PARTICIPATION / EXCELLENCE / STORY</text></svg>;
}

function AboutSystemGraphic() {
  return <svg className="about-system-graphic" viewBox="0 0 420 360" role="img" aria-label="A connected system moving from knowledge to action"><defs><linearGradient id="aboutLine" x1="0" x2="1"><stop offset="0" stopColor="#f37b5a" /><stop offset="1" stopColor="#9bb4ff" /></linearGradient></defs><rect x="18" y="18" width="384" height="324" fill="none" stroke="#ffffff" strokeOpacity="0.18" /><circle cx="210" cy="180" r="92" fill="none" stroke="#2357e6" strokeOpacity="0.45" strokeDasharray="3 11" /><circle cx="210" cy="180" r="42" fill="#2357e6" opacity="0.28" /><path d="M68 92 164 152 210 180 300 93M74 267 164 152 210 180 300 265M210 180 317 265" fill="none" stroke="url(#aboutLine)" strokeWidth="2" /><g fill="#f5efe6"><circle cx="68" cy="92" r="7" /><circle cx="164" cy="152" r="6" /><circle cx="300" cy="93" r="7" /><circle cx="74" cy="267" r="7" /><circle cx="300" cy="265" r="7" /><circle cx="317" cy="265" r="7" /><circle cx="210" cy="180" r="12" /></g><text x="42" y="52" fill="#f5efe6" fontFamily="DM Sans" fontSize="11" letterSpacing="3">KNOWLEDGE / CONTEXT / ACTION</text></svg>;
}

function PromptGraphic() {
  return <svg className="prompt-graphic" viewBox="0 0 420 360" role="img" aria-label="AIC prompt moving from the organizers to a student team and final submission"><defs><linearGradient id="promptLine" x1="0" x2="1"><stop offset="0" stopColor="#f37b5a" /><stop offset="1" stopColor="#9bb4ff" /></linearGradient></defs><rect x="18" y="18" width="384" height="324" fill="none" stroke="#ffffff" strokeOpacity="0.18" /><circle cx="208" cy="180" r="112" fill="#10192f" opacity="0.1" /><g><rect x="42" y="74" width="126" height="140" fill="#10192f" stroke="#9bb4ff" strokeOpacity="0.75" /><text x="57" y="96" fill="#f37b5a" fontFamily="DM Sans" fontSize="9" letterSpacing="2">01 / AIC BRIEF</text><text x="57" y="130" fill="#f5efe6" fontFamily="Fraunces" fontSize="23">The</text><text x="57" y="153" fill="#f5efe6" fontFamily="Fraunces" fontSize="23">problem</text></g><path d="M169 144H204" stroke="url(#promptLine)" strokeWidth="2" strokeDasharray="4 5" /><g><circle cx="250" cy="104" r="18" fill="#2357e6" /><circle cx="294" cy="137" r="18" fill="#f37b5a" /><circle cx="252" cy="180" r="18" fill="#f5efe6" /><circle cx="299" cy="214" r="18" fill="#9bb4ff" /><path d="M250 104 294 137 252 180 299 214" fill="none" stroke="#9bb4ff" strokeWidth="1.5" strokeOpacity="0.8" /></g><path d="M317 177H350" stroke="url(#promptLine)" strokeWidth="2" strokeDasharray="4 5" /><g><rect x="350" y="119" width="43" height="116" fill="none" stroke="#f5efe6" strokeOpacity="0.75" /><path d="M360 143h23M360 163h23M360 183h23M360 203h23" stroke="#9bb4ff" strokeWidth="2" strokeLinecap="round" /></g><text x="42" y="52" fill="#f5efe6" fontFamily="DM Sans" fontSize="11" letterSpacing="3">PROMPT / TEAM / SUBMISSION</text></svg>;
}

function QuestionMarkVisual() {
  return <div className="question-visual" aria-hidden="true"><svg viewBox="0 0 340 270"><circle cx="162" cy="132" r="94" fill="none" stroke="#2357e6" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="3 9" /><circle cx="162" cy="132" r="67" fill="#2357e6" opacity="0.08" /><path d="M128 104c2-25 22-40 47-40 28 0 48 17 48 42 0 21-12 31-41 15-9-20-17-20-30 0" fill="none" stroke="#2357e6" strokeWidth="8" strokeLinecap="round" /><circle cx="174" cy="206" r="6" fill="#f37b5a" /></svg></div>;
}

function MapGrid() {
  const points: Array<[number, number, string, string]> = [[147,246,'Vancouver','BC'], [199,234,'Calgary','AB'], [198,161,'Yellowknife','NT'], [401,282,'Toronto','ON'], [435,270,'Montreal','QC'], [493,275,'Halifax','NS'], [557,257,'St. John’s','NL'], [464,153,'Iqaluit','NU']];
  return <svg viewBox="0 0 600 330" role="img" aria-label="Stylized outline of Canada with connected locations"><path d={canadaOutline} fill="#2357e6" fillOpacity="0.12" fillRule="evenodd" stroke="#9bb4ff" strokeWidth="1.5" strokeLinejoin="round" /><path d="M147 246 199 234 401 282 435 270 493 275 557 257M199 234 198 161 464 153" fill="none" stroke="#f37b5a" strokeOpacity="0.75" strokeWidth="1.5" strokeDasharray="5 7" />{points.map(([x, y, label, region], index) => <g key={`${label}-${region}`} className="map-point"><circle cx={x} cy={y} r="15" fill="none" stroke="#f37b5a" strokeOpacity="0.32" strokeDasharray="2 5" /><circle cx={x} cy={y} r="5" fill={index === 2 ? '#f37b5a' : '#f5efe6'} /><text x={x + 10} y={y - 9} fill="#f5efe6" fontFamily="DM Sans" fontSize="9" letterSpacing="1.2">{region}</text><title>{label}</title></g>)}<text x="56" y="304" fill="#9bb4ff" fontFamily="DM Sans" fontSize="12" letterSpacing="2">ALL PROVINCES / TERRITORIES / ONLINE</text></svg>;
}

function FAQList() {
  const [open, setOpen] = useState<number | null>(0);
  return <div className="faq-list reveal">{faqs.map(([question, answer], index) => { const answerId = `faq-answer-${index}`; return <div key={question} className={`faq-item ${open === index ? 'is-open' : ''}`}><button onClick={() => setOpen(open === index ? null : index)} aria-expanded={open === index} aria-controls={answerId}><span>{String(index + 1).padStart(2, '0')}</span><strong>{question}</strong><i>{open === index ? '–' : '+'}</i></button><div id={answerId} className="faq-answer"><p>{answer}</p></div></div>; })}</div>;
}

function TimelineItem({ item, index }: { item: typeof timelineItems[number]; index: number }) {
  return <div className={`timeline-item reveal accent-${item.accent}`}><span className="timeline-index">{String(index + 1).padStart(2, '0')}</span><div className="timeline-marker" /><div className="timeline-main"><p>{item.label}</p><strong>{item.date}</strong><small>{item.note}</small></div></div>;
}

function Benefit({ number, title, body }: { number: string; title: string; body: string }) {
  return <div className="benefit-row"><span>{number}</span><div><h3>{title}</h3><p>{body}</p></div></div>;
}

function Discipline({ index, title, copy }: { index: string; title: string; copy: string }) {
  return <div className="discipline"><span>{index}</span><h3>{title}</h3><p>{copy}</p></div>;
}

function PrizeRow({ index, title, note }: { index: string; title: string; note: string }) {
  return <div className="prize-row"><span>{index}</span><div><h3>{title}</h3><p>{note}</p></div><Arrow /></div>;
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div className="fact"><span>{label}</span><strong>{value}</strong></div>;
}

function FormField({ label, hint, required, error, wide, children }: { label: string; hint?: string; required?: boolean; error?: string; wide?: boolean; children: React.ReactNode }) {
  return <label className={`form-field ${wide ? 'wide' : ''}`}>
    <span className="field-label">{label}{required && <b>*</b>}{hint && <em>{hint}</em>}</span>
    {children}
    {error && <small className="field-error">{error}</small>}
  </label>;
}

function Button({ children, onClick, variant = 'primary' }: { children: React.ReactNode; onClick: () => void; variant?: 'primary' | 'outline-light' | 'text-light' }) {
  return <button className={`button button-${variant}`} onClick={onClick}>{children}</button>;
}

function Arrow() {
  return <svg className="arrow" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h13M9.5 3.5 15 9l-5.5 5.5" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>;
}

function Footer({ navigate }: { navigate: (href: string) => void }) {
  return <footer className="site-footer"><div className="container footer-top"><div className="footer-brand"><button className="brand" onClick={() => navigate('/')}><span className="brand-mark" aria-hidden="true"><span /><span /><i /></span><span><strong>AIC</strong><small>Applied Intelligence Challenge</small></span></button><p>A virtual competition for the next way of thinking.</p></div><div className="footer-links"><div><span>Explore</span><a href="/about" onClick={(event) => { event.preventDefault(); navigate('/about'); }}>About AIC</a><a href="/challenge" onClick={(event) => { event.preventDefault(); navigate('/challenge'); }}>The challenge</a><a href="/timeline" onClick={(event) => { event.preventDefault(); navigate('/timeline'); }}>Timeline</a></div><div><span>Take part</span><a href="/prizes" onClick={(event) => { event.preventDefault(); navigate('/prizes'); }}>Prizes & recognition</a><a href="/faq" onClick={(event) => { event.preventDefault(); navigate('/faq'); }}>FAQ</a><a href="/register" onClick={(event) => { event.preventDefault(); navigate('/register'); }}>Register your team</a></div></div></div><div className="container footer-bottom"><span>Inaugural year • Canada</span><span>Designed for curious minds</span></div></footer>;
}
