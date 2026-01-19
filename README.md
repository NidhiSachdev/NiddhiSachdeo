# Niddhi Sachdeo - Portfolio Website

A modern, aesthetic portfolio website with animated backgrounds, glassmorphism effects, blog functionality, and contact form.

## Features

- **Homepage** - Animated hero section, about me, experience, skills, projects, and contact
- **Blog** - SEO-optimized blog with search and category filtering
- **Projects** - Filterable project gallery
- **Contact** - Form with spam protection that sends emails via Web3Forms
- **Responsive** - Works on all devices
- **Dark Theme** - Beautiful purple/pink gradient aesthetic

## Quick Start

### Preview Locally

```bash
cd /home/niddhis/portfolio
python3 -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

## Customization

### 1. Add Your Photos

Place these images in the `assets/images/` folder:
- `profile.jpg` - Your main profile photo (square, ~400x400px recommended)
- `about.jpg` - Photo for the about section
- `favicon.ico` - Your favicon
- `og-image.jpg` - Open Graph image for social sharing (1200x630px)

### 2. Add Project Screenshots

Place project screenshots in `assets/project-images/`:
- `intrusion-detection.jpg`
- `bus-tracking.jpg`
- `restaurant.jpg`
- `portfolio.jpg`
- `enterprise.jpg`

### 3. Add Your Resume PDF

Place your resume as `assets/Niddhi_Sachdeo_Resume.pdf`

### 4. Set Up Contact Form

1. Go to [web3forms.com](https://web3forms.com) and sign up (free)
2. Get your access key
3. In `index.html` and `contact.html`, replace `YOUR_WEB3FORMS_ACCESS_KEY` with your key

### 5. Update hCaptcha (Optional)

1. Sign up at [hcaptcha.com](https://dashboard.hcaptcha.com)
2. Get your site key
3. Replace the `data-sitekey` in the contact forms

## Adding Content

### Add a Blog Post

Edit `content/blog/posts.json`:

```json
{
  "slug": "your-post-url-slug",
  "title": "Your Post Title",
  "excerpt": "Brief description...",
  "date": "2026-01-20",
  "category": "Java",
  "author": "Niddhi Sachdeo",
  "image": "assets/images/blog/your-image.jpg",
  "keywords": ["keyword1", "keyword2"],
  "content": "# Your Post\n\nContent in Markdown..."
}
```

### Add a Project

Edit `content/projects/projects.json`:

```json
{
  "title": "Project Name",
  "description": "What this project does...",
  "category": "Web",
  "image": "assets/project-images/project.jpg",
  "tech": ["Java", "MySQL"],
  "github": "https://github.com/NidhiSachdev/...",
  "demo": "https://..."
}
```

## Deploy to GitHub Pages

1. Create a GitHub repository named `niddhisachdeo.github.io` (or `NidhiSachdev.github.io`)

2. Push your code:
```bash
cd /home/niddhis/portfolio
git init
git add .
git commit -m "Initial portfolio commit"
git branch -M main
git remote add origin https://github.com/NidhiSachdev/niddhisachdeo.github.io.git
git push -u origin main
```

3. Go to repository **Settings** > **Pages** > Select **main** branch > **Save**

4. Your site will be live at `https://niddhisachdeo.github.io`

## Submit to Google

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your website URL
3. Verify ownership
4. Submit sitemap: `https://niddhisachdeo.github.io/sitemap.xml`

## File Structure

```
portfolio/
├── index.html              # Homepage with all sections
├── blog.html               # Blog listing
├── blog-post.html          # Individual blog post
├── projects.html           # Projects gallery
├── contact.html            # Contact page
├── thank-you.html          # Form success page
├── sitemap.xml             # SEO sitemap
├── robots.txt              # Search engine config
├── css/
│   └── style.css           # All styles
├── js/
│   ├── main.js             # Navigation & utilities
│   ├── blog.js             # Blog listing
│   ├── blog-post.js        # Blog post rendering
│   ├── projects.js         # Projects filtering
│   └── contact.js          # Form handling
├── content/
│   ├── blog/
│   │   └── posts.json      # Blog posts data
│   └── projects/
│       └── projects.json   # Projects data
└── assets/
    ├── images/             # Profile, about, favicon
    ├── project-images/     # Project screenshots
    └── Niddhi_Sachdeo_Resume.pdf
```

## Technologies Used

- HTML5, CSS3, JavaScript (Vanilla)
- Google Fonts (Playfair Display, Poppins, Fira Code)
- Web3Forms (Contact form backend)
- hCaptcha (Spam protection)
- Marked.js (Markdown parsing)

## Design Features

- Animated floating background shapes
- Glassmorphism UI elements
- Smooth scroll animations
- Morphing profile image border
- Gradient color scheme (purple/pink)
- Dark theme optimized

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

Made with 💜 by Niddhi Sachdeo
