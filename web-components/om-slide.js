(function () {
    var template = document.createElement('template');

    template.innerHTML = `
        <style>
            .slide {
                position: absolute;
                opacity: 0;
                transform: translateX(var(--active-transform-x));
                transition: 0.5s transform, 0.4s opacity .2s;
                visibility: hidden;
                --active-transform-x: 100%;
                --deactive-transform-x: -100%;
                width: 100%;
            }

            .slide.will-fade {
                --active-transform-x: 0;
                --deactive-transform-x: 0;
            }

            .slide.is-active {
                opacity: 1;
                transform: translateX(0);
                transition: 0.5s transform, 0.4s opacity;
                visibility: visible;
            }

            .slide.is-deactivating {
                opacity: 0;
                transform: translateX(var(--deactive-transform-x));
            }

            .slide .slide-img img {
                width: 100%;
            }
        </style>
        
        <div class="slide">
            <div class="slide-img"></div>
            <div class="slide-content"></div>
        </div>
    `


    class OmSlide extends HTMLElement {
        _image = null
        get image () {return this._image }


        _descripton = null
        get descripton () {return this._descripton }
          
        static get observedAttributes() { return ['data-active']; }

        constructor() {
            super();

            this._image = this.querySelector("picture").outerHTML;
            this._descripton = (this.querySelector("div") || this.querySelector("p"))?.outerHTML;

            this.innerHTML = "";

            this._shadowRoot = this.attachShadow({ 'mode': 'open' });
        }

        connectedCallback() {
            this._shadowRoot.appendChild(template.content.cloneNode(true));

            var effect = this.parentElement.dataset.effect || "slide";
            this.shadowRoot.querySelector('.slide').classList.add("will-" + effect);
            this.shadowRoot.querySelector('.slide-img').innerHTML = this._image;
            this.shadowRoot.querySelector('.slide-content').innerHTML = this._descripton;
        }


        disconnectedCallback() {
            this._shadowRoot.innerHTML = "";
        }


        attributeChangedCallback(attrName, oldVal, newVal) {
            if (attrName !== "data-active") {return;}
            if (oldVal === newVal) {return;}
            const slide = this._shadowRoot.querySelector(".slide");
            switch (newVal) {
                case "true":
                    slide.classList.add("is-active");
                    return;
                default:
                    if (oldVal === null) {
                        return;
                    }
                    slide.classList.add("is-deactivating");
                    setTimeout(() => {
                        slide.classList.remove("is-active");
                        slide.classList.remove("is-deactivating");
                    }, 500);
                    
                    return
            }
            
        }
        
    }

    window.customElements.define('om-slide', OmSlide);
})()