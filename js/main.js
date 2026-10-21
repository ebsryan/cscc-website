// ==========================================================================
// Central States Collision Conference — Main JS
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when a link is clicked (mobile)
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');

  const setActiveLink = () => {
    let currentId = '';
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 120 && rect.bottom > 120) {
        currentId = section.id;
      }
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
  };
  window.addEventListener('scroll', setActiveLink);
  setActiveLink();

  /* ---------- Schedule day tabs ---------- */
  const dayTabs = document.querySelectorAll('.day-tab');
  const dayPanels = document.querySelectorAll('.day-panel');

  dayTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const day = tab.dataset.day;

      dayTabs.forEach(t => {
        t.classList.toggle('active', t === tab);
        t.setAttribute('aria-selected', t === tab);
      });

      dayPanels.forEach(panel => {
        panel.classList.toggle('active', panel.dataset.day === day);
      });
    });
  });

  /* ---------- FAQ accordion ---------- */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all others
      faqItems.forEach(other => {
        other.classList.remove('open');
        other.querySelector('.faq-answer').style.maxHeight = null;
        other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // Toggle this one
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- Forms (registration + vendor enquiry) ----------
     Submissions go to Netlify Forms. Netlify finds each form by the
     name="..." on the <form> tag and stores every submission in the
     site dashboard, as well as emailing the addresses configured there.

     The success message is only shown once Netlify has actually
     confirmed receipt. If the send fails, the form stays on screen
     with an error so nobody is told they registered when they didn't.
  ------------------------------------------------------------------ */

  const connectForm = (formId, successId, errorId) => {
    const form = document.getElementById(formId);
    const success = document.getElementById(successId);
    const error = document.getElementById(errorId);
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const button = form.querySelector('button[type="submit"]');
      const buttonText = button ? button.textContent : '';
      if (button) {
        button.disabled = true;
        button.textContent = 'Sending...';
      }
      if (error) error.classList.remove('show');

      try {
        const response = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(new FormData(form)).toString()
        });

        if (!response.ok) throw new Error('Submission failed: ' + response.status);

        form.style.display = 'none';
        if (success) success.classList.add('show');
      } catch (err) {
        console.error(err);
        if (error) error.classList.add('show');
        if (button) {
          button.disabled = false;
          button.textContent = buttonText;
        }
      }
    });
  };

  connectForm('registrationForm', 'formSuccess', 'formError');
  connectForm('vendorForm', 'vendorSuccess', 'vendorError');

});