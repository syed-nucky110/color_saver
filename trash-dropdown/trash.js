trashColorContainer.addEventListener("click", (event) => {
    const dropdown = document.querySelector('.trash-dropdown-menu');
    const isDropdownBtn = event.target.closest('#trash-options-btn');
    const isDropdownMenu = event.target.closest('.trash-dropdown-menu');

    // Toggling dropdown
    if (isDropdownBtn) {
        dropdown.classList.toggle('show');
    }
    // Close dropdown if clicking outside
    else if (!isDropdownMenu) {
        if (dropdown && dropdown.classList.contains('show')) {
            dropdown.classList.remove('show');
        }
    }

    // Close Trash Box (Existing logic)
    if (event.target == closeTrashBoxBtn || (event.target == trashColorContainer && event.target != trashColorBox)) {
        closeTrashColorBox();
    }
})






// Trash Options Dropdown Logic
const trashDropdownMenu = document.querySelector('.trash-dropdown-menu');
const emptyTrashBtn = document.getElementById('empty-trash-btn');
const restoreAllTrashBtn = document.getElementById('restore-all-trash-btn');

if (emptyTrashBtn) {
    emptyTrashBtn.addEventListener('click', () => {
        const trashColors = JSON.parse(localStorage.getItem("trashColors")) || [];
        if (trashColors.length === 0) {
            throwMessage("Trash is already empty", "#ff6b35");
            trashDropdownMenu.classList.remove('show');
            return;
        }

        localStorage.setItem("trashColors", JSON.stringify([]));
        renderTrashColors();
        isTrashFull();
        throwMessage("Trash emptied successfully", "#00ff00", "trash-outline");
        trashDropdownMenu.classList.remove('show');
    });
}

if (restoreAllTrashBtn) {
    restoreAllTrashBtn.addEventListener('click', () => {
        const trashColors = JSON.parse(localStorage.getItem("trashColors")) || [];
        if (trashColors.length === 0) {
            throwMessage("No colors to restore", "#ff6b35");
            trashDropdownMenu.classList.remove('show');
            return;
        }

        let savedColors = JSON.parse(localStorage.getItem("saveColor")) || [];

        // Filter out colors that are already in savedColors to avoid duplicates
        const newColors = trashColors.filter(color => !savedColors.includes(color));

        // Add non-duplicate colors to savedColors
        savedColors = [...savedColors, ...newColors];

        localStorage.setItem("saveColor", JSON.stringify(savedColors));
        localStorage.setItem("trashColors", JSON.stringify([]));

        renderTrashColors();
        renderColors(); // Update the main list
        isTrashFull();

        const restoredCount = newColors.length;
        const duplicateCount = trashColors.length - restoredCount;

        if (duplicateCount > 0) {
            throwMessage(`Restored ${restoredCount} colors (${duplicateCount} were duplicates)`, "#00ff00", "refresh-outline");
        } else {
            throwMessage("All colors restored successfully", "#00ff00", "refresh-outline");
        }

        trashDropdownMenu.classList.remove('show');
    });
}






function updateTrashButtonsState(count) {
    const emptyTrashBtn = document.getElementById('empty-trash-btn');
    const restoreAllTrashBtn = document.getElementById('restore-all-trash-btn');

    if (emptyTrashBtn) {
        emptyTrashBtn.disabled = count === 0;
    }
    if (restoreAllTrashBtn) {
        restoreAllTrashBtn.disabled = count === 0;
    }
}