// Theme Management
function initTheme() {
      const theme = localStorage.getItem('theme') || 'light';
      document.body.setAttribute('data-theme', theme);
}

// Search Functionality
class DocSearch {
      constructor() {
            this.searchInput = document.getElementById('search-input');
            this.searchResults = document.getElementById('search-results');
            this.sections = Array.from(document.querySelectorAll('.doc-section'));
            this.searchData = this.buildSearchIndex();

            this.setupEventListeners();
      }

      buildSearchIndex() {
            return this.sections.map(section => ({
                  id: section.id,
                  title: section.querySelector('h1, h2').textContent,
                  content: section.textContent,
                  element: section
            }));
      }

      setupEventListeners() {
            this.searchInput.addEventListener('input', () => this.handleSearch());
            this.searchInput.addEventListener('focus', () => this.searchResults.style.display = 'block');

            document.addEventListener('click', (e) => {
                  if (!this.searchInput.contains(e.target) && !this.searchResults.contains(e.target)) {
                        this.searchResults.style.display = 'none';
                  }
            });
      }

      handleSearch() {
            const query = this.searchInput.value.toLowerCase().trim();

            if (!query) {
                  this.searchResults.style.display = 'none';
                  return;
            }

            const results = this.searchData
                  .filter(item =>
                        item.title.toLowerCase().includes(query) ||
                        item.content.toLowerCase().includes(query)
                  )
                  .slice(0, 5); // Limit to 5 results

            this.displayResults(results);
      }

      displayResults(results) {
            if (!results.length) {
                  this.searchResults.style.display = 'none';
                  return;
            }

            this.searchResults.innerHTML = results
                  .map(result => `
                <div class="search-result-item" data-section="${result.id}">
                    ${result.title}
                </div>
            `)
                  .join('');

            this.searchResults.style.display = 'block';

            // Add click handlers to results
            this.searchResults.querySelectorAll('.search-result-item').forEach(item => {
                  item.addEventListener('click', () => {
                        const section = document.getElementById(item.dataset.section);
                        section.scrollIntoView({ behavior: 'smooth' });
                        this.searchResults.style.display = 'none';
                        this.searchInput.value = '';
                  });
            });
      }
}

// Navigation handling
class Navigation {
      constructor() {
            this.navLinks = document.querySelectorAll('.nav-link');
            this.setupNavigation();
            this.setupMobileMenu();
      }

      setupNavigation() {
            this.navLinks.forEach(link => {
                  link.addEventListener('click', (e) => {
                        e.preventDefault();
                        const targetId = link.getAttribute('href').substring(1);
                        const targetSection = document.getElementById(targetId);

                        if (targetSection) {
                              // Update active state
                              this.navLinks.forEach(l => l.classList.remove('active'));
                              link.classList.add('active');

                              // Calculate offset for search bar
                              const searchContainer = document.querySelector('.search-container');
                              const offset = searchContainer ? searchContainer.offsetHeight + 20 : 0;

                              // Smooth scroll with offset
                              const targetPosition = targetSection.offsetTop - offset;
                              window.scrollTo({
                                    top: targetPosition,
                                    behavior: 'smooth'
                              });

                              // Add a small delay before updating active state to ensure proper scroll position
                              setTimeout(() => {
                                    // Update active link based on current scroll position
                                    this.updateActiveLink();
                              }, 100);

                              // Close mobile menu if open
                              document.querySelector('.sidebar').classList.remove('active');
                        }
                  });
            });

            window.addEventListener('scroll', () => this.updateActiveLink());
      }

      updateActiveLink() {
            requestAnimationFrame(() => {
                  const searchContainer = document.querySelector('.search-container');
                  const offset = searchContainer ? searchContainer.offsetHeight : 0;
                  const scrollPosition = window.scrollY + window.innerHeight / 2;  // Use middle of viewport
                  const sections = Array.from(document.querySelectorAll('.doc-section'));

                  // Find the current section
                  let currentSection = null;
                  for (const section of sections) {
                        const rect = section.getBoundingClientRect();
                        const sectionTop = rect.top + window.scrollY;
                        const sectionBottom = sectionTop + rect.height;

                        if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
                              currentSection = section;
                              break;
                        }
                  }

                  // If no section is found and we're at the bottom, use the last section
                  if (!currentSection && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50) {
                        currentSection = sections[sections.length - 1];
                  }

                  // If no section is found and we're at the top, use the first section
                  if (!currentSection && window.scrollY < 50) {
                        currentSection = sections[0];
                  }

                  if (currentSection) {
                        const currentId = currentSection.getAttribute('id');
                        this.navLinks.forEach(link => {
                              const href = link.getAttribute('href');
                              if (href === `#${currentId}`) {
                                    if (!link.classList.contains('active')) {
                                          link.classList.add('active');
                                    }
                              } else {
                                    link.classList.remove('active');
                              }
                        });
                  }
            });
      }

      setupMobileMenu() {
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'mobile-menu-toggle';
            toggleBtn.innerHTML = `
            <ion-icon name="chevron-forward-outline" aria-hidden="true"></ion-icon>
            <span class="sr-only">Toggle menu</span>
        `;
            toggleBtn.setAttribute('aria-label', 'Toggle menu');

            // Insert the toggle button at the start of the search container
            const searchContainer = document.querySelector('.search-container');
            searchContainer.insertBefore(toggleBtn, searchContainer.firstChild);

            toggleBtn.addEventListener('click', () => {
                  const sidebar = document.querySelector('.sidebar');
                  sidebar.classList.toggle('active');
                  toggleBtn.setAttribute('aria-expanded', sidebar.classList.contains('active'));
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                  const sidebar = document.querySelector('.sidebar');
                  const isClickInsideMenu = sidebar.contains(e.target);
                  const isClickOnToggle = e.target.closest('.mobile-menu-toggle');

                  if (!isClickInsideMenu && !isClickOnToggle && sidebar.classList.contains('active')) {
                        sidebar.classList.remove('active');
                        toggleBtn.setAttribute('aria-expanded', 'false');
                  }
            });
      }
}

// Mobile Navigation
class MobileNav {
      constructor() {
            this.sidebar = document.querySelector('.sidebar');
            this.setupMobileNav();
      }

      setupMobileNav() {
            // Add toggle button for mobile
            //   const toggleBtn = document.createElement('button');
            //   toggleBtn.classList.add('mobile-nav-toggle');
            //   toggleBtn.innerHTML = '<ion-icon name="menu-outline"></ion-icon>';
            //   document.body.appendChild(toggleBtn);

            //   toggleBtn.addEventListener('click', () => {
            //       this.sidebar.classList.toggle('active');
            //   });

            // Close sidebar when clicking a link on mobile
            document.querySelectorAll('.nav-link').forEach(link => {
                  link.addEventListener('click', () => {
                        if (window.innerWidth <= 768) {
                              this.sidebar.classList.remove('active');
                        }
                  });
            });
      }
}

// FAQ Accordion
class FAQAccordion {
      constructor() {
            this.faqItems = document.querySelectorAll('.faq-item');
            this.setupAccordion();
      }

      setupAccordion() {
            this.faqItems.forEach(item => {
                  const question = item.querySelector('.faq-question');
                  const answer = item.querySelector('.faq-answer');
                  const content = answer.querySelector('.faq-content');

                  // Set initial height to 0
                  answer.style.maxHeight = '0px';

                  question.addEventListener('click', () => {
                        // Toggle the faq-item active state
                        const isActive = item.classList.contains('active');

                        // Close all other items
                        this.faqItems.forEach(otherItem => {
                              if (otherItem !== item) {
                                    otherItem.classList.remove('active');
                                    const otherAnswer = otherItem.querySelector('.faq-answer');
                                    otherAnswer.style.maxHeight = '0px';
                              }
                        });

                        // Toggle current item
                        if (!isActive) {
                              item.classList.add('active');
                              question.setAttribute('aria-expanded', 'true');
                              answer.style.maxHeight = content.offsetHeight + 'px';
                        } else {
                              item.classList.remove('active');
                              question.setAttribute('aria-expanded', 'false');
                              answer.style.maxHeight = '0px';
                        }
                  });
            });
      }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
      initTheme();
      new DocSearch();
      new Navigation();
      new MobileNav();
      new FAQAccordion();
});
