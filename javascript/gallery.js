define(['jquery'], function($) {

  var baseDir = './';
  var resources = [
    "abstract.gv",
    "alf.gv",
    "arr_none.gv",
    "arrows.gv",
    "awilliams.gv",
    "biological.gv",
    "clust.gv",
    "clust1.gv",
    "clust2.gv"
  ];

  return {
    actor_middleware: {
      load: function(req, event, next) {
        $.get("/"+baseDir+"gallery/actor_test.json" ).done(function(diagram) {
          req.source = diagram;
          next();
        });
      }
    },
    middleware: {
      load: function(req, event, next) {
        $.get("/"+baseDir+"gallery/actors_test.json" ).done(function(diagram) {
          req.source = diagram;
          req.document = {
            type: "fiddle",
            fork: baseDir+"gallery/actors_test.json"
          };
          next();
        });
      }
    },
    random: function() {
      return resources[Math.floor(Math.random() * resources.length)];
    },
    resources: resources
  }
});
