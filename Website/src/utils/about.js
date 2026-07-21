const toolsData = [
  { id: 'central', name: 'Stack', icon: 'fa-solid fa-layer-group', central: true, desc: 'Écosystème de développement : versionning, CI/CD, conteneurisation et collaboration.', uses: ['Dev', 'CI/CD', 'Agile'] },
  { id: 'github', name: 'GitHub', icon: 'fa-brands fa-github', desc: 'Plateforme de versioning, CI/CD et collaboration.', uses: ['Repositories', 'Actions', 'Pull Requests'] },
  { id: 'git', name: 'Git', icon: 'fa-brands fa-git-alt', desc: 'Gestion de versions et collaboration en équipe.', uses: ['Branches', 'Merge', 'CI/CD'] },
  { id: 'docker', name: 'Docker', icon: 'fa-brands fa-docker', desc: 'Conteneurisation et orchestration des services.', uses: ['Images', 'Compose', 'Déploiement'] },
  { id: 'vscode', name: 'VS Code', icon: 'fa-solid fa-code', desc: 'Éditeur de code principal et extensible.', uses: ['Extensions', 'Débogage'] },
  { id: 'office', name: 'Office', icon: 'fa-solid fa-file-word', desc: 'Suite bureautique pour la documentation.', uses: ['Word', 'Excel', 'PowerPoint'] },
  { id: 'arduino', name: 'Arduino', icon: 'fa-solid fa-microchip', desc: 'Programmation embarquée et prototypage rapide.', uses: ['Capteurs', 'PWM'] },
  { id: 'fusion', name: 'Fusion 360', icon: 'fa-solid fa-cube', desc: 'Conception 3D et électronique.', uses: ['CAD', 'FEM', 'Impression 3D'] },
  { id: 'claude', name: 'Claude Code', icon: 'fa-solid fa-asterisk', desc: 'Assistant IA pour la génération et révision de code.', uses: ['Génération', 'Review', 'Doc'] },
  { id: 'copilot', name: 'Copilot', icon: 'fa-solid fa-robot', desc: "Assistance IA dans l'IDE pour la programmation.", uses: ['Autocomplétion', 'Suggestions', 'Tests'] },
  { id: 'powershell', name: 'Powershell', icon: 'fa-solid fa-terminal', desc: 'Automatisation des tâches et scripting système.', uses: ['Scripts', 'Automation'] },
  { id: 'linux', name: 'Linux', icon: 'fa-brands fa-linux', desc: "Système d'exploitation libre pour le développement.", uses: ['Bash', 'Admin'] },
  { id: 'notion', name: 'Notion', icon: 'fa-solid fa-n', desc: 'Organisation des projets, notes et documentation.', uses: ['Wiki', 'Tasks', 'Notes'] },
  { id: 'openproject', name: 'OpenProject', icon: 'fa-solid fa-list-check', desc: 'Gestion de projet agile et planification.', uses: ['Scrum', 'Planning', 'Tracking'] }
];

function getNodeSize() {
  return window.innerWidth <= 480 ? 52 : (window.innerWidth <= 768 ? 60 : 100);
}

export function initializeAboutPage() {
  const container = document.getElementById('tools-spiderweb');
  const canvas = document.getElementById('tools-canvas');
  if (!container || !canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let cx = 0;
  let cy = 0;
  let radius = 0;
  let nodes = [];
  let rafId;

  function resize() {
    const rect = container.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = width;
    canvas.height = height;
    cx = width / 2;
    cy = height / 2;
    radius = Math.min(width, height) * 0.42;
  }

  function createNodes() {
    container.querySelectorAll('.tool-node').forEach(node => node.remove());
    nodes = [];

    const central = toolsData.find(t => t.central);
    const periphery = toolsData.filter(t => !t.central);

    if (central) {
      const nodeEl = createNodeElement(central);
      container.appendChild(nodeEl);
      bindTooltipPositioning(nodeEl);
      nodes.push({ data: central, el: nodeEl, x: 0, y: 0, speed: 0.3 + Math.random() * 0.3, offset: Math.random() * Math.PI * 2 });
    }

    const nodeSize = getNodeSize();
    const halfSize = nodeSize / 2;
    const count = periphery.length;
    const minDimHalf = Math.min(width, height) / 2;
    const margin = 20;
    const safeRadius = Math.max(minDimHalf - halfSize - margin, 80);

    for (let i = 0; i < count; i += 1) {
      const angle = (i / count) * 2 * Math.PI - Math.PI / 2;
      const x = Math.cos(angle) * safeRadius;
      const y = Math.sin(angle) * safeRadius;
      const nodeEl = createNodeElement(periphery[i]);
      container.appendChild(nodeEl);
      bindTooltipPositioning(nodeEl);
      nodes.push({ data: periphery[i], el: nodeEl, x, y, speed: 0.2 + Math.random() * 0.3, offset: Math.random() * Math.PI * 2 });
    }
  }

  function bindTooltipPositioning(nodeEl) {
    const tooltip = nodeEl.querySelector('.node-tooltip');
    if (!tooltip) return;

    function adjust() {
      tooltip.style.setProperty('--tt-shift', '0px');
      tooltip.classList.remove('tooltip-flip');

      const rect = tooltip.getBoundingClientRect();
      const edgeMargin = 10;
      let shift = 0;

      if (rect.left < edgeMargin) {
        shift = edgeMargin - rect.left;
      } else if (rect.right > window.innerWidth - edgeMargin) {
        shift = (window.innerWidth - edgeMargin) - rect.right;
      }

      if (shift !== 0) {
        tooltip.style.setProperty('--tt-shift', `${shift}px`);
      }

      const navSafeTop = 70;
      if (rect.top < navSafeTop) {
        tooltip.classList.add('tooltip-flip');
      }
    }

    nodeEl.addEventListener('mouseenter', adjust);
    nodeEl.addEventListener('touchstart', adjust, { passive: true });
  }

  function createNodeElement(data) {
    const div = document.createElement('div');
    div.className = `tool-node${data.central ? ' central' : ''}`;

    const usesHtml = data.uses.map(use => `<span class="tooltip-tag">${use}</span>`).join('');
    div.innerHTML = `
      <div class="node-circle">
        <i class="node-icon ${data.icon}"></i>
        <span class="node-label">${data.name}</span>
      </div>
      <div class="node-tooltip">
        <h4>${data.name}</h4>
        <p>${data.desc}</p>
        <div class="tooltip-tags">
          ${usesHtml}
        </div>
      </div>
    `;

    return div;
  }

  function updatePositions(time) {
    const nodeSize = getNodeSize();
    const half = nodeSize / 2;

    nodes.forEach(node => {
      const floatX = Math.sin(time * 0.001 * node.speed + node.offset) * 6;
      const floatY = Math.cos(time * 0.001 * node.speed + node.offset) * 6;
      const targetX = cx + node.x + floatX;
      const targetY = cy + node.y + floatY;
      const px = Math.max(half, Math.min(width - half, targetX));
      const py = Math.max(half, Math.min(height - half, targetY));

      node.el.style.left = `${px - half}px`;
      node.el.style.top = `${py - half}px`;
      node.px = px;
      node.py = py;
    });
  }

  function drawLines() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';

    const centralNode = nodes.find(n => n.data.central);
    if (centralNode) {
      nodes.forEach(node => {
        if (node === centralNode) return;
        ctx.beginPath();
        ctx.moveTo(centralNode.px, centralNode.py);
        ctx.lineTo(node.px, node.py);
        const dist = Math.hypot(node.px - centralNode.px, node.py - centralNode.py);
        const alpha = Math.max(0.05, 1 - dist / (radius * 2.5));
        ctx.strokeStyle = `rgba(123, 97, 255, ${alpha * 0.5})`;
        ctx.stroke();
      });
    }

    const periphery = nodes.filter(n => !n.data.central);
    for (let i = 0; i < periphery.length; i += 1) {
      for (let j = i + 1; j < periphery.length; j += 1) {
        const a = periphery[i];
        const b = periphery[j];
        const dist = Math.hypot(a.px - b.px, a.py - b.py);

        if (dist < radius * 1.4) {
          ctx.beginPath();
          ctx.moveTo(a.px, a.py);
          ctx.lineTo(b.px, b.py);
          const alpha = Math.max(0.05, 1 - dist / (radius * 1.4));
          ctx.strokeStyle = `rgba(123, 97, 255, ${alpha * 0.25})`;
          ctx.stroke();
        }
      }
    }
  }

  function animate(time) {
    updatePositions(time);
    drawLines();
    rafId = requestAnimationFrame(animate);
  }

  function init() {
    resize();
    createNodes();
    if (rafId) cancelAnimationFrame(rafId);
    animate(0);
  }

  window.addEventListener('resize', init);
  init();
}
