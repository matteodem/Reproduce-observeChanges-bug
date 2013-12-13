SomeCollection = new Meteor.Collection('some');
FakeESIndex = new Meteor.Collection('index');

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
              FakeESIndex.remove(id);
          },
          'added' : function (id, doc) {
              FakeESIndex.insert(id, doc);
          }
      });

      for (i = 0; i < 20; i += 1) {
          SomeCollection.insert({ 'foo' : 'bar' + ' ' + i });
      }

      SomeCollection.insert(SomeCollection.findOne()._id);

      SomeCollection.remove({});

      // The real replication of both collections
      console.log(SomeCollection.find().fetch());
      console.log(FakeESIndex.find().fetch());
  });
}
