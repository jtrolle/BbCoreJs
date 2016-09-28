/*global jQuery:false, $:false, Backbone:false */
/*jshint -W004 */
define(['jquery', '../pagination/helper/renderer.helper', 'jssimplepagination'], function (corejQuery, Renderer) {
    'use strict';
    /*make sure our jQuery instance has the extension*/
    if (!corejQuery.fn.hasOwnProperty("pagination")) {
        if ($) {
            corejQuery.fn.pagination = $.fn.pagination;
        }
        if (jQuery) {
            corejQuery.fn.pagination = jQuery.fn.pagination;
        }
    }
    var $ = corejQuery,
        Pagination = new JS.Class({

            defaultConfig: {
                css: {},
                cls: 'pagination clearfix',
                items: 0,
                itemsOnPage: 10,
                displayedPages: 5,
                renderMode: 'default',
                prevText: 'Prev',
                nextText: 'Next',
                theme: 'tpl-name'
            },

            initialize: function (config) {
                this.config = $.extend({}, this.defaultConfig, config);
                this.IS_VISIBLE = false;
                this.SINGLE_PAGE_MODE = "singlePage";
                this.DEFAULT_PAGE_MODE = "default";
                this.MAX_PAGES = 1000; //only 10 clicks on next on single page mode
                this.silenceNextEvent = false;
                this.renderList = {};
                $.extend(this, {}, Backbone.Events);
                this.widget = $("<div/>").clone();
                this.bindEvents();
                this.build();
                this.handleMode();
                this.setItemsOnPage(this.config.itemsOnPage, true);
            },

            handleMode: function () {
                if ($.inArray(this.config.renderMode, [this.DEFAULT_PAGE_MODE, this.SINGLE_PAGE_MODE]) === -1) {
                    this.config.renderMode = 'default';
                }
                this.renderMode = this.config.renderMode;
            },

            setItems: function (total, itemsToShow) {
                if (this.isSinglePageMode()) {
                    total = (isNaN(total) || (total === 0)) ? 0 : this.MAX_PAGES;
                    this.onLastPage = false;
                }
                if (isNaN(total)) {
                    throw "setItemsException 'nb' parameter must be a number !";
                }

                this.invoke('updateItems', parseInt(total, 10));

                if (this.isSinglePageMode()) {
                    if (itemsToShow && (itemsToShow <= parseInt(this.getPaginationConf().itemsOnPage, 10))) {
                    /* the last page has been reached */
                        this.onLastPage = true;
                    }
                }
                this.beforeRender(this.widget);
            },

            isSinglePageMode: function () {
                return this.renderMode === this.SINGLE_PAGE_MODE;
            },

            setItemsOnPage: function (nb, silent) {
                silent = (typeof silent === 'boolean') ? silent : false;
                this.silenceNextEvent = silent;
                this.invoke('updateItemsOnPage', nb);
                this.beforeRender(this.widget);
            },

            bindEvents: function () {
                var self = this;
                this.widget.on('click', '.first-btn', function () {
                    self.selectPage(1);
                });
                this.widget.on('click', '.last-btn', function () {
                    var conf = self.getPaginationConf();
                    if (conf) {
                        self.selectPage(conf.pages);
                    }
                });
                this.widget.on('click', '.bb5-pagination-next', function () {
                    self.nextPage();
                });
                this.widget.on('click', '.bb5-pagination-prev', function () {
                    self.prevPage();
                });
            },

            checkState: function () {
                var hideWidget = false,
                    state = this.getPaginationConf();
                if (parseInt(state.items, 10) === 0 || parseInt(state.items, 10) <= parseInt(state.itemsOnPage, 10)) {
                    hideWidget = true;
                }


                if (hideWidget) {
                    $(this.widget).hide();
                    this.IS_VISIBLE = false;
                } else {
                    $(this.widget).show();
                    this.IS_VISIBLE = true;
                }
                this.trigger('afterRender', this.IS_VISIBLE);
            },

            getPaginationConf: function () {
                return $(this.widget).data('pagination');
            },

            beforeRender: function () {
                var render = Renderer.render(this.renderMode, this);
                if (!render) {
                    throw "BeforeRenderException " + this.renderMode + " render can't be found !";
                }
                return render;
            },

            reset: function () {
                this.selectPage(1, true);
                this.invoke('redraw');
                this.beforeRender(this.widget);
            },

            build: function () {
                $(this.widget).css(this.defaultConfig.css);
                this.config.onPageClick = $.proxy(this.handlePageClick, this);
                $(this.widget).pagination(this.config);
            },

            handlePageClick: function (currentPage) {
                if (this.silenceNextEvent) {
                    this.silenceNextEvent = false;
                    return;
                }
                this.beforeRender(this.widget);
                this.trigger('pageChange', currentPage, this.getItemsOnPage());
            },

            /* We provide a programatic way to adapt the render view */
            invoke: function (methodName) {
                var args = Array.prototype.slice.call(arguments, 0);
                args.shift();
                try {
                    this.widget.pagination(methodName, args.join(', '));
                } catch (e) {
                    throw "PaginationException Error while invoking " + methodName + e;
                }
            },

            render: function (container, positionMethod) {
                if (typeof this.beforeRender === "function") {
                    this.widget = this.beforeRender(this.widget);
                }
                positionMethod = (typeof positionMethod === "string") ? positionMethod : 'html';
                if (container && corejQuery(container).length) {
                    corejQuery(container)[positionMethod](this.widget);
                } else {
                    return this.widget;
                }
            },

            selectPage: function (pageNo, silent) {
                silent = (typeof silent === 'boolean') ? silent : false;
                this.silenceNextEvent = silent;
                this.invoke('selectPage', pageNo);
            },


            prevPage: function () {
                this.invoke('prevPage');
            },

            nextPage: function () {
                this.invoke('nextPage');
            },

            getPagesCount: function () {
                return this.invoke('getPagesCount');
            },

            getCurrentPage: function () {
                return this.invoke('getCurrentPage');
            },

            destroy: function () {
                this.invoke('destroy');
            },
            disable: function () {
                this.invoke('disable');
            },

            enable: function () {
                this.invoke('enable');
            },

            getItemsOnPage: function () {
                var conf = this.getPaginationConf(),
                    itemsOnPage = parseInt(conf.itemsOnPage, 10);

                if (this.isSinglePageMode()) {
                    itemsOnPage = itemsOnPage + 1; //this allows us to compute
                }

                return itemsOnPage;
            }
        });
    return {
        createPagination: function (config) {
            config = config || {};
            return new Pagination(config);
        },
        Pagination: Pagination
    };
});