# 🏫 Salve Regina School Website

<div align="center">

```svg
<svg width="200" height="80" viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="80" rx="10" fill="#2c3e50"/>
  <circle cx="40" cy="40" r="15" fill="#3498db"/>
  <rect x="25" y="32" width="30" height="16" fill="none" stroke="#3498db" stroke-width="2"/>
  <path d="M25 40 L40 25 L55 40" fill="none" stroke="#3498db" stroke-width="2"/>
  <text x="70" y="35" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#ffffff">Salve Regina</text>
  <text x="70" y="50" font-family="Arial, sans-serif" font-size="12" fill="#bdc3c7">School</text>
</svg>
```

**A modern, responsive school website built for Salve Regina School**

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![PHP](https://img.shields.io/badge/PHP-777BB4?style=flat&logo=php&logoColor=white)](https://www.php.net/)

</div>

---

## 📋 Overview

This is a complete website solution developed for Salve Regina School, featuring a modern design, responsive layout, and comprehensive school management features. The site provides information about academics, admissions, campus life, and includes an integrated review system with admin controls.

**Developer:** [Your Name]

---

## ✨ Features

<div align="center">

```svg
<svg width="600" height="200" viewBox="0 0 600 200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Responsive Design Icon -->
  <g transform="translate(50, 50)">
    <rect x="0" y="20" width="60" height="40" rx="5" fill="#3498db" opacity="0.8"/>
    <rect x="15" y="35" width="30" height="20" rx="2" fill="#ffffff"/>
    <rect x="20" y="70" width="20" height="30" rx="3" fill="#e74c3c" opacity="0.8"/>
    <rect x="25" y="80" width="10" height="15" rx="1" fill="#ffffff"/>
    <text x="30" y="120" font-family="Arial" font-size="10" text-anchor="middle" fill="#2c3e50">Responsive</text>
  </g>
  
  <!-- Interactive Features Icon -->
  <g transform="translate(200, 50)">
    <circle cx="30" cy="30" r="25" fill="#9b59b6" opacity="0.8"/>
    <path d="M20 30 Q30 20 40 30 Q30 40 20 30" fill="#ffffff"/>
    <circle cx="25" cy="25" r="3" fill="#ffffff"/>
    <circle cx="35" cy="35" r="3" fill="#ffffff"/>
    <text x="30" y="120" font-family="Arial" font-size="10" text-anchor="middle" fill="#2c3e50">Interactive</text>
  </g>
  
  <!-- Admin Panel Icon -->
  <g transform="translate(350, 50)">
    <rect x="10" y="15" width="40" height="30" rx="3" fill="#1abc9c" opacity="0.8"/>
    <rect x="15" y="25" width="10" height="2" fill="#ffffff"/>
    <rect x="15" y="30" width="15" height="2" fill="#ffffff"/>
    <rect x="15" y="35" width="8" height="2" fill="#ffffff"/>
    <circle cx="42" cy="22" r="3" fill="#ffffff"/>
    <text x="30" y="120" font-family="Arial" font-size="10" text-anchor="middle" fill="#2c3e50">Admin Panel</text>
  </g>
  
  <!-- Email System Icon -->
  <g transform="translate(500, 50)">
    <rect x="10" y="20" width="40" height="25" rx="3" fill="#f39c12" opacity="0.8"/>
    <path d="M10 20 L30 35 L50 20" fill="none" stroke="#ffffff" stroke-width="2"/>
    <text x="30" y="120" font-family="Arial" font-size="10" text-anchor="middle" fill="#2c3e50">Email System</text>
  </g>
</svg>
```

</div>

### 🎯 Core Features
- **Multi-page Navigation** - Homepage, About, Academics, Admissions, Gallery, Contact
- **Responsive Design** - Mobile-first approach, works on all devices
- **Interactive Elements** - Image galleries, animated counters, typewriter effects
- **Review System** - User reviews with email approval workflow
- **Admin Dashboard** - Manage reviews, view submissions, email controls
- **Contact Integration** - Working contact form with email notifications
- **Newsletter Signup** - Email subscription system

### 🛠️ Technical Features
- **Smooth Animations** - CSS transitions and JavaScript-powered effects
- **Smart Navigation** - Auto-hide/show navbar on scroll
- **Image Optimization** - Lazy loading and responsive images
- **Form Validation** - Client and server-side validation
- **SEO Friendly** - Semantic HTML structure
- **Cross-browser Compatible** - Tested across major browsers

---

## 🗂️ Project Structure

```
salve-regina-school/
├── 📄 index.html                 # Homepage
├── 📄 about.html                 # About page
├── 📄 academics.html             # Academic programs
├── 📄 admissions.html            # Admissions information
├── 📄 campus.html                # Campus gallery
├── 📄 contact.html               # Contact form
├── 📄 admin.html                 # Admin dashboard
├── 📄 reviews.html               # Review submission form
├── 📄 thanks.html                # Thank you page
├── 📄 submit_review.php          # Review processing
├── 📄 send_email.php             # Email handling
├── 📄 contact_process.php        # Contact form processing
├── 🎨 styles.css                 # Main styles
├── 🎨 about.css                  # About page styles
├── 🎨 academics.css              # Academics styles
├── 🎨 admissions.css             # Admissions styles
├── 🎨 campus.css                 # Campus gallery styles
├── 🎨 contact.css                # Contact form styles
├── ⚡ script.js                  # Main JavaScript
├── ⚡ about.js                   # About page functionality
├── ⚡ academics.js               # Academics interactions
├── ⚡ admissions.js              # Admissions features
├── ⚡ campus.js                  # Gallery functionality
├── ⚡ contact.js                 # Contact form handling
└── 📂 images/                    # Image assets
    ├── srs_logo.png
    ├── image2.jpg
    └── school_building_*.jpg
```

---

## 🚀 Getting Started

### Prerequisites
- Web server with PHP support (Apache/Nginx)
- PHP 7.4 or higher
- Email server configuration (for contact forms)

### Installation

1. **Clone or download** the project files to your web server directory

2. **Configure email settings** in PHP files:
   ```php
   // Update email configurations in:
   // - contact_process.php
   // - send_email.php
   // - submit_review.php
   ```

3. **Set up file permissions**:
   ```bash
   chmod 755 *.php
   chmod 644 *.html *.css *.js
   ```

4. **Test the website** by opening `index.html` in your browser

---

## 📱 Responsive Breakpoints

<div align="center">

```svg
<svg width="500" height="100" viewBox="0 0 500 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Mobile -->
  <rect x="20" y="30" width="25" height="40" rx="3" fill="#e74c3c"/>
  <rect x="25" y="35" width="15" height="25" rx="1" fill="#ffffff"/>
  <text x="32" y="85" font-family="Arial" font-size="9" text-anchor="middle" fill="#2c3e50">Mobile</text>
  <text x="32" y="95" font-family="Arial" font-size="8" text-anchor="middle" fill="#7f8c8d">≤ 480px</text>
  
  <!-- Tablet -->
  <rect x="100" y="25" width="40" height="30" rx="3" fill="#f39c12"/>
  <rect x="105" y="30" width="30" height="20" rx="1" fill="#ffffff"/>
  <text x="120" y="85" font-family="Arial" font-size="9" text-anchor="middle" fill="#2c3e50">Tablet</text>
  <text x="120" y="95" font-family="Arial" font-size="8" text-anchor="middle" fill="#7f8c8d">≤ 768px</text>
  
  <!-- Desktop -->
  <rect x="200" y="20" width="60" height="35" rx="3" fill="#27ae60"/>
  <rect x="205" y="25" width="50" height="25" rx="1" fill="#ffffff"/>
  <text x="230" y="85" font-family="Arial" font-size="9" text-anchor="middle" fill="#2c3e50">Desktop</text>
  <text x="230" y="95" font-family="Arial" font-size="8" text-anchor="middle" fill="#7f8c8d">≤ 970px</text>
  
  <!-- Large Desktop -->
  <rect x="320" y="15" width="80" height="40" rx="3" fill="#8e44ad"/>
  <rect x="325" y="20" width="70" height="30" rx="1" fill="#ffffff"/>
  <text x="360" y="85" font-family="Arial" font-size="9" text-anchor="middle" fill="#2c3e50">Large Desktop</text>
  <text x="360" y="95" font-family="Arial" font-size="8" text-anchor="middle" fill="#7f8c8d">> 970px</text>
</svg>
```

</div>

| Device | Breakpoint | Navigation | Layout |
|--------|------------|------------|--------|
| Mobile | ≤ 480px | Hamburger menu | Single column |
| Tablet | ≤ 768px | Hamburger menu | Two columns |
| Desktop | ≤ 970px | Full navigation | Multi-column |
| Large | > 970px | Full navigation | Grid layout |

---

## 🎨 Design System

### Color Palette
```css
/* Primary Colors */
--primary-blue: #2c3e50;
--accent-blue: #3498db;
--warning-yellow: #f39c12;
--success-green: #27ae60;

/* Neutral Colors */
--text-dark: #2c3e50;
--text-light: #6c757d;
--background-light: #f8f9fa;
--white: #ffffff;
```

### Typography
- **Primary Font**: Poppins (Google Fonts)
- **Headings**: 700 weight
- **Body Text**: 400 weight
- **Responsive sizing**: rem units with mobile-first scaling

---

## 📧 Email Configuration

The website includes several email features that require proper configuration:

### Contact Form
- **File**: `contact_process.php`
- **Purpose**: Handles general inquiries
- **Features**: Form validation, spam protection, email notifications

### Review System
- **Files**: `submit_review.php`, `send_email.php`
- **Purpose**: Review submission and approval workflow
- **Features**: Admin email notifications, approval/rejection system

### Setup Requirements
1. Configure SMTP settings in PHP files
2. Set up email templates
3. Test email delivery
4. Set appropriate sender addresses

---

## 🔧 Customization

### Updating School Information
1. **Logo**: Replace `images/srs_logo.png` with your school logo
2. **Colors**: Modify CSS custom properties in `styles.css`
3. **Content**: Update text content in HTML files
4. **Images**: Replace images in the `images/` folder

### Adding New Pages
1. Create new HTML file
2. Create corresponding CSS file
3. Create corresponding JS file
4. Update navigation in all existing pages
5. Add page to site structure

---

## 🌐 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 80+ | ✅ Full support |
| Firefox | 75+ | ✅ Full support |
| Safari | 13+ | ✅ Full support |
| Edge | 80+ | ✅ Full support |
| IE | 11 | ⚠️ Limited support |

---

## 📊 Performance Features

<div align="center">

```svg
<svg width="400" height="150" viewBox="0 0 400 150" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Speed Icon -->
  <g transform="translate(50, 25)">
    <circle cx="25" cy="25" r="20" fill="none" stroke="#27ae60" stroke-width="3"/>
    <path d="M25 10 L25 25 L35 30" stroke="#27ae60" stroke-width="2" fill="none"/>
    <text x="25" y="65" font-family="Arial" font-size="11" text-anchor="middle" fill="#2c3e50">Fast Loading</text>
  </g>
  
  <!-- Optimization Icon -->
  <g transform="translate(150, 25)">
    <rect x="10" y="10" width="30" height="30" fill="none" stroke="#3498db" stroke-width="3" rx="5"/>
    <path d="M15 20 L20 25 L35 15" stroke="#3498db" stroke-width="2" fill="none"/>
    <text x="25" y="65" font-family="Arial" font-size="11" text-anchor="middle" fill="#2c3e50">Optimized</text>
  </g>
  
  <!-- SEO Icon -->
  <g transform="translate(250, 25)">
    <circle cx="20" cy="20" r="15" fill="none" stroke="#e74c3c" stroke-width="3"/>
    <path d="M30 30 L40 40" stroke="#e74c3c" stroke-width="3"/>
    <text x="25" y="65" font-family="Arial" font-size="11" text-anchor="middle" fill="#2c3e50">SEO Ready</text>
  </g>
</svg>
```

</div>

- **Image Optimization**: Compressed images with appropriate formats
- **CSS Minification**: Optimized stylesheets for faster loading
- **JavaScript Efficiency**: Event delegation and throttling
- **Lazy Loading**: Images load as needed
- **Caching**: Browser caching for static assets

---

## 🤝 Contributing

This is a custom school website project. For modifications or improvements:

1. Test changes across different devices
2. Ensure responsive design principles
3. Maintain consistent code style
4. Update documentation as needed

---

## 📄 License

This project is developed specifically for Salve Regina School. All rights reserved.

---

## 👨‍💻 Developer

**Developed by:** [Your Name]

- Custom design and development
- Responsive implementation
- PHP backend integration
- Admin system development
- Email workflow setup

---

<div align="center">

```svg
<svg width="300" height="60" viewBox="0 0 300 60" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="300" height="60" rx="30" fill="#2c3e50"/>
  <text x="150" y="35" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#ffffff" text-anchor="middle">Salve Regina School Website</text>
  <text x="150" y="50" font-family="Arial, sans-serif" font-size="10" fill="#bdc3c7" text-anchor="middle">Built with dedication for educational excellence</text>
</svg>
```

**Made with ❤️ for education**

</div>