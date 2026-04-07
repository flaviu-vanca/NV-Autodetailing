# NV Autodetailing

<p align="center">
  <strong>NV Autodetailing</strong> is a professional, SEO-ready multi-page website for an auto detailing business, featuring service landing pages, portfolio galleries, and contact workflows.
</p>

<p align="center">
  <!-- Tech / stack -->
  <img alt="HTML5" src="https://img.shields.io/badge/HTML5-Static%20Pages-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
  <img alt="SCSS" src="https://img.shields.io/badge/SCSS-Styles-CC6699?style=for-the-badge&logo=sass&logoColor=white" />
  <img alt="CSS3" src="https://img.shields.io/badge/CSS3-Custom%20Styling-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
  <img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-Frontend-F7DF1E?style=for-the-badge&logo=javascript&logoColor=111111" />
  <img alt="Bootstrap" src="https://img.shields.io/badge/Bootstrap-5.x-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white" />
  <img alt="PHP" src="https://img.shields.io/badge/PHP-Form%20Handlers-777BB4?style=for-the-badge&logo=php&logoColor=white" />
</p>

<p align="center">
  <!-- Quick links -->
  <a href="https://nvautodetailing.com/">
    <img alt="Live site" src="https://img.shields.io/badge/Live%20Site-nvautodetailing.com-111111?style=flat-square&logo=googlechrome&logoColor=white" />
  </a>
  <a href="#project-structure">
    <img alt="Project structure" src="https://img.shields.io/badge/%F0%9F%93%81-Project%20Structure-0A66C2?style=flat-square" />
  </a>
  <a href="#tech-stack">
    <img alt="Tech stack" src="https://img.shields.io/badge/%F0%9F%A7%B0-Tech%20Stack-3A3A3A?style=flat-square" />
  </a>
  <a href="#deployment">
    <img alt="Deployment" src="https://img.shields.io/badge/%F0%9F%9A%80-Deployment-2EA44F?style=flat-square" />
  </a>
</p>

---

## ✨ Overview

This repository contains the source code for the **NV Autodetailing** website: a static, marketing-focused site built to clearly present services, showcase results through image-heavy portfolio content, and make it easy for customers to get in touch.

It also includes an optional backend scaffold (`review-service`) prepared for a future reviews integration.

## 🧩 What’s Included

- **Service pages** for the main detailing offerings (e.g., folie solara, polisare, detailing interior, curatare motor, protectie ceramica, restaurare faruri)
- **Portfolio galleries** to highlight completed work
- **Contact workflows** (static-host friendly) plus **legacy PHP handlers** for traditional hosting
- **SEO essentials**: sitemap, robots.txt, canonical URLs, Open Graph metadata, and structured data
- **Legal pages** (privacy policy and terms)

## ✅ Features

- 🏠 Multi-page static website with dedicated service landing pages
- 📱 Responsive UI built with Bootstrap + custom styling
- 🖼️ Portfolio sections optimized for visual proof and trust-building
- 📨 Homepage contact form with Netlify-style submission flow
- 🧾 Optional PHP form handlers for PHP hosting
- 🔎 SEO-ready structure and metadata
- ⚙️ Separate Spring Boot module reserved for future reviews integration

## 📁 Project Structure

```text
NV-Autodetailing/
|- index.html
|- folie-solara.html
|- polisare.html
|- detailing.html
|- curatare-motor.html
|- protectie-ceramica.html
|- restaurare-faruri.html
|- politica-de-confidențialitate.html
|- termeni-si-conditii.html
|- sitemap.xml
|- robots.txt
|- assets/
|  |- css/
|  |- js/
|  |- img/
|  |- scss/
|  `- vendor/
|- forms/
|  |- contact.php
|  `- newsletter.php
`- review-service/
   |- pom.xml
   `- src/
```

## 🧰 Tech Stack

| Area | Stack |
|------|-------|
| Frontend | HTML, CSS/SCSS, JavaScript |
| UI framework | Bootstrap 5 |
| Form handling | Netlify-style frontend submission + PHP handlers |
| Backend scaffold | Java 21, Spring Boot 3.5 |
| Assets | Static images, icons, vendor libraries |

## 🗺️ Key Pages

| Page | Purpose |
|------|---------|
| `index.html` | Homepage, service overview, contact form, portfolio highlights |
| `folie-solara.html` | Solar film service page |
| `polisare.html` | Paint correction and polish service page |
| `detailing.html` | Interior detailing service page |
| `curatare-motor.html` | Engine cleaning service page |
| `protectie-ceramica.html` | Ceramic protection service page |
| `restaurare-faruri.html` | Headlight restoration service page |
| `politica-de-confidențialitate.html` | Privacy policy |
| `termeni-si-conditii.html` | Terms and conditions |

## 📨 Forms

### Homepage contact form

The contact form on `index.html` is wired through `assets/js/main.js` and posts URL-encoded form data to `/` in a Netlify-compatible format.

### PHP handlers

If you deploy on PHP hosting, you can use:

- `forms/contact.php`
- `forms/newsletter.php`

> **Note:** `forms/newsletter.php` may still contain a placeholder recipient email—update it before production use.

## ⭐ Review Service (`review-service`)

`review-service` is a separate Maven-based Spring Boot application intended for a future reviews proxy/integration.

Current status:

- ✅ Maven project scaffold is present
- ✅ Spring Boot entry point exists
- ✅ Test scaffold exists
- ❌ No controllers/services/reviews logic implemented yet

## 🚀 Deployment

- The main website is static and can be deployed to any static hosting provider.
- The homepage contact form supports a Netlify-style submission flow out of the box.
- If you use PHP hosting, the `forms/` handlers can be used instead.
- The `review-service` module would require its own deployment process if/when activated.

## 📝 Notes / Next Steps

- Implement the reviews proxy inside `review-service`
- Consolidate form handling (choose a single production path)
- Add a build pipeline for SCSS compilation and asset optimization
- Add deployment documentation for the chosen hosting platform
- Add a license file if this repository is intended for public reuse