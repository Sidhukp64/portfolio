/**
 * ============================================================
 *  SIDHARTH KP — In-Page Visual Editor & Direct GitHub Sync
 *  Exclusively for Sidharth (owner) via GitHub Personal Access Token.
 * ============================================================
 */

(function () {
  'use strict';

  // Config
  const GITHUB_REPO = 'Sidhukp64/portfolio';
  const FILE_PATH   = 'index.html';
  const BRANCH      = 'main';

  // Local storage keys
  const STORAGE_KEY_TOKEN = 'sk_portfolio_gh_token';
  const STORAGE_KEY_PIN   = 'sk_portfolio_admin_pin';

  // State
  let isEditMode = false;

  // Editable selectors
  const EDITABLE_SELECTORS = [
    '.hero-name',
    '.hero-greeting',
    '.hero-desc',
    '.objective-text',
    '.about-desc',
    '.info-value',
    '.interest-tag',
    '.skill-name',
    '.skills-cat-title',
    '.soft-skill-card span',
    '.timeline-title',
    '.timeline-place',
    '.timeline-time',
    '.timeline-score',
    '.timeline-desc',
    '.achievement-item p',
    '.project-title',
    '.project-desc',
    '.project-status',
    '.stack-tag',
    '.cert-title',
    '.cert-org',
    '.cert-year',
    '.cert-status',
    '.cert-info h4',
    '.cert-info p',
    '.cert-badge',
    '.contact-item-value',
    '.section-title',
    '.section-label'
  ];

  /* ------------------------------------------------------------
     DOM Injections: Admin Bar & Modals
     ------------------------------------------------------------ */
  function injectAdminUI() {
    // 1. Floating Toolbar
    const bar = document.createElement('div');
    bar.id = 'admin-bar';
    bar.innerHTML = `
      <span class="admin-pill-badge"><span class="admin-pulse-dot"></span> EDIT MODE</span>
      <button id="admin-btn-add-project" class="admin-btn" title="Add a new project card">
        <i class="fas fa-plus-circle"></i> Add Project
      </button>
      <button id="admin-btn-publish" class="admin-btn admin-btn-publish" title="Publish changes directly to GitHub">
        <i class="fas fa-cloud-upload-alt"></i> <span id="admin-publish-text">Save &amp; Publish</span>
      </button>
      <button id="admin-btn-download" class="admin-btn" title="Download clean index.html backup">
        <i class="fas fa-download"></i> Backup
      </button>
      <button id="admin-btn-settings" class="admin-btn" title="Editor &amp; Token Settings">
        <i class="fas fa-cog"></i>
      </button>
      <button id="admin-btn-exit" class="admin-btn admin-btn-exit" title="Exit Edit Mode">
        <i class="fas fa-times"></i>
      </button>
    `;
    document.body.appendChild(bar);

    // 2. Auth Modal
    const authModal = document.createElement('div');
    authModal.id = 'admin-auth-modal';
    authModal.className = 'admin-modal-overlay';
    authModal.innerHTML = `
      <div class="admin-modal-box">
        <div class="admin-modal-header">
          <h3><i class="fas fa-user-shield" style="color:var(--gold)"></i> Owner Admin Login</h3>
          <button class="admin-modal-close" data-close="admin-auth-modal">&times;</button>
        </div>
        <div class="admin-modal-body">
          <p>This editor allows <strong>Sidharth</strong> to edit website content directly on screen and push live updates straight to GitHub Pages.</p>
          
          <div id="admin-pin-group" class="admin-field-group" style="display:none">
            <label for="admin-input-pin">Enter Quick PIN</label>
            <input type="password" id="admin-input-pin" placeholder="••••" maxlength="10" />
            <div class="admin-hint">Enter your preset admin PIN to unlock immediately.</div>
          </div>

          <div id="admin-token-group" class="admin-field-group">
            <label for="admin-input-token">GitHub Personal Access Token (PAT)</label>
            <input type="password" id="admin-input-token" placeholder="ghp_xxxxxxxxxxxxxxxxxxxx" autocomplete="off" />
            <div class="admin-hint">
              Needs <code>repo</code> (Contents: Read &amp; Write) permission for <strong>${GITHUB_REPO}</strong>.<br/>
              <a href="https://github.com/settings/tokens/new?scopes=repo&description=Portfolio+InPage+Editor" target="_blank" rel="noopener noreferrer">
                👉 Click here to create a GitHub token
              </a>
            </div>
          </div>

          <div id="admin-set-pin-group" class="admin-field-group">
            <label for="admin-input-new-pin">Set a Quick PIN (Optional)</label>
            <input type="password" id="admin-input-new-pin" placeholder="e.g. 1234 (for easy next-time access)" maxlength="10" />
            <div class="admin-hint">Allows fast unlock next time without having to paste the long token again.</div>
          </div>
        </div>
        <div class="admin-modal-footer">
          <button class="admin-btn" data-close="admin-auth-modal">Cancel</button>
          <button id="admin-submit-auth" class="admin-btn admin-btn-publish">
            <i class="fas fa-unlock-alt"></i> Unlock Edit Mode
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(authModal);

    // 3. Add Project Modal
    const projectModal = document.createElement('div');
    projectModal.id = 'admin-project-modal';
    projectModal.className = 'admin-modal-overlay';
    projectModal.innerHTML = `
      <div class="admin-modal-box">
        <div class="admin-modal-header">
          <h3><i class="fas fa-folder-plus" style="color:var(--gold)"></i> Add New Project</h3>
          <button class="admin-modal-close" data-close="admin-project-modal">&times;</button>
        </div>
        <div class="admin-modal-body">
          <div class="admin-field-group">
            <label for="proj-name">Project Title *</label>
            <input type="text" id="proj-name" placeholder="e.g. AI Medical Assistant" required />
          </div>
          <div class="admin-field-group">
            <label for="proj-status">Status Badge</label>
            <select id="proj-status">
              <option value="Production Ready" selected>Production Ready</option>
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
            </select>
          </div>
          <div class="admin-field-group">
            <label for="proj-color">Color Accent</label>
            <select id="proj-color">
              <option value="teal" selected>Teal (Cyan)</option>
              <option value="purple">Purple</option>
              <option value="green">Green</option>
              <option value="gold">Gold</option>
            </select>
          </div>
          <div class="admin-field-group">
            <label for="proj-icon">Icon (Font Awesome Class)</label>
            <input type="text" id="proj-icon" value="fas fa-laptop-code" placeholder="e.g. fas fa-robot" />
          </div>
          <div class="admin-field-group">
            <label for="proj-desc">Description *</label>
            <textarea id="proj-desc" rows="3" placeholder="Brief summary of what it does and why it was built..." required></textarea>
          </div>
          <div class="admin-field-group">
            <label for="proj-stack">Tech Stack (comma separated)</label>
            <input type="text" id="proj-stack" placeholder="e.g. Python, FastAPI, React, Docker" />
          </div>
          <div class="admin-field-group">
            <label for="proj-link">GitHub or Live Link</label>
            <input type="url" id="proj-link" value="https://github.com/Sidhukp64" placeholder="https://github.com/..." />
          </div>
        </div>
        <div class="admin-modal-footer">
          <button class="admin-btn" data-close="admin-project-modal">Cancel</button>
          <button id="admin-submit-project" class="admin-btn admin-btn-publish">
            <i class="fas fa-check"></i> Add to Portfolio
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(projectModal);

    // 4. Settings Modal
    const settingsModal = document.createElement('div');
    settingsModal.id = 'admin-settings-modal';
    settingsModal.className = 'admin-modal-overlay';
    settingsModal.innerHTML = `
      <div class="admin-modal-box">
        <div class="admin-modal-header">
          <h3><i class="fas fa-cog" style="color:var(--gold)"></i> Editor Settings</h3>
          <button class="admin-modal-close" data-close="admin-settings-modal">&times;</button>
        </div>
        <div class="admin-modal-body">
          <div class="admin-field-group">
            <label for="settings-token">Update GitHub Personal Access Token</label>
            <input type="password" id="settings-token" placeholder="Paste new token to update" />
          </div>
          <div class="admin-field-group">
            <label for="settings-pin">Update Quick PIN</label>
            <input type="password" id="settings-pin" placeholder="Enter new PIN" maxlength="10" />
          </div>
          <hr style="border-color:var(--border); margin: 1.5rem 0;" />
          <button id="admin-btn-logout" class="admin-btn" style="color:#ef4444; border-color:rgba(239,68,68,0.4); width:100%; justify-content:center;">
            <i class="fas fa-sign-out-alt"></i> Clear Saved Credentials on this Device
          </button>
        </div>
        <div class="admin-modal-footer">
          <button class="admin-btn" data-close="admin-settings-modal">Close</button>
          <button id="admin-submit-settings" class="admin-btn admin-btn-publish">
            Save Settings
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(settingsModal);

    // 5. Inject Lock Trigger in Footer
    const footerCopy = document.querySelector('.footer-copy');
    if (footerCopy && !document.getElementById('admin-trigger-btn')) {
      const lockBtn = document.createElement('button');
      lockBtn.id = 'admin-trigger-btn';
      lockBtn.className = 'admin-trigger-btn';
      lockBtn.setAttribute('title', 'Owner Admin Login (Ctrl+Shift+E)');
      lockBtn.setAttribute('aria-label', 'Owner Admin Login');
      lockBtn.innerHTML = '<i class="fas fa-lock" aria-hidden="true"></i>';
      lockBtn.addEventListener('click', handleAuthTrigger);
      footerCopy.appendChild(lockBtn);
    }
  }

  /* ------------------------------------------------------------
     Auth Handling
     ------------------------------------------------------------ */
  function handleAuthTrigger() {
    if (isEditMode) {
      exitEditMode();
      return;
    }

    const savedToken = localStorage.getItem(STORAGE_KEY_TOKEN);
    const savedPin   = localStorage.getItem(STORAGE_KEY_PIN);

    const authModal     = document.getElementById('admin-auth-modal');
    const pinGroup      = document.getElementById('admin-pin-group');
    const tokenGroup    = document.getElementById('admin-token-group');
    const setPinGroup   = document.getElementById('admin-set-pin-group');
    const pinInput      = document.getElementById('admin-input-pin');
    const tokenInput    = document.getElementById('admin-input-token');

    // If both token & PIN are saved, ask only for PIN
    if (savedToken && savedPin) {
      pinGroup.style.display = 'block';
      tokenGroup.style.display = 'none';
      setPinGroup.style.display = 'none';
      pinInput.value = '';
      openModal('admin-auth-modal');
      setTimeout(() => pinInput.focus(), 100);
      return;
    }

    // Otherwise show full token setup
    pinGroup.style.display = 'none';
    tokenGroup.style.display = 'block';
    setPinGroup.style.display = 'block';
    tokenInput.value = savedToken || '';
    openModal('admin-auth-modal');
    setTimeout(() => tokenInput.focus(), 100);
  }

  function verifyAndUnlock() {
    const savedToken = localStorage.getItem(STORAGE_KEY_TOKEN);
    const savedPin   = localStorage.getItem(STORAGE_KEY_PIN);

    const pinInput    = document.getElementById('admin-input-pin');
    const tokenInput  = document.getElementById('admin-input-token');
    const newPinInput = document.getElementById('admin-input-new-pin');

    // Checking existing PIN
    if (savedToken && savedPin && document.getElementById('admin-pin-group').style.display !== 'none') {
      if (pinInput.value.trim() === savedPin) {
        closeModal('admin-auth-modal');
        enterEditMode();
        notify('Admin mode activated! Click any text to edit.', 'success');
      } else {
        notify('Incorrect PIN. Please try again.', 'error');
        pinInput.value = '';
        pinInput.focus();
      }
      return;
    }

    // Setting up token
    const token = tokenInput.value.trim();
    if (!token) {
      notify('Please enter your GitHub Personal Access Token.', 'error');
      return;
    }

    localStorage.setItem(STORAGE_KEY_TOKEN, token);

    const newPin = newPinInput.value.trim();
    if (newPin) {
      localStorage.setItem(STORAGE_KEY_PIN, newPin);
    }

    closeModal('admin-auth-modal');
    enterEditMode();
    notify('Credentials saved! You are now in visual edit mode.', 'success');
  }

  /* ------------------------------------------------------------
     Enter / Exit Edit Mode
     ------------------------------------------------------------ */
  function enterEditMode() {
    isEditMode = true;
    document.body.classList.add('admin-edit-active');
    document.getElementById('admin-bar').classList.add('active');

    // Enable contenteditable on target elements
    EDITABLE_SELECTORS.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        el.setAttribute('contenteditable', 'true');
        el.setAttribute('spellcheck', 'true');

        // Prevent accidental link triggers while editing
        if (el.tagName === 'A' || el.closest('a')) {
          el.addEventListener('click', preventLinkWhileEditing);
        }
      });
    });

    // Add delete buttons on project cards
    attachCardDeleteButtons();
    // Add skill controls
    attachSkillControls();
  }

  function exitEditMode() {
    isEditMode = false;
    document.body.classList.remove('admin-edit-active');
    document.getElementById('admin-bar').classList.remove('active');

    // Remove contenteditable
    EDITABLE_SELECTORS.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        el.removeAttribute('contenteditable');
        el.removeAttribute('spellcheck');
        if (el.tagName === 'A' || el.closest('a')) {
          el.removeEventListener('click', preventLinkWhileEditing);
        }
      });
    });

    // Remove skill admin controls
    document.querySelectorAll('.admin-skill-delete-btn, .admin-add-skill-btn').forEach(el => el.remove());

    notify('Exited edit mode.', 'success');
  }

  function preventLinkWhileEditing(e) {
    if (isEditMode) {
      e.preventDefault();
    }
  }

  /* ------------------------------------------------------------
     Project Card Operations
     ------------------------------------------------------------ */
  function attachCardDeleteButtons() {
    document.querySelectorAll('.project-card').forEach(card => {
      if (!card.querySelector('.admin-card-delete-btn')) {
        const btn = document.createElement('button');
        btn.className = 'admin-card-delete-btn';
        btn.setAttribute('title', 'Delete this project card');
        btn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const title = card.querySelector('.project-title')?.textContent || 'this project';
          if (confirm(`Are you sure you want to delete "${title.trim()}"?`)) {
            card.style.transition = 'all 0.3s ease';
            card.style.transform = 'scale(0.8)';
            card.style.opacity = '0';
            setTimeout(() => card.remove(), 300);
            notify('Project removed.', 'success');
          }
        });
        card.style.position = 'relative';
        card.appendChild(btn);
      }
    });
  }

  /* ------------------------------------------------------------
     Skill Operations
     ------------------------------------------------------------ */
  function attachSkillControls() {
    // 1. Delete button on each skill chip and soft skill card
    document.querySelectorAll('.skill-chip, .soft-skill-card').forEach(chip => {
      if (!chip.querySelector('.admin-skill-delete-btn')) {
        const btn = document.createElement('button');
        btn.className = 'admin-skill-delete-btn';
        btn.setAttribute('title', 'Delete this skill');
        btn.innerHTML = '&times;';
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const nameEl = chip.querySelector('.skill-name') || chip.querySelector('span');
          const skillName = nameEl ? nameEl.textContent.trim() : 'this skill';
          if (confirm(`Delete skill "${skillName}"?`)) {
            chip.style.transition = 'all 0.2s ease';
            chip.style.transform = 'scale(0.8)';
            chip.style.opacity = '0';
            setTimeout(() => chip.remove(), 200);
            notify(`Skill "${skillName}" removed.`, 'success');
          }
        });
        chip.appendChild(btn);
      }
    });

    // 2. Add Skill button on each skills column
    document.querySelectorAll('.skills-col').forEach(col => {
      if (!col.querySelector('.admin-add-skill-btn')) {
        const addBtn = document.createElement('button');
        addBtn.className = 'admin-add-skill-btn';
        addBtn.innerHTML = '<i class="fas fa-plus"></i> Add Skill';
        addBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const skillName = prompt('Enter skill name (e.g. TypeScript, AWS, Next.js, Redux):');
          if (!skillName || !skillName.trim()) return;

          const trimmed = skillName.trim();
          const grid = col.querySelector('.skills-chips-grid') || col.querySelector('.soft-skills-grid');
          if (!grid) return;

          // Smart icon detection
          let iconClass = 'fas fa-check-circle';
          const lower = trimmed.toLowerCase();
          if (lower.includes('python')) iconClass = 'fab fa-python';
          else if (lower.includes('js') || lower.includes('javascript') || lower.includes('typescript') || lower.includes('ts')) iconClass = 'fab fa-js';
          else if (lower.includes('react')) iconClass = 'fab fa-react';
          else if (lower.includes('node')) iconClass = 'fab fa-node-js';
          else if (lower.includes('html')) iconClass = 'fab fa-html5';
          else if (lower.includes('css') || lower.includes('tailwind')) iconClass = 'fab fa-css3-alt';
          else if (lower.includes('git')) iconClass = 'fab fa-git-alt';
          else if (lower.includes('docker') || lower.includes('container')) iconClass = 'fab fa-docker';
          else if (lower.includes('aws') || lower.includes('azure') || lower.includes('gcp')) iconClass = 'fab fa-aws';
          else if (lower.includes('java') && !lower.includes('script')) iconClass = 'fab fa-java';
          else if (lower.includes('sql') || lower.includes('data') || lower.includes('mongo') || lower.includes('db')) iconClass = 'fas fa-database';
          else if (lower.includes('api') || lower.includes('cloud')) iconClass = 'fas fa-cloud';
          else if (lower.includes('fastapi') || lower.includes('express')) iconClass = 'fas fa-bolt';
          else if (lower.includes('chart') || lower.includes('bi') || lower.includes('analytics') || lower.includes('tableau')) iconClass = 'fas fa-chart-bar';

          const newChip = document.createElement('div');
          if (grid.classList.contains('soft-skills-grid')) {
            newChip.className = 'soft-skill-card';
            newChip.innerHTML = `<i class="${iconClass}" aria-hidden="true"></i><span class="skill-name" contenteditable="true" spellcheck="true">${trimmed}</span>`;
          } else {
            newChip.className = 'skill-chip';
            newChip.innerHTML = `<i class="${iconClass}" aria-hidden="true"></i><span class="skill-name" contenteditable="true" spellcheck="true">${trimmed}</span>`;
          }

          grid.appendChild(newChip);
          attachSkillControls();
          notify(`Skill "${trimmed}" added! Click "Save & Publish" when finished.`, 'success');
        });

        col.appendChild(addBtn);
      }
    });
  }

  function handleAddProject() {
    const title = document.getElementById('proj-name').value.trim();
    const status = document.getElementById('proj-status').value;
    const color = document.getElementById('proj-color').value;
    const icon = document.getElementById('proj-icon').value.trim() || 'fas fa-laptop-code';
    const desc = document.getElementById('proj-desc').value.trim();
    const stack = document.getElementById('proj-stack').value.trim();
    const link = document.getElementById('proj-link').value.trim() || 'https://github.com/Sidhukp64';

    if (!title || !desc) {
      notify('Please provide at least a project title and description.', 'error');
      return;
    }

    const tagsHtml = stack
      ? stack.split(',').map(s => `<span class="stack-tag">${s.trim()}</span>`).join('\n                  ')
      : '<span class="stack-tag">Code</span>';

    const statusClass = status.toLowerCase().includes('prod') ? 'production' : 'completed';

    const card = document.createElement('div');
    card.className = 'project-card reveal-up visible';
    card.setAttribute('data-tilt', '');
    card.innerHTML = `
      <div class="project-card-inner">
        <div class="project-icon-bg ${color}">
          <i class="${icon}" aria-hidden="true"></i>
        </div>
        <div class="project-meta">
          <span class="project-status ${statusClass}">${status}</span>
          <h3 class="project-title">${title}</h3>
          <p class="project-desc">${desc}</p>
          <div class="project-stack">
            ${tagsHtml}
          </div>
        </div>
        <div class="project-footer">
          <a href="${link}" target="_blank" rel="noopener noreferrer" class="btn btn-ghost btn-sm">
            <i class="fab fa-github" aria-hidden="true"></i> View on GitHub
          </a>
        </div>
      </div>
    `;

    const grid = document.querySelector('.projects-grid');
    if (grid) {
      grid.appendChild(card);
      attachCardDeleteButtons();

      // Make new elements editable
      card.querySelectorAll('.project-title, .project-desc, .project-status, .stack-tag').forEach(el => {
        el.setAttribute('contenteditable', 'true');
        el.setAttribute('spellcheck', 'true');
      });

      closeModal('admin-project-modal');
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      notify(`Project "${title}" added!`, 'success');
    }
  }

  /* ------------------------------------------------------------
     Clean HTML Serializer
     ------------------------------------------------------------ */
  function getCleanHtml() {
    // Clone document
    const clone = document.documentElement.cloneNode(true);

    // 1. Remove editor runtime classes & attributes
    clone.classList.remove('admin-edit-active');
    const bodyClone = clone.querySelector('body');
    if (bodyClone) {
      bodyClone.classList.remove('admin-edit-active');
    }

    // 2. Remove all contenteditable and spellcheck attributes
    clone.querySelectorAll('[contenteditable]').forEach(el => {
      el.removeAttribute('contenteditable');
      el.removeAttribute('spellcheck');
    });

    // 3. Remove admin delete and add buttons
    clone.querySelectorAll('.admin-card-delete-btn, .admin-skill-delete-btn, .admin-add-skill-btn').forEach(el => el.remove());

    // 4. Remove all dynamically injected admin UI elements completely from static HTML
    clone.querySelectorAll('#admin-bar, #admin-auth-modal, #admin-project-modal, #admin-settings-modal, #admin-trigger-btn').forEach(el => el.remove());

    // 6. Remove toast notifications from clone
    const toastClone = clone.querySelector('#toast-container');
    if (toastClone) {
      toastClone.innerHTML = '';
    }

    // Return clean complete doctype + html
    return '<!DOCTYPE html>\n' + clone.outerHTML;
  }

  /* ------------------------------------------------------------
     Direct GitHub Sync (Save & Publish)
     ------------------------------------------------------------ */
  async function publishToGitHub() {
    const token = localStorage.getItem(STORAGE_KEY_TOKEN);
    if (!token) {
      notify('No GitHub token found. Please set your token in settings.', 'error');
      openModal('admin-settings-modal');
      return;
    }

    const publishBtn  = document.getElementById('admin-btn-publish');
    const publishText = document.getElementById('admin-publish-text');
    const originalText = publishText.innerHTML;

    publishBtn.disabled = true;
    publishText.innerHTML = '<span class="admin-spinner"></span> Publishing...';

    try {
      notify('Connecting to GitHub API...', 'success', 2500);

      // Step 1: Fetch current file SHA
      const getUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}?ref=${BRANCH}&t=${Date.now()}`;
      const getRes = await fetch(getUrl, {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!getRes.ok) {
        if (getRes.status === 401 || getRes.status === 403) {
          throw new Error('GitHub token invalid or unauthorized. Please verify token permissions.');
        }
        throw new Error(`Failed to fetch repository metadata (HTTP ${getRes.status})`);
      }

      const fileData = await getRes.json();
      const sha = fileData.sha;

      // Step 2: Prepare clean HTML & UTF-8 Base64 encode
      const cleanHtml = getCleanHtml();
      const base64Content = btoa(unescape(encodeURIComponent(cleanHtml)));

      // Step 3: PUT update
      notify('Saving changes to main branch...', 'success', 2500);
      const putUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}`;
      const putRes = await fetch(putUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: 'chore: update portfolio content via visual editor',
          content: base64Content,
          sha: sha,
          branch: BRANCH
        })
      });

      if (!putRes.ok) {
        const errorData = await putRes.json().catch(() => ({}));
        throw new Error(errorData.message || `GitHub update failed with status ${putRes.status}`);
      }

      notify('🎉 Published to GitHub! Live site will update in ~1 minute.', 'success', 7000);

    } catch (err) {
      console.error('Publish error:', err);
      notify(`Publish failed: ${err.message}`, 'error', 7000);
      // Offer fallback
      if (confirm('Publishing to GitHub encountered an error. Would you like to download a local backup file instead?')) {
        downloadBackup();
      }
    } finally {
      publishBtn.disabled = false;
      publishText.innerHTML = originalText;
    }
  }

  /* ------------------------------------------------------------
     Download Local Backup
     ------------------------------------------------------------ */
  function downloadBackup() {
    const cleanHtml = getCleanHtml();
    const blob = new Blob([cleanHtml], { type: 'text/html;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'index.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    notify('Backup index.html downloaded!', 'success');
  }

  /* ------------------------------------------------------------
     Modal Helpers
     ------------------------------------------------------------ */
  function openModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('open');
  }

  function closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('open');
  }

  function notify(msg, type = 'success', duration = 4000) {
    if (window.showToast) {
      window.showToast(msg, type, duration);
    } else {
      console.log(`[${type}] ${msg}`);
    }
  }

  /* ------------------------------------------------------------
     Initialization & Event Listeners
     ------------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', () => {
    injectAdminUI();

    // Keyboard shortcut: Ctrl+Shift+E (or Cmd+Shift+E)
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'E' || e.key === 'e')) {
        e.preventDefault();
        handleAuthTrigger();
      }
    });

    // Close buttons for modals
    document.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', () => {
        closeModal(btn.getAttribute('data-close'));
      });
    });

    // Modal background click to close
    document.querySelectorAll('.admin-modal-overlay').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('open');
        }
      });
    });

    // Auth submit
    document.getElementById('admin-submit-auth')?.addEventListener('click', verifyAndUnlock);
    document.getElementById('admin-input-pin')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') verifyAndUnlock();
    });

    // Add project button & submit
    document.getElementById('admin-btn-add-project')?.addEventListener('click', () => {
      openModal('admin-project-modal');
    });
    document.getElementById('admin-submit-project')?.addEventListener('click', handleAddProject);

    // Save & Publish
    document.getElementById('admin-btn-publish')?.addEventListener('click', publishToGitHub);

    // Download Backup
    document.getElementById('admin-btn-download')?.addEventListener('click', downloadBackup);

    // Exit
    document.getElementById('admin-btn-exit')?.addEventListener('click', exitEditMode);

    // Settings
    document.getElementById('admin-btn-settings')?.addEventListener('click', () => {
      document.getElementById('settings-token').value = localStorage.getItem(STORAGE_KEY_TOKEN) || '';
      document.getElementById('settings-pin').value = localStorage.getItem(STORAGE_KEY_PIN) || '';
      openModal('admin-settings-modal');
    });

    document.getElementById('admin-submit-settings')?.addEventListener('click', () => {
      const newToken = document.getElementById('settings-token').value.trim();
      const newPin   = document.getElementById('settings-pin').value.trim();

      if (newToken) localStorage.setItem(STORAGE_KEY_TOKEN, newToken);
      if (newPin) localStorage.setItem(STORAGE_KEY_PIN, newPin);

      closeModal('admin-settings-modal');
      notify('Settings updated successfully.', 'success');
    });

    document.getElementById('admin-btn-logout')?.addEventListener('click', () => {
      if (confirm('Clear saved credentials from this browser? You will need to re-enter your token next time.')) {
        localStorage.removeItem(STORAGE_KEY_TOKEN);
        localStorage.removeItem(STORAGE_KEY_PIN);
        closeModal('admin-settings-modal');
        exitEditMode();
        notify('Logged out and credentials cleared.', 'success');
      }
    });
  });

})();
