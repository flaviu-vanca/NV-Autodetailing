# NV Autodetailing

<p align="center">
  Professional presentation website for <strong>NV Autodetailing</strong>, built as a static multi-page site with service landing pages, contact workflows, SEO assets, and a separate Spring Boot scaffold for future reviews integration.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-Static%20Pages-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5 badge" />
  <img src="https://img.shields.io/badge/CSS3-Custom%20Styling-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3 badge" />
  <img src="https://img.shields.io/badge/JavaScript-Frontend-F7DF1E?style=for-the-badge&logo=javascript&logoColor=111111" alt="JavaScript badge" />
  <img src="https://img.shields.io/badge/Bootstrap-5.x-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white" alt="Bootstrap badge" />
  <img src="https://img.shields.io/badge/PHP-Form%20Handlers-777BB4?style=for-the-badge&logo=php&logoColor=white" alt="PHP badge" />
  <img src="https://img.shields.io/badge/Spring%20Boot-Review%20Service-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot badge" />
</p>

<p align="center">
  <a href="https://nvautodetailing.com/">
    <img src="https://img.shields.io/badge/Live%20Site-nvautodetailing.com-111111?style=flat-square&logo=googlechrome&logoColor=white" alt="Live site badge" />
  </a>
</p>

## Overview

This repository contains the source for the NV Autodetailing website. The project is centered around a static, SEO-friendly marketing site for auto detailing services, with individual pages for major services, a homepage contact form, image-heavy portfolio sections, and legal pages.

In addition to the website itself, the repo includes a separate `review-service` Maven module intended for a future Google Reviews proxy or backend integration. At the moment, that service is only a Spring Boot starter scaffold and does not expose any API endpoints yet.

## Website Description

NV Autodetailing is a professional presentation website for an auto detailing business based in Gottlob, Timis. Its purpose is to showcase the brand, present the available services clearly, build trust through visual portfolio content, and make it easy for potential customers to get in touch.

The website includes:

- `🚘` Dedicated pages for core services such as folie solara, polisare, detailing interior, curatare motor, protectie ceramica, and restaurare faruri
- `🖼️` Before-and-after style portfolio galleries that highlight completed work
- `📍` Local business information, contact details, and embedded map location
- `📝` Legal and privacy pages for transparency and compliance
- `🔍` Search-friendly structure with service-specific pages and metadata

## Features

- `🏠` Multi-page static website with dedicated service pages
- `📱` Responsive frontend built on Bootstrap and custom styles
- `🖼️` Rich portfolio galleries for detailing work
- `📨` Homepage contact form with Netlify-style submission flow
- `📬` Legacy PHP form handlers for traditional hosting setups
- `🔎` SEO essentials including sitemap, robots.txt, canonical URLs, and structured data
- `⚙️` Separate Spring Boot module reserved for future reviews integration

## Project Structure

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

## Tech Stack

| Area | Stack |
|------|-------|
| Frontend | HTML, CSS, JavaScript |
| UI framework | Bootstrap 5 |
| Styling source | SCSS + compiled CSS |
| Form handling | Netlify-style frontend submission + PHP handlers |
| Backend scaffold | Java 21, Spring Boot 3.5 |
| Assets | Static images, icons, vendor libraries |

## Key Pages

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

## Forms

### `📨` Homepage contact form

The contact form on `index.html` is wired through `assets/js/main.js` and posts URL-encoded form data to `/` in a Netlify-compatible format.

### `📬` PHP handlers

The repository also contains classic PHP form endpoints:

- `forms/contact.php`
- `forms/newsletter.php`

These are useful if the site is deployed on PHP hosting instead of a static hosting platform.

### `⚠️` Current note

`forms/newsletter.php` still contains the default placeholder recipient email and should be updated before production use on PHP hosting.

## Review Service

The `review-service` module is a separate Maven-based Spring Boot application.

Current state:

- `✅` Maven project is present
- `✅` Spring Boot application entry point exists
- `✅` Test scaffold exists
- `❌` No controllers, services, or review proxy logic yet

This module is best treated as a planned backend extension rather than an active production service.

## Deployment Notes

- The main website is static and can be deployed to standard static hosting platforms.
- The homepage contact form is already set up for a Netlify-style submission flow.
- If deploying to PHP hosting, the `forms/` handlers can be used instead.
- The `review-service` module would need its own deployment flow if it becomes active.

## SEO and Content

The site already includes several SEO-oriented elements:

- `sitemap.xml`
- `robots.txt`
- Canonical URLs
- Open Graph metadata
- JSON-LD structured data
- Service-specific landing pages

## Notes for Future Improvements

- Implement the reviews proxy inside `review-service`
- Consolidate form handling so only one production path is maintained
- Add a proper build pipeline for SCSS compilation and asset optimization
- Add deployment documentation for the chosen hosting platform
- Add a license file if the repository is intended for public reuse

## Repository Status

This repository currently has:

- A clean Git working tree
- No Node.js package manifest
- No Docker configuration
- No top-level README before this file

That means the site is maintained primarily as a direct-edit static project with a separate Java backend scaffold.
