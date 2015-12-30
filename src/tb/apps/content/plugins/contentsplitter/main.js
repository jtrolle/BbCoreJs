define(['content.pluginmanager', 'Core/ApplicationManager', 'content.manager', 'component!translator', 'content.dnd.manager', 'jquery'], function (PluginManager, ApplicationManager, ContentManager, Translator, DNDManager, jQuery) {

    'use strict';
    /**
     * contentSplitter allow us to split a cotent into two content
     */
    PluginManager.registerPlugin('contentsplitter', {

        scope: PluginManager.scope.BLOCK,
        onInit: function () {
            this.SPLITTABLE_CONTENT = "Text/Paragraph";
            this.btnState = 0;
            this.splitData = {};
            return true;
        },

        onDisable: function () {
            this.deactivate();
        },

        onContextChange: function (previousContext) {
            if (!previousContext.content) {
                return false;
            }
            jQuery(previousContext.content.jQueryObject).find(".split-panel").remove();
            jQuery(previousContext.content.jQueryObject).css({
                cursor: 'default'
            });
            jQuery(previousContext.content.jQueryObject).css({
                cursor: 'default'
            });
            this.removeMarker();
            var state = this.state[previousContext.content];
            if (!state) {
                return false;
            }

            state.isActivated = false;
            this.state[previousContext.content] = state;
        },

        insertMarker: function (e) {
            /* disable selection if click on helper */

            if (jQuery(e.target).closest('.split-panel').length) {
                return false;
            }

            if (!this.isActivated()) {
                return false;
            }
            this.removeMarker();
            var sel = window.getSelection ? window.getSelection() : document.selection,
                txtToAdd = "<span class='bb-contentsplitter-marker'></span>",
                isTextNode = (sel.anchorNode.nodeType === 3),
                caretPos = this.getCursorPosition(e.target),
                content = isTextNode ? jQuery(sel.anchorNode.parentNode).text() : jQuery(sel.anchorNode).text(),
                contentLength = content.length,
                before = content.substring(0, caretPos),
                after = content.substring(caretPos, contentLength),
                anchorNode = isTextNode ? jQuery(sel.anchorNode.parentNode) : jQuery(sel.anchorNode),
                updatedContent = before + txtToAdd + after;
            anchorNode.html(updatedContent);
            this.showSplitButton();
            this.setContentState("splitData", {
                beforeContent: before,
                afterContent: after,
                anchorNode: anchorNode
            });
            return false;
        },

        removeMarker: function () {
            jQuery('.bb-contentsplitter-marker').remove();
        },

        /*@cf */
        getCursorPosition: function (element) {
            var caretOffset = 0,
                range,
                textRange,
                preCaretRange,
                preCaretTextRange;
            if (window.getSelection !== "undefined") {
                range = window.getSelection().getRangeAt(0);
                preCaretRange = range.cloneRange();
                preCaretRange.selectNodeContents(element);
                preCaretRange.setEnd(range.endContainer, range.endOffset);
                caretOffset = preCaretRange.toString().length;
            } else if (document.selection !== "undefined" && document.selection.type !== "Control") {
                textRange = document.selection.createRange();
                preCaretTextRange = document.body.createTextRange();
                preCaretTextRange.moveToElementText(element);
                preCaretTextRange.setEndPoint("EndToEnd", textRange);
                caretOffset = preCaretTextRange.text.length;
            }
            return caretOffset;
        },

        clearSelection: function () {
            var sel = window.getSelection ? window.getSelection() : document.selection;
            if (typeof sel.empty === "function") {
                sel.empty();
            }
            if (typeof sel.removeAllRanges === "function") {
                sel.removeAllRanges();
            }
        },

        updateNodeContent: function (node, value) {
            var jQueryDfd = jQuery.Deferred(),
                contentValue,
                bodyElement;

            node.getData("elements").done(function (elements) {
                bodyElement = elements.body;

                if (!bodyElement) {
                    return false;
                }

                bodyElement = ContentManager.buildElement({
                    'type': bodyElement.type,
                    uid: bodyElement.uid
                });

                contentValue = value.map(function () {
                    return jQuery(this).get(0).outerHTML;
                }).get().join("");

                bodyElement.set("value", contentValue);

                jQueryDfd.resolve(node);
            });

            return jQueryDfd.promise();
        },

        splitContent: function (e) {
            e.stopPropagation();

            var self = this,
                splitData = this.getContentState('splitData'),
                currentC = this.getCurrentContent(),
                splittedContent,
                newNode,
                remainedContentValue,
                splitContentValue,

                currentNodeParent = this.getCurrentContent().getParent(),//article Body (It MUST BE a contentSet)
                siblingPosition = DNDManager.getPosition(this.getCurrentContent().jQueryObject, currentNodeParent.jQueryObject);

            if (!splitData) {
                return false;
            }

            ContentManager.maskMng.mask(currentC.jQueryObject);

            /* create a new Paragraph Element */
            ContentManager.createElement(this.getCurrentContentType()).done(function (content) {
                splittedContent = ContentManager.buildElement({
                    'type': self.getCurrentContentType(),
                    'uid': content.uid
                });

                //splitted Content
                splitContentValue = splitData.anchorNode.nextAll().clone();
                splitContentValue = jQuery("</p>").html(splitData.afterContent).add(jQuery(splitContentValue));

                /* source */
                splitData.anchorNode.nextAll().remove();
                remainedContentValue = splitData.anchorNode.prevAll().clone();
                remainedContentValue = remainedContentValue.add(jQuery("</p>").html(splitData.beforeContent));
                /* update source */
                splitData.anchorNode.html(remainedContentValue);
                /*append Content here */
                currentNodeParent.append(splittedContent, siblingPosition + 1).done(function () {
                    /*append rev*/
                    newNode = ContentManager.buildElement({
                        'type': self.getCurrentContentType(),
                        'uid': splittedContent.uid
                    }).jQueryObject;
                    ContentManager.maskMng.mask(newNode);
                    /* update contents */

                    jQuery.when(
                        self.updateNodeContent(currentC, remainedContentValue),
                        self.updateNodeContent(splittedContent, splitContentValue)
                    ).done(function () {
                        self.saveChanges().done(function () {
                            splittedContent.refresh();
                        });
                    });
                });

            });
            this.deactivate();
            return false;
        },

        saveChanges : function () {
            var dfd = new jQuery.Deferred();
            ApplicationManager.invokeService('content.main.save', true).done(function (servicePromise) {
                servicePromise.done(dfd.resolve);
            });
            return dfd.promise();
        },


        canApplyOnContext: function () {
            var contentParent = this.getCurrentContent().getParent(),
                isAParagraph = this.getCurrentContentType() === this.SPLITTABLE_CONTENT;
            return contentParent.isAContentSet() && isAParagraph && this.context.scope !== PluginManager.scope.CONTENT;
        },

        isActivated: function () {
            return this.getContentState("isActivated");
        },

        showSplitButton: function () {
            jQuery('.split-panel > .doSplit').show();
        },

        hideSplitButton: function () {
            jQuery('.split-panel > .doSplit').hide();
        },

        activate: function () {
            this.getCurrentContent().jQueryObject.off("mouseup.splitter").on("mouseup.splitter", this.insertMarker.bind(this));
            this.getCurrentContent().jQueryObject.off('click.splitter').on('click.splitter', '.doSplit', this.splitContent.bind(this));

            var splitModePanel = jQuery("<div class='split-panel'></div>").clone(),

                textLabel = jQuery('<span></span>').addClass('contentsplitter-label'),
                button = jQuery("<button></button>");

            button.hide();

            textLabel.html('Split mode enabled');

            button.addClass("btn btn-sm btn-default btn-xs doSplit").html(Translator.translate("split_content"));

            splitModePanel.append(textLabel);
            splitModePanel.append(button);

            this.getCurrentContent().jQueryObject.append(splitModePanel);
            this.getCurrentContent().jQueryObject.css({
                cursor: 'text'
            });
            this.setContentState("isActivated", true);
        },

        deactivate: function () {
            this.getCurrentContent().jQueryObject.off("mouseup.splitter");
            this.getCurrentContent().jQueryObject.off("click.splitter");
            this.getCurrentContent().jQueryObject.find('.split-panel').remove();
            this.getCurrentContent().jQueryObject.css({
                cursor: 'default'
            });
            this.removeMarker();
            this.clearSelection();
            this.setContentState("isActivated", false);
        },

        toggleSplitMode: function (e) {
            e.stopPropagation();
            if (!this.isActivated()) {
                this.activate();
                return;
            }
            this.deactivate();
        },

        getActions: function () {
            var self = this;
            return [
                {
                    name: 'Content splitter',
                    ico: 'fa fa-scissors',
                    cmd: this.createCommand(self.toggleSplitMode, self),
                    checkContext: function () {
                        return true;
                    }
                }
            ];
        }

    });

});