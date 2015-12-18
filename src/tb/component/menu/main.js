 /**
     * Event list :
     *  show component
     *  hide
     *  select
     *  click
     *
     * --
     * ImageMenu = New Menu();
     * ImageMenu.addItem({label: Créer, key, action: function(){}});
     * ImageMenu.addItem({label: Créer, key, action: function(){}});
     * ImageMenu.show();
     **/
define(['jquery', 'Core', 'Core/Renderer', 'text!../menu/templates/layout.html', 'component!translator', 'jsclass'], function (jQuery, Core, Renderer, layout, Translator) {
    'use strict';

    var MenuComponent = new JS.Class({

        defaultConfig: {
            menuTitle: Translator.translate("menu_block_title"),
            "cssClass" : "",
            width: "",
            height: ""
        },

        initialize: function (userConfig) {
            this.config = jQuery.extend(true, this.defaultConfig, userConfig);
            this.buttonKeys = [];
            this.widget = jQuery("<div/>");
            this.isVisible = false;
            if (this.config.hasOwnProperty("cssClass") && typeof this.config.cssClass === 'string') {
                jQuery(this.widget).addClass(this.config.cssClass);
            }
            jQuery.extend(this, {}, Backbone.Events);
            this.isRendered = false;
            this.uiState = new Core.SmartList({idKey: 'key'});
            this.VISIBLE_STATE = 1;
            this.INVISIBLE_STATE = 0;
            this.bindEvents();
        },

        setButtons: function (buttons) {
            if (!Array.isArray(buttons)) { return false; }
            var self = this;
            jQuery.map(buttons, function (buttons) {
                buttons.state = self.VISIBLE_STATE;
            });
            this.uiState.setData(buttons);
        },

        addButton: function (key, label, action) {
            if (typeof key !== 'string') {  return; }
            if (typeof label !== 'string') { return; }
            this.enable();
            action = (typeof action === 'function') ? action : jQuery.noop;
            var item = {key: key, label: label, action: action, state: this.VISIBLE_STATE};
            this.buttonKeys.push(key);
            this.uiState.set(item);
        },

        getMenuTitle: function () {
            return this.config.menuTitle;
        },


        hasVisibleItems: function () {
            return this.widget.find(".menu-item").length;
        },

        addSeparator: function () {
            var key = Math.random().toString(36).substr(2, 7),
                separator = { key: key, type: "sep"};
            this.uiState.set(separator);
        },

        disableButton: function (key) {
            try {
                var item = this.uiState.get(key);
                item.state = this.INVISIBLE_STATE;
                this.uiState.set(item);
            } catch (e) {
                return e;
            }
        },

        disableButtons: function (btnKeys) {
            if (!Array.isArray(btnKeys)) { return false; }
            var self = this;
            this.showAll();
            jQuery.map(btnKeys, function (key) {
                self.disableButton(key);
            });

            if (!this.hasVisibleItems()) {
                this.disable();
            }

        },

        enableButton: function (key) {
            try {
                var item = this.uiState.get(key);
                item.state = this.VISIBLE_STATE;
                this.uiState.set(item);
            } catch (e) {
                return e;
            }
        },

        bindEvents: function () {
            var self = this;
            this.uiState.onChange = this.updateUi.bind(this);
            this.uiState.onInit = this.onInit.bind(this);
            this.widget.on("click", ".dropdown-toggle", this.showMenu.bind(this));
            this.widget.on("click", ".menu-item", this.handleClick.bind(this));
            jQuery("body").on("click", function () {
                self.hideMenu();
                return true;
            });
        },

        hideMenu: function () {
            if (!this.isVisible) {
                return;
            }
            this.widget.find(".dropdown-menu").hide();
            this.isVisible = false;
        },

        /* Before show */
        showMenu: function (e) {
            e.stopPropagation();
            if (this.isVisible) {
                return this.hideMenu();
            }
            this.trigger("beforeShow", this);

            if (this.hasVisibleItems()) {
                this.widget.find(".dropdown-menu").show();
                this.isVisible = true;
            }
            return true;
        },

        showAll: function () {
            var self = this;
            jQuery.map(this.buttonKeys, function (btnKey) {
                self.enableButton(btnKey);
            });
        },

        disable: function () {
            this.isEnabled = false;
            this.widget.find(".btn").addClass("disabled");
        },

        enable: function () {
            this.isEnabled = true;
            this.widget.find(".btn").removeClass("disabled");
        },

        hideAll: function () {
            var self = this;
            jQuery.map(this.buttonKeys, function (val) {
                self.disableButton(val);
            });
        },

        handleClick: function (e) {
            e.stopPropagation();
            var item = e.currentTarget,
                buttonItem = this.uiState.get(jQuery(item).data("button-key"));
            if (buttonItem) {
                buttonItem.action();
            }
            this.hideMenu();
            return true;
        },

        onInit: function () {
            this.updateUi();
            this.disable();
        },

        updateUi: function () {
            var data = this.uiState.toArray(true);
            /* called on change according to state */
            this.widget.html(Renderer.render(layout, {data: data, title: this.getMenuTitle()}));
        },

        render: function (container) {
            if (container) {
                jQuery(container).html(this.widget);
            }
            return this.widget;
        }
    });

    return {

        create: function (config) {
            config = config || {};
            return new MenuComponent(config);
        },

        MenuComponent: MenuComponent

    };



});