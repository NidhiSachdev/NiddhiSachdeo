/**
 * Blog Post Page JavaScript
 * Loads and renders individual blog posts with Markdown support
 */

(function() {
    const blogPostContainer = document.getElementById('blog-post');
    const slug = window.utils.getUrlParameter('slug');

    if (!slug) {
        window.location.href = 'blog.html';
        return;
    }

    // Load post data
    async function loadPost() {
        try {
            // Load posts index
            const response = await fetch('content/blog/posts.json');
            const data = await response.json();
            const post = data.posts.find(p => p.slug === slug);

            if (!post) {
                showError('Post not found');
                return;
            }

            // Update page meta tags
            updateMetaTags(post);

            // Load markdown content
            const contentResponse = await fetch(`content/blog/${post.slug}.md`);
            
            let content;
            if (contentResponse.ok) {
                const markdown = await contentResponse.text();
                content = marked.parse(markdown);
            } else {
                // Use the content from JSON if markdown file doesn't exist
                content = post.content ? marked.parse(post.content) : '<p>Content coming soon...</p>';
            }

            renderPost(post, content);

        } catch (error) {
            console.error('Error loading post:', error);
            showError('Unable to load post');
        }
    }

    // Update page meta tags for SEO
    function updateMetaTags(post) {
        document.title = `${post.title} | Blog`;
        
        // Update meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.content = post.excerpt;

        // Update meta keywords
        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords && post.keywords) metaKeywords.content = post.keywords.join(', ');

        // Update Open Graph tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.content = post.title;

        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) ogDesc.content = post.excerpt;

        const ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage && post.image) ogImage.content = post.image;

        const ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) ogUrl.content = window.location.href;

        // Update Twitter Card tags
        const twTitle = document.querySelector('meta[name="twitter:title"]');
        if (twTitle) twTitle.content = post.title;

        const twDesc = document.querySelector('meta[name="twitter:description"]');
        if (twDesc) twDesc.content = post.excerpt;

        const twImage = document.querySelector('meta[name="twitter:image"]');
        if (twImage && post.image) twImage.content = post.image;

        // Update canonical URL
        const canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) canonical.href = window.location.href;
    }

    // Render the post
    function renderPost(post, content) {
        const readingTime = window.utils.calculateReadingTime(content);
        const shareUrl = encodeURIComponent(window.location.href);
        const shareTitle = encodeURIComponent(post.title);

        blogPostContainer.innerHTML = `
            <header class="blog-post-header">
                <span class="blog-post-category">${window.utils.escapeHtml(post.category)}</span>
                <h1 class="blog-post-title">${window.utils.escapeHtml(post.title)}</h1>
                <div class="blog-post-meta">
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        ${window.utils.formatDate(post.date)}
                    </span>
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        ${readingTime}
                    </span>
                    ${post.author ? `
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        ${window.utils.escapeHtml(post.author)}
                    </span>
                    ` : ''}
                </div>
            </header>

            ${post.image ? `
            <div class="blog-post-image">
                <img src="${post.image}" alt="${window.utils.escapeHtml(post.title)}">
            </div>
            ` : ''}

            <div class="blog-post-content">
                ${content}
            </div>

            <div class="social-share">
                <span>Share this article:</span>
                <a href="https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}" target="_blank" rel="noopener" aria-label="Share on Twitter">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}" target="_blank" rel="noopener" aria-label="Share on LinkedIn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
                <a href="https://www.facebook.com/sharer/sharer.php?u=${shareUrl}" target="_blank" rel="noopener" aria-label="Share on Facebook">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="mailto:?subject=${shareTitle}&body=Check out this article: ${shareUrl}" aria-label="Share via Email">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </a>
            </div>

            <div style="text-align: center; margin-top: 2rem;">
                <a href="blog.html" class="btn btn-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                    Back to Blog
                </a>
            </div>
        `;
    }

    // Show error message
    function showError(message) {
        blogPostContainer.innerHTML = `
            <div class="no-results">
                <h3>${message}</h3>
                <p><a href="blog.html">Return to blog</a></p>
            </div>
        `;
    }

    // Initialize
    loadPost();
})();
