/**
 * Projects Page JavaScript
 * Loads and displays projects from JSON data (without images)
 */

(function() {
    const projectsGrid = document.getElementById('projects-grid');
    const projectsFilter = document.getElementById('projects-filter');
    const noResults = document.getElementById('no-results');
    
    let allProjects = [];
    let currentCategory = 'all';

    // Load projects
    async function loadProjects() {
        try {
            const response = await fetch('content/projects/projects.json');
            const data = await response.json();
            allProjects = data.projects;
            renderProjects(allProjects);
        } catch (error) {
            console.error('Error loading projects:', error);
            projectsGrid.innerHTML = `
                <div class="no-results">
                    <h3>Unable to load projects</h3>
                    <p>Please try again later.</p>
                </div>
            `;
        }
    }

    // Render projects to the grid (without images)
    function renderProjects(projects) {
        if (projects.length === 0) {
            projectsGrid.innerHTML = '';
            noResults.classList.remove('hidden');
            return;
        }

        noResults.classList.add('hidden');
        
        projectsGrid.innerHTML = projects.map(project => `
            <article class="project-card glass-card" style="overflow: visible;">
                <div class="project-content" style="padding: var(--spacing-xl);">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                        <span class="project-category">${window.utils.escapeHtml(project.category)}</span>
                        ${project.github ? `
                        <a href="${project.github}" target="_blank" rel="noopener" style="color: var(--primary-light);" aria-label="View on GitHub">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                        </a>
                        ` : ''}
                    </div>
                    <h3 class="project-title">${window.utils.escapeHtml(project.title)}</h3>
                    <p class="project-description">${window.utils.escapeHtml(project.description)}</p>
                    <div class="project-tech">
                        ${project.tech.map(t => `<span>${window.utils.escapeHtml(t)}</span>`).join('')}
                    </div>
                    ${project.date ? `<p style="font-size: 0.75rem; color: var(--text-tertiary); margin-top: 0.75rem;">${window.utils.escapeHtml(project.date)}</p>` : ''}
                </div>
            </article>
        `).join('');
    }

    // Filter projects by category
    function filterProjects() {
        let filtered = allProjects;

        if (currentCategory !== 'all') {
            filtered = allProjects.filter(project => project.category === currentCategory);
        }

        renderProjects(filtered);
    }

    // Category filter functionality
    if (projectsFilter) {
        projectsFilter.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                // Update active state
                projectsFilter.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                e.target.classList.add('active');

                // Filter projects
                currentCategory = e.target.dataset.category;
                filterProjects();
            }
        });
    }

    // Initialize
    loadProjects();
})();
