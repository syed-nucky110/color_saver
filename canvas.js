document.addEventListener('DOMContentLoaded', function() {
    // Canvas elements
    const designCanvas = document.getElementById('design-canvas');
    const canvasPlaceholder = document.querySelector('.canvas-placeholder');
    const selectToolBtn = document.getElementById('select-tool');
    const addTextBtn = document.getElementById('add-text-btn');
    const addRectangleBtn = document.getElementById('add-rectangle-btn');
    const addCircleBtn = document.getElementById('add-circle-btn');
    const addImageBtn = document.getElementById('add-image-btn');
    const addLineBtn = document.getElementById('add-line-btn');
    const deleteElementBtn = document.getElementById('delete-element-btn');
    const duplicateElementBtn = document.getElementById('duplicate-element-btn');
    const zoomInBtn = document.getElementById('zoom-in-btn');
    const zoomOutBtn = document.getElementById('zoom-out-btn');
    const resetViewBtn = document.getElementById('reset-view-btn');
    const zoomLevel = document.getElementById('zoom-level');
    const undoBtn = document.getElementById('undo-btn');
    const redoBtn = document.getElementById('redo-btn');
    const togglePropertiesPanel = document.getElementById('toggle-properties-panel');
    const toggleLayersPanel = document.getElementById('toggle-layers-panel');
    
    // Property panel elements
    const propertiesPanel = document.querySelector('.canvas-properties-panel');
    const layersPanel = document.querySelector('.canvas-layers-panel');
    const elementX = document.getElementById('element-x');
    const elementY = document.getElementById('element-y');
    const elementWidth = document.getElementById('element-width');
    const elementHeight = document.getElementById('element-height');
    const elementBgColor = document.getElementById('element-bg-color');
    const elementBgColorText = document.getElementById('element-bg-color-text');
    const elementText = document.getElementById('element-text');
    const elementFontSize = document.getElementById('element-font-size');
    const elementBorderWidth = document.getElementById('element-border-width');
    const elementBorderColor = document.getElementById('element-border-color');
    const elementOpacity = document.getElementById('element-opacity');
    const opacityValue = document.getElementById('opacity-value');
    const layerList = document.getElementById('layer-list');
    
    // State variables
    let selectedElement = null;
    let isDragging = false;
    let isDrawing = false;
    let isResizing = false;
    let dragOffset = { x: 0, y: 0 };
    let elementCounter = 0;
    let currentTool = 'select';
    let zoom = 100;
    let history = [];
    let historyIndex = -1;
    let elements = [];
    let startX, startY, startWidth, startHeight;
    
    // Hide placeholder when elements are added
    function hidePlaceholder() {
        if (canvasPlaceholder) {
            canvasPlaceholder.style.display = 'none';
        }
    }
    
    // Show placeholder when canvas is empty
    function showPlaceholder() {
        if (elements.length === 0 && canvasPlaceholder) {
            canvasPlaceholder.style.display = 'block';
        }
    }
    
    // Update canvas mode class
    function updateCanvasMode() {
        designCanvas.className = 'design-canvas';
        designCanvas.classList.add(`${currentTool}-mode`);
    }
    
    // Create a new canvas element
    function createCanvasElement(type, x = 100, y = 100, width, height) {
        hidePlaceholder();
        
        elementCounter++;
        const element = document.createElement('div');
        element.className = `canvas-element ${type}-element`;
        element.id = `element-${elementCounter}`;
        element.dataset.id = elementCounter;
        element.dataset.type = type;
        
        // Set position
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
        
        // Set default dimensions based on element type
        switch(type) {
            case 'text':
                element.style.width = width ? `${width}px` : '150px';
                element.style.height = height ? `${height}px` : '40px';
                element.textContent = 'Text Element';
                element.style.display = 'flex';
                element.style.alignItems = 'center';
                element.style.justifyContent = 'center';
                element.style.padding = '5px';
                element.style.fontSize = '16px';
                element.style.backgroundColor = 'transparent';
                break;
            case 'rectangle':
                element.style.width = width ? `${width}px` : '150px';
                element.style.height = height ? `${height}px` : '100px';
                element.style.backgroundColor = '#3498db';
                break;
            case 'circle':
                element.style.width = width ? `${width}px` : '100px';
                element.style.height = height ? `${height}px` : '100px';
                element.style.backgroundColor = '#3498db';
                element.style.borderRadius = '50%';
                break;
            case 'image':
                element.style.width = width ? `${width}px` : '150px';
                element.style.height = height ? `${height}px` : '150px';
                element.style.backgroundColor = '#e0e0e0';
                element.style.backgroundImage = 'url("assets/android-icon-144x144.png")';
                element.style.backgroundSize = 'cover';
                element.style.backgroundPosition = 'center';
                element.style.backgroundRepeat = 'no-repeat';
                break;
            case 'line':
                element.style.width = width ? `${width}px` : '100px';
                element.style.height = height ? `${height}px` : '2px';
                element.style.backgroundColor = '#000000';
                break;
        }
        
        // Add event listeners for dragging
        element.addEventListener('mousedown', startDrag);
        element.addEventListener('click', selectElement);
        
        designCanvas.appendChild(element);
        
        // Add to elements array
        const elementData = {
            id: elementCounter,
            type: type,
            element: element,
            x: x,
            y: y,
            width: parseInt(element.style.width),
            height: parseInt(element.style.height),
            backgroundColor: element.style.backgroundColor || '#3498db',
            text: element.textContent || '',
            fontSize: element.style.fontSize || '16px',
            borderWidth: 0,
            borderColor: '#000000',
            opacity: 100
        };
        
        elements.push(elementData);
        
        // Update layers panel
        updateLayersPanel();
        
        // Save to history
        saveToHistory();
        
        return element;
    }
    
    // Start dragging an element
    function startDrag(e) {
        if (e.button !== 0) return; // Only left mouse button
        if (currentTool !== 'select') return;
        
        isDragging = true;
        selectedElement = this;
        selectElement.call(this);
        
        const rect = selectedElement.getBoundingClientRect();
        const canvasRect = designCanvas.getBoundingClientRect();
        dragOffset.x = e.clientX - rect.left;
        dragOffset.y = e.clientY - rect.top;
        
        // Bring element to front
        selectedElement.style.zIndex = '1000';
        
        e.preventDefault();
        e.stopPropagation();
    }
    
    // Start drawing a new element
    function startDrawing(e) {
        if (currentTool === 'select') return;
        
        isDrawing = true;
        const canvasRect = designCanvas.getBoundingClientRect();
        const startX = e.clientX - canvasRect.left;
        const startY = e.clientY - canvasRect.top;
        
        // Create element based on current tool
        let element;
        switch(currentTool) {
            case 'text':
                element = createCanvasElement('text', startX, startY);
                selectElement.call(element);
                break;
            case 'rectangle':
                element = createCanvasElement('rectangle', startX, startY, 1, 1);
                break;
            case 'circle':
                element = createCanvasElement('circle', startX, startY, 1, 1);
                break;
            case 'image':
                element = createCanvasElement('image', startX, startY);
                break;
            case 'line':
                element = createCanvasElement('line', startX, startY, 1, 1);
                break;
        }
        
        if (element && currentTool !== 'text' && currentTool !== 'image') {
            selectedElement = element;
            selectElement.call(element);
        }
        
        e.preventDefault();
        e.stopPropagation();
    }
    
    // Handle drawing
    function drawElement(e) {
        if (!isDrawing || !selectedElement || currentTool === 'select' || currentTool === 'text' || currentTool === 'image') return;
        
        const canvasRect = designCanvas.getBoundingClientRect();
        const currentX = e.clientX - canvasRect.left;
        const currentY = e.clientY - canvasRect.top;
        
        const elementRect = selectedElement.getBoundingClientRect();
        const elementLeft = elementRect.left - canvasRect.left;
        const elementTop = elementRect.top - canvasRect.top;
        
        const width = Math.abs(currentX - elementLeft);
        const height = Math.abs(currentY - elementTop);
        
        selectedElement.style.width = `${width}px`;
        selectedElement.style.height = `${height}px`;
        
        // Update element data
        const elementData = elements.find(el => el.id == selectedElement.dataset.id);
        if (elementData) {
            elementData.width = width;
            elementData.height = height;
        }
    }
    
    // Handle dragging
    function dragElement(e) {
        if (!isDragging || !selectedElement) return;
        
        const canvasRect = designCanvas.getBoundingClientRect();
        const x = e.clientX - canvasRect.left - dragOffset.x;
        const y = e.clientY - canvasRect.top - dragOffset.y;
        
        // Keep element within canvas bounds
        const maxX = canvasRect.width - selectedElement.offsetWidth;
        const maxY = canvasRect.height - selectedElement.offsetHeight;
        
        selectedElement.style.left = `${Math.max(0, Math.min(x, maxX))}px`;
        selectedElement.style.top = `${Math.max(0, Math.min(y, maxY))}px`;
        
        // Update element data
        const elementData = elements.find(el => el.id == selectedElement.dataset.id);
        if (elementData) {
            elementData.x = parseInt(selectedElement.style.left);
            elementData.y = parseInt(selectedElement.style.top);
            updatePropertyInputs();
        }
    }
    
    // Stop dragging or drawing
    function stopAction() {
        isDragging = false;
        isDrawing = false;
        isResizing = false;
        if (selectedElement) {
            selectedElement.style.zIndex = '';
            saveToHistory();
        }
    }
    
    // Select an element
    function selectElement(e) {
        // Remove selection from all elements
        document.querySelectorAll('.canvas-element').forEach(el => {
            el.classList.remove('selected');
        });
        
        // Select clicked element
        selectedElement = this;
        selectedElement.classList.add('selected');
        
        // Show properties panel
        propertiesPanel.classList.remove('collapsed');
        
        // Update property inputs
        updatePropertyInputs();
        
        // Update layers panel
        updateLayersPanel();
        
        // Prevent event bubbling
        if (e) {
            e.stopPropagation();
        }
    }
    
    // Update property inputs with selected element values
    function updatePropertyInputs() {
        if (!selectedElement) return;
        
        elementX.value = parseInt(selectedElement.style.left) || 0;
        elementY.value = parseInt(selectedElement.style.top) || 0;
        elementWidth.value = parseInt(selectedElement.style.width) || 0;
        elementHeight.value = parseInt(selectedElement.style.height) || 0;
        elementBgColor.value = rgbToHex(selectedElement.style.backgroundColor) || '#3498db';
        elementBgColorText.value = rgbToHex(selectedElement.style.backgroundColor) || '#3498db';
        elementOpacity.value = selectedElement.style.opacity ? parseInt(parseFloat(selectedElement.style.opacity) * 100) : 100;
        opacityValue.textContent = `${elementOpacity.value}%`;
        
        if (selectedElement.classList.contains('text-element')) {
            elementText.value = selectedElement.textContent || '';
            elementFontSize.value = parseInt(selectedElement.style.fontSize) || 16;
            document.querySelector('.text-properties').classList.add('active');
        } else {
            document.querySelector('.text-properties').classList.remove('active');
        }
        
        // Update element data
        const elementData = elements.find(el => el.id == selectedElement.dataset.id);
        if (elementData) {
            elementData.x = parseInt(selectedElement.style.left) || 0;
            elementData.y = parseInt(selectedElement.style.top) || 0;
            elementData.width = parseInt(selectedElement.style.width) || 0;
            elementData.height = parseInt(selectedElement.style.height) || 0;
            elementData.backgroundColor = rgbToHex(selectedElement.style.backgroundColor) || '#3498db';
            elementData.text = selectedElement.textContent || '';
            elementData.fontSize = parseInt(selectedElement.style.fontSize) || 16;
            elementData.opacity = parseInt(elementOpacity.value);
        }
    }
    
    // Update selected element properties
    function updateElementProperties() {
        if (!selectedElement) return;
        
        selectedElement.style.left = `${elementX.value}px`;
        selectedElement.style.top = `${elementY.value}px`;
        selectedElement.style.width = `${elementWidth.value}px`;
        selectedElement.style.height = `${elementHeight.value}px`;
        selectedElement.style.backgroundColor = elementBgColor.value;
        selectedElement.style.opacity = parseInt(elementOpacity.value) / 100;
        
        if (selectedElement.classList.contains('text-element')) {
            selectedElement.textContent = elementText.value;
            selectedElement.style.fontSize = `${elementFontSize.value}px`;
        }
        
        // Update element data
        const elementData = elements.find(el => el.id == selectedElement.dataset.id);
        if (elementData) {
            elementData.x = parseInt(elementX.value);
            elementData.y = parseInt(elementY.value);
            elementData.width = parseInt(elementWidth.value);
            elementData.height = parseInt(elementHeight.value);
            elementData.backgroundColor = elementBgColor.value;
            elementData.text = elementText.value;
            elementData.fontSize = parseInt(elementFontSize.value);
            elementData.opacity = parseInt(elementOpacity.value);
        }
    }
    
    // Convert RGB to Hex
    function rgbToHex(rgb) {
        if (!rgb) return '#3498db';
        
        // Handle transparent
        if (rgb === 'transparent') return '#000000';
        
        // Handle rgba format
        if (rgb.includes('rgba')) {
            const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
            if (!match) return '#3498db';
            
            const r = parseInt(match[1]).toString(16).padStart(2, '0');
            const g = parseInt(match[2]).toString(16).padStart(2, '0');
            const b = parseInt(match[3]).toString(16).padStart(2, '0');
            
            return `#${r}${g}${b}`;
        }
        
        // Handle rgb format
        const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        if (!match) return '#3498db';
        
        const r = parseInt(match[1]).toString(16).padStart(2, '0');
        const g = parseInt(match[2]).toString(16).padStart(2, '0');
        const b = parseInt(match[3]).toString(16).padStart(2, '0');
        
        return `#${r}${g}${b}`;
    }
    
    // Delete selected element
    function deleteSelectedElement() {
        if (!selectedElement) return;
        
        // Remove from DOM
        selectedElement.remove();
        
        // Remove from elements array
        elements = elements.filter(el => el.id != selectedElement.dataset.id);
        
        // Clear selection
        selectedElement = null;
        propertiesPanel.classList.add('collapsed');
        
        // Update layers panel
        updateLayersPanel();
        
        // Show placeholder if no elements left
        showPlaceholder();
        
        // Save to history
        saveToHistory();
    }
    
    // Duplicate selected element
    function duplicateSelectedElement() {
        if (!selectedElement) return;
        
        const elementData = elements.find(el => el.id == selectedElement.dataset.id);
        if (!elementData) return;
        
        const newX = elementData.x + 20;
        const newY = elementData.y + 20;
        
        const newElement = createCanvasElement(
            elementData.type, 
            newX, 
            newY, 
            elementData.width, 
            elementData.height
        );
        
        // Copy properties
        newElement.style.backgroundColor = elementData.backgroundColor;
        if (elementData.type === 'text') {
            newElement.textContent = elementData.text;
            newElement.style.fontSize = `${elementData.fontSize}px`;
        }
        newElement.style.opacity = elementData.opacity / 100;
        
        // Select the new element
        selectElement.call(newElement);
    }
    
    // Update layers panel
    function updateLayersPanel() {
        layerList.innerHTML = '';
        
        if (elements.length === 0) {
            layerList.innerHTML = '<div class="empty-layers">No layers yet</div>';
            return;
        }
        
        // Display elements in reverse order (last added on top)
        [...elements].reverse().forEach(elementData => {
            const layerItem = document.createElement('div');
            layerItem.className = 'layer-item';
            if (selectedElement && selectedElement.dataset.id == elementData.id) {
                layerItem.classList.add('selected');
            }
            
            let icon = 'square-outline';
            switch(elementData.type) {
                case 'text':
                    icon = 'text-outline';
                    break;
                case 'circle':
                    icon = 'ellipse-outline';
                    break;
                case 'image':
                    icon = 'image-outline';
                    break;
                case 'line':
                    icon = 'remove-outline';
                    break;
            }
            
            layerItem.innerHTML = `
                <ion-icon name="${icon}"></ion-icon>
                <span class="layer-name">${elementData.type.charAt(0).toUpperCase() + elementData.type.slice(1)} ${elementData.id}</span>
                <ion-icon class="layer-visibility" name="eye-outline"></ion-icon>
            `;
            
            layerItem.addEventListener('click', (e) => {
                if (e.target.classList.contains('layer-visibility')) return;
                const element = document.getElementById(`element-${elementData.id}`);
                if (element) {
                    selectElement.call(element);
                }
            });
            
            layerList.appendChild(layerItem);
        });
    }
    
    // Zoom functions
    function zoomIn() {
        zoom = Math.min(zoom + 10, 200);
        updateZoom();
    }
    
    function zoomOut() {
        zoom = Math.max(zoom - 10, 50);
        updateZoom();
    }
    
    function resetZoom() {
        zoom = 100;
        updateZoom();
    }
    
    function updateZoom() {
        zoomLevel.textContent = `${zoom}%`;
        designCanvas.style.transform = `scale(${zoom / 100})`;
        designCanvas.style.transformOrigin = 'center center';
    }
    
    // History functions
    function saveToHistory() {
        // Remove any future history after current point
        history = history.slice(0, historyIndex + 1);
        
        // Save current state
        history.push(JSON.parse(JSON.stringify(elements)));
        historyIndex = history.length - 1;
        
        // Limit history size
        if (history.length > 50) {
            history.shift();
            historyIndex--;
        }
    }
    
    function undo() {
        if (historyIndex <= 0) return;
        
        historyIndex--;
        restoreFromHistory();
    }
    
    function redo() {
        if (historyIndex >= history.length - 1) return;
        
        historyIndex++;
        restoreFromHistory();
    }
    
    function restoreFromHistory() {
        if (historyIndex < 0 || historyIndex >= history.length) return;
        
        // Clear current elements
        document.querySelectorAll('.canvas-element').forEach(el => el.remove());
        elements = [];
        
        // Restore elements from history
        const savedElements = history[historyIndex];
        savedElements.forEach(elementData => {
            const element = createCanvasElement(
                elementData.type,
                elementData.x,
                elementData.y,
                elementData.width,
                elementData.height
            );
            
            // Restore properties
            element.style.backgroundColor = elementData.backgroundColor;
            if (elementData.type === 'text') {
                element.textContent = elementData.text;
                element.style.fontSize = `${elementData.fontSize}px`;
            }
            element.style.opacity = elementData.opacity / 100;
            
            elements.push(elementData);
        });
        
        // Clear selection
        selectedElement = null;
        propertiesPanel.classList.add('collapsed');
        
        // Update UI
        showPlaceholder();
        updateLayersPanel();
    }
    
    // Tool selection
    function selectTool(tool) {
        // Remove active class from all tools
        document.querySelectorAll('.toolbar-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to selected tool
        switch(tool) {
            case 'select':
                selectToolBtn.classList.add('active');
                break;
            case 'text':
                addTextBtn.classList.add('active');
                break;
            case 'rectangle':
                addRectangleBtn.classList.add('active');
                break;
            case 'circle':
                addCircleBtn.classList.add('active');
                break;
            case 'image':
                addImageBtn.classList.add('active');
                break;
            case 'line':
                addLineBtn.classList.add('active');
                break;
        }
        
        currentTool = tool;
        updateCanvasMode();
    }
    
    // Toggle panels
    function togglePanel(panel) {
        panel.classList.toggle('collapsed');
    }
    
    // Add event listeners
    selectToolBtn.addEventListener('click', () => selectTool('select'));
    addTextBtn.addEventListener('click', () => selectTool('text'));
    addRectangleBtn.addEventListener('click', () => selectTool('rectangle'));
    addCircleBtn.addEventListener('click', () => selectTool('circle'));
    addImageBtn.addEventListener('click', () => selectTool('image'));
    addLineBtn.addEventListener('click', () => selectTool('line'));
    
    deleteElementBtn.addEventListener('click', deleteSelectedElement);
    duplicateElementBtn.addEventListener('click', duplicateSelectedElement);
    
    zoomInBtn.addEventListener('click', zoomIn);
    zoomOutBtn.addEventListener('click', zoomOut);
    resetViewBtn.addEventListener('click', resetZoom);
    
    undoBtn.addEventListener('click', undo);
    redoBtn.addEventListener('click', redo);
    
    togglePropertiesPanel.addEventListener('click', () => togglePanel(propertiesPanel));
    toggleLayersPanel.addEventListener('click', () => togglePanel(layersPanel));
    
    // Canvas mouse events
    designCanvas.addEventListener('mousedown', (e) => {
        if (e.target === designCanvas) {
            startDrawing(e);
        }
    });
    
    document.addEventListener('mousemove', (e) => {
        dragElement(e);
        drawElement(e);
    });
    
    document.addEventListener('mouseup', stopAction);
    
    // Deselect when clicking on canvas
    designCanvas.addEventListener('click', function(e) {
        if (e.target === designCanvas) {
            document.querySelectorAll('.canvas-element').forEach(el => {
                el.classList.remove('selected');
            });
            selectedElement = null;
            propertiesPanel.classList.add('collapsed');
            updateLayersPanel();
        }
    });
    
    // Property input events
    elementX.addEventListener('input', updateElementProperties);
    elementY.addEventListener('input', updateElementProperties);
    elementWidth.addEventListener('input', updateElementProperties);
    elementHeight.addEventListener('input', updateElementProperties);
    elementBgColor.addEventListener('input', updateElementProperties);
    elementBgColorText.addEventListener('input', function() {
        elementBgColor.value = this.value;
        updateElementProperties();
    });
    elementText.addEventListener('input', updateElementProperties);
    elementFontSize.addEventListener('input', updateElementProperties);
    elementBorderWidth.addEventListener('input', updateElementProperties);
    elementBorderColor.addEventListener('input', updateElementProperties);
    elementOpacity.addEventListener('input', function() {
        opacityValue.textContent = `${this.value}%`;
        updateElementProperties();
    });
    
    // Initialize
    showPlaceholder();
    updateCanvasMode();
    updateZoom();
});