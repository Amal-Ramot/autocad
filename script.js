(function () {
  var KEY = 'autocad-guide-done';
  var steps = Array.prototype.slice.call(document.querySelectorAll('.step'));
  var total = steps.length;

  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
  var state = load();

  function refresh() {
    var count = 0;
    steps.forEach(function (sec) {
      var on = !!state[sec.id];
      if (on) count++;
      sec.classList.toggle('completed', on);
      sec.querySelector('.done input').checked = on;
      var link = document.querySelector('.toc a[href="#' + sec.id + '"]');
      if (link) link.classList.toggle('is-done', on);
    });
    document.getElementById('pfill').style.width = (count / total * 100) + '%';
    document.getElementById('ptext').textContent = count + '/' + total;
  }

  steps.forEach(function (sec, i) {
    sec.querySelector('.done input').addEventListener('change', function (e) {
      state[sec.id] = e.target.checked;
      save(state);
      refresh();
      if (e.target.checked && steps[i + 1]) {
        setTimeout(function () { steps[i + 1].scrollIntoView({ behavior: 'smooth' }); }, 350);
      }
    });
  });
  refresh();

  // highlight current section in the TOC
  var links = document.querySelectorAll('.toc a');
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) {
          var on = a.getAttribute('href') === '#' + en.target.id;
          a.classList.toggle('active', on);
          if (on && a.scrollIntoView) a.parentNode.parentNode.scrollLeft = a.offsetLeft - 40;
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    document.querySelectorAll('#before, .step, #faq').forEach(function (s) { obs.observe(s); });
  }

  // lightbox
  var lb = document.getElementById('lightbox');
  var lbImg = lb.querySelector('img');
  document.querySelectorAll('figure img').forEach(function (img) {
    img.addEventListener('click', function () {
      lbImg.src = img.src; lbImg.alt = img.alt; lb.hidden = false;
    });
  });
  function close() { lb.hidden = true; lbImg.src = ''; }
  lb.addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
})();
