// Drag & drop simples com ordenação dentro da coluna
document.addEventListener('DOMContentLoaded', () => {
  const draggables = () => document.querySelectorAll('.draggable');
  const dropzones = document.querySelectorAll('.dropzone');

  // adicionar listeners a itens (delegação ou inicial)
  function attachDragHandlers(item) {
    item.addEventListener('dragstart', () => {
      item.classList.add('dragging');
      // remove placeholders quando começamos a arrastar
      document.querySelectorAll('.dropzone').forEach(z => z.classList.remove('empty'));
    });

    item.addEventListener('dragend', () => {
      item.classList.remove('dragging');
      // se uma dropzone ficou vazia, mostra placeholder
      document.querySelectorAll('.dropzone').forEach(updateEmptyState);
    });
  }

  function updateEmptyState(zone) {
    const hasDraggable = zone.querySelector('.draggable');
    if (!hasDraggable) {
      zone.classList.add('empty');
      if (!zone.querySelector('.placeholder')) {
        const p = document.createElement('li');
        p.className = 'placeholder';
        p.textContent = zone.id === 'learn' ? 'Arraste aqui para adicionar' : 'Arraste aqui para planejar projetos';
        zone.appendChild(p);
      }
    } else {
      zone.classList.remove('empty');
      const ph = zone.querySelector('.placeholder');
      if (ph) ph.remove();
    }
  }

  // atualizar initial state
  draggables().forEach(attachDragHandlers);
  dropzones.forEach(updateEmptyState);

  dropzones.forEach(zone => {
    zone.addEventListener('dragover', e => {
      e.preventDefault();
      zone.classList.add('drag-over');

      const afterElement = getDragAfterElement(zone, e.clientY);
      const dragging = document.querySelector('.dragging');
      if (!dragging) return;

      if (afterElement == null) {
        zone.appendChild(dragging);
      } else {
        zone.insertBefore(dragging, afterElement);
      }
    });

    zone.addEventListener('dragleave', () => {
      zone.classList.remove('drag-over');
    });

    zone.addEventListener('drop', e => {
      e.preventDefault();
      zone.classList.remove('drag-over');
      // atualizar estado de placeholder se necessário
      updateEmptyState(zone);
      // re-attach handlers to any new draggables (caso tenham vindo de outro container)
      draggables().forEach(attachDragHandlers);
    });
  });

  // função utilitária para descobrir onde inserir o elemento arrastado dentro de uma coluna
  function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element || null;
  }
});
