/**
 * Blog Page JavaScript
 * Loads and displays blog posts from JSON data (without images)
 */

(function() {
    const blogGrid = document.getElementById('blog-grid');
    const searchInput = document.getElementById('blog-search');
    const categoryFilter = document.getElementById('category-filter');
    const noResults = document.getElementById('no-results');
    
    let allPosts = [];
    let currentCategory = 'all';
    let searchQuery = '';

    // Load blog posts
    async function loadPosts() {
        try {
            const response = await fetch('content/blog/posts.json');
            const data = await response.json();
            allPosts = data.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
            renderPosts(allPosts);
        } catch (error) {
            console.error('Error loading blog posts:', error);
            blogGrid.innerHTML = `
                <div class="no-results">
                    <h3>Unable to load posts</h3>
                    <p>Please try again later.</p>
                </div>
            `;
        }
    }

    // Render posts to the grid (without images)
    function renderPosts(posts) {
        if (posts.length === 0) {
            blogGrid.innerHTML = '';
            noResults.classList.remove('hidden');
            return;
        }

        noResults.classList.add('hidden');
        
        blogGrid.innerHTML = posts.map(post => `
            <article class="blog-card glass-card">
                <div class="blog-card-content" style="padding: var(--spacing-xl);">
                    <div class="blog-card-meta">
                        <span class="blog-card-category">${window.utils.escapeHtml(post.category)}</span>
                        <span class="blog-card-date">${window.utils.formatDate(post.date)}</span>
                    </div>
                    <h2 class="blog-card-title">
                        <a href="blog-post.html?slug=${post.slug}">${window.utils.escapeHtml(post.title)}</a>
                    </h2>
                    <p class="blog-card-excerpt">${window.utils.escapeHtml(post.excerpt)}</p>
                    <a href="blog-post.html?slug=${post.slug}" class="blog-card-link">
                        Read more
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </a>
                </div>
            </article>
        `).join('');
    }

    // Filter posts based on category and search
    function filterPosts() {
        let filtered = allPosts;

        // Filter by category
        if (currentCategory !== 'all') {
            filtered = filtered.filter(post => post.category === currentCategory);
        }

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(post => 
                post.title.toLowerCase().includes(query) ||
                post.excerpt.toLowerCase().includes(query) ||
                post.category.toLowerCase().includes(query) ||
                (post.keywords && post.keywords.some(k => k.toLowerCase().includes(query)))
            );
        }

        renderPosts(filtered);
    }

    // Search functionality
    if (searchInput) {
        let debounceTimer;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                searchQuery = e.target.value.trim();
                filterPosts();
            }, 300);
        });
    }

    // Category filter functionality
    if (categoryFilter) {
        categoryFilter.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                // Update active state
                categoryFilter.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                e.target.classList.add('active');

                // Filter posts
                currentCategory = e.target.dataset.category;
                filterPosts();
            }
        });
    }

    // Initialize
    loadPosts();
})();
