import Marionette from 'marionette';

export default Marionette.Behavior.extend({
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
    initialize() {
        if (this.shouldListenToModel()) {
            this.listenTo(this.view.getOption('model'), 'before:read', this.onShowBusy);
            this.listenTo(this.view.getOption('model'), 'after:read', this.onHideBusy);
        }

        if (this.shouldListenToCollection()) {
            this.listenTo(this.view.getOption('collection'), 'before:read', this.onShowBusy);
            this.listenTo(this.view.getOption('collection'), 'after:read', this.onHideBusy);
        }
    },
    shouldListenToModel() {
        return this.options.busyOnModel && this.view.getOption('model');
    },
    shouldListenToCollection() {
        return this.options.busyOnCollection && this.view.getOption('collection');
    },
    onShowBusy() {
        this.show(this.ui.showWhileBusy);
        this.hide(this.ui.hideWhileBusy);
    },
    onHideBusy() {
        this.hide(this.ui.showWhileBusy);
        this.show(this.ui.hideWhileBusy);
    },
    /**
     * Show $el if possible.
     */
    show($el) {
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
    hide($el) {
        if ($el.addClass) {
            $el.addClass(this.options.hideClassName);
        }

        if ($el.removeClass) {
            $el.removeClass(this.options.showClassName);
        }
    },
    onRender() {
        const wait = this.options.wait || Marionette.getOption(this.view, 'wait');

        this.onHideBusy();

        if (wait && wait.state && wait.state() === 'pending') {
            this.onShowBusy();
            wait.always(this.onHideBusy.bind(this));
        } else {
            // Show busy if a fetch has been triggered before the view was rendered.
            if (this.shouldListenToModel() && this.view.getOption('model').inSyncRead) {
                this.onShowBusy();
            }

            if (this.shouldListenToCollection() && this.view.getOption('collection').inSyncRead) {
                this.onShowBusy();
            }
        }
    },
});
