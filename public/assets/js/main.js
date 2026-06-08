(function() {
  'use strict';

  const WA_NUMBER = '880XXXXXXXXX';
  let pendingOrder = null;

  /* ───── Product card: click to expand — only one at a time ───── */
  document.querySelectorAll('.prod-card').forEach(card => {
    card.addEventListener('click', function(e) {
      const row = e.target.closest('.var-row');
      if (row) return;
      const wasOpen = this.classList.contains('open');
      document.querySelectorAll('.prod-card').forEach(c => c.classList.remove('open'));
      if (!wasOpen) this.classList.add('open');
    });
  });

  /* ───── Click anywhere on a variation row → open order modal ───── */
  document.querySelectorAll('.var-row').forEach(row => {
    row.addEventListener('click', function() {
      const card = this.closest('.prod-card');
      pendingOrder = {
        name: card.dataset.name,
        pkg: this.dataset.pkg,
        price: this.dataset.price
      };
      document.getElementById('orderModal').classList.add('open');
      document.getElementById('custName').focus();
    });
  });

  /* ───── Order modal: submit ───── */
  document.getElementById('orderForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('custName').value.trim();
    const phone = document.getElementById('custPhone').value.trim();
    const message = document.getElementById('custMsg').value.trim();
    if (!name || !phone || !pendingOrder) return;

    const orderId = 'DP' + Date.now().toString(36).toUpperCase();
    const lines = [
      `*New Order from Digital SubDesk*`,
      ``,
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Product: ${pendingOrder.name}`,
      `Package: ${pendingOrder.pkg}`,
      `Price: ৳${pendingOrder.price}`,
      `Ref: ${orderId}`,
      ``
    ];
    if (message) {
      lines.push(`Message: ${message}`);
      lines.push(``);
    }
    lines.push(`Please provide payment details (bKash/Nagad/USDT/Binance/Solana/Litecoin).`);
    const msg = lines.join('\n');

    closeModal();
    showToast(`Order sent! Ref: ${orderId}`);
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  });

  /* ───── Order modal: cancel & close ───── */
  document.getElementById('modalCancel').addEventListener('click', closeModal);
  document.getElementById('orderModal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
  });

  function closeModal() {
    document.getElementById('orderModal').classList.remove('open');
    document.getElementById('custName').value = '';
    document.getElementById('custPhone').value = '';
    document.getElementById('custMsg').value = '';
    pendingOrder = null;
  }

  /* ───── Tabs ───── */
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden'));
      const tab = document.getElementById('tab-' + this.dataset.tab);
      if (tab) tab.classList.remove('hidden');
    });
  });

  /* ───── Product search filter ───── */
  const searchInput = document.getElementById('productSearch');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const q = this.value.toLowerCase().trim();
      document.querySelectorAll('.prod-card').forEach(card => {
        const name = card.dataset.name.toLowerCase();
        const label = card.querySelector('.name')?.textContent.toLowerCase() || '';
        card.style.display = (!q || name.includes(q) || label.includes(q)) ? '' : 'none';
      });
    });
  }

  /* ───── Chat widget ───── */
  const chatBtn = document.getElementById('chatToggle');
  const chatMenu = document.getElementById('chatMenu');
  if (chatBtn && chatMenu) {
    chatBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      chatMenu.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!chatBtn.contains(e.target) && !chatMenu.contains(e.target)) {
        chatMenu.classList.remove('open');
      }
    });
  }

  /* ───── Navbar scroll ───── */
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.classList.add('nav-scrolled');
    } else {
      nav.classList.remove('nav-scrolled');
    }
  });

  /* ───── Toast ───── */
  function showToast(msg) {
    const t = document.getElementById('toast');
    const span = t.querySelector('span');
    if (span) span.textContent = msg;
    t.classList.add('show');
    setTimeout(() => { t.classList.remove('show'); }, 3500);
  }

  /* ───── Back to top ───── */
  const topBtn = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    topBtn.classList.toggle('visible', window.scrollY > 600);
  });
  topBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

})();
