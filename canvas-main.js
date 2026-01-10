// This script handles the canvas option in the main page
document.addEventListener('DOMContentLoaded', function() {
    // Add any necessary initialization for the canvas option in the main page
    console.log('Canvas module loaded');
    
    // Add Figma-like enhancements to the main interface
    const canvasOption = document.querySelector('.canvas-option .option');
    
    if (canvasOption) {
        // Add visual feedback for the canvas option
        canvasOption.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        canvasOption.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
        
        // Add tooltip
        canvasOption.title = 'Design web layouts with Figma-like tools';
    }
});