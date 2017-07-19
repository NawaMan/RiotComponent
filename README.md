# RiotComponent
The library to make it easy to make riotjs component.

# Introduction
RiotComponent adds method, property or event to the root element so that it can be accessed from the outside.

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
        
        self._property('label', function(newLebel) {
          self.label = newLebel
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

At the bottom of the aboce example, you can see that we can listen to the event `zero`, change the value of the `label` options (and have it trigger the update) and call a method `restart()` all directly on the `count` element. It is much more convenient and intuitive to do this than using observable bus as commonly recommended.

Try the aboce out here [Live demo on jsFiddle](https://jsfiddle.net/jcdxdrpk/18/ "Live demo on jsFiddle!")

## CDN
### Non-Minified
https://cdn.gitcdn.link/repo/NawaMan/RiotComponent/master/riotcomponent.js
### Minified
https://cdn.gitcdn.link/repo/NawaMan/RiotComponent/master/riotcomponent.min.js

## Dependency
This library only require `riot`.
