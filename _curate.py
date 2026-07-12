# -*- coding: utf-8 -*-
"""Curate portfolio: quality over quantity. Do not rebuild from scratch."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent
html_path = ROOT / "index.html"
text = html_path.read_text(encoding="utf-8")

# --- CSS: remove archive/video dump styles; add robotics + premium polish ---
archive_css = re.search(
    r"/\* Expanded visual archive \*/.*?@media \(max-width:560px\)\{[^}]+\}",
    text,
    re.S,
)
if archive_css:
    text = text.replace(archive_css.group(0), "")

# Clean grid rule references to archive/video
text = text.replace(", .archive-masonry, .video-grid", "")
text = text.replace(",.archive-item,.video-card", "")
text = text.replace(",.archive-item:hover,.video-card:hover", "")

robotics_css = """
/* ROBOTICS — curated platforms */
#robotics{padding:var(--pad-y) 0;background:var(--bg2)}
.robo-cats{max-width:var(--max);margin:0 auto;padding:0 var(--pad-x);display:flex;flex-direction:column;gap:clamp(2.4rem,5vw,3.8rem)}
.robo-cat-label{
  font-family:'DM Mono',monospace;font-size:.63rem;letter-spacing:.28em;text-transform:uppercase;
  color:var(--gold);margin-bottom:1rem;display:flex;align-items:center;gap:.85rem;
}
.robo-cat-label::after{content:'';flex:1;height:1px;background:var(--border)}
.robo-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem}
.robo-grid.duo{grid-template-columns:1.2fr 1fr}
.robo-card{
  background:rgba(28,24,18,.72);border:.5px solid var(--border);overflow:hidden;
  backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);
  transition:transform .4s var(--ease),border-color .35s,box-shadow .4s;
}
.robo-card:hover{
  transform:translateY(-4px);border-color:var(--border-strong);
  box-shadow:0 20px 48px rgba(0,0,0,.4),0 0 28px rgba(201,168,76,.08);
}
.robo-card .media{aspect-ratio:4/3;overflow:hidden}
.robo-card.featured .media{aspect-ratio:16/10;min-height:280px}
.robo-card img{width:100%;height:100%;object-fit:cover;transition:transform .7s var(--ease)}
.robo-card:hover img{transform:scale(1.04)}
.robo-card-body{padding:1.15rem 1.25rem 1.35rem}
.robo-card-title{font-size:.95rem;font-weight:500;margin-bottom:.3rem}
.robo-card-desc{font-size:.84rem;color:var(--muted);line-height:1.7}
.research-support{
  display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;
  max-width:var(--max);margin:clamp(1.8rem,4vw,2.8rem) auto 0;padding:0 var(--pad-x);
}
.research-support .media{aspect-ratio:4/3;overflow:hidden;border:.5px solid var(--border);background:var(--card)}
.research-support img{width:100%;height:100%;object-fit:cover;transition:transform .65s var(--ease)}
.research-support .media:hover img{transform:scale(1.04)}
.research-mission{
  max-width:var(--max);margin:clamp(2rem,4vw,3rem) auto 0;padding:0 var(--pad-x);
  display:grid;grid-template-columns:1fr 1.4fr;gap:clamp(1.5rem,4vw,3rem);align-items:center;
}
.research-mission h3{
  font-family:'Bebas Neue',sans-serif;font-size:clamp(1.8rem,3vw,2.5rem);line-height:1.05;letter-spacing:.02em;
}
.research-mission h3 span{color:var(--gold)}
.research-mission p{color:var(--muted);font-size:.95rem;line-height:1.85}
.impact-line{
  max-width:var(--max);margin:clamp(2rem,4vw,3rem) auto 0;padding:1.5rem 1.6rem;
  margin-left:var(--pad-x);margin-right:var(--pad-x);
  border:.5px solid var(--border-strong);background:rgba(201,168,76,.05);
  box-shadow:0 0 40px rgba(201,168,76,.06);
}
.impact-line p{font-size:.95rem;color:var(--off);line-height:1.8;text-align:center}
.impact-line strong{color:var(--gold);font-weight:500}
#selected{padding:var(--pad-y) 0;background:var(--bg)}
@media (max-width:900px){
  .robo-grid,.robo-grid.duo,.research-support{grid-template-columns:1fr 1fr}
  .research-mission{grid-template-columns:1fr}
}
@media (max-width:560px){
  .robo-grid,.robo-grid.duo,.research-support{grid-template-columns:1fr}
  .robo-card.featured{grid-column:auto}
}
"""

# Inject robotics CSS before </style>
if "#robotics{" not in text:
    text = text.replace("</style>", robotics_css + "\n</style>", 1)

# Premium glow polish on existing cards (subtle)
if "ambient-gold" not in text:
    glow = """
/* Premium ambient + glass polish */
body{
  background:
    radial-gradient(ellipse 80% 50% at 10% -10%,rgba(201,168,76,.07),transparent 55%),
    radial-gradient(ellipse 60% 40% at 90% 20%,rgba(201,168,76,.04),transparent 50%),
    var(--bg);
}
.btn-primary{box-shadow:0 0 24px rgba(201,168,76,.18)}
.hero-stat-num{text-shadow:0 0 28px rgba(201,168,76,.25)}
.r-card,.proj,.corp-card,.beyond-card,.honor-card,.story-cell,.robo-card{
  background:rgba(28,24,18,.78);
  box-shadow:inset 0 1px 0 rgba(232,201,122,.06);
}
.r-card:hover,.proj:hover,.corp-card:hover,.beyond-card:hover,.honor-card:hover,.robo-card:hover{
  box-shadow:0 22px 50px rgba(0,0,0,.42),0 0 32px rgba(201,168,76,.1),inset 0 1px 0 rgba(232,201,122,.1);
}
.collab-bar,.pull-quote{
  background:rgba(28,24,18,.85);
  box-shadow:0 0 36px rgba(201,168,76,.05);
}
.tl-item::before{box-shadow:0 0 0 4px rgba(201,168,76,.18),0 0 16px rgba(201,168,76,.35)}
"""
    text = text.replace("</style>", glow + "\n</style>", 1)

# --- NAV ---
old_nav = """  <ul class="nav-links" id="navLinks">
    <li><a href="#about">About</a></li>
    <li><a href="#research">Research</a></li>
    <li><a href="#projects">Projects</a></li>
    <li><a href="#leadership">Leadership</a></li>
    <li><a href="#journey">Journey</a></li>
    <li><a href="#archive">Archive</a></li>
    <li><a href="#beyond">Beyond</a></li>
    <li><a href="#contact" class="nav-cta">Contact</a></li>
  </ul>"""

new_nav = """  <ul class="nav-links" id="navLinks">
    <li><a href="#about">About</a></li>
    <li><a href="#research">Research</a></li>
    <li><a href="#robotics">Robotics</a></li>
    <li><a href="#projects">Projects</a></li>
    <li><a href="#leadership">Impact</a></li>
    <li><a href="#journey">Journey</a></li>
    <li><a href="#beyond">Beyond</a></li>
    <li><a href="#contact" class="nav-cta">Contact</a></li>
  </ul>"""
if old_nav in text:
    text = text.replace(old_nav, new_nav)

# --- Replace from #research through end of #reels (before #journey) ---
# Keep hero, marquee, about intact.

sections_html = r'''
<section id="research">
  <div class="section-header reveal" style="padding:0 var(--pad-x)">
    <div class="section-eyebrow">AI Farms Initiative · Since Oct 2022</div>
    <h2 class="section-title">Field Research.<br><em>Real Systems.</em></h2>
    <p class="section-subtitle">First-author work at the convergence of AI, autonomous robotics, and sustainable agriculture — with Tuskegee, USDA, CROPPS, and Cornell.</p>
  </div>

  <div class="reveal">
    <img class="research-bleed" src="assets/images%20copy/02_AI_Farms_Research/10782.jpg" alt="AI Farms field research operations with agricultural drone systems" width="2400" height="1600" loading="lazy" style="object-position:center 40%">
    <p class="research-caption">Hero Research — AI Farms field operations at Tuskegee University</p>
  </div>

  <div class="research-mission reveal">
    <h3>Research<br><span>Mission.</span></h3>
    <p>Build and deploy AI-powered robotic systems that sense, decide, and act in real agricultural environments — turning field data into decisions that scale beyond a single plot.</p>
  </div>

  <div class="story-strip reveal">
    <div class="story-cell">
      <div class="story-label">Challenge</div>
      <p>Agriculture needs scalable sensing and autonomy — fields are large, labor is limited, and decisions demand better data.</p>
    </div>
    <div class="story-cell">
      <div class="story-label">Technology</div>
      <p>Drones, quadruped robots, autonomous rovers, IoT sensors, and computer vision deployed together in real environments.</p>
    </div>
    <div class="story-cell">
      <div class="story-label">Research</div>
      <p>First-author work integrating AI-powered robotic systems for precision agriculture and environmental monitoring.</p>
    </div>
    <div class="story-cell">
      <div class="story-label">Impact</div>
      <p>Live demos for researchers, dignitaries, and students — proving multi-robot systems can operate in the field today.</p>
    </div>
  </div>

  <div class="research-support reveal">
    <div class="media"><img src="assets/images%20copy/02_AI_Farms_Research/274091622200731962.jpg" alt="Drone and field robotics during AI Farms research" loading="lazy" style="object-position:center 35%"></div>
    <div class="media"><img src="assets/images%20copy/02_AI_Farms_Research/2104941407774967754.jpg" alt="Quadruped robot in the AI Farms research lab" loading="lazy"></div>
    <div class="media"><img src="assets/images%20copy/02_AI_Farms_Research/IMG_2029.JPEG" alt="Automated greenhouse gantry system for crop monitoring" loading="lazy"></div>
    <div class="media"><img src="assets/images%20copy/02_AI_Farms_Research/IMG_2497.JPEG" alt="Experimental crop beds in greenhouse research facility" loading="lazy"></div>
  </div>

  <div class="research-grid reveal" style="padding-top:clamp(1.8rem,4vw,2.8rem)">
    <article class="r-card">
      <div class="media"><img src="assets/images%20copy/02_AI_Farms_Research/10784.jpg" alt="Cameron Jones conducting leaf measurements during field research" loading="lazy" style="object-position:center 30%"></div>
      <div class="r-card-body">
        <div class="r-card-num">01</div>
        <div class="r-card-title">Precision Field Science</div>
        <div class="r-card-desc">Crop health measurements and sensor instrumentation that bridge AI systems with agricultural decision-making.</div>
      </div>
    </article>
    <article class="r-card">
      <div class="media"><img src="assets/images%20copy/02_AI_Farms_Research/IMG_3363.JPG" alt="Crop sensing and environmental monitoring research" loading="lazy" style="object-position:center 40%"></div>
      <div class="r-card-body">
        <div class="r-card-num">02</div>
        <div class="r-card-title">Sensors &amp; Greenhouse AI</div>
        <div class="r-card-desc">Controlled-environment monitoring for real-time environmental data and yield-oriented research.</div>
      </div>
    </article>
    <article class="r-card">
      <div class="media"><img src="assets/images%20copy/02_AI_Farms_Research/IMG_2775.JPEG" alt="AI Farms greenhouse and research infrastructure" loading="lazy" style="object-position:center 45%"></div>
      <div class="r-card-body">
        <div class="r-card-num">03</div>
        <div class="r-card-title">Research Infrastructure</div>
        <div class="r-card-desc">Systems and facilities that make continuous experimentation possible — from beds to automation.</div>
      </div>
    </article>
  </div>

  <div class="research-feature reveal">
    <img src="assets/images%20copy/05_Industry_Corporate/10198.jpg" alt="Cameron Jones presenting first-author research poster on AI-powered robotic systems" loading="lazy" style="object-position:center 18%">
    <div>
      <h3>First-Author<br><span>Research Poster.</span></h3>
      <p>"Integrating AI-Powered Robotic Systems for Precision Agriculture and Environmental Monitoring" — developed and presented with Tuskegee University, USDA, CROPPS, and Cornell University.</p>
      <p>The work bridges autonomous platforms with environmental sensing — showing how AI and robotics can inform agricultural decisions at scale.</p>
    </div>
  </div>

  <div class="collab-bar reveal">
    <span class="collab-label">Collaborators</span>
    <div class="collab-div"></div>
    <span class="collab-name">Tuskegee University</span>
    <div class="collab-div"></div>
    <span class="collab-name">USDA</span>
    <div class="collab-div"></div>
    <span class="collab-name">CROPPS</span>
    <div class="collab-div"></div>
    <span class="collab-name">Cornell University</span>
  </div>

  <div class="impact-line reveal">
    <p><strong>Impact.</strong> Drone overhead. Autonomous rover on the ground. Robot dog walking the field — deployed together for researchers, dignitaries, and students.</p>
  </div>
</section>

<section id="robotics">
  <div class="section-header reveal" style="padding:0 var(--pad-x)">
    <div class="section-eyebrow">Autonomous Systems</div>
    <h2 class="section-title">Machines That<br><em>Move.</em></h2>
    <p class="section-subtitle">Robot dog. Drone. Rover. Clear platforms. Real deployments. Community demos that make autonomy tangible.</p>
  </div>

  <div class="robo-cats">
    <div class="reveal">
      <div class="robo-cat-label">Autonomous Robotics</div>
      <div class="robo-grid duo">
        <article class="robo-card featured">
          <div class="media"><img src="assets/images%20copy/03_Robotics/IMG_6667.JPG" alt="Silver LiDAR-equipped quadruped robot during field research" loading="lazy" style="object-position:center 45%"></div>
          <div class="robo-card-body">
            <div class="robo-card-title">Robot Dog — Field Platform</div>
            <div class="robo-card-desc">Quadruped systems for terrain traversal, sensing, and live research demonstrations.</div>
          </div>
        </article>
        <article class="robo-card">
          <div class="media"><img src="assets/images%20copy/03_Robotics/IMG_0073.JPG" alt="Quadruped robot platform close detail" loading="lazy" style="object-position:center 40%"></div>
          <div class="robo-card-body">
            <div class="robo-card-title">Platform Detail</div>
            <div class="robo-card-desc">Hardware built for outdoor autonomy — sensors, locomotion, and field readiness.</div>
          </div>
        </article>
      </div>
    </div>

    <div class="reveal">
      <div class="robo-cat-label">Field Deployment</div>
      <div class="robo-grid">
        <article class="robo-card">
          <div class="media"><img src="assets/images%20copy/03_Robotics/IMG_1936.JPG" alt="Multi-robot field deployment with drone, robot dog, and rovers" loading="lazy" style="object-position:center 45%"></div>
          <div class="robo-card-body">
            <div class="robo-card-title">Multi-Robot Ops</div>
            <div class="robo-card-desc">Coordinated fleets — aerial and ground systems operating in the same session.</div>
          </div>
        </article>
        <article class="robo-card">
          <div class="media"><img src="assets/images%20copy/03_Robotics/IMG_1561.JPG" alt="Large agricultural research rover platform" loading="lazy" style="object-position:center 40%"></div>
          <div class="robo-card-body">
            <div class="robo-card-title">Agricultural Rover</div>
            <div class="robo-card-desc">Ground platforms for crop-row navigation and field instrumentation.</div>
          </div>
        </article>
        <article class="robo-card">
          <div class="media"><img src="assets/images%20copy/03_Robotics/IMG_4364.JPG" alt="Autonomous rover systems prepared for deployment" loading="lazy" style="object-position:center 50%"></div>
          <div class="robo-card-body">
            <div class="robo-card-title">Rover Systems</div>
            <div class="robo-card-desc">Deployment-ready autonomy for outdoor agricultural research.</div>
          </div>
        </article>
      </div>
    </div>

    <div class="reveal">
      <div class="robo-cat-label">Community Demonstrations</div>
      <div class="robo-grid duo">
        <article class="robo-card">
          <div class="media"><img src="assets/images%20copy/03_Robotics/IMG_6659.JPG" alt="Robotics demonstration for community and stakeholders" loading="lazy" style="object-position:center 30%"></div>
          <div class="robo-card-body">
            <div class="robo-card-title">Live Demonstrations</div>
            <div class="robo-card-desc">Bringing autonomous systems to conferences, campuses, and public audiences.</div>
          </div>
        </article>
        <article class="robo-card">
          <div class="media"><img src="assets/images%20copy/03_Robotics/IMG_6658.JPG" alt="Robot dog operations during outreach demonstration" loading="lazy" style="object-position:center 35%"></div>
          <div class="robo-card-body">
            <div class="robo-card-title">Outreach Operations</div>
            <div class="robo-card-desc">Hands-on robotics that make AI tangible for students and communities.</div>
          </div>
        </article>
      </div>
    </div>
  </div>
</section>

<section id="projects">
  <div class="section-header reveal" style="padding:0 var(--pad-x)">
    <div class="section-eyebrow">Engineering</div>
    <h2 class="section-title">Systems Built.<br><em>Problems Solved.</em></h2>
    <p class="section-subtitle">From hackathon floors to custom hardware — end-to-end technical depth and creative problem solving.</p>
  </div>

  <div class="bento">
    <article class="proj proj-lg reveal">
      <div class="media"><img src="assets/images%20copy/06_Projects/IMG_0669.JPEG" alt="UIUC Precision Agriculture Hackathon first-place team with awards" loading="lazy" style="object-position:center 28%"></div>
      <div class="proj-body">
        <div class="proj-label">Hackathon · UIUC</div>
        <div class="proj-title">Precision Ag Hackathon</div>
        <p class="proj-desc">First Place — Analytics &amp; Decision Support Track. 2026 Precision &amp; Digital Agriculture Hackathon.</p>
        <div class="proj-tech"><span>Analytics</span><span>Decision Support</span><span>AgTech</span></div>
      </div>
    </article>
    <article class="proj proj-sm reveal reveal-d1">
      <div class="media"><img src="assets/images%20copy/06_Projects/IMG_0362.JPEG" alt="AuburnHacks team collaboration and project work" loading="lazy" style="object-position:center 25%"></div>
      <div class="proj-body">
        <div class="proj-label">Hackathon · AuburnHacks</div>
        <div class="proj-title">AuburnHacks Champion</div>
        <p class="proj-desc">First Place. "Project Tropical." Four teammates. One win.</p>
        <div class="proj-tech"><span>Full-Stack</span><span>Hackathon</span><span>Team Lead</span></div>
      </div>
    </article>
    <article class="proj proj-md reveal">
      <div class="media"><img src="assets/images%20copy/06_Projects/IMG_2713.JPG" alt="Hardware and systems project development" loading="lazy" style="object-position:center 40%"></div>
      <div class="proj-body">
        <div class="proj-label">Hardware · Systems</div>
        <div class="proj-title">Sensor &amp; Hardware Builds</div>
        <p class="proj-desc">Hands-on systems work — instrumentation, assembly, and iteration for research workloads.</p>
        <div class="proj-tech"><span>IoT</span><span>Hardware</span><span>Engineering</span></div>
      </div>
    </article>
    <article class="proj proj-md reveal reveal-d1">
      <div class="media"><img src="assets/images%20copy/06_Projects/IMG_8101.jpeg" alt="Custom PC hardware build engineered by Cameron Jones" loading="lazy" style="object-position:center 40%"></div>
      <div class="proj-body">
        <div class="proj-label">Hardware · Systems</div>
        <div class="proj-title">Custom PC Builds</div>
        <p class="proj-desc">End-to-end custom computing hardware for research and development workloads.</p>
        <div class="proj-tech"><span>Hardware</span><span>Systems</span><span>Performance</span></div>
      </div>
    </article>
    <article class="proj proj-md reveal reveal-d2">
      <div class="media"><img src="assets/images%20copy/06_Projects/IMG_2402.JPG" alt="Project development and technical build process" loading="lazy" style="object-position:center 35%"></div>
      <div class="proj-body">
        <div class="proj-label">Build · Process</div>
        <div class="proj-title">Prototype to Product</div>
        <p class="proj-desc">Iterating from concept to working systems — the craft behind shipped solutions.</p>
        <div class="proj-tech"><span>Prototyping</span><span>Build</span><span>Iteration</span></div>
      </div>
    </article>
  </div>
</section>

<section id="leadership">
  <div class="section-header reveal" style="padding:0 var(--pad-x)">
    <div class="section-eyebrow">Leadership &amp; Community</div>
    <h2 class="section-title">Impact Beyond<br>the <em>Lab.</em></h2>
    <p class="section-subtitle">From Capitol Hill to elementary classrooms — building bridges between technology and the communities that need it most.</p>
  </div>

  <div class="lead-layout">
    <ul class="lead-list reveal">
      <li class="l-item">
        <div class="l-num">01</div>
        <div>
          <div class="l-org">UNCF</div>
          <div class="l-role">UNCF Ambassador</div>
          <div class="l-desc">Representing the United Negro College Fund at corporate summits and the HBCU Tech-E Summit — advocating for HBCU students and STEM access at the highest levels.</div>
        </div>
      </li>
      <li class="l-item">
        <div class="l-num">02</div>
        <div>
          <div class="l-org">MANRRS · Syngenta</div>
          <div class="l-role">SMART Ag Tech Cohort</div>
          <div class="l-desc">Selected for the MANRRS S²MART Academy Technology Track — deploying robotics at national conferences and visiting Syngenta HQ.</div>
        </div>
      </li>
      <li class="l-item">
        <div class="l-num">03</div>
        <div>
          <div class="l-org">Community Outreach</div>
          <div class="l-role">Elementary STEM Educator</div>
          <div class="l-desc">Bringing robot dogs, drones, and coding workshops into elementary schools — sparking curiosity in the next generation of technologists.</div>
        </div>
      </li>
      <li class="l-item">
        <div class="l-num">04</div>
        <div>
          <div class="l-org">FFA</div>
          <div class="l-role">Honor Society of Agriculture</div>
          <div class="l-desc">Inducted member of the FFA Honor Society — recognized for excellence in agricultural education and leadership.</div>
        </div>
      </li>
      <li class="l-item">
        <div class="l-num">05</div>
        <div>
          <div class="l-org">Tuskegee University</div>
          <div class="l-role">AI Farms Research Assistant</div>
          <div class="l-desc">Since October 2022 — leading field research, drone operations, and robot demonstrations for university, government, and industry stakeholders.</div>
        </div>
      </li>
    </ul>

    <div class="lead-mosaic reveal reveal-d1">
      <img src="assets/images%20copy/04_Leadership_Community/IMG_6289.jpeg" alt="Cameron Jones volunteering with United Way Meals on Wheels" loading="lazy" style="object-position:center 20%">
      <img src="assets/images%20copy/04_Leadership_Community/IMG_0062.JPG" alt="STEM outreach and youth engagement" loading="lazy" style="object-position:center 25%">
      <img src="assets/images%20copy/04_Leadership_Community/IMG_0055.JPG" alt="Workshop engagement and community education" loading="lazy" style="object-position:center 30%">
      <img src="assets/images%20copy/04_Leadership_Community/8900312655144300583.jpg" alt="Leadership and advocacy event" loading="lazy" style="object-position:center 18%">
    </div>
  </div>

  <div class="industry-header reveal">
    <div class="section-eyebrow left">Industry &amp; Institutions</div>
    <h2 class="section-title">Professional<br><em>Exposure.</em></h2>
    <p class="section-subtitle">From corporate campuses to research partnerships — relationships across industry and academia.</p>
  </div>

  <div class="corp-strip reveal" style="grid-template-columns:repeat(4,1fr)">
    <article class="corp-card">
      <div class="media"><img src="assets/images%20copy/05_Industry_Corporate/10196.jpg" alt="Industry leadership engagement" loading="lazy" style="object-position:center 25%"></div>
      <div class="corp-card-label">Industry · Leadership</div>
    </article>
    <article class="corp-card">
      <div class="media"><img src="assets/images%20copy/05_Industry_Corporate/20250425_Tuskegee%20CROPPS%20visit-9800.jpeg" alt="CROPPS research collaboration visit at Tuskegee" loading="lazy" style="object-position:center 30%"></div>
      <div class="corp-card-label">CROPPS · Cornell Network</div>
    </article>
    <article class="corp-card">
      <div class="media"><img src="assets/images%20copy/05_Industry_Corporate/1915048171914742516.jpg" alt="Professional networking and research partnership" loading="lazy" style="object-position:center 30%"></div>
      <div class="corp-card-label">Syngenta · MANRRS</div>
    </article>
    <article class="corp-card">
      <div class="media"><img src="assets/images%20copy/05_Industry_Corporate/20250425_Tuskegee%20CROPPS%20visit-9796.jpeg" alt="Field research with institutional partners" loading="lazy" style="object-position:center 40%"></div>
      <div class="corp-card-label">Field · Partners</div>
    </article>
  </div>
</section>

<section id="selected">
  <div class="section-header reveal" style="padding:0 var(--pad-x)">
    <div class="section-eyebrow">Curated</div>
    <h2 class="section-title">Selected<br><em>Work.</em></h2>
    <p class="section-subtitle">A short visual edit — the frames that best represent the research, robotics, and impact story.</p>
  </div>
  <div class="gallery-track-wrap">
    <div class="gallery-track" id="carouselTrack">
      <figure class="gallery-slide"><img src="assets/images%20copy/03_Robotics/IMG_1936.JPG" alt="Multi-robot field deployment" loading="lazy"><figcaption>Multi-Robot Field Ops</figcaption></figure>
      <figure class="gallery-slide"><img src="assets/images%20copy/02_AI_Farms_Research/IMG_2029.JPEG" alt="Greenhouse research systems" loading="lazy"><figcaption>Greenhouse Systems</figcaption></figure>
      <figure class="gallery-slide"><img src="assets/images%20copy/03_Robotics/IMG_6667.JPG" alt="Robot dog field research" loading="lazy"><figcaption>Robot Dog</figcaption></figure>
      <figure class="gallery-slide"><img src="assets/images%20copy/05_Industry_Corporate/10198.jpg" alt="Research poster presentation" loading="lazy" style="object-position:center 15%"><figcaption>First-Author Poster</figcaption></figure>
      <figure class="gallery-slide"><img src="assets/images%20copy/06_Projects/IMG_0669.JPEG" alt="UIUC hackathon first place" loading="lazy" style="object-position:center 25%"><figcaption>UIUC — First Place</figcaption></figure>
      <figure class="gallery-slide"><img src="assets/images%20copy/04_Leadership_Community/IMG_5565.JPG" alt="Leadership cohort" loading="lazy" style="object-position:center 25%"><figcaption>Leadership</figcaption></figure>
      <figure class="gallery-slide"><img src="assets/images%20copy/03_Robotics/IMG_1561.JPG" alt="Agricultural rover" loading="lazy"><figcaption>Agricultural Rover</figcaption></figure>
      <figure class="gallery-slide"><img src="assets/images%20copy/10_Honors_Achievements/20260420_180837.jpg" alt="Academic honor recognition" loading="lazy" style="object-position:center 18%"><figcaption>Honors</figcaption></figure>
    </div>
  </div>
  <div class="gallery-controls">
    <button class="gallery-btn" id="prevBtn" type="button" aria-label="Previous">&#8592;</button>
    <button class="gallery-btn" id="nextBtn" type="button" aria-label="Next">&#8594;</button>
  </div>
</section>

<section id="beyond">
  <div class="section-header reveal" style="padding:0 var(--pad-x)">
    <div class="section-eyebrow">Life Outside Tech</div>
    <h2 class="section-title">Beyond<br>the <em>Lab.</em></h2>
    <p class="section-subtitle">The outdoors grounds me. Kayaking, fishing, photography — finding signal in the natural world.</p>
  </div>
  <div class="beyond-grid reveal" style="grid-template-columns:repeat(2,1fr)">
    <article class="beyond-card" style="grid-column:1/-1">
      <div class="media" style="aspect-ratio:21/9;min-height:280px"><img src="assets/images%20copy/07_Hobbies_and_Passions/IMG_6209.jpeg" alt="Cameron Jones holding a catch after fishing by the lake" loading="lazy" style="object-position:center 20%"></div>
      <div class="beyond-caption">On the Water — Fishing</div>
    </article>
    <article class="beyond-card">
      <div class="media"><img src="assets/images%20copy/07_Hobbies_and_Passions/IMG_2945.JPG" alt="Outdoor passion photography" loading="lazy" style="object-position:center 25%"></div>
      <div class="beyond-caption">Outdoors</div>
    </article>
    <article class="beyond-card">
      <div class="media"><img src="assets/images%20copy/07_Hobbies_and_Passions/IMG_9256.JPG" alt="Hobby and passion photography" loading="lazy" style="object-position:center 30%"></div>
      <div class="beyond-caption">Passions</div>
    </article>
    <article class="beyond-card">
      <div class="media"><img src="assets/images%20copy/08_Beyond_The_Lab/IMG_6682.JPG" alt="Cinematic personal photography" loading="lazy" style="object-position:center 28%"></div>
      <div class="beyond-caption">Moments Beyond Work</div>
    </article>
  </div>
  <p class="beyond-note">· Kayaking · Fishing · Photography ·</p>
</section>

<section id="roots">
  <div class="roots-layout">
    <div class="reveal">
      <div class="section-eyebrow left" style="margin-bottom:1.6rem">Family &amp; Legacy</div>
      <h2 class="roots-quote">Tuskegee<br><span>Runs</span><br>Deep.</h2>
      <p class="roots-text">My connection to Tuskegee University isn't just academic — it's generational. My parents are alumni. My siblings attended. This institution, founded in 1881 by Booker T. Washington, shaped my family across decades and continues to shape me.</p>
      <p class="roots-text">When I walk across that campus, I carry the weight and the pride of everyone who came before me. That legacy fuels every research paper, every robot deployment, every presentation I give.</p>
      <p class="roots-text">I'm not just attending Tuskegee. I'm adding to its story.</p>
    </div>
    <div class="roots-photos reveal reveal-d1">
      <img src="assets/images%20copy/09_Tuskegee_Legacy/IMG_5528.jpeg" alt="Cameron Jones with family on Tuskegee football field" loading="lazy" style="object-position:center 25%">
      <img src="assets/images%20copy/09_Tuskegee_Legacy/IMG_5538.jpeg" alt="Tuskegee University pride and campus moment" loading="lazy" style="object-position:center 25%">
      <img src="assets/images%20copy/09_Tuskegee_Legacy/IMG_4112.JPEG" alt="Family and Tuskegee legacy gathering" loading="lazy" style="object-position:center 20%">
      <img src="assets/images%20copy/09_Tuskegee_Legacy/IMG_0596.PNG" alt="Tuskegee legacy and campus tradition" loading="lazy" style="object-position:center 30%">
    </div>
  </div>
</section>

<section id="honors">
  <div class="section-header reveal" style="padding:0 var(--pad-x);margin-bottom:2rem">
    <div class="section-eyebrow">Recognition</div>
    <h2 class="section-title" style="font-size:clamp(2.2rem,4vw,3.2rem)">Honors &amp; <em>Distinction</em></h2>
  </div>
  <div class="honors-grid reveal">
    <article class="honor-card">
      <div class="media"><img src="assets/images%20copy/10_Honors_Achievements/20260420_180837.jpg" alt="Formal academic honor society recognition" loading="lazy" style="object-position:center 15%"></div>
      <p>Academic Honor Recognition</p>
    </article>
    <article class="honor-card">
      <div class="media"><img src="assets/images%20copy/10_Honors_Achievements/9777.jpg" alt="Honor cords and academic achievement attire" loading="lazy" style="object-position:center 30%"></div>
      <p>Honor Cords &amp; Distinction</p>
    </article>
    <article class="honor-card">
      <div class="media"><img src="assets/images%20copy/10_Honors_Achievements/IMG_3233.JPG" alt="Achievement ceremony and recognition moment" loading="lazy" style="object-position:center 25%"></div>
      <p>Ceremony &amp; Achievement</p>
    </article>
  </div>
</section>

'''

# Find start of research section and start of journey (keep journey+)
m_start = re.search(r'<section id="research">', text)
m_journey = re.search(r'<section id="journey">', text)
if not m_start or not m_journey:
    raise SystemExit("Could not find research/journey anchors")

text = text[: m_start.start()] + sections_html + "\n" + text[m_journey.start() :]

# Fix lead mosaic for 4 images - CSS expects first full width
lead_mosaic_fix = """
.lead-mosaic{display:grid;grid-template-columns:1fr 1fr;gap:.85rem}
.lead-mosaic img{
  width:100%;height:clamp(140px,18vw,180px);object-fit:cover;border:.5px solid var(--border);
  transition:border-color .3s,transform .55s var(--ease);
}
.lead-mosaic img:hover{border-color:var(--border-strong)}
.lead-mosaic img:first-child{grid-column:1/-1;height:clamp(220px,28vw,300px);object-position:center 20%}
"""
text = re.sub(
    r"\.lead-mosaic\{display:grid;grid-template-columns:1fr 1fr;gap:\.85rem\}.*?\.lead-mosaic img:not\(:first-child\)\{height:clamp\(160px,22vw,210px\)\}",
    lead_mosaic_fix.strip(),
    text,
    count=1,
    flags=re.S,
)

# Mobile: corp-strip 4-col -> 2
if ".corp-strip{grid-template-columns:1fr 1fr}" not in text:
    text = text.replace(
        "@media (max-width:900px){",
        "@media (max-width:900px){\n  .corp-strip{grid-template-columns:1fr 1fr!important}",
        1,
    )

# Gallery id was #gallery — carousel JS may reference it; keep track id
# Verify media paths exist
from urllib.parse import unquote

missing = []
for src in re.findall(r'src="(assets/[^"]+)"', text):
    path = ROOT / unquote(src)
    if not path.exists():
        missing.append(src)

imgs = len(re.findall(r"<img\s", text))
vids = len(re.findall(r"<video\s", text, re.I))

html_path.write_text(text, encoding="utf-8")
print(f"Wrote {html_path}")
print(f"Images: {imgs}  Videos: {vids}")
print(f"Missing: {len(missing)}")
for m in missing[:30]:
    print(" MISSING", m)
