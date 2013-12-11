SomeCollection = new Meteor.Collection('some');

if (Meteor.isClient) {
  Template.hello.greeting = function () {
    return "Welcome to observeChangesOnRemoveAll.";
  };

  Template.hello.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
      var i;

      // set up observe changes
      SomeCollection.find().observeChanges({
          'removed' : function (id) {
              console.log('removed a doc!');
              console.log(id);
              console.log("--------\n\n");
          },
          'added' : function (id) {
              console.log('added a doc!');
              console.log(id);
              console.log("--------\n\n");
          }
      });

      for (i = 0; i < 20; i += 1) {
          // is being logged
          SomeCollection.insert({ 'foo' : 'bar' + ' ' + i });
      }

      // is being logged
      SomeCollection.insert(SomeCollection.findOne()._id);

      // is not being logged
      SomeCollection.remove({});

      // is empty though
      console.log(SomeCollection.find().fetch());
  });
}
