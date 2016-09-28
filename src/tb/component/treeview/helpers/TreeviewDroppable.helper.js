define(
    [
        'Core',
        'component!dnd',
        'jquery'
    ],
    function (Core, dndManager, jQuery) {

        "use strict";

        var TreeviewDroppable = new JS.Class({

            initialize: function (treeview) {
                this.treeview = treeview;
                this.treeview.on("init", this.initDroppable.bind(this));
                this.context = "treeview_" + Math.random().toString(36).substr(2, 9);
                this.transferData = {};
            },

            initDroppable: function () {
                if (!this.treeview.options.droppable) { return false; }
                this.treeview.el.find(".jqtree-tree").attr("dropzone", true);
                this.treeview.treeEl.find(".jqtree-tree").attr("dropzone", true);
                dndManager(this.treeview.el).addListeners(this.context, ".jqtree-tree");
                this.bindEvents();
            },

            clearOver: function () {
                this.treeview.el.find('.dragover').removeClass('dragover').css({border: 'none'});
                this.transferData = {};
            },

            bindEvents: function () {
                var self = this,
                    treenode;

                Core.Mediator.subscribe("on:" + this.context + ":dragover", function (event) {
                    treenode = (jQuery(event.target).hasClass("jqtree-element")) ? event.target : jQuery(event.target).closest('.jqtree-element').eq(0);
                    self.treeview.el.find('.dragover').css({border: 'none'});
                    if (treenode) {
                        var node = jQuery(treenode).parent('li').get(0);
                        jQuery(treenode).addClass("dragover").css({border: '1px solid #be3a18'});
                        self.transferData.node = jQuery(node).data("node");
                        self.transferData.htmlNode = treenode;
                        event.preventDefault();
                    }
                });

                Core.Mediator.subscribe("on:" + this.context + ":dragleave", function () {
                    self.clearOver();
                });

                Core.Mediator.subscribe("on:" + this.context + ":drop", function (event) {
                    event.preventDefault();

                    var draggedItem,
                        draggedItemKey = event.dataTransfer.getData('text/plain') || null;

                    if (!draggedItemKey || jQuery.trim(draggedItemKey).length === 0) {
                        self.clearOver();
                        Core.exception('TreeviewDroppableException', 50900, 'No Dragged Item key was provided');
                    }
                    draggedItem = Core.get(draggedItemKey);
                    if (!draggedItem) {
                        self.clearOver();
                        Core.exception('TreeviewDroppableException', 50900, 'No Dragged Item could found with the key [' + draggedItemKey + ']');
                    }
                    /* target source */
                    self.treeview.treeEl.trigger('tree.itemdrop', [self.transferData.node, draggedItem]);
                    self.clearOver();
                });
            }
        });

        return {
            init: function (treeview) {
                return new TreeviewDroppable(treeview);
            }
        };
    }
);