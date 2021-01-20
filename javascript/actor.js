define(["ace/ace", "ace/lib/lang"],
    function (ace, lang) {

        var actor = ace.edit("actor");
        actor.setTheme("ace/theme/eclipse");
        actor.getSession().setMode("ace/mode/json");
        //var StatusBar = ace.require('ace/ext/statusbar').StatusBar;
        //new StatusBar(editor, document.getElementById('editor-bar'));

        var messages = {
            syntax: "Syntax error near",
            keyword: "Unknown keyword",
            attribute: "Unknown attribute",
            unterminated: "Unterminated structure starting"
        };

        var callback;

        var update = lang.delayedCall(function () {
            var result = actor.getValue();
            // if (true) { // TODO improve dot source checking
            if (callback) {
                callback(result);
            }
            //     actor.getSession().clearAnnotations();
            // } else {
            //     var annotations = result.errors.map(function (e) {
            //         var c = actor.getSession().getDocument().indexToPosition(e.pos);
            //         c.text = [messages[e.type], " '", e.string, "'."].join('');
            //         c.type = "error";
            //         return c;
            //     });
            //     actor.getSession().setAnnotations(annotations);
            // }
            return result;
        });
        actor.on("change", function () {
            update.delay(600);
        });

        return {
            onChange: function(fn) {
                callback = fn;
                callback(actor.getValue());
            },
            contents: function(contents) {
                if (contents!==undefined) {
                    var pos = actor.getCursorPosition();
                    actor.setValue(contents, -1);
                    actor.moveCursorToPosition(pos);
                } else {
                    return actor.getValue();
                }
            },
            middleware: {
                source: function(req, event, next) {
                    req.source = actor.getValue();
                    next();
                }
            }
        }
    }
);
