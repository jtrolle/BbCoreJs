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
        'content.models.AbstractContent',
        'jquery',
        'content.manager',
        'component!mask',
        'jsclass'
    ],
    function (AbstractContent, jQuery) {

        'use strict';

        var ContentSet = new JS.Class(AbstractContent, {

            identifierDataAttribute: 'bb-identifier',

            /**
             * Initialize Content
             *
             * @param {Object} config
             */
            initialize: function (config) {
                this.callSuper(config);
            },

            /**
             * Add content html from parent with and position
             * If position is not provided, html will be at the first
             * @param {String} html
             * @param {Number} position
             * @returns {Promise}
             */
            append: function (content, position) {
                var self = this,
                    done = false,
                    dfd = jQuery.Deferred(),
                    children = this.getNodeChildren(),
                    mask = require('component!mask').createMask();

                mask.mask(this.jQueryObject);

                this.getData('parameters').done(function () {

                    var renderModeParam = self.getParameters('rendermode'),
                        renderMode = (renderModeParam !== undefined) ? renderModeParam.value : undefined;

                    content.getHtml(renderMode).done(function (html) {

                        if (position === 'last') {
                            self.jQueryObject.append(html);
                            done = true;
                        } else {
                            children.each(function (key) {
                                if (key === position) {
                                    jQuery(this).before(html);
                                    done = true;

                                    return false;
                                }
                            });
                        }

                        if (done === false) {
                            self.jQueryObject.prepend(html);
                        }

                        require('content.manager').addDefaultZoneInContentSet(true);

                        self.setUpdated(true);

                        require('content.manager').computeImages();

                        mask.unmask(self.jQueryObject);

                        dfd.resolve();
                    }).fail(function () {
                        mask.unmask(self.jQueryObject);
                    });
                }).fail(function () {
                    mask.unmask(self.jQueryObject);
                });

                return dfd.promise();
            },

            updateRevision: function () {
                this.updateRevisionElements();

                return this.revision;
            },

            updateRevisionElements: function () {
                if (this.revision.elements === undefined) {
                    var children = this.getChildren(),
                        child,
                        key,
                        elements = [];

                    for (key in children) {
                        if (children.hasOwnProperty(key)) {
                            child = children[key];
                            elements.push({'type': child.type, 'uid': child.uid});
                        }
                    }

                    this.revision.setElements(elements);
                }
            },

            /**
             * Return children of contentSet
             * @returns {Object}
             */
            getNodeChildren: function () {
                return this.jQueryObject.children(this.contentClass);
            },

            /**
             * Get children as content
             * @returns {Array}
             */
            getChildren: function () {
                var self = this,
                    nodeChildren = this.getNodeChildren(),
                    nodeChild,
                    ContentManager = require('content.manager'),
                    objectIdentifier,
                    children = [];

                nodeChildren.each(function () {
                    nodeChild = jQuery(this);
                    objectIdentifier = nodeChild.data(self.identifierDataAttribute);

                    children.push(ContentManager.buildElement(ContentManager.retrievalObjectIdentifier(objectIdentifier)));
                });

                return children;
            },

            /**
             * Verify if contentSet accept this element name
             * @param {String} accept
             * @returns {Boolean}
             */
            accept: function (accept) {
                var accepts = this.getDefinition('accept'),
                    key,
                    result = false;

                if (accepts.length === 0) {
                    result = true;
                } else {
                    for (key in accepts) {
                        if (accepts.hasOwnProperty(key)) {
                            if (accepts[key] === accept) {
                                result = true;
                                break;
                            }
                        }
                    }
                }

                return result;
            },

            /**
             * Verify if contentSet is children of an other contentSet
             * @param {String} contentSetId
             * @returns {Boolean}
             */
            isChildrenOf: function (contentSetId) {
                var parents = this.jQueryObject.parents('[data-bb-id]'),
                    result = false;

                parents.each(function () {
                    var currentTarget = jQuery(this);

                    if (currentTarget.attr('data-bb-id') === contentSetId) {
                        result = true;

                        return false;
                    }
                });

                return result;
            }
        });

        return ContentSet;
    }
);
