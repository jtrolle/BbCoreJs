/*
 * Copyright (c) 2011-2013 Lp digital system
 *
 * This file is part of BackBuilder5.
 *
 * BackBuilder5 is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * BackBuilder5 is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with BackBuilder5. If not, see <http://www.gnu.org/licenses/>.
 */

define(
    'tb.component/formbuilder/main',
    [
        'tb.core.Api',
        'jquery',
        'tb.component/formbuilder/form/Form',
        'tb.core.Utils',
        'jsclass'
    ],
    function (Core, jQuery, FormConstructor, Utils) {

        'use strict';

        /**
         * FormBuilder object
         */
        var formPath = 'tb.component/formbuilder/form/',

            FormBuilder = new JS.Class({
                /**
                 *
                 * config.elements:
                 *      name:
                 *          type: 'text'
                 *          label: 'My name'
                 *          value: ''
                 *
                 * @param {type} config
                 */
                renderForm: function (config) {

                    var form = {},
                        dfd = new jQuery.Deferred();

                    if (!config.hasOwnProperty('elements')) {
                        Core.exception('MissingPropertyException', 500, 'Property "elements" not found');
                    }

                    config = jQuery.extend({}, config);

                    this.mappingRequire = [];

                    this.parseGlobalConfig(config);
                    this.parseFormConfig(config.form);

                    form = new FormConstructor(config.form);

                    this.parseElementConfig(config.elements, form);

                    Utils.requireWithPromise(this.mappingRequire).done(function () {
                        dfd.resolve(form.render());
                    }).fail(function (e) {
                        dfd.reject(e);
                    });

                    return dfd.promise();
                },

                parseGlobalConfig: function (config) {
                    if (!config.hasOwnProperty('form')) {
                        config.form = jQuery.extend({}, {});
                    }

                    if (typeof config.onSubmit === 'function') {
                        config.form.onSubmit = config.onSubmit;
                    }

                    if (typeof config.onValidate === 'function') {
                        config.form.onValidate = config.onValidate;
                    }
                },

                parseFormConfig: function (formConfig) {
                    if (false === formConfig.hasOwnProperty('template')) {
                        formConfig.template = formPath + 'templates/form.twig';
                    }
                    formConfig.template = 'text!' + formConfig.template;
                    this.mappingRequire.push(formConfig.template);

                    if (false === formConfig.hasOwnProperty('view')) {
                        formConfig.view = formPath + 'views/form.view';
                    }
                    this.mappingRequire.push(formConfig.view);
                },

                parseElementConfig: function (elements, form) {
                    var key,
                        elementConfig,
                        typeFormated;

                    for (key in elements) {
                        if (elements.hasOwnProperty(key)) {
                            elementConfig = jQuery.extend({}, elements[key]);

                            typeFormated = elementConfig.type.substr(0, 1).toUpperCase() + elementConfig.type.substr(1);

                            //Class
                            if (false === elementConfig.hasOwnProperty('class')) {
                                elementConfig.class = formPath + 'ElementBuilder!' + typeFormated;
                            }
                            this.mappingRequire.push(elementConfig.class);

                            //Template
                            if (false === elementConfig.hasOwnProperty('template')) {
                                elementConfig.template = formPath + 'element/templates/' + elementConfig.type + '.twig';
                            }
                            elementConfig.template = 'text!' + elementConfig.template;
                            this.mappingRequire.push(elementConfig.template);

                            //View
                            if (false === elementConfig.hasOwnProperty('view')) {
                                elementConfig.view = formPath + 'element/views/form.element.view.' + elementConfig.type;
                            }
                            this.mappingRequire.push(elementConfig.view);

                            form.add(key, elementConfig);
                        }
                    }
                }
            });

        return new JS.Singleton(FormBuilder);
    }
);
