class FancyMenu {

    /**
        @description Initialize the menu with a container element
        @param {HTMLElement} container
    */
    constructor(container) {
        
        if (!container || !(container instanceof HTMLElement)) throw new Error("Invalid parameter. 'container' should be an HTMLElement.");
        
        const newContainer = document.createElement("div");
        newContainer.className = "fancyMenu";
        container.appendChild(newContainer);
        
        this._container = newContainer;
        this._items = [];
        this.opened = false;
        this._placeholderData = {};

        const observer = new ResizeObserver(() => { this._resizeOptionsContainer(); });
        observer.observe(this._container);

    }

    /**
        @description Set items for the menu
        @param {Array} items 
    */
    setItems(items) {
        if (!items || !Array.isArray(items)) throw new Error("Invalid parameter. 'items' should be an array.");
        this._items = items;
    }

    /**
        @description Add new items for the menu
        @param {Array} items 
    */
    addItems(items) {
        if (!items || !Array.isArray(items)) throw new Error("Invalid parameter. 'items' should be an array.");
        this._items.push(...items);
    }

    /**
        @description Set new placeholder data
    */
    setPlaceholder(placeholderData) {
        if (typeof placeholderData == 'object') this._placeholderData = placeholderData;
    }
    
    /**
        @description Get placeholder data
    */
    getPlaceholder() {
        return this._placeholderData;
    }

    /**
        @description Returns all the items of the menu
        @returns {Array} Array
    */
    getItems() {
        return this._items;
    }

    /**
        @description Get selected index
        @returns {number} Number
    */
    get selectedIndex() {
        return this._selectedIndex;
    }
    
    /**
        @description Set selected index
        @param {number} index
    */
    set selectedIndex(index) {
        if (typeof index !== 'number') throw new Error("Invalid parameter. 'index' should be a number.");
        if (index < 0) throw new Error("Invalid parameter. 'index' should be a number greater than 0.");
        this._selectedIndex = index;
    }

    /**
        @description Gets the opened state of the menu
        @returns {boolean} Boolean
    */
    get opened() {
        if (this._optionsContainer) return this._optionsContainer.style.display == "block";
        return false;
    }
        
    /**
        @description Sets the opened state of the menu
        @param {boolean} state
    */
    set opened(state) {
        if (this._optionsContainer) this._optionsContainer.style.display = state ? "block" : "none";
    }

    /**
        @description Get the function that's going to be called when someone clicks an option
        @returns {function} Function
    */
    get onSelectOption() {
        return this._selectOptionFunction;
    }
            
    /**
        @description Set a function that's going to be called when someone clicks an option
        @param {function} callback
    */
    set onSelectOption(callback) {
        if (typeof callback !== "function") throw new Error("Invalid parameter. 'callback' should be a function.");
        this._selectOptionFunction = callback;
    }

    _resizeOptionsContainer() {
        if (this._optionsContainer) this._optionsContainer.style.width = `${this._placeholderContainer.offsetWidth}px`;
    }

    /**
        @description Refresh the menu's items
    */
    refresh() {

        this._container.innerHTML = "";

        const createMenuElement = (itemData, index = 0, isPlaceholder = false) => {

            if (!itemData) return;

            // Create option container element
            const option = document.createElement("div");
            option.className = isPlaceholder ? "fancyMenu-Placeholder-Container" : "fancyMenu-Option-Container";
            if (!isPlaceholder) option.setAttribute("menuindex", index);

            // Create image/icon element
            if (useImageSeparation) {
                const image = document.createElement("img");
                if (itemData.image) { image.src = itemData.image; }
                else { image.style.opacity = "0"; }
                image.className = isPlaceholder ? "fancyMenu-Placeholder-Image" : "fancyMenu-Option-Image";
                image.draggable = false;
                option.appendChild(image);
            }

            // Create text & description container element
            const subContainer = document.createElement("div");
            subContainer.className = isPlaceholder ? "fancyMenu-Placeholder-SubContainer" : "fancyMenu-Option-SubContainer";
            option.appendChild(subContainer);

            // Create text element
            const textContainer = document.createElement("div");
            const text = document.createElement("span");
            textContainer.className = isPlaceholder ? "fancyMenu-Placeholder-Text" : "fancyMenu-Option-Text";
            text.textContent = itemData.name;
            textContainer.append(text);
            subContainer.appendChild(textContainer);
        
            // Create description element
            if (itemData.description) {
                const descriptionContainer = document.createElement("div");
                const description = document.createElement("span");
                descriptionContainer.className = isPlaceholder ? "fancyMenu-Placeholder-Description" : "fancyMenu-Option-Description";
                description.textContent = itemData.description;
                descriptionContainer.appendChild(description);
                subContainer.appendChild(descriptionContainer);
            }

            // Create placeholder icon
            if (isPlaceholder && this._placeholderData?.icon) {
                const image = document.createElement("img");
                image.src = this._placeholderData.icon;
                image.className = "fancyMenu-Placeholder-Icon";
                image.draggable = false;
                option.appendChild(image);
            }

            return option;

        }

        // Menu option click handler
        this._container.onclick = (event) => {

            const element = event.composedPath().find(e => e.className?.includes("fancyMenu-Option-Container"));
            if (!element) return;

            this.selectedIndex = parseInt(element.getAttribute("menuindex"));
            if (this._selectOptionFunction) this._selectOptionFunction(element, this.selectedIndex);

            this.opened = false;
            const placeholder = createMenuElement(this._items[this.selectedIndex], null, true);
            if (!placeholder) return;

            this._placeholderContainer.replaceChildren(...placeholder.childNodes);

        }

        // Bool that indicates if we should use the image separation
        const useImageSeparation = this._items.some(itemData => itemData.image) || this._placeholderData.image;

        const placeholder = createMenuElement(this._placeholderData, null, true);
        this._container.appendChild(placeholder);
        this._placeholderContainer = placeholder;

        // Hide/Unhide Menu
        placeholder.onclick = () => {
            const state = !this.opened;
            if (state) this.constructor.hideAllMenusOptions();
            this.opened = state;
        }

        const optionsContainer = document.createElement("div");
        optionsContainer.classList = "fancyMenu-Options-Container";
        this._container.appendChild(optionsContainer);

        this._optionsContainer = optionsContainer;
        this.opened = false;

        this._items.forEach((itemData, index) => {
            const option = createMenuElement(itemData, index, false);
            this._optionsContainer.appendChild(option);
        });

    }

    /**
        @description Hides the options of all the menus on the page
    */
    static hideAllMenusOptions() {
        document.querySelectorAll(".fancyMenu-Options-Container").forEach(element => {
            element.style.display = "none";
        });
    }

}

// Hide menus when the document is unfocused or when the user clicks outside the menu

window.addEventListener("click", (event) => {
    if (!event.composedPath().some(e => e.className?.startsWith("fancyMenu"))) FancyMenu.hideAllMenusOptions();
})

window.addEventListener("blur", () => { FancyMenu.hideAllMenusOptions(); });