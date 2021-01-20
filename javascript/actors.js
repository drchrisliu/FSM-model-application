define(["ace/ace", "ace/lib/lang"],
    function (ace, lang) {

        var actors = ace.edit("actors");
        actors.setTheme("ace/theme/eclipse");
        actors.getSession().setMode("ace/mode/json");
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
            var result = actors.getValue();
            // if (true) { // TODO improve dot source checking
                if (callback) {
                    callback(result);
                }
            //     actors.getSession().clearAnnotations();
            // } else {
            //     var annotations = result.errors.map(function (e) {
            //         var c = actors.getSession().getDocument().indexToPosition(e.pos);
            //         c.text = [messages[e.type], " '", e.string, "'."].join('');
            //         c.type = "error";
            //         return c;
            //     });
            //     actors.getSession().setAnnotations(annotations);
            // }
            return result;
        });
        actors.on("change", function () {
            update.delay(600);
        });

        return {
            onChange: function(fn) {
                callback = fn;
                callback(actors.getValue());
            },
            contents: function(contents) {
                if (contents!==undefined) {
                    var pos = actors.getCursorPosition();
                    actors.setValue(contents, -1);
                    actors.moveCursorToPosition(pos);
                } else {
                    return actors.getValue();
                }
            },
            middleware: {
                source: function(req, event, next) {
                    req.source = actors.getValue();
                    next();
                }
            }
        }
    }
);
