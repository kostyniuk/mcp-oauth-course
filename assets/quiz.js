// Reusable exercises. Markup contracts:
//  Multiple choice: <div class="exercise mcq" data-answer="KEY"> … <button class="opt" data-key="KEY"> … <div class="feedback" data-right="…" data-wrong="…">
//  Order:           <div class="exercise order" data-solution="a,b,c"> … <div class="order-pool"><div class="item" data-id="a">…</div></div><div class="order-picked"></div>
//  Sort:            <div class="exercise sort"> … <div class="sort-row" data-answer="LEFT|RIGHT"> text <button class="btn" data-pick="LEFT">…</button><button class="btn" data-pick="RIGHT">…</button></div>
//  Recall:          <div class="exercise recall"> … <textarea></textarea><button class="btn reveal">Show model answer</button><div class="model">…</div>
// Scores are kept per page in localStorage so a later review lesson can resurface misses.
(() => {
  const key = `score:${location.pathname.split('/').pop()}`;
  const results = {};
  const save = () => {
    localStorage.setItem(key, JSON.stringify(results));
    const done = Object.values(results);
    const el = document.querySelector('.score');
    if (el) el.textContent = `${done.filter(Boolean).length} / ${document.querySelectorAll('.exercise:not(.recall)').length} correct first time`;
  };
  const record = (id, ok) => {
    if (!(id in results)) results[id] = ok;
    save();
  };
  const say = (box, ok, text) => {
    const fb = box.querySelector('.feedback');
    fb.textContent = text ?? (ok ? fb.dataset.right : fb.dataset.wrong);
    fb.className = `feedback show ${ok ? 'good' : 'bad'}`;
  };

  document.querySelectorAll('.exercise').forEach((box, i) => {
    const id = box.id || `ex${i}`;

    if (box.classList.contains('mcq')) {
      box.querySelectorAll('.opt').forEach((opt) => opt.addEventListener('click', () => {
        const ok = opt.dataset.key === box.dataset.answer;
        opt.classList.add(ok ? 'right' : 'wrong');
        if (ok) box.querySelectorAll('.opt').forEach((o) => (o.disabled = true));
        record(id, ok);
        say(box, ok);
      }));
    }

    if (box.classList.contains('order')) {
      const pool = box.querySelector('.order-pool');
      const picked = box.querySelector('.order-picked');
      // Shuffle once so the source order never hints at the answer.
      [...pool.children].sort(() => Math.random() - 0.5).forEach((c) => pool.appendChild(c));
      box.addEventListener('click', (e) => {
        const item = e.target.closest('.item');
        if (!item || box.dataset.locked) return;
        (item.parentElement === pool ? picked : pool).appendChild(item);
      });
      box.querySelector('.check').addEventListener('click', () => {
        const solution = box.dataset.solution.split(',');
        const order = [...picked.children].map((c) => c.dataset.id);
        if (order.length !== solution.length) return say(box, false, 'Place every step first.');
        let ok = true;
        [...picked.children].forEach((c, n) => {
          const right = c.dataset.id === solution[n];
          c.classList.toggle('right', right);
          c.classList.toggle('wrong', !right);
          ok = ok && right;
        });
        record(id, ok);
        say(box, ok);
        if (ok) box.dataset.locked = '1';
      });
      box.querySelector('.reset')?.addEventListener('click', () => {
        delete box.dataset.locked;
        [...picked.children].forEach((c) => { c.classList.remove('right', 'wrong'); pool.appendChild(c); });
        box.querySelector('.feedback').className = 'feedback';
      });
    }

    if (box.classList.contains('sort')) {
      const rows = [...box.querySelectorAll('.sort-row')];
      rows.forEach((row) => row.querySelectorAll('[data-pick]').forEach((b) => b.addEventListener('click', () => {
        row.dataset.picked = b.dataset.pick;
        row.querySelectorAll('[data-pick]').forEach((x) => x.classList.toggle('primary', x === b));
      })));
      box.querySelector('.check').addEventListener('click', () => {
        if (rows.some((r) => !r.dataset.picked)) return say(box, false, 'Sort every row first.');
        let ok = true;
        rows.forEach((r) => {
          const right = r.dataset.picked === r.dataset.answer;
          r.style.background = right ? 'var(--good-soft)' : 'var(--bad-soft)';
          ok = ok && right;
        });
        record(id, ok);
        say(box, ok);
      });
    }

    if (box.classList.contains('recall')) {
      box.querySelector('.reveal').addEventListener('click', () => box.querySelector('.model').classList.add('show'));
    }
  });
  save();
})();
