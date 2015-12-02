/*
 * Copyright (c) 2011-2013 Lp digital system
 *
 * This file is part of BackBee.
 *
 * BackBee is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * BackBee is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with BackBee. If not, see <http://www.gnu.org/licenses/>.
 */
define(
    [
        'Core',
        'jquery',
        'BackBone',
        'Core/Renderer',
        'text!tb.component/formbuilder/form/element/templates/contentTypeSelector_item.twig'
    ],
    function (Core, jQuery, BackBone, Renderer, itemLayout) {
        'use strict';


        var ContentNodeSelectorView = BackBone.View.extend({

            root: "<div/>",

            initialize: function (template, formTag, element) {
                this.el = formTag;
                this.template = template;
                this.element = element;
                this.BACKBEE_NAMESPACE = "BackBee\\ClassContent\\";
                this.MAX_ENTRY = 999;
                this.contentTypeSelector = null;
                this.isLoaded = false;
                this.bindEvents();
                this.parseConfig();
            },

            bindEvents: function () {
                var self = this;

                Core.Mediator.subscribe('on:form:render', function (form) {
                    if (self.isLoaded) { return false; }
                    self.contentTypeSelector = form.find(".element_" + self.element.getKey());
                    self.inputInfos = self.contentTypeSelector.find(".form-infos").eq(0);
                    self.contentTypeSelector.on("click", ".add-contenttype", self.showContentTypeTree.bind(self));
                    self.contentTypeSelector.on("click", ".trash-btn", self.removeContentType.bind(self));
                    self.isLoaded = true;
                });
            },

            removeContentType: function (e) {
                var currentItem = jQuery(e.currentTarget).closest(".contenttype-item");
                jQuery(currentItem).remove();
                this.updateValues();
            },

            parseConfig : function () {

                var previousValue = (this.element.config && this.element.config.hasOwnProperty("value")) ? this.element.config.value : [];
                this.previousValue = Array.isArray(previousValue) ? previousValue : [];

                this.maxentry = this.MAX_ENTRY;
                if (this.element.config && this.element.config.hasOwnProperty('maxentry')) {
                    this.maxentry = parseInt(this.element.config.maxentry, 10);
                }
            },

            canAddMoreItems: function () {
                return this.contentTypeSelector.find(".contenttype-item").length < this.maxentry;

            },

            handleContentTypeSelection: function (node) {
                if (!node) {
                    return;
                }
                if (!this.canAddMoreItems()) {
                    this.categoryTreeView.hide();
                    return;
                }
                var contentType = this.BACKBEE_NAMESPACE + node.type.replace('/', '\\'),
                    item = Renderer.render(itemLayout, {
                        contentType: contentType
                    });

                this.contentTypeSelector.find(".item-container").append(jQuery(item));
                this.updateValues();
                this.categoryTreeView.hide();
            },

            /* update changes */
            updateValues: function () {
                var cValue,
                    results = this.contentTypeSelector.find(".contenttype-item input").map(function () {
                        return jQuery(this).val();
                    }).get();

                cValue = JSON.stringify(results);

                if (JSON.stringify(this.previousValue) !== cValue) {
                    this.inputInfos.val(cValue);
                    this.inputInfos.attr("updated", "true");
                }
            },

            showContentTypeTree: function () {
                var self = this;

                if (!this.canAddMoreItems()) {
                    return;
                }

                if (!this.categoryTreeView) {

                    require(['component!contenttypeselector'], function (ContentTypeSelector) {
                        self.categoryTreeView = ContentTypeSelector.create({});
                        self.categoryTreeView.on("contentTypeSelection", self.handleContentTypeSelection.bind(self));
                        self.categoryTreeView.display();
                    });
                } else {
                    self.categoryTreeView.display();
                }
            },


            render: function () {
                var itemRenders = [],
                    self = this;
                jQuery.each(this.element.value, function (i) {
                    itemRenders.push(Renderer.render(itemLayout, {contentType: self.element.value[i]}));
                });

                return Renderer.render(this.template, {
                    element: this.element,
                    contentTypes: itemRenders
                });
            }
        });

        return ContentNodeSelectorView;

    }
);