# RiotComponent
The library helps make RiotJS elements components.

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url]

# Introduction
RiotComponent adds methods, properties or events to the root element so that it can be accessed from the outside. **Methods** allow the parent element to call functions in the child elements. **Properties** expose settable values of the child elements to the parent. When set the child will be notified so that appropirate actions (such as update) can be done. **Events** will allows the child elements to notify the parent element when something happened.

Plus! In the line of the minimalist approach of RiotJs, the RiotComponent is sized less than 1K!

NOTE: Those from v0.0.X see the "Migration to v0.1.X" below.

# How to use
First you need to include the library to your page. See below for CDN or NPM options.

## Make a component
Calling `riotComponent.makeComponent(this)`, where `this` is the tag instance will return the component.

    <script type="riot/tag">
      <count-down>
        <span>{label}</span><span>{count}</span>
    
        var self = riotComponent.makeComponent(this)
        ....

Once this is done you can start adding methods, events and properties.

## Method
Methods allow the parent element to call functions in the child elements. After the element is made a component. You can add a method to it like this:

	... // More code here
        self._method('restart', function() { ... })
	... // More code there

then from the outside, the method can be called like this ...

      document.getElementById(...).restart()

Parameters can be passed to the method just like other functions.

If you attach reference to the element, you can also use its referece.

      <count-down ref='cd1' ></count-down>

and use it like this ..

      self.refs.cd1.restart()

## Property
Properties expose settable values of the child elements to the parent. When set the child will be notify so that appropirate actions (such as update) can be done. Let say you need to allow the label value to be set, you can do this:

        self._property('label', function(newLabel, storeValue) {
          storeValue() // This function will update the underline value with the newLabel.
          self.update()
        })

So when the label property got set from the outside, you will get the element updated.

      document.getElementById(...).label = 'New Label'

Preprocessing of the value is also allowed.

        self._property('label', function(newLabel, storeValue) {
          storeValue(newLabel || self.DEFAULT_VALUE) // If the newLabel is null or undefined, store the default value.
          self.update()
        })

Similar to methods, you can access to the comment with `ref`.


Properties also allows you to attach `get` function that post process your value. For example:

        self._property('label',
        function(newLebel, updateValue) { // SetCallBack
          updateValue()
          self.update()
        }, function function(underlineValue) {  // GetCallBack
          if (!underlineValue)  // If the underline value is never set, return the default.
            return self.DEFAULT_LABEL
          return underlineValue
        })

## Event
Events allow the child elements to notify the parent element when something happened. Let say we want to notify the parent when the count down have reached zero. We can add the zero event to the element.

        var onzero = self._event('zero')
	...
	... // Every second
	    self.count--
	    if (self.count == 0) {
        onzero()	// trigger the event
        clearTimeout(timer)
      }

The parent can listen to the event like this:

      document.getElementById(...).on('zero', function() {
      ... do things when zero ...

We can also make an onXXX options as listener as well.

        var onzero = self._event('zero', opts.onzero)
	...

and it can be used like this:

    <count-down id='count' onzero='{handleZero}'></count-down>
    ...
    function handleZero() {
        ...
    }

Parameters can be passed on when the event is trigged as usual.

## Example
    <count-down id='count' label='Count: ' start=5></count-down>

    <script type="riot/tag">
      <count-down>
        <span>{label}</span><span>{count}</span>
    
        var self = riotComponent.makeComponent(this)
        self.label = opts.label
        self.count = opts.start
    
        self._method('restart', function() {
          self.count = opts.start
          self.update()
          startTimer()
        })
        
        self._property('label', function(newLebel, storeValue) {
          storeValue()
          self.update()
        })
        
        var onzero = self._event('zero')
        startTimer()
        
        function startTimer() {
          var timer = setInterval(function() {
            self.count--
            self.update()
            if (self.count == 0) {
              onzero()
              clearTimeout(timer)
            }
          }, 1000)
        }
      </count-down>
    </script>

    <script>
      riot.mount('*')
  
      var count = document.getElementById('count')
      count.on('zero', function() {
        alert('It is ZERO!')
        count.label = prompt('Enter new label (or "STOP at " to stop the timer): ', "STOP at ")
        if (!(count.label === 'STOP at ')) {
          count.restart()
        }
    })
    </script>


At the bottom of the above example, you can see that we can listen to the event `zero`, change the value of the `label` options (and have it trigger the update) and call a method `restart()` all directly on the `count` element. It is much more convenient and intuitive to do this than using observable bus as commonly recommended.

## DEMO
Try the aboce out here [Live demo on jsFiddle](https://jsfiddle.net/xxu9ae03/1/ "Live demo on jsFiddle!")

## NPM
    npm install riotcomponent

## CDN
### Non-Minified
https://cdn.rawgit.com/NawaMan/RiotComponent/master/riotcomponent.js
### Minified
https://cdn.rawgit.com/NawaMan/RiotComponent/master/riotcomponent.min.js

## Dependency
This library only require `riot`.


## Migrate from v0.0.X to v0.1.X
In v0.1.0, the tag itself also become a component. This cause a problem to properties declared in v0.0.10 as the value will be update as a field in the tag. To solve this, the value was hidden in field called '_propsValues' but this is an implementation details we do not want to expose so we pass on a function to update the value to the setCallBack instead.

So what was previously 

        self._property('label', function(newLebel) {
          self.label = newLabel   // This will cause stackoverflow.
          self.update()
        })

has now become.

        self._property('label', function(newLebel, storeValue) {
          storeValue()
          self.update()
        })

This also provide flexibility to the setCallBack because the new value can be preprocessed before store.

        self._property('label', function(newLebel, storeValue) {
          var preprocessNewLabel = ... preprocessing newLabel ...
          storeValue(preprocessNewLabel)
          self.update()
        })
	
[npm-url]: https://npmjs.org/package/riotcomponent
[downloads-image]: http://img.shields.io/npm/dm/riotcomponent.svg
[npm-image]: http://img.shields.io/npm/v/riotcomponent.svg
[travis-url]: https://travis-ci.org/jmblog/riotcomponent
[travis-image]: http://img.shields.io/travis/jmblog/riotcomponent.svg
