let mergeToggleButtons = document.querySelectorAll('.merge-section-btn')

mergeToggleButtons.forEach(btn => {
      btn.addEventListener('click', () => {
            console.log(btn.querySelector('ion-icon'));
            (isMergeModeOn) ? mergeModeOff() : mergeModeOn();
      })
});

function mergeModeOn() {
      AppWrapper.setAttribute("style", "");
      mergeToggleButtons.forEach(btn => {
            btn.style.display = "none";
      })
      gradientWrapper.classList.add('merge-gradient-color-wrapper');
      
      isMergeModeOn = true;
}

function mergeModeOff() {
      mergeToggleButtons.forEach(btn => {
            btn.style.display = "";
      })
      // openGradientMode();
      gradientWrapper.classList.remove('merge-gradient-color-wrapper');
      isMergeModeOn = false;
}