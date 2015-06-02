# marionette-busy

A simple behavior to show a busy message to the user.

## Usage

Define a view as follows:
```js
var Marionette = require('marionette'),
    busy = require('marionette-busy');

return Marionette.ItemView.extend({
    behaviors: {
        busy: {behaviorClass: BusyBehavior},
    },
});

```
The template can now define 2 elements with class:

- _hide-while-busy: This element will be hidden during busy.
- _show-while-busy: This element will be shown during busy.

Make sure you add the following to your css file:

```css
.hide {
    display: none;
}

.show {
    display: block;
}
```

The behavior now hooks into the model and collection and shows a busy message when `before:read` is triggered and hides on `after:read`.

You can also manually trigger a busy message using `this.triggerMethod('show:busy')` and `this.triggerMethod('hide:busy')`.

## Options

```js
return Marionette.ItemView.extend({
    behaviors: {
        busy: {
            behaviorClass: BusyBehavior,
            showClassName: 'show',      // Shown elements will have this class.
            hideClassName: 'hide',      // Hidden elements will have this class.
            busyOnModel: true,          // Listen to this.model for before:read and after:read.
            busyOnCollection: true,     // Listen to this.collection for before:read and after:read.
            wait: null,                 // Hooks into promise to show busy message. This can also be defined on the view.
        },
    },
});