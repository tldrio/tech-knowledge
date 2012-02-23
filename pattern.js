/*
 * The first part comes from the book Essential JS Design Patterns
 */



/*
 * The Module Pattern
 */

//Module Patter Boilerplate

var myNameSpace = (function() {
    var myPrivateVar = 0;
    var myPrivateMethod = function(someText) {
        log.info(someText);
    };

    return {
      myPublicVar: 'foo',
      myPublicFunction: function(bar) {
          myPrivateVar++;
          myPrivateMethod(bar);
      }
    };
}());

// Exemple of Module Pattern
var testModule = (function() {
    var counter = 0;
    return {
      incrementCounter: function() {
          return counter++;
      },
      resetCounter: function() {
        log.debug('counter value prior to reset: ' + counter);
        counter = 0;
      },
    }; 
}());

testModule.incrementCounter();
testModule.incrementCounter();
testModule.incrementCounter();
testModule.resetCounter();


//Final Module Pattern

var someModule = (function() {
  var privateVar = 5;
  var privateMethod = function() {
    return 'Private Test';
  };

  return {
    publicVar: 10,
    publicMethod: function() {
      return ' Followed by Public Test ';
    },
    getData: function() {
      return privateMethod() + this.publicMethod() + privateVar;
    },
  };
}());

var someText = someModule.getData();
log.warn(someText);

// Revealing Module Pattern = Advanced Module Pattern

var myRevealingModule = (function() {
  var name = 'John Smith';
  var age = 40;

  function updatePerson () {
    name = 'John Smith Update';
  }
  function setPerson (person) {
    name = person;
  }
  function getPerson () {
    return name;
  }

  return {
    set: setPerson,
    get: getPerson,
  };
}());

var textReveal = myRevealingModule.get();
log.debug(textReveal);
myRevealingModule.set('Charles');
textReveal = myRevealingModule.get();
log.info(textReveal);

/*
 * THe Observer Pattern
 */




/*
 * Whats follows comes from the book Javascript patterns
 */


/*
 * Namespacing function
 * We can create MYAPP.modules.modules2 via
 * var modules2 = MYAPP.namespace('MYAPP.modules.modules2');
 * The advanced version of Namespacing is the Sandbox pattern
 * detailed after
 */

 // Global namespace object is usually in CAPS
var MYAPP = MYAPP || {};

MYAPP.namespace = function(ns_string) {
  var parts = ns_string.split('.'),
      parent = MYAPP,
      i;

  if(parts[0] === "MYAPP"){
    parts = parts.slice(1);
  }

  for (i = 0; i < parts.length; i += 1) {
      if(typeof parent[parts[i]] === "undefined") {
        parent[parts[i]] = {};
      }
      parent = parent[parts[i]];
  }
  return parent;
};


/*
 * Creating an object with private data
 */

// But be careful because here getSpecs returns a pointer to specs so
// it can be modified after retrieving it
// That's why it's better to return a deep copy or to split the method
// to return only the neccessary info : dimension, etc ...

function Gadget () {
    
  var specs = {
    width: 200,
    height: 100,
    color: 'blue',
  };

  this.getSpecs = function() {
    return specs;
  };
}

// We can use the prototype property to avoid the creation of any
// member added with this in the constructor. With property the common
// parts are shared among all the instances created with the same constructor



Gadget.prototype = (function() {
  var brand = 'Auchan';

  return {
    getBrand: function() {
      return brand;
    }
  };
}());

var toy = new Gadget();
log.info(toy.getSpecs());
log.info(toy.getBrand());

// Here we create an object with a private static property

var Tool = (function() {
  // static variable
  var counter = 0,
      NewTool;

  // This is the returned constructor
  NewTool = function() {
    counter += 1;
  };

  // a privileged method
  NewTool.prototype.getLastId = function() {
      return counter;
  };

  return NewTool;

}());

var hammer = new Tool();
log.info(hammer.getLastId());
var saw = new Tool();
log.info(saw.getLastId());

/*
 * Sandbox Pattern
 */

// Adresses the drawbacks of the namespacing pattern like reliance on a single global variable
// and long, dotted names to type
// Using the sandbox will look like this :
// new Sandbox(function(box) { //code here });
//


function Sandbox () {
  //turn arguments into an array
  var args = Array.prototype.slice.call(arguments),
      //last argument is  the callback
      callback = args.pop(),
      //modules can be passed as an array or as individual parameters
      modules = (args[0] && typeof args[0] === "string") ? args : args[0],
      i;

  //make sure the function is called as a constructor
  //This pattern avoid having calling new
    if(!(this instanceof Sandbox)){
      return new Sandbox(modules, callback);
    }

    //add properties to this as needed
    this.a = 1;
    this.b = 2;

    //now add modules to the core `this` object
    //no modules or `*` both mean `use all modules`
    if(!modules || modules === '*') {
      modules = [];
      for (i in Sandbox.modules) {
        if (Sandbox.modules.hasOwnProperty(i)) {
          modules.push(i);
        }
      }
    }

    // initialize required modules

    for ( i = 0; i < modules.length; i += 1) {
        Sandbox.modules[modules[i]](this);
    }

    //call the callback
    callback(this);
}

Sandbox.prototype = {
  name: "My application",
  version: "1.0",
  getName: function() {
    return this.name;
  }
};

//Add modules

Sandbox.modules = {};
Sandbox.modules.dom = function(box) {
  box.getElement = function(){};
  box.getStyle = function(){};
  box.foo = 'bar';
};
Sandbox.modules.event = function(box) {
  box.attachEvent = function(){
    log.info('attaching event');
  };
  box.detachEvent = function(){};
};

// Use the sandbox

Sandbox('dom', 'event', function (box) {
  //code with dom and event here
  log.info(box.foo);
  box.attachEvent();
});



