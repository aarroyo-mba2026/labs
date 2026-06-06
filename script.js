const header = document.querySelector(".site-header");
const form = document.querySelector(".contact-form");
const revealElements = document.querySelectorAll(".reveal");
const successModal = document.getElementById("formSuccessModal");
const closeModalButtons = document.querySelectorAll("[data-close-modal]");
const projectCards = document.querySelectorAll("[data-project-id]");
const projectModal = document.getElementById("projectModal");
const projectModalPanel = projectModal?.querySelector(".project-modal-panel");
const projectModalContent = document.getElementById("projectModalContent");
const closeProjectModalButtons = document.querySelectorAll("[data-close-project-modal]");
let activeProjectRevealObserver = null;
let lastFocusedElement = null;
let projectModalCloseTimer = null;

const projectData = {
  kanoa: {
    title: "Kanoa - The Super App for Pet Owners",
    hook: "This is about the time I co-founded a startup, reached a funding round, and chose an MBA over a term sheet.",
    oneLiner: "My first official venture, built to become a digital ecosystem for pet owners, and one of my earliest lessons in ambition, team building, and scale.",
    roleTags: ["Co-founder", "Built the founding team", "Product strategy", "Growth", "Analytics", "Fundraising", "Go-to-market"],
    outcome: [
      "Finalist in a government startup competition",
      "Decided to move my career from retail to digital businesses (one of the best career decisions I have made so far)",
      "Reached fundraising conversations with angel investors",
      "Faced the decision between going all-in and pursuing my MBA",
    ],
    coverImage: "./assets/projects/kanoa_portrait.png",
    logo: "./assets/projects/kanoa_logo.png",
    product: "Kanoa was a venture I started with Piero, a long-time friend and later repeat collaborator. The idea was to build a super app for pet owners: one place that could support all angles of their lives as pet owners and, over time, connect them with other pet owners too. We started with practical features like pet profiles, family sharing, reminders, notifications, and a pet-friendly map. The longer-term roadmap was more ambitious: a social layer where people could share advice, meet in parks, and help their pets find friends or partners.",
    learned: "It confirmed that entrepreneurship is not just an interest for me, it is a path I want to keep growing into. It was also the first time I built a digital product, and where I got hands-on exposure to product strategy, design thinking, user testing, fundraising, and the level of scale a network-driven idea would need to work.",
  },
  atlas: {
    title: "Atlas - Voice Agent for the LBS Network",
    hook: "57,000 alumni, one voice agent, and my first real step into building AI products.",
    oneLiner: "A Public Favourite-winning prototype we built for the first AI Agents Cup at London Business School, using a five-minute voice call to unlock richer alumni insights and more specific, insight-rich connections across a 57,000-person network.",
    roleTags: ["AI product definition", "User research", "Problem framing", "Feature definition", "Voice call design", "Prototyping", "Pitch"],
    outcome: [
      "Won Public Favourite at the first AI Agents Cup at London Business School",
      "Built a functional prototype with voice calls and natural-language search",
    ],
    coverImage: "./assets/projects/atlas_portrait croped.png",
    logo: "./assets/projects/atlas_logo.jpeg",
    product: "Atlas was a functional prototype built for the first AI Agents Cup at London Business School. The product had two parts: a voice agent that could capture richer, open-ended alumni context in calls of under five minutes, and a natural-language search layer that helped users find highly specific people across the LBS network. It was imagined as part of a broader pipeline of AI prototypes that could help the school respond to real community needs.",
    learned: "It gave me my first real experience building an AI product with agents and voice. More importantly, it taught me that understanding the latest technology matters, but only if it stays grounded in a real user problem instead of chasing the solution for its own sake.",
  },
  "name-to-face": {
    title: "Name to Face - A Memory Game for My MBA Cohort",
    hook: "A game I built for myself when 450 new faces made me want networking to feel more human.",
    oneLiner: "A personal memory game I built to help me associate names with faces across my 450-person MBA cohort.",
    roleTags: ["Product concept", "Data structuring", "Vibe coding", "Development", "Deployment"],
    outcome: [
      "Built from scratch with AI support for the first time, from idea to deployment",
      "Proved strong demand for the need, with around 10% of the cohort interested",
      "Tested by several friends from the cohort on my device",
    ],
    coverImage: "./assets/projects/game_full croped.png",
    logo: "./assets/projects/game_logo.png",
    product: "Name to Face was a lightweight game I built for myself at the start of my MBA. In a cohort of 450 people, I found it hard to remember names even when I remembered faces and conversations. So I built a simple game in Python, deployed it to Google Cloud, and used a personal database of photos to test myself on people’s names.",
    learned: "It showed me how quickly a personal need can become a viable product with the right tools. More than proving that I could build it, the project showed me how fast I could go from idea to something real and usable.",
  },
  ava: {
    title: "Ava - A Physical Voice Companion for Active Ageing",
    hook: "A physical AI product for older adults, created to make inactivity less likely and independence easier to keep.",
    oneLiner: "A physical, voice-based AI product and business model we developed for an entrepreneurship funding competition, designed to help older adults stay active and independent through family support.",
    roleTags: ["Product strategy", "Market research", "Product concept", "Business model", "Pitch"],
    outcome: [
      "Identified a strong market opportunity with a real user problem worth testing",
      "Built a full venture proposal for a funding competition",
      "Developed the product story, market framing, and business model",
    ],
    coverImage: "./assets/projects/ava_portrait.png",
    logo: "./assets/projects/ava_logo.png",
    product: "Ava was a physical, voice-based venture concept for a funding competition, created for older adults at risk of becoming more inactive and isolated. The idea was a proactive companion that would not wait to be asked, but would help turn an empty day into an active one through conversation, social prompts, and activity planning. It was meant to support the older adult directly, while also giving family members a safer and more manageable way to stay involved.",
    learned: "It got me into the details of building an AI entrepreneurship from the ground up, combining new skills from my MBA with my previous experience in product and business. It also gave me my first real exposure to market research and to the emerging category of physical AI companions.",
  },
};

const modalSections = [
  ["The product", "product"],
  ["My role", "myRole"],
  ["What I learned", "learned"],
  ["Outcome", "outcome"],
];

const updateHeader = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 50);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: "0px 0px -80px 0px",
  }
);

revealElements.forEach((element) => observer.observe(element));

const updateBodyModalState = () => {
  const hasOpenSuccessModal = successModal?.classList.contains("is-visible");
  const hasOpenProjectModal =
    projectModal?.classList.contains("is-visible") || projectModal?.classList.contains("is-closing");
  document.body.classList.toggle("modal-open", Boolean(hasOpenSuccessModal || hasOpenProjectModal));
};

const escapeHTML = (value = "") =>
  String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };

    return entities[character];
  });

const getProjectInitials = (title) =>
  title
    .split(/\s+/)
    .filter((word) => /^[a-z0-9]/i.test(word))
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

const renderCategoryTags = (categories = []) =>
  categories
    .map((category, index) => {
      const colors = ["red", "teal", "gold"];
      return `<span class="project-modal-tag project-modal-tag-${colors[index % colors.length]}">${escapeHTML(category)}</span>`;
    })
    .join("");

const renderRoleTags = (tags = []) =>
  tags.map((tag) => `<span class="project-modal-role-tag">${escapeHTML(tag)}</span>`).join("");

const renderOutcomeItems = (items = []) =>
  items.map((item) => `<li>${escapeHTML(item)}</li>`).join("");

const renderProjectSection = ([label, key], project, index) => {
  if (key === "myRole") {
    return `
      <section class="project-modal-section modal-reveal" style="transition-delay: ${index * 70}ms">
        <h3>${escapeHTML(label)}</h3>
        <div class="project-modal-role-tags">${renderRoleTags(project.roleTags)}</div>
      </section>
    `;
  }

  if (key === "outcome") {
    return `
      <section class="project-modal-section modal-reveal" style="transition-delay: ${index * 70}ms">
        <h3>${escapeHTML(label)}</h3>
        <ul class="project-modal-outcomes">${renderOutcomeItems(project.outcome)}</ul>
      </section>
    `;
  }

  return `
    <section class="project-modal-section modal-reveal" style="transition-delay: ${index * 70}ms">
      <h3>${escapeHTML(label)}</h3>
      <p>${escapeHTML(project[key])}</p>
    </section>
  `;
};

const prepareProjectRevealObserver = () => {
  if (!projectModalContent) return;
  if (activeProjectRevealObserver) {
    activeProjectRevealObserver.disconnect();
  }

  activeProjectRevealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          activeProjectRevealObserver.unobserve(entry.target);
        }
      });
    },
    {
      root: projectModalContent,
      threshold: 0.1,
      rootMargin: "0px 0px -60px 0px",
    }
  );

  projectModalContent.querySelectorAll(".modal-reveal").forEach((element) => {
    activeProjectRevealObserver.observe(element);
  });
};

const renderProjectModal = (project) => {
  if (!projectModalContent) return;

  const logoMarkup = project.logo
    ? `<img src="${escapeHTML(project.logo)}" alt="${escapeHTML(project.title)} logo" onerror="this.remove()" />`
    : `<span>${escapeHTML(getProjectInitials(project.title))}</span>`;

  projectModalContent.innerHTML = `
    <div class="project-modal-cover">
      <img src="${escapeHTML(project.coverImage)}" alt="${escapeHTML(project.title)} cover image" />
    </div>

    <header class="project-modal-header">
      <div class="project-modal-logo">${logoMarkup}</div>
      <div class="project-modal-title-row modal-reveal">
        <div>
          <h2 id="project-modal-title">${escapeHTML(project.title)}</h2>
          <p class="project-modal-tagline">${escapeHTML(project.oneLiner)}</p>
        </div>
      </div>
      <div class="project-modal-categories modal-reveal" style="transition-delay: 70ms">
        ${renderCategoryTags(project.roleTags.slice(0, 3))}
      </div>
    </header>

    <div class="project-modal-content">
      ${modalSections.map((section, index) => renderProjectSection(section, project, index + 2)).join("")}
    </div>
  `;
};

const openProjectModal = (projectId) => {
  const project = projectData[projectId];
  if (!project || !projectModal || !projectModalPanel || !projectModalContent) return;

  window.clearTimeout(projectModalCloseTimer);
  projectModal.classList.remove("is-closing");
  lastFocusedElement = document.activeElement;
  renderProjectModal(project);
  projectModalContent.scrollTop = 0;
  projectModal.classList.add("is-visible");
  projectModal.setAttribute("aria-hidden", "false");
  updateBodyModalState();
  prepareProjectRevealObserver();

  requestAnimationFrame(() => {
    projectModalPanel.focus();
  });
};

const closeProjectModal = () => {
  if (!projectModal) return;
  if (!projectModal.classList.contains("is-visible")) return;

  projectModal.classList.remove("is-visible");
  projectModal.classList.add("is-closing");
  projectModal.setAttribute("aria-hidden", "true");
  if (activeProjectRevealObserver) {
    activeProjectRevealObserver.disconnect();
    activeProjectRevealObserver = null;
  }
  updateBodyModalState();

  if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
    lastFocusedElement.focus();
  }

  projectModalCloseTimer = window.setTimeout(() => {
    projectModal.classList.remove("is-closing");
    updateBodyModalState();
  }, 300);
};

const trapProjectModalFocus = (event) => {
  if (!projectModal?.classList.contains("is-visible") || event.key !== "Tab") return;

  const focusableElements = projectModal.querySelectorAll(
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
  );
  const visibleFocusableElements = Array.from(focusableElements).filter(
    (element) => element.offsetParent !== null
  );
  const firstElement = visibleFocusableElements[0];
  const lastElement = visibleFocusableElements[visibleFocusableElements.length - 1];

  if (!firstElement || !lastElement) return;

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
};

projectCards.forEach((card) => {
  const openCardProject = () => openProjectModal(card.dataset.projectId);

  card.addEventListener("click", openCardProject);
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openCardProject();
    }
  });
});

closeProjectModalButtons.forEach((button) => {
  button.addEventListener("click", closeProjectModal);
});

const emailInput = document.querySelector('.contact-form input[name="email"]');
const replyToInput = document.querySelector('.contact-form input[name="_replyto"]');

if (emailInput && replyToInput) {
  emailInput.addEventListener("input", () => {
    replyToInput.value = emailInput.value.trim();
  });
}

const openSuccessModal = () => {
  if (!successModal) return;
  successModal.classList.add("is-visible");
  successModal.setAttribute("aria-hidden", "false");
  updateBodyModalState();
};

const closeSuccessModal = () => {
  if (!successModal) return;
  successModal.classList.remove("is-visible");
  successModal.setAttribute("aria-hidden", "true");
  updateBodyModalState();
};

closeModalButtons.forEach((button) => {
  button.addEventListener("click", closeSuccessModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeProjectModal();
    closeSuccessModal();
  }

  trapProjectModalFocus(event);
});

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        form.reset();
        openSuccessModal();
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    }
  });
}
