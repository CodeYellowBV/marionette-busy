define(function (require) {
    'use strict';

    var Marionette = require('marionette');

    return Marionette.Behavior.extend({
        defaults: {
            showClassName: 'show',      // Shown elements will have this class.
            hideClassName: 'hide',      // Hidden elements will have this class.
            busyOnModel: true,          // Listen to this.model for before:read and after:read.
            busyOnCollection: true,     // Listen to this.collection for before:read and after:read.
            wait: null,                 // Hooks into promise to show busy message.
        },
        ui: {
            hideWhileBusy: '._hide-while-busy',
            showWhileBusy: '._show-while-busy',
        },
        initialize: function (options) {
            if (this.options.busyOnModel && this.view.getOption('model')) {
                this.listenTo(this.view.getOption('model'), 'before:read', this.onShowBusy);
                this.listenTo(this.view.getOption('model'), 'after:read', this.onHideBusy);
            }

            if (this.options.busyOnCollection && this.view.getOption('collection')) {
                this.listenTo(this.view.getOption('collection'), 'before:read', this.onShowBusy);
                this.listenTo(this.view.getOption('collection'), 'after:read', this.onHideBusy);
            }
        },
        onShowBusy: function () {
            this.show(this.ui.showWhileBusy);
            this.hide(this.ui.hideWhileBusy);
        },
        onHideBusy: function () {
            this.hide(this.ui.showWhileBusy);
            this.show(this.ui.hideWhileBusy);
        },
        /**
         * Show $el if possible.
         */
        show: function ($el) {
            if ($el.addClass) {
                $el.addClass(this.options.showClassName);
            }

            if ($el.removeClass) {
                $el.removeClass(this.options.hideClassName);
            }
        },
        /**
         * Hide $el if possible.
         */
        hide: function ($el) {
            if ($el.addClass) {
                $el.addClass(this.options.hideClassName);
            }

            if ($el.removeClass) {
                $el.removeClass(this.options.showClassName);
            }
        },
        onRender: function () {
            var wait = this.options.wait || Marionette.getOption(this.view, 'wait');
            
            this.onHideBusy();

            if (wait) {
                this.onShowBusy();
                wait.always(this.onShowBusy.bind(this));
            }
        }
    });
});