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

require.config({
    paths: {
        'ct.node.formater': 'src/tb/component/contenttypeselector/helper/node.formater'
    }
});

define(['jquery', 'Core', 'component!treeview', 'ct.node.formater', 'component!translator', 'BackBone', 'jsclass'], function (jQuery, Core, TreeViewComponent, formater) {

    "use strict";

    var trans = Core.get("trans") || function (value) { return value; },

        ContentTypeSelector =  new JS.Class({

            defaultConfig : {
                dialogConfig: {
                    title: trans("select_a_contenttype"),
                    draggable: true,
                    resizable: true,
                    autoOpen: false
                }
            },

            initialize: function (userConfig) {

                userConfig = userConfig || {};
                this.isLoaded = false;
                this.config = jQuery.extend(true, {}, this.defaultConfig, userConfig);
                jQuery.extend(this, {}, Backbone.Events);
                this.config.dialogConfig.open = this.onReady.bind(this);
                this.dialog = TreeViewComponent.createPopinTreeView(this.config.dialogConfig);

            },

            isDialogMode: function () {
                return this.dialog.usePopin;
            },

            loadCategories : function () {
                var self = this;
                this.popIn.mask();

                Core.ApplicationManager.invokeService("content.main.getRepository").done(function (pageRepository) {
                    pageRepository.findCategories().done(function (data) {
                        var formattedData = formater.format('category', data);
                        self.categoryTreeView.setData(formattedData);
                        self.loadRootNode();
                    }).always(self.popIn.unmask);
                });
            },

            loadRootNode: function () {
                var tree = this.categoryTreeView.getRootNode();
                this.categoryTreeView.invoke("openNode", tree.children[0]);
            },

            bindEvents: function () {
                var self = this;
                this.categoryTreeView.on('click', function (e) {
                    if (e.node.isRoot) {
                        return;
                    }

                    if (e.node.isACategory) {
                        self.trigger("categorySelection", e.node);
                    } else {
                        self.trigger("contentTypeSelection", e.node);
                    }

                });
            },

            /* is called when popin is ready */
            onReady: function (popinTreeView) {
                if (this.isLoaded) {
                    return false;
                }
                this.popIn = popinTreeView.getPopIn();
                this.categoryTreeView = popinTreeView.getTreeView();
                this.loadCategories();
                this.bindEvents();
            },

            display : function () {
                this.dialog.display();
            },

            hide: function () {
                this.dialog.hide();
            },

            close: function () {
                this.dialog.hide();
            }


        });

    return {
        create: function (config) {
            config = config || {};
            return new ContentTypeSelector(config);
        },
        ContentTypeSelector: ContentTypeSelector
    };


});