/* ============================================================
   Mochilão Europa — Autenticação e Perfis
   Senha do admin: admin123
   ============================================================ */

const ADMIN_USER = 'admin';
const ADMIN_PASS_HASH = btoa('admin123'); // hash simples base64

/* ── Chaves de armazenamento ── */
const USERS_KEY = 'rota_users';

/* ── Retorna o usuário atual da sessão ── */
function getCurrentUser() {
  return sessionStorage.getItem('rota_current_user') || null;
}

/* ── Verifica se o usuário atual é admin ── */
function isAdmin() {
  return getCurrentUser() === ADMIN_USER;
}

/* ── Prefixo de chave de storage por perfil ── */
function storageKey(key) {
  const user = getCurrentUser() || 'guest';
  return `${user}_${key}`;
}

/* ── Obtém todos os usuários cadastrados ── */
function getAllUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
  } catch (e) { return {}; }
}

/* ── Salva todos os usuários ── */
function saveAllUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/* ── Cadastra um novo usuário ── */
function registerUser(username, password) {
  username = username.trim().toLowerCase();
  if (!username || !password) return { ok: false, msg: 'Preencha todos os campos.' };
  if (username.length < 3) return { ok: false, msg: 'Nome de usuário deve ter ao menos 3 letras.' };
  if (password.length < 4) return { ok: false, msg: 'Senha deve ter ao menos 4 caracteres.' };
  if (username === ADMIN_USER) return { ok: false, msg: 'Este nome de usuário é reservado.' };

  const users = getAllUsers();
  if (users[username]) return { ok: false, msg: 'Este nome de usuário já está em uso.' };

  users[username] = { hash: btoa(password), createdAt: new Date().toISOString() };
  saveAllUsers(users);
  return { ok: true };
}

/* ── Faz login ── */
function login(username, password) {
  username = username.trim().toLowerCase();
  if (!username || !password) return { ok: false, msg: 'Preencha todos os campos.' };

  // Login do admin
  if (username === ADMIN_USER) {
    if (btoa(password) === ADMIN_PASS_HASH) {
      sessionStorage.setItem('rota_current_user', ADMIN_USER);
      return { ok: true };
    }
    return { ok: false, msg: 'Senha incorreta.' };
  }

  const users = getAllUsers();
  if (!users[username]) return { ok: false, msg: 'Usuário não encontrado.' };
  if (btoa(password) !== users[username].hash) return { ok: false, msg: 'Senha incorreta.' };

  sessionStorage.setItem('rota_current_user', username);
  return { ok: true };
}

/* ── Faz logout ── */
function logout() {
  sessionStorage.removeItem('rota_current_user');
  showLoginScreen();
}

/* ── Remove um usuário (somente admin) ── */
function removeUser(username) {
  if (!isAdmin()) return;
  const users = getAllUsers();
  delete users[username];
  saveAllUsers(users);
}

/* ════════════════════════════════════════
   UI — TELA DE LOGIN
   ════════════════════════════════════════ */
function showLoginScreen() {
  document.getElementById('app-root').style.display = 'none';
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('login-error').textContent = '';
  document.getElementById('login-username').value = '';
  document.getElementById('login-password').value = '';
  document.getElementById('register-form').classList.remove('open');
}

function hideLoginScreen() {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('app-root').style.display = '';
  updateUserUI();
}

function updateUserUI() {
  const user = getCurrentUser();
  const badge = document.getElementById('user-badge');
  if (!badge) return;
  if (isAdmin()) {
    badge.innerHTML = `⚙️ <strong>ADM</strong> · ${ADMIN_USER} <button class="logout-btn" onclick="logout()" title="Sair">↩ Sair</button>`;
  } else {
    badge.innerHTML = `👤 ${user} <button class="logout-btn" onclick="logout()" title="Sair">↩ Sair</button>`;
  }

  // Painel ADM
  const adminPanel = document.getElementById('admin-panel');
  if (adminPanel) adminPanel.style.display = isAdmin() ? 'block' : 'none';
}

function handleLogin() {
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;
  const result = login(username, password);
  if (result.ok) {
    hideLoginScreen();
    // Re-inicializa o app com os dados do novo perfil
    if (typeof loadState === 'function') loadState();
    if (typeof renderRoteiro === 'function') renderRoteiro();
  } else {
    document.getElementById('login-error').textContent = result.msg;
  }
}

function handleRegister() {
  const username = document.getElementById('reg-username').value;
  const password = document.getElementById('reg-password').value;
  const result = registerUser(username, password);
  if (result.ok) {
    document.getElementById('register-error').textContent = '';
    // Faz login automático após cadastro
    login(username, password);
    hideLoginScreen();
    if (typeof loadState === 'function') loadState();
    if (typeof renderRoteiro === 'function') renderRoteiro();
  } else {
    document.getElementById('register-error').textContent = result.msg;
  }
}

function toggleRegisterForm() {
  document.getElementById('register-form').classList.toggle('open');
  document.getElementById('login-error').textContent = '';
}

function renderAdminPanel() {
  if (!isAdmin()) return;
  const panel = document.getElementById('admin-users-list');
  if (!panel) return;
  const users = getAllUsers();
  const keys = Object.keys(users);
  if (!keys.length) {
    panel.innerHTML = '<p style="color:var(--muted);font-size:13px">Nenhum usuário cadastrado além do admin.</p>';
    return;
  }
  panel.innerHTML = keys.map(u => `
    <div class="admin-user-row">
      <span>👤 ${u}</span>
      <span style="font-size:11px;color:var(--muted)">${users[u].createdAt?.slice(0,10) || ''}</span>
      <button class="admin-del-btn" onclick="adminRemoveUser('${u}')">✕ Remover</button>
    </div>`).join('');
}

function adminRemoveUser(username) {
  if (confirm(`Remover o usuário "${username}"? Esta ação não pode ser desfeita.`)) {
    removeUser(username);
    renderAdminPanel();
    if (typeof showToast === 'function') showToast(`Usuário ${username} removido.`);
  }
}

/* ── Inicializa autenticação ── */
function initAuth() {
  const user = getCurrentUser();
  if (!user) {
    showLoginScreen();
  } else {
    hideLoginScreen();
  }

  // Enter para login
  ['login-username', 'login-password'].forEach(id => {
    document.getElementById(id)?.addEventListener('keydown', e => {
      if (e.key === 'Enter') handleLogin();
    });
  });
  ['reg-username', 'reg-password'].forEach(id => {
    document.getElementById(id)?.addEventListener('keydown', e => {
      if (e.key === 'Enter') handleRegister();
    });
  });
}
