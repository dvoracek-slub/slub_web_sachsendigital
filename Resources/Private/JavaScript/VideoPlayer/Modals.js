// @ts-check

import SimpleModal from './SimpleModal';

/**
 * @typedef Modals
 * @property {() => boolean} hasOpen
 * @property {() => void} closeNext
 * @property {() => void} closeAll
 * @property {() => Promise<void>} update
 */

/**
 * Mixin to add modal-related utility functions to set of modals.
 *
 * @template {Record<string, SimpleModal<any>>} T
 * @param {T} modals
 * @returns {T & Modals}
 */
export default function Modals(modals) {
  const modalsArray = Object.values(modals);

  /** @type {T & Modals} */
  const result = {
    ...modals,
    hasOpen: () => {
      return modalsArray.some(modal => modal.isOpen);
    },
    closeNext: () => {
      for (const modal of modalsArray) {
        // TODO: Close topmost? Close most recently opened?
        if (modal.isOpen) {
          modal.close();
          break;
        }
      }
    },
    closeAll: () => {
      for (const modal of modalsArray) {
        modal.close();
      }
    },
    update: async () => {
      await Promise.all(
        modalsArray.map(modal => modal.update())
      );
    },
  };

  // Set DOM element that is used to cover the background of the modals. It is
  // used to make sure that when a modal is open, the background won't respond
  // to mouse actions. It also makes it simpler to detect clicking outside of
  // an open modal.
  const modalCover = document.createElement('div');
  modalCover.className = "sxnd-modal-cover";
  modalCover.addEventListener('click', () => {
    result.closeAll();
  });
  document.body.append(modalCover);

  // TODO: Performance
  window.addEventListener('resize', () => {
    for (const modal of modalsArray) {
      modal.resize();
    }
  });

  for (const modal of modalsArray) {
    modal.on('updated', () => {
      if (result.hasOpen()) {
        modalCover.classList.add('shown');
      } else {
        modalCover.classList.remove('shown');
      }
    });
  }

  return result;
}
