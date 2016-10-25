/*
 * Copyright (c) 2011-2016 Lp digital system
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
        'ls-templates': 'src/tb/component/imagecropper/templates'
    }
});

define(
    ['require', 'Core/Renderer', 'component!popin', 'component!translator', 'text!ls-templates/confirm.twig'],
    function (require, Renderer, PopinManager, Translator) {
        'use strict';

        /**
         * View of new page
         * @type {Object} Backbone.View
         */
        return Backbone.View.extend({

            popinConfig: {
                id: 'cropimage-cofirm-popin',
                width: 500
                /*top: 180*/
            },

            /**
             * Initialize function
             */
            initialize: function (config) {
                var self = this,
                    tpl = Renderer.render(require('text!ls-templates/confirm.twig'));

                this.popin = PopinManager.createSubPopIn(config.parentPopin, this.popinConfig);
                this.popin.setContent(tpl);

                this.popin.addButton(Translator.translate('validate'), function () {
                    if (typeof config.validateCallback === 'function') {
                        config.validateCallback();
                    }
                    self.popin.destroy();
                });

                this.popin.addButton(Translator.translate('cancel'), function () {
                    self.destruct();
                });
            },

            display: function () {
                this.popin.display();
            },

            destruct: function () {
                this.popin.destroy();
            }
        });
    }
);
