(function () {
  var template = document.createElement('template');

  template.innerHTML = `
      <style>
        .slider {
          display: block;
          min-height: var(--min-slide-height);
          transition: 0.3s min-height;
          overflow: hidden;
        }
      </style>

      <div class="slider">
        <slot name="slide"> </slot>
      </div>
  `


  class OmSlider extends HTMLElement {
      constructor() {
          super();
          this._shadowRoot = this.attachShadow({ 'mode': 'closed' });
          this._shadowRoot.appendChild(template.content.cloneNode(true));

          this.goToNext = this.goToNext.bind(this);
          this.goToPrevious = this.goToPrevious.bind(this);

          this.setActiveItem(0);
      }


      get timeout () {
        return Number(this.dataset.timeout || 3000)
      }


      get activeItemIndex() {
        var activeItem = this.querySelector("[data-active=\"true\"]");
        if (!activeItem) return 0;

        return this.getChildren().indexOf(activeItem);
      }



      getChildren() {
        return Array.from(this.children)
      }


      goToPrevious = function () {
        let nextItem = this.activeItemIndex - 1;

        if (nextItem < 0) {
          nextItem = this.getChildren().length - 1;
        }

        this.setActiveItem(nextItem);
      }


      goToNext = function () {
        let nextItem = this.activeItemIndex + 1;

        if (this.getChildren().length <= nextItem) {
          nextItem = 0
        }

        this.setActiveItem(nextItem);
      }


      setActiveItem (nextItem) {
        const children = this.getChildren().map((child) => {
          child.dataset.active = false;
          return child;
        });

        var slider = this._shadowRoot.querySelector(".slider");
        slider.style.setProperty('--min-slide-height', children[nextItem]._shadowRoot.querySelector(".slide").clientHeight + "px")
        

        children[nextItem].dataset.active = true;
      }

      _interval = null;
      connectedCallback() {
        this._interval = setInterval(this.goToPrevious, this.timeout);
      }

      disconnectedCallback() {
        clearInterval(this._interval);
      }
  }

  window.customElements.define('om-slider', OmSlider);
})()