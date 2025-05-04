/**
* Template Name: Day
* Template URL: https://bootstrapmade.com/day-multipurpose-html-template-for-free/
* Updated: Aug 07 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function () {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll',toggleScrolled);
  window.addEventListener('load',toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  mobileNavToggleBtn.addEventListener('click',mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click',() => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click',function (e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load',() => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click',(e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load',toggleScrollTop);
  document.addEventListener('scroll',toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load',aosInit);

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement,config);
      } else {
        new Swiper(swiperElement,config);
      }
    });
  }

  window.addEventListener("load",initSwiper);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function (isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'),function () {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'),{
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function (filters) {
      filters.addEventListener('click',function () {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      },false);
    });

  });

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load',function (e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        },100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load',navmenuScrollspy);
  document.addEventListener('scroll',navmenuScrollspy);

})();

(function () {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll',toggleScrolled);
  window.addEventListener('load',toggleScrolled);

  // Adaugă codul pentru filtrarea imaginilor
  const imagesData = {
    'curatare-motor': [
      'curatare-motor-portfolio-1.jpg',
      'curatare-motor-portfolio-2.jpg',
      'curatare-motor-portfolio-3.jpg',
      'curatare-motor-portfolio-4.jpg',
      'curatare-motor-portfolio-5.jpg',
      'curatare-motor-portfolio-6.jpg',
      'curatare-motor-portfolio-7.jpg',
      'curatare-motor-portfolio-8.jpg',
      'curatare-motor-portfolio-9.jpg',
    ],
    'detailing-interior': [
      'detailing-interior-portfolio-1.jpg',
      'detailing-interior-portfolio-2.jpg',
      'detailing-interior-portfolio-3.jpg',
      'detailing-interior-portfolio-4.jpg',
      'detailing-interior-portfolio-5.jpg',
      'detailing-interior-portfolio-6.jpg',
      'detailing-interior-portfolio-7.jpg',
      'detailing-interior-portfolio-8.jpg',
      'detailing-interior-portfolio-9.jpg',
    ],
    'polish-profesional': [
      'polish-profesional-portfolio-1.jpg',
      'polish-profesional-portfolio-2.jpg',
      'polish-profesional-portfolio-3.jpg',
      'polish-profesional-portfolio-4.jpg',
      'polish-profesional-portfolio-5.jpg',
      'polish-profesional-portfolio-6.jpg',
      'polish-profesional-portfolio-7.jpg',
      'polish-profesional-portfolio-8.jpg',
      'polish-profesional-portfolio-9.jpg',
    ],
    'protectie-ceramica': [
      'protectie-ceramica-portfolio-1.jpg',
      'protectie-ceramica-portfolio-2.jpg',
      'protectie-ceramica-portfolio-3.jpg',
      'protectie-ceramica-portfolio-4.jpg',
      'protectie-ceramica-portfolio-5.jpg',
      'protectie-ceramica-portfolio-6.jpg',
      'protectie-ceramica-portfolio-7.jpg',
      'protectie-ceramica-portfolio-8.jpg',
      'protectie-ceramica-portfolio-9.jpg',
    ],
    'restaurare-faruri': [
      'restaurare-faruri-portfolio-1.jpg',
      'restaurare-faruri-portfolio-2.jpg',
      'restaurare-faruri-portfolio-3.jpg',
      'restaurare-faruri-portfolio-4.jpg',
      'restaurare-faruri-portfolio-5.jpg',
      'restaurare-faruri-portfolio-6.jpg',
      'restaurare-faruri-portfolio-7.jpg',
      'restaurare-faruri-portfolio-8.jpg',
      'restaurare-faruri-portfolio-9.jpg',
    ],
    'folie-solara': [
      'folie-solara-portfolio-1.jpg',
      'folie-solara-portfolio-2.jpg',
      'folie-solara-portfolio-3.jpg',
      'folie-solara-portfolio-4.jpg',
      'folie-solara-portfolio-5.jpg',
      'folie-solara-portfolio-6.jpg',
      'folie-solara-portfolio-7.jpg',
      'folie-solara-portfolio-8.jpg',
      'folie-solara-portfolio-9.jpg',
    ],
  };

  // Selectăm containerul de imagini din portofoliu
  const portfolioContainer = document.querySelector('.portfolio-items');
  const filterButtons = document.querySelectorAll('.filter-button');

  // Funcție care actualizează galeria cu imagini în funcție de categoria selectată
  function updatePortfolioImages(category) {
    portfolioContainer.innerHTML = ''; // Curățăm galeria de imagini anterioare
    const images = imagesData[category]; // Obținem imaginile pentru categoria selectată

    images.forEach((image,index) => {
      const imageElement = document.createElement('div');
      imageElement.classList.add('col-lg-4','col-md-6','portfolio-item','isotope-item',`filter-${category}`);
      imageElement.innerHTML = `
        <img src="assets/img/${category}/${image}" class="img-fluid" alt="${category} ${index + 1}" />
        <div class="portfolio-info">
          <h4>${category} ${index + 1}</h4>
          <p>Lorem ipsum, dolor sit</p>
          <a href="assets/img/${category}/${image}" title="${category} ${index + 1}" data-gallery="portfolio-gallery-${category}" class="glightbox preview-link"><i class="bi bi-zoom-in"></i></a>
          <a href="portfolio-details.html" title="More Details" class="details-link"><i class="bi bi-link-45deg"></i></a>
        </div>
      `;
      portfolioContainer.appendChild(imageElement);
    });
  }

  // Adăugăm evenimentul de clic pe fiecare buton de filtru
  filterButtons.forEach((button) => {
    button.addEventListener('click',function () {
      const filterCategory = this.getAttribute('data-filter');
      updatePortfolioImages(filterCategory);
    });
  });

  /**
   * Restul funcțiilor tale originale pentru scroll, preloader etc.
   */
})();

// Adaugă codul pentru filtrarea imaginilor
