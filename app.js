const setupMenu = () => {
  const header = document.querySelector('.topbar-inner');
  const toggle = header?.querySelector('.nav-toggle');
  const shell = header?.querySelector('.nav-shell');
  const nav = header?.querySelector('.nav');
  const langBtn = header?.querySelector('.lang-btn');
  const langDropdown = header?.querySelector('.lang-dropdown');

  if (!toggle || !shell || !nav) return;

  const currentPath = window.location.pathname.replace(/index\.html$/, '');
  const desktopLangLinks = Array.from(langDropdown?.querySelectorAll('a') || []);

  if (desktopLangLinks.length && !nav.querySelector('.nav-lang-switcher')) {
    const langSwitcher = document.createElement('div');
    langSwitcher.className = 'nav-lang-switcher';
    langSwitcher.innerHTML = '<div class="nav-lang-label">Idioma</div><div class="nav-lang-links"></div>';
    const mobileLinks = langSwitcher.querySelector('.nav-lang-links');

    desktopLangLinks.forEach((link) => {
      const clone = link.cloneNode(true);
      const clonePath = new URL(clone.getAttribute('href'), window.location.href).pathname.replace(/index\.html$/, '');
      if (clonePath === currentPath) clone.classList.add('active');
      mobileLinks?.appendChild(clone);
    });

    nav.appendChild(langSwitcher);
  }

  const closeMenu = () => {
    document.body.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  const openMenu = () => {
    document.body.classList.add('menu-open');
    toggle.setAttribute('aria-expanded', 'true');
  };

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = document.body.classList.contains('menu-open');
    if (open) closeMenu(); else openMenu();
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => closeMenu());
  });

  if (langBtn && langDropdown) {
    langBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = langBtn.getAttribute('aria-expanded') === 'true';
      langBtn.setAttribute('aria-expanded', String(!isExpanded));
      langDropdown.classList.toggle('active');
    });
  }

  shell.addEventListener('click', (event) => {
    if (event.target === shell) closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
      langBtn?.setAttribute('aria-expanded', 'false');
      langDropdown?.classList.remove('active');
    }
  });

  document.addEventListener('click', (e) => {
    if (langDropdown && !langDropdown.contains(e.target)) {
      langBtn?.setAttribute('aria-expanded', 'false');
      langDropdown.classList.remove('active');
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 980) closeMenu();
  });
};

const mailLabels = {
  es: {
    subject: 'Consulta web Pim Pam Teachers',
    done: 'Mensaje preparado. Si tu gestor de correo no se abre, copia el texto y envíalo a pimpamteachers@gmail.com.',
    error: 'Revisa los campos marcados antes de enviar el formulario.',
    privacy: 'Debes aceptar la política de privacidad para continuar.',
    labels: {
      name: 'Nombre',
      email: 'Email',
      organisation: 'Centro u organización',
      service: 'Interés principal',
      message: 'Mensaje'
    }
  },
  ca: {
    subject: 'Consulta web Pim Pam Teachers',
    done: 'Missatge preparat. Si el gestor de correu no s’obre, copia el text i envia’l a pimpamteachers@gmail.com.',
    error: 'Revisa els camps marcats abans d’enviar el formulari.',
    privacy: 'Has d’acceptar la política de privacitat per continuar.',
    labels: {
      name: 'Nom',
      email: 'Correu electrònic',
      organisation: 'Centre o organització',
      service: 'Interès principal',
      message: 'Missatge'
    }
  },
  en: {
    subject: 'Pim Pam Teachers website enquiry',
    done: 'Message prepared. If your email app does not open, copy the text and send it to pimpamteachers@gmail.com.',
    error: 'Please review the highlighted fields before submitting the form.',
    privacy: 'Please accept the privacy policy to continue.',
    labels: {
      name: 'Name',
      email: 'Email',
      organisation: 'School or organisation',
      service: 'Main interest',
      message: 'Message'
    }
  }
};

document.querySelectorAll('[data-mail-form]').forEach((form) => {
  const status = form.querySelector('[data-form-status]');
  const lang = form.dataset.lang || 'es';
  const content = mailLabels[lang] || mailLabels.es;

  const setStatus = (message, state = '') => {
    if (!status) return;
    status.textContent = message;
    status.className = `small form-status${state ? ` is-${state}` : ''}`;
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!form.reportValidity()) {
      setStatus(content.error, 'error');
      return;
    }

    const privacy = form.querySelector('input[name="privacy"]');
    if (privacy && !privacy.checked) {
      setStatus(content.privacy, 'error');
      privacy.focus();
      return;
    }

    const data = new FormData(form);
    const email = form.dataset.email || 'pimpamteachers@gmail.com';
    const body = [
      `${content.labels.name}: ${data.get('name') || ''}`,
      `${content.labels.email}: ${data.get('email') || ''}`,
      `${content.labels.organisation}: ${data.get('organisation') || ''}`,
      `${content.labels.service}: ${data.get('service') || ''}`,
      '',
      `${content.labels.message}:`,
      `${data.get('message') || ''}`
    ].join('\n');

    const mailto = `mailto:${email}?subject=${encodeURIComponent(content.subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    navigator.clipboard?.writeText(body).catch(() => {});
    setStatus(content.done, 'success');
  });
});

setupMenu();
