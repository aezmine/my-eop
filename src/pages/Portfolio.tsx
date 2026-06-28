import React, { useState, useEffect } from "react";
import "./Portfolio.css";

interface PortfolioProps {
  onNavigate: (path: string) => void;
}

export const Portfolio: React.FC<PortfolioProps> = ({ onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // 1. Scroll-Fade Observer (IntersectionObserver)
    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    document.querySelectorAll(".section").forEach((el) => fadeObserver.observe(el));

    // 2. Active Section Scroll Highlighting
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".site-nav a[href^=\"#\"]");

    const activateNavLink = (id: string) => {
      navLinks.forEach((link) => {
        const href = link.getAttribute("href");
        if (href === "#" + id) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });
    };

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activateNavLink(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-30% 0px -60% 0px",
        threshold: 0,
      }
    );

    sections.forEach((section) => sectionObserver.observe(section));

    // 3. Inject Chat Widget Stylesheet
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "chat-widget.css";
    document.head.appendChild(link);

    // 4. Inject Chat Widget Script
    const script = document.createElement("script");
    script.src = "chat-widget.js";
    script.defer = true;
    document.body.appendChild(script);

    // Clean up observers and script on unmount
    return () => {
      fadeObserver.disconnect();
      sectionObserver.disconnect();
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      const widget = document.getElementById("chat-widget-root");
      if (widget) {
        widget.innerHTML = "";
      }
    };
  }, []);

  return (
    <div className="portfolio-page">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      
          
          <header className="site-header" role="banner">
              <div className="container header-inner">
                  <a href="#home" className="brand" aria-label="Azmin Hassan — home">Azmin Hassan</a>
      
                  <nav id="site-nav" className={`site-nav ${isMobileMenuOpen ? 'open' : ''}`} aria-label="Primary navigation">
                      <a href="#summary" onClick={() => setIsMobileMenuOpen(false)}>Summary</a>
                      <a href="#skills" onClick={() => setIsMobileMenuOpen(false)}>Skills</a>
                      <a href="#experience" onClick={() => setIsMobileMenuOpen(false)}>Experience</a>
                      <a href="#projects" onClick={() => setIsMobileMenuOpen(false)}>Projects</a>
                      <a href="#education" onClick={() => setIsMobileMenuOpen(false)}>Education</a>
                      <a href="#resume" onClick={() => setIsMobileMenuOpen(false)}>Resume</a>
                      <a href="/eop" onClick={(e) => { e.preventDefault(); onNavigate('/eop'); setIsMobileMenuOpen(false); }}>EOP Assessment</a>
                  </nav>
      
                  <a
                      href="ats.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-sm nav-ats-btn"
                      id="nav-ats-btn"
                      aria-label="Open ATS-optimised resume view (opens in new tab)"
                      title="ATS Mode — plain text resume for job applications"
                  >
                      
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/>
                          <line x1="16" y1="13" x2="8" y2="13"/>
                          <line x1="16" y1="17" x2="8" y2="17"/>
                          <polyline points="10 9 9 9 8 9"/>
                      </svg>
                      ATS Mode
                  </a>
      
                  <button
                      className="nav-toggle"
                      id="nav-toggle"
                      aria-controls="site-nav"
                      aria-expanded={isMobileMenuOpen}
                      aria-label="Toggle navigation menu"
                      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  >
                      <span></span>
                      <span></span>
                      <span></span>
                  </button>
              </div>
          </header>
      
          
          <main id="main-content">
      
              
              <section id="home" className="hero" aria-label="Profile header">
                  <div className="container hero-grid">
                      
                      <div className="hero-copy">
                          <h1 className="hero-name">Azmin Hassan</h1>
                          <p className="hero-title">Computer Science Undergraduate & Software Developer</p>
                          <p className="hero-summary">
                              Backend-focused Computer Science undergraduate at Universiti Malaysia Terengganu,
                              specialising in Java, web development, and database systems. Proactive learner who
                              quickly adapts to new technologies — actively seeking internship opportunities to
                              contribute to real-world software engineering projects.
                          </p>
      
                          <div className="contact-row" role="list" aria-label="Contact information">
                              <span className="contact-item" role="listitem">
                                  
                                  <svg className="contact-icon" viewBox="0 0 24 24" aria-hidden="true">
                                      <rect x="2" y="4" width="20" height="16" rx="2"/>
                                      <path d="m2 7 8.5 6a2.5 2.5 0 0 0 3 0L22 7"/>
                                  </svg>
                                  <a href="mailto:aezmine@gmail.com">aezmine@gmail.com</a>
                              </span>
                              <span className="contact-item" role="listitem">
                                  
                                  <svg className="contact-icon" viewBox="0 0 24 24" aria-hidden="true">
                                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                                  </svg>
                                  <a href="tel:+601139018046">+60-1139018046</a>
                              </span>
                              <span className="contact-item" role="listitem">
                                  
                                  <svg className="contact-icon" viewBox="0 0 24 24" aria-hidden="true">
                                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                                      <rect x="2" y="9" width="4" height="12"/>
                                      <circle cx="4" cy="4" r="2"/>
                                  </svg>
                                  <a href="https://www.linkedin.com/in/aezmine/" target="_blank" rel="noopener noreferrer">linkedin.com/in/aezmine</a>
                              </span>
                              <span className="contact-item" role="listitem">
                                  
                                  <svg className="contact-icon" viewBox="0 0 24 24" aria-hidden="true">
                                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                                  </svg>
                                  <a href="https://github.com/aezmine" target="_blank" rel="noopener noreferrer">github.com/aezmine</a>
                              </span>
                              <span className="contact-item" role="listitem">
                                  
                                  <svg className="contact-icon" viewBox="0 0 24 24" aria-hidden="true">
                                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                      <circle cx="12" cy="10" r="3"/>
                                  </svg>
                                  Pahang, Malaysia
                              </span>
                              <span className="contact-item" role="listitem">
                                  
                                  <svg className="contact-icon" viewBox="0 0 24 24" aria-hidden="true">
                                      <circle cx="12" cy="12" r="10"/>
                                      <line x1="2" y1="12" x2="22" y2="12"/>
                                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                                  </svg>
                                  <a href="https://minazmin.my" target="_blank" rel="noopener noreferrer">minazmin.my</a>
                              </span>
                          </div>
      
                          <div className="hero-actions">
                              <a
                                  className="btn btn-primary"
                                  href="#projects"
                                  id="hero-projects-btn"
                              >
                                  View Projects
                              </a>
                              <a
                                  className="btn btn-outline"
                                  href="assets/AZMIN_RESUME.pdf"
                                  download="Azmin_Hassan_Resume.pdf"
                                  id="hero-resume-download-btn"
                                  aria-label="Download Azmin Hassan's resume as PDF"
                              >
                                  
                                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                      <polyline points="7 10 12 15 17 10"/>
                                      <line x1="12" y1="15" x2="12" y2="3"/>
                                  </svg>
                                  Download Resume
                              </a>
                              <a
                                  className="btn btn-outline"
                                  href="https://www.linkedin.com/in/aezmine/"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  id="hero-linkedin-btn"
                                  aria-label="Azmin Hassan on LinkedIn (opens in new tab)"
                              >
                                  LinkedIn
                              </a>
                          </div>
                      </div>
      
                      
                      <div className="hero-photo-wrap">
                          <img
                              src="assets/pic04.png"
                              alt="Professional portrait of Azmin Hassan"
                              className="hero-photo"
                              width="180"
                              height="220"
                              loading="eager"
                              fetchPriority="high"
                           />
                      </div>
                  </div>
              </section>
      
              
              <div className="main-content">
                  <div className="container">
      
                      
                      <section id="summary" className="section" aria-labelledby="summary-heading">
                          <div className="section-header">
                              <h2 id="summary-heading" className="section-title">Professional Summary</h2>
                              <div className="section-line" aria-hidden="true"></div>
                          </div>
                          <p style={{ fontSize: '0.975rem', color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: '72ch' }}>
                              Computer Science undergraduate with hands-on experience building backend-driven systems
                              using Java, web technologies, and relational databases. Demonstrates strong ability to
                              design, develop, and optimise functional applications with a focus on scalability and
                              data management. Fast learner with proven ability to adapt in fast-paced, high-pressure
                              environments — consistently improving code quality and problem-solving depth across each
                              semester. Actively seeking internship opportunities to contribute to real-world software
                              engineering projects.
                          </p>
                      </section>
      
                      
                      <section id="skills" className="section" aria-labelledby="skills-heading">
                          <div className="section-header">
                              <h2 id="skills-heading" className="section-title">Technical Skills</h2>
                              <div className="section-line" aria-hidden="true"></div>
                          </div>
                          <div className="skills-groups">
                              <div className="skill-group">
                                  <span className="skill-group-label">Programming</span>
                                  <div className="skill-tags" role="list" aria-label="Programming languages">
                                      <span className="skill-tag highlight" role="listitem">Java</span>
                                      <span className="skill-tag" role="listitem">JavaScript</span>
                                      <span className="skill-tag" role="listitem">HTML5</span>
                                      <span className="skill-tag" role="listitem">CSS3</span>
                                      <span className="skill-tag" role="listitem">Python (Basic)</span>
                                  </div>
                              </div>
                              <div className="skill-group">
                                  <span className="skill-group-label">Web Technologies</span>
                                  <div className="skill-tags" role="list" aria-label="Web technologies">
                                      <span className="skill-tag" role="listitem">JSP</span>
                                      <span className="skill-tag" role="listitem">Servlets</span>
                                      <span className="skill-tag" role="listitem">RESTful APIs</span>
                                      <span className="skill-tag" role="listitem">Frontend Development</span>
                                      <span className="skill-tag" role="listitem">Responsive Design</span>
                                  </div>
                              </div>
                              <div className="skill-group">
                                  <span className="skill-group-label">Databases</span>
                                  <div className="skill-tags" role="list" aria-label="Databases">
                                      <span className="skill-tag highlight" role="listitem">MySQL</span>
                                      <span className="skill-tag" role="listitem">CRUD Operations</span>
                                      <span className="skill-tag" role="listitem">Query Optimisation</span>
                                      <span className="skill-tag" role="listitem">Schema Design</span>
                                  </div>
                              </div>
                              <div className="skill-group">
                                  <span className="skill-group-label">Tools & Platforms</span>
                                  <div className="skill-tags" role="list" aria-label="Tools and platforms">
                                      <span className="skill-tag" role="listitem">Git</span>
                                      <span className="skill-tag" role="listitem">GitHub</span>
                                      <span className="skill-tag" role="listitem">VS Code</span>
                                      <span className="skill-tag" role="listitem">Apache Tomcat</span>
                                      <span className="skill-tag" role="listitem">ThingSpeak</span>
                                      <span className="skill-tag" role="listitem">Power BI (Basic)</span>
                                      <span className="skill-tag" role="listitem">Raspberry Pi Pico W</span>
                                  </div>
                              </div>
                              <div className="skill-group">
                                  <span className="skill-group-label">Core Strengths</span>
                                  <div className="skill-tags" role="list" aria-label="Core strengths">
                                      <span className="skill-tag" role="listitem">Problem Solving</span>
                                      <span className="skill-tag" role="listitem">Debugging</span>
                                      <span className="skill-tag" role="listitem">Algorithmic Thinking</span>
                                      <span className="skill-tag" role="listitem">System Design Fundamentals</span>
                                      <span className="skill-tag" role="listitem">Fast Learner</span>
                                  </div>
                              </div>
                          </div>
                      </section>
      
                      
                      <section id="experience" className="section" aria-labelledby="experience-heading">
                          <div className="section-header">
                              <h2 id="experience-heading" className="section-title">Work Experience</h2>
                              <div className="section-line" aria-hidden="true"></div>
                          </div>
                          <div className="timeline">
      
                              <article className="timeline-item" aria-label="J&T Express and Shopee experience">
                                  <div className="timeline-header">
                                      <div>
                                          <h3 className="timeline-title">Logistics Assistant <span className="timeline-company">@ J&T Express & Shopee</span></h3>
                                      </div>
                                      <span className="timeline-date">2024 – 2025</span>
                                  </div>
                                  <div className="timeline-body">
                                      <ul>
                                          <li>Managed parcel sorting and logistics workflow with high accuracy across high-volume distribution runs.</li>
                                          <li>Handled time-sensitive operations requiring strong attention to detail and execution precision.</li>
                                          <li>Optimised task execution in a fast-paced distribution environment, strengthening operational efficiency awareness.</li>
                                          <li>Strengthened discipline, process reliability, and cross-team coordination skills.</li>
                                      </ul>
                                  </div>
                              </article>
      
                              <article className="timeline-item" aria-label="McDonald's experience">
                                  <div className="timeline-header">
                                      <div>
                                          <h3 className="timeline-title">Crew Trainee <span className="timeline-company">@ McDonald's</span></h3>
                                      </div>
                                      <span className="timeline-date">2023</span>
                                  </div>
                                  <div className="timeline-body">
                                      <ul>
                                          <li>Maintained operational efficiency in a high-volume, fast-paced environment.</li>
                                          <li>Trained new staff on standard operating procedures (SOPs), demonstrating ability to communicate and teach clearly.</li>
                                          <li>Developed strong teamwork, communication, and time management skills under pressure.</li>
                                      </ul>
                                  </div>
                              </article>
      
                          </div>
                      </section>
      
                      
                      <section id="projects" className="section" aria-labelledby="projects-heading">
                          <div className="section-header">
                              <h2 id="projects-heading" className="section-title">Project Experience</h2>
                              <div className="section-line" aria-hidden="true"></div>
                          </div>
                          <div className="project-grid">
      
                              <article className="project-card" aria-label="UMT Classroom Booking System project">
                                  <div className="project-card-header">
                                      <h3 className="project-title">UMT Classroom Booking System</h3>
                                      <div className="project-links">
                                          <a
                                              href="https://github.com/aezmine"
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="project-link-btn"
                                              aria-label="View Classroom Booking System on GitHub"
                                              title="GitHub"
                                          >
                                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                                              </svg>
                                          </a>
                                      </div>
                                  </div>
                                  <div className="project-desc">
                                      <ul>
                                          <li>Developed a full web-based classroom reservation system using Java, JSP, and MySQL.</li>
                                          <li>Implemented booking conflict detection logic to prevent scheduling overlaps.</li>
                                          <li>Designed structured database schema and CRUD operations for efficient booking management.</li>
                                          <li>Deployed on Apache Tomcat; reduced manual scheduling conflicts through automation scripts.</li>
                                      </ul>
                                  </div>
                                  <div className="project-tech" aria-label="Technologies used">
                                      <span className="tech-badge">Java</span>
                                      <span className="tech-badge">JSP</span>
                                      <span className="tech-badge">MySQL</span>
                                      <span className="tech-badge">Apache Tomcat</span>
                                      <span className="tech-badge">HTML/CSS</span>
                                  </div>
                              </article>
      
                              <article className="project-card" aria-label="Virtual Kelulut Repository System project">
                                  <div className="project-card-header">
                                      <h3 className="project-title">Virtual Kelulut Repository System</h3>
                                      <div className="project-links">
                                          <a
                                              href="https://github.com/aezmine"
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="project-link-btn"
                                              aria-label="View Kelulut Repository System on GitHub"
                                              title="GitHub"
                                          >
                                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                                              </svg>
                                          </a>
                                      </div>
                                  </div>
                                  <div className="project-desc">
                                      <ul>
                                          <li>Built a centralised digital data management system for kelulut research data at UMT.</li>
                                          <li>Designed and implemented a relational database schema for structured data storage and retrieval.</li>
                                          <li>Improved data retrieval efficiency and accessibility for researchers and university staff.</li>
                                          <li>Applied core database management principles to a real-world academic use case.</li>
                                      </ul>
                                  </div>
                                  <div className="project-tech" aria-label="Technologies used">
                                      <span className="tech-badge">Java</span>
                                      <span className="tech-badge">MySQL</span>
                                      <span className="tech-badge">JSP</span>
                                      <span className="tech-badge">Database Design</span>
                                  </div>
                              </article>
      
                              <article className="project-card" aria-label="Mini Weather Station IoT project">
                                  <div className="project-card-header">
                                      <h3 className="project-title">Mini Weather Station — IoT</h3>
                                      <div className="project-links">
                                          <a
                                              href="https://github.com/aezmine"
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="project-link-btn"
                                              aria-label="View Weather Station project on GitHub"
                                              title="GitHub"
                                          >
                                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                                              </svg>
                                          </a>
                                      </div>
                                  </div>
                                  <div className="project-desc">
                                      <ul>
                                          <li>Developed an IoT-based weather monitoring system using Raspberry Pi Pico W.</li>
                                          <li>Integrated temperature, humidity, light, and ultrasonic sensors for real-time environmental data collection.</li>
                                          <li>Connected system to ThingSpeak cloud platform for live monitoring and dashboard visualisation.</li>
                                          <li>Implemented automated Wi-Fi data transmission for continuous remote access and analysis.</li>
                                      </ul>
                                  </div>
                                  <div className="project-tech" aria-label="Technologies used">
                                      <span className="tech-badge">Raspberry Pi Pico W</span>
                                      <span className="tech-badge">MicroPython</span>
                                      <span className="tech-badge">ThingSpeak</span>
                                      <span className="tech-badge">IoT Sensors</span>
                                      <span className="tech-badge">Wi-Fi</span>
                                  </div>
                              </article>
      
                              <article className="project-card" aria-label="Hackathon Smart City project">
                                  <div className="project-card-header">
                                      <h3 className="project-title">Hackathon X Smart City</h3>
                                      <div className="project-links">
                                      </div>
                                  </div>
                                  <div className="project-desc">
                                      <ul>
                                          <li>Collaborated in a team to rapidly prototype a functional Smart City solution under strict time constraints.</li>
                                          <li>Applied problem-solving and critical thinking in a competitive hackathon environment.</li>
                                          <li>Contributed to idea development, technical implementation, and final presentation.</li>
                                      </ul>
                                  </div>
                                  <div className="project-tech" aria-label="Skills demonstrated">
                                      <span className="tech-badge">Team Collaboration</span>
                                      <span className="tech-badge">Rapid Prototyping</span>
                                      <span className="tech-badge">Problem Solving</span>
                                  </div>
                              </article>
      
                          </div>
                      </section>
      
                      
                      <section id="education" className="section" aria-labelledby="education-heading">
                          <div className="section-header">
                              <h2 id="education-heading" className="section-title">Education</h2>
                              <div className="section-line" aria-hidden="true"></div>
                          </div>
                          <div className="education-list">
      
                              <article className="edu-item" aria-label="Universiti Malaysia Terengganu">
                                  <div className="edu-body">
                                      <h3 className="edu-institution">Universiti Malaysia Terengganu (UMT)</h3>
                                      <p className="edu-degree">Bachelor of Computer Science with Maritime Informatics (Honours)</p>
                                      <p className="edu-detail">Faculty of Computing and Mathematics</p>
                                      <p className="edu-detail">Expected Graduation: 2027</p>
                                      <span className="edu-gpa">CGPA: 3.49 (Latest Semester)</span>
                                      <p className="edu-detail" style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>Semester progression: 3.06 → 3.30 → 3.71 → 3.88 → 3.55 (upward trend)</p>
                                  </div>
                                  <span className="edu-date">2023 – Present</span>
                              </article>
      
                              <article className="edu-item" aria-label="Seri Lipis College STPM">
                                  <div className="edu-body">
                                      <h3 className="edu-institution">Seri Lipis College</h3>
                                      <p className="edu-degree">STPM — Science Stream</p>
                                  </div>
                                  <span className="edu-date">2022 – 2023</span>
                              </article>
      
                              <article className="edu-item" aria-label="SMK Sungai Koyan SPM">
                                  <div className="edu-body">
                                      <h3 className="edu-institution">SMK (F) Sungai Koyan</h3>
                                      <p className="edu-degree">SPM — Science Stream</p>
                                  </div>
                                  <span className="edu-date">2020 – 2022</span>
                              </article>
      
                          </div>
                      </section>
      
                      
                      <section id="additional" className="section" aria-labelledby="additional-heading">
                          <div className="section-header">
                              <h2 id="additional-heading" className="section-title">Additional Information</h2>
                              <div className="section-line" aria-hidden="true"></div>
                          </div>
                          <div className="additional-grid">
      
                              <div className="additional-card">
                                  <p className="additional-label">Languages</p>
                                  <div className="additional-items">
                                      <span className="additional-item">English — Intermediate (reading & writing)</span>
                                      <span className="additional-item">Bahasa Melayu — Fluent (native)</span>
                                  </div>
                              </div>
      
                              <div className="additional-card">
                                  <p className="additional-label">Key Strengths</p>
                                  <div className="additional-items">
                                      <span className="additional-item">Strong problem-solving mindset with practical coding application</span>
                                      <span className="additional-item">Fast learner — quickly adapts to new technologies</span>
                                      <span className="additional-item">Self-driven; capable of independent project development</span>
                                      <span className="additional-item">Structured and logical approach to debugging</span>
                                  </div>
                              </div>
      
                              <div className="additional-card">
                                  <p className="additional-label">Availability</p>
                                  <div className="additional-items">
                                      <span className="additional-item">Open to internship opportunities</span>
                                      <span className="additional-item">Willing to relocate for the right role</span>
                                      <span className="additional-item">Based in Pahang, Malaysia</span>
                                  </div>
                              </div>
      
                          </div>
                      </section>
      
                      
                      <section id="resume" className="section" aria-labelledby="resume-heading">
                          <div className="section-header">
                              <h2 id="resume-heading" className="section-title">Resume</h2>
                              <div className="section-line" aria-hidden="true"></div>
                          </div>
      
                          <div className="resume-cta">
                              <p className="resume-cta-text">
                                  View or download my full resume. Use <strong>ATS Mode</strong> for a plain-text version optimised for job application systems.
                              </p>
                              <div className="resume-actions">
                                  <a
                                      className="btn btn-primary"
                                      href="assets/AZMIN_RESUME.pdf"
                                      download="Azmin_Hassan_Resume.pdf"
                                      id="resume-download-btn"
                                      aria-label="Download resume PDF"
                                  >
                                      
                                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                          <polyline points="7 10 12 15 17 10"/>
                                          <line x1="12" y1="15" x2="12" y2="3"/>
                                      </svg>
                                      Download PDF
                                  </a>
                                  <a
                                      className="btn btn-outline"
                                      href="ats.html"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      id="resume-ats-btn"
                                      aria-label="Open ATS-optimised resume view (opens in new tab)"
                                  >
                                      
                                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                          <polyline points="14 2 14 8 20 8"/>
                                          <line x1="16" y1="13" x2="8" y2="13"/>
                                          <line x1="16" y1="17" x2="8" y2="17"/>
                                      </svg>
                                      ATS Mode
                                  </a>
                                  <a
                                      className="btn btn-outline"
                                      href="https://drive.google.com/file/d/1j2l8rjSC6KtfVe8UWvJI1jnZQ3h2L18Y/view"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      id="resume-view-btn"
                                      aria-label="Open resume on Google Drive (opens in new tab)"
                                  >
                                      Open in Google Drive
                                  </a>
                              </div>
                          </div>
      
                          <iframe
                              className="resume-preview"
                              src="https://drive.google.com/file/d/1j2l8rjSC6KtfVe8UWvJI1jnZQ3h2L18Y/preview"
                              title="Azmin Hassan resume PDF preview"
                              loading="lazy"
                              aria-label="Resume preview"
                          ></iframe>
      
                          <p className="resume-fallback">
                              Direct link:
                              <a href="https://drive.google.com/file/d/1j2l8rjSC6KtfVe8UWvJI1jnZQ3h2L18Y/view" target="_blank" rel="noopener noreferrer">
                                  View on Google Drive ↗
                              </a>
                          </p>
                      </section>
      
                  </div>
              </div>
      
          </main>
      
          
          <footer className="site-footer" role="contentinfo">
              <div className="container footer-inner">
                  <p className="footer-copy">
                      {'©'} {new Date().getFullYear()} Azmin Hassan. All rights reserved.
                  </p>
                  <nav className="footer-links" aria-label="Footer links">
                      <a href="https://github.com/aezmine" target="_blank" rel="noopener noreferrer">GitHub</a>
                      <a href="https://www.linkedin.com/in/aezmine/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                      <a href="mailto:aezmine@gmail.com">Contact</a>
                  </nav>
              </div>
          </footer>
      
      {/* Floating Chat Widget Root */}
      <div id="chat-widget-root" aria-live="polite"></div>
    </div>
  );
};
