/* ==========================================================================
   ESTADO GLOBAL E INICIALIZAÇÃO
   ========================================================================== */
// Carrega as anotações do localStorage ou cria uma inicial se não houver nenhuma
let notes = JSON.parse(localStorage.getItem('alphacode_notes')) || [];

if (notes.length === 0) {
  notes = [
    {
      id: "1",
      title: "Bem-vindo ao AlphaCode",
      content: "Esta é uma anotação de teste.\nVocê pode fixar as mais importantes no topo ou excluir quando não precisar mais.",
      pinned: true,
      createdAt: new Date().toLocaleDateString('pt-BR')
    }
  ];
  localStorage.setItem('alphacode_notes', JSON.stringify(notes));
}

document.addEventListener('DOMContentLoaded', () => {
  initAuth();
  initNavigation();
  initNotesModule();
  renderNotes();
});

/* ==========================================================================
   1. AUTENTICAÇÃO E TELA DE LOGIN
   ========================================================================== */
function initAuth() {
  const loginForm = document.getElementById('loginForm');
  const authScreen = document.getElementById('authScreen');
  const appLayout = document.getElementById('appLayout');
  const btnLogout = document.getElementById('btnLogout');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      authScreen.classList.add('hidden');
      appLayout.classList.remove('hidden');
    });
  }

  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      appLayout.classList.add('hidden');
      authScreen.classList.remove('hidden');
    });
  }
}

/* ==========================================================================
   2. NAVEGAÇÃO ENTRE TELAS (SIDEBAR)
   ========================================================================== */
function initNavigation() {
  const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
  const viewSections = document.querySelectorAll('.view-section');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();

      // Remove classe ativa de todos e adiciona no selecionado
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');

      const targetViewId = item.getAttribute('data-view');

      // Esconde todas as seções e mostra apenas a selecionada
      viewSections.forEach(section => {
        if (section.id === targetViewId) {
          section.classList.remove('hidden');
        } else {
          section.classList.add('hidden');
        }
      });
    });
  });
}

/* ==========================================================================
   3. MÓDULO DE ANOTAÇÕES (RENDER, CRIAR, FIXAR, EXCLUIR)
   ========================================================================== */
function renderNotes() {
  const container = document.getElementById('notesGrid');
  const statNotesCount = document.getElementById('statNotesCount');

  // Atualiza contador no Dashboard
  if (statNotesCount) {
    statNotesCount.innerText = notes.length;
  }

  if (!container) return;

  // Ordena: Anotações fixadas (pinned: true) ficam no topo
  const sortedNotes = [...notes].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  if (sortedNotes.length === 0) {
    container.innerHTML = `<p style="color: var(--text-muted); grid-column: 1/-1;">Nenhuma anotação cadastrada.</p>`;
    return;
  }

  container.innerHTML = sortedNotes.map(note => `
    <div class="note-card ${note.pinned ? 'pinned' : ''}">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
        <h3 style="margin: 0; word-break: break-word;">${escapeHtml(note.title)}</h3>
        <div style="display: flex; gap: 4px; flex-shrink: 0;">
          <!-- Botão Fixar / Desfixar -->
          <button 
            class="btn-icon" 
            onclick="togglePinNote('${note.id}')" 
            title="${note.pinned ? 'Desfixar anotação' : 'Fixar anotação no topo'}"
            style="color: ${note.pinned ? 'var(--primary)' : 'var(--text-muted)'}; cursor: pointer;"
          >
            📌
          </button>
          
          <!-- Botão Excluir -->
          <button 
            class="btn-icon" 
            onclick="deleteNote('${note.id}')" 
            title="Excluir anotação"
            style="color: var(--danger); cursor: pointer;"
          >
            🗑️
          </button>
        </div>
      </div>
      
      <p style="color: var(--text-secondary); font-size: 0.9rem; white-space: pre-line; margin-top: 8px; word-break: break-word;">${escapeHtml(note.content)}</p>
      
      <small style="display: block; margin-top: 12px; color: var(--text-muted); font-size: 0.75rem;">
        ${note.createdAt || ''}
      </small>
    </div>
  `).join('');
}

// Alternar estado de fixado (Pin / Unpin)
function togglePinNote(id) {
  notes = notes.map(note => {
    if (note.id === id) {
      return { ...note, pinned: !note.pinned };
    }
    return note;
  });
  saveAndReloadNotes();
}

// Excluir anotação por ID
function deleteNote(id) {
  if (confirm("Tem certeza que deseja excluir esta anotação?")) {
    notes = notes.filter(note => note.id !== id);
    saveAndReloadNotes();
  }
}

// Criar nova anotação
function createNote(title, content) {
  const newNote = {
    id: Date.now().toString(),
    title: title,
    content: content,
    pinned: false,
    createdAt: new Date().toLocaleDateString('pt-BR')
  };

  notes.unshift(newNote);
  saveAndReloadNotes();
}

// Salvar no LocalStorage e atualizar tela
function saveAndReloadNotes() {
  localStorage.setItem('alphacode_notes', JSON.stringify(notes));
  renderNotes();
}

/* ==========================================================================
   4. MODAL E FORMULÁRIO DE ANOTAÇÕES
   ========================================================================== */
function initNotesModule() {
  const btnOpenModal = document.getElementById('btnOpenNoteModal');
  const btnCloseModal = document.getElementById('btnCloseNoteModal');
  const btnCancel = document.getElementById('btnCancelNote');
  const noteModal = document.getElementById('noteModal');
  const noteForm = document.getElementById('noteForm');
  const titleInput = document.getElementById('noteTitleInput');
  const contentInput = document.getElementById('noteContentInput');

  function openModal() {
    noteModal.classList.remove('hidden');
    titleInput.focus();
  }

  function closeModal() {
    noteModal.classList.add('hidden');
    noteForm.reset();
  }

  if (btnOpenModal) btnOpenModal.addEventListener('click', openModal);
  if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
  if (btnCancel) btnCancel.addEventListener('click', closeModal);

  // Fecha clicando fora do modal
  if (noteModal) {
    noteModal.addEventListener('click', (e) => {
      if (e.target === noteModal) closeModal();
    });
  }

  // Envio do formulário
  if (noteForm) {
    noteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = titleInput.value.trim();
      const content = contentInput.value.trim();

      if (title && content) {
        createNote(title, content);
        closeModal();
      }
    });
  }
}

/* ==========================================================================
   5. UTILITÁRIOS (SEGURANÇA HTML)
   ========================================================================== */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.innerText = text;
  return div.innerHTML;
}