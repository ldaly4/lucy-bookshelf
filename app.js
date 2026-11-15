(() => {
  'use strict';
  const content = window.SHELF_CONTENT;
  const $ = id => document.getElementById(id);
  const dialog = $('reader'), spread = $('spread'), sheet = $('turn-sheet');
  const mobile = matchMedia('(max-width: 767px)'), reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let book = null, page = 0, turning = false, origin = null, timer, soundEnabled = false, audioContext, openingTimer;
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  if (content.shelfPhoto?.src) {
    const photo = el('img');
    photo.src = content.shelfPhoto.src;
    photo.alt = content.shelfPhoto.alt || 'Lucy’s photograph';
    photo.decoding = 'async';
    $('shelf-photo').replaceChildren(photo);
  }
  content.books.forEach((item, index) => {
    const button = el('button', 'book-spine');
    button.id = `spine-${item.id}`;
    button.style.setProperty('--book', item.color);
    if (item.ink) button.style.setProperty('--spine-ink', item.ink);
    button.style.setProperty('--height', `${item.height}px`);
    button.style.setProperty('--width', `${item.width}px`);
    button.setAttribute('aria-label', `Open ${item.title}`);
    button.setAttribute('aria-haspopup', 'dialog');
    const spineTitle = el('span', 'spine-title', item.spineTitle || item.title);
    if (item.spineSubtitle) spineTitle.append(el('span', 'spine-subtitle', item.spineSubtitle));
    button.append(el('span', 'spine-material'), el('span', 'spine-number', `VOL. ${String(index + 1).padStart(2, '0')}`), spineTitle, el('span', 'spine-symbol', item.symbol));
    button.addEventListener('click', () => {
      playSound('click');
      history.pushState({ bookshelf: true, book: item.id }, '', `#${item.id}`);
      openBook(item, button, true);
    });
    $('bookshelf').append(button);
  });
  // Sounds are synthesized locally: no downloads, tracking, or audio files.
  function playSound(type) {
    if (!soundEnabled) return;
    try {
      audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
      audioContext.resume();
      const osc = audioContext.createOscillator(), gain = audioContext.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(type === 'turn' ? 310 : 520, audioContext.currentTime);
      osc.frequency.exponentialRampToValueAtTime(130, audioContext.currentTime + .12);
      gain.gain.setValueAtTime(.025, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(.001, audioContext.currentTime + .14);
      osc.connect(gain); gain.connect(audioContext.destination);
      osc.start(); osc.stop(audioContext.currentTime + .15);
    } catch (_) { /* Sound is optional; reading still works if audio is unavailable. */ }
  }
  function toggleSound() {
    soundEnabled = !soundEnabled;
    document.querySelectorAll('.sound').forEach(button => {
      button.setAttribute('aria-pressed', String(soundEnabled));
      button.setAttribute('aria-label', `Turn sounds ${soundEnabled ? 'off' : 'on'}`);
      button.querySelector('span').textContent = `sound ${soundEnabled ? 'on' : 'off'}`;
    });
    playSound('click');
  }
  $('reader-sound').addEventListener('click', toggleSound);
  function total() { return book ? 1 + book.sections.length * (mobile.matches ? 2 : 1) : 1; }
  function sectionIndex() { return mobile.matches ? Math.floor((page - 1) / 2) : page - 1; }
  function focusHeading() { $('book-title')?.focus({ preventScroll: true }); }
  function jumpTo(target) {
    if (target !== page) turn(target > page ? 1 : -1, target, true);
  }
  function contentsLink() {
    const link = el('a', 'contents-link', '← Contents');
    link.href = `#${book.id}`;
    link.addEventListener('click', event => { event.preventDefault(); jumpTo(0); });
    return link;
  }
  function heading(text, className = '') {
    const node = el('h2', className, text);
    node.id = 'book-title'; node.tabIndex = -1;
    return node;
  }
  function corner(direction) {
    const button = el('button', `corner corner-${direction > 0 ? 'next' : 'previous'}`);
    button.setAttribute('aria-label', direction > 0 ? 'Turn to next page' : 'Turn to previous page');
    button.append(el('span', '', direction > 0 ? '↗' : '↖'));
    button.addEventListener('click', () => turn(direction));
    return button;
  }
  function contentsPages() {
    const title = el('section', 'paper-page contents-cover');
    const symbol = el('span', 'contents-symbol', book.symbol); symbol.setAttribute('aria-hidden', 'true');
    title.append(el('p', 'kicker', 'CONTENTS'), heading(book.title), symbol);
    const nav = el('nav', 'contents-nav'); nav.setAttribute('aria-label', `${book.title} contents`);
    const list = el('ol', 'contents-list');
    book.sections.forEach((section, index) => {
      const li = el('li');
      const link = el('a', 'section-jump', section.heading);
      link.href = `#${book.id}`;
      link.dataset.section = section.id;
      link.addEventListener('click', event => {
        event.preventDefault();
        jumpTo(1 + index * (mobile.matches ? 2 : 1));
      });
      li.append(link); list.append(li);
    });
    nav.append(list);
    if (mobile.matches) { title.append(nav); return [title]; }
    const right = el('section', 'paper-page contents-index');
    right.append(el('p', 'kicker', 'IN THIS BOOK'), nav);
    return [title, right];
  }
  function crossBookLink(details) {
    const link = el('a', 'book-crosslink', details.text);
    link.href = `#${details.book}`;
    link.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = content.books.find(item => item.id === details.book);
      if (!target) return;
      event.preventDefault();
      playSound('click');
      // Keep this visit to the reader as one history entry, so Back still closes it.
      history.replaceState(history.state?.bookshelf ? { bookshelf: true, book: target.id } : null, '', link.hash);
      openBook(target, null, false);
      focusHeading();
    });
    return link;
  }
  function copyPage(item, index) {
    const section = el('section', 'paper-page page-copy section-copy');
    section.append(contentsLink(), el('p', 'kicker', `${String(index + 1).padStart(2, '0')} / ${book.title}`), heading(item.heading));
    item.text.split(/\n\s*\n|\n/).filter(text => text.trim()).forEach(text => section.append(el('p', 'page-text', text)));
    if (item.bookLink) section.append(crossBookLink(item.bookLink));
    section.append(el('span', 'page-number', String(index * 2 + 1).padStart(2, '0')));
    return section;
  }
  function photoPlaceholder(photo) {
    const placeholder = el('div', 'photo-placeholder-box', `Photo: ${photo.description}`);
    return placeholder;
  }
  function photoPage(item, index) {
    const section = el('section', 'paper-page page-photo section-photos');
    section.append(contentsLink());
    if (mobile.matches) section.append(heading(`${item.heading} — photos`, 'sr-only'));
    const gallery = el('div', `scrapbook-gallery${item.photos.length > 1 ? ' multiple-photos' : ''}`);
    item.photos.forEach(photo => {
      const figure = el('figure', 'polaroid');
      if (photo.src) {
        const image = el('img');
        image.src = photo.src; image.alt = photo.alt ?? photo.description;
        image.loading = 'lazy'; image.decoding = 'async'; image.width = 640; image.height = 480;
        image.addEventListener('error', () => image.replaceWith(photoPlaceholder(photo)), { once: true });
        figure.append(image);
      } else figure.append(photoPlaceholder(photo));
      figure.append(el('figcaption', '', photo.caption || photo.description));
      gallery.append(figure);
    });
    section.append(gallery, el('span', 'page-number', String(index * 2 + 2).padStart(2, '0')));
    return section;
  }
  function render() {
    spread.replaceChildren();
    spread.classList.toggle('showing-contents', page === 0);
    if (page === 0) spread.append(...contentsPages());
    else {
      const index = sectionIndex(), item = book.sections[index];
      if (!mobile.matches || (page - 1) % 2 === 0) spread.append(copyPage(item, index));
      if (!mobile.matches || (page - 1) % 2 === 1) spread.append(photoPage(item, index));
    }
    if (page > 0) spread.firstElementChild.append(corner(-1));
    if (page < total() - 1) spread.lastElementChild.append(corner(1));
    $('position').textContent = `Page ${page + 1} of ${total()}`;
    $('previous').hidden = page === 0;
    $('next').hidden = page >= total() - 1;
  }
  function turn(direction, target = page + direction, headingFocus = false) {
    if (!book || turning || target < 0 || target >= total()) return;
    turning = true;
    const focused = document.activeElement;
    const needsFocus = headingFocus || spread.contains(focused);
    const oldPage = (direction > 0 ? spread.lastElementChild : spread.firstElementChild).cloneNode(true);
    oldPage.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
    oldPage.querySelectorAll('button, a').forEach(node => node.remove());
    sheet.replaceChildren(oldPage);
    page = target;
    render();
    dialog.scrollTop = 0;
    sheet.className = `turn-sheet turning${direction < 0 ? ' backwards' : ''}`;
    playSound('turn');
    timer = setTimeout(() => {
      sheet.className = 'turn-sheet'; sheet.replaceChildren(); turning = false;
      if (needsFocus) focusHeading();
      else if (focused === $('next') && $('next').hidden) $('previous').focus({ preventScroll: true });
      else if (focused === $('previous') && $('previous').hidden) $('next').focus({ preventScroll: true });
    }, reduced.matches ? 150 : 500);
  }
  function openBook(item, button, animate) {
    clearTimeout(timer); clearTimeout(openingTimer); turning = false; sheet.className = 'turn-sheet';
    dialog.querySelectorAll('.flying-book').forEach(node => node.remove());
    book = item; page = 0; origin = button || $(`spine-${item.id}`);
    document.querySelector('.reader-shell').style.setProperty('--book', book.color);
    render();
    dialog.scrollTop = 0;
    document.body.classList.add('reading');
    if (!dialog.open) dialog.showModal();
    $('close-book').focus({ preventScroll: true });
    document.querySelector('.book-binding').classList.remove('opening');
    if (animate && !reduced.matches && origin) {
      const start = origin.getBoundingClientRect(), target = document.querySelector('.book-binding').getBoundingClientRect();
      const flying = el('div', 'flying-book', item.title);
      flying.style.cssText = `left:${start.left}px;top:${start.top}px;width:${start.width}px;height:${start.height}px;--book:${item.color}`;
      // Attach inside the dialog so the moving cover stays above the modal backdrop.
      dialog.append(flying);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        flying.style.transform = `translate(${target.left + target.width / 2 - start.left - start.width / 2}px,${target.top + target.height / 2 - start.top - start.height / 2}px) scale(1.3) rotate(-8deg)`;
        flying.style.opacity = '0';
        document.querySelector('.book-binding').classList.add('opening');
      }));
      openingTimer = setTimeout(() => flying.remove(), 560);
    } else { document.querySelector('.book-binding').classList.add('opening'); }
  }
  function closeVisual() {
    if (!dialog.open) return;
    clearTimeout(timer); clearTimeout(openingTimer);
    dialog.querySelectorAll('.flying-book').forEach(node => node.remove());
    sheet.className = 'turn-sheet'; turning = false;
    dialog.close(); document.body.classList.remove('reading'); book = null;
    origin?.focus({ preventScroll: true });
  }
  function requestClose() {
    playSound('click');
    if (history.state?.bookshelf) history.back();
    else { history.replaceState(null, '', location.pathname + location.search); closeVisual(); }
  }
  function route() {
    const id = location.hash.slice(1), item = content.books.find(entry => entry.id === id);
    if (item) { if (book?.id !== id) openBook(item, null, false); }
    else closeVisual();
  }
  $('close-book').addEventListener('click', requestClose);
  dialog.addEventListener('cancel', event => { event.preventDefault(); requestClose(); });
  $('next').addEventListener('click', () => turn(1));
  $('previous').addEventListener('click', () => turn(-1));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); requestClose(); return; }
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); turn(event.key === 'ArrowRight' ? 1 : -1); }
  });
  let touch = null;
  spread.addEventListener('touchstart', event => { const point = event.changedTouches[0]; touch = { x: point.clientX, y: point.clientY }; }, { passive: true });
  spread.addEventListener('touchend', event => {
    if (!touch) return;
    const point = event.changedTouches[0], dx = point.clientX - touch.x, dy = point.clientY - touch.y;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5) turn(dx < 0 ? 1 : -1);
    touch = null;
  }, { passive: true });
  mobile.addEventListener('change', () => {
    if (!book) return;
    clearTimeout(timer); turning = false; sheet.className = 'turn-sheet';
    page = page === 0 ? 0 : (mobile.matches ? 1 + (page - 1) * 2 : 1 + Math.floor((page - 1) / 2)); render();
    focusHeading();
  });
  window.addEventListener('hashchange', route);
  window.addEventListener('popstate', route);
  route();
})();
