// Menus are generated at authoring time; JS only adds closing and focus behavior.
export function enhancePrimaryNavigation(container) {
  if (!container) return;
  const groupsUI = [...container.querySelectorAll('details')];
  function closeMenus(except) {
    groupsUI.forEach(group => { if (group !== except) group.open = false; });
  }
  groupsUI.forEach(group => group.addEventListener('toggle', () => {
    if (group.open) closeMenus(group);
  }));
  document.addEventListener('click', event => {
    if (!container.contains(event.target) || event.target.closest('a')) closeMenus();
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const activeGroup = groupsUI.find(group => group.open && group.contains(document.activeElement));
    closeMenus();
    activeGroup?.querySelector('summary').focus();
  });
}
