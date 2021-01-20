require([
	'editor',
	'actors',
	'actor',
	'jquery',
	'database',
	'renderer',
	'grapnel',
	'analytics',
	'gallery',
	'bootstrap',
	'visualizeHierarchicalCluster'
], function(editor, actors, actor, $, db, renderer, Grapnel, ga, gallery, bootstrap, visualizeHierarchicalCluster) {
	var bar = $('#editor-bar');
	var baseDir = './';
	var currentFSMs = '';
	var mergedDOT = '';
	var mergedFSM = '';
	var decomposedActors = '';
	var HSM_sortedNodes = [];
	var HSM = '';
	var currentFSMSObj = null;
	// create diagram screen
	var createFSMJSON = '';
	var createDOT = '';
	// visulize diagram screen
	var visualFSMJSON = '';
	var visualDOT = '';
	// merge diagram screen
	var mergeFSMJSON = '';
	var mergeDOT = '';
	// HFSM diagram screen
	var HSMJSON = '';
	var HSMDOT = '';

	var basicActorHTML =
		'                  <div class="card actorCard" name="actorCard" id="actorCard_1">  <div class="card-header" id="headingOne">\n' +
		'                <h2 class="mb-0">\n' +
		'                    <button type="button" class="btn btn-link actorNameLabel" data-toggle="collapse" data-target="#collapse_1">Actor 1</button>\n' +
		'                </h2>\n' +
		'            </div>\n' +
		'            <div id="collapse_1" class="collapse" aria-labelledby="headingOne" data-parent="#accordionActors">\n' +
		'                <div class="card-body">\n' +
		'                    <div class="accordion" id="accordionActor_1">\n' +
		'                        <div class="card">\n' +
		'                            <div class="input-group mb-3 input-group-sm">\n' +
		'                                <div class="input-group-prepend">\n' +
		'                                    <span class="input-group-text">Actor Name:</span>\n' +
		'                                </div>\n' +
		'                                <input type="text" name="actorName" id="actorName_1" value="Actor 1" class="actorName form-control">\n' +
		'                            </div>\n' +
		'                            <div class="card-header" id="heading_1_states">\n' +
		'                                <h2 class="mb-0">\n' +
		'                                    <button type="button" class="btn btn-link" data-toggle="collapse" data-target="#accordionActor_1_states"><span class="actorNameLabel">Actor 1</span> States\n' +
		'                                    </button>\n' +
		'                                </h2>\n' +
		'                            </div>\n' +
		'\n' +
		'                            <div id="accordionActor_1_states" class="collapse" aria-labelledby="heading_1_states" data-parent="#accordionActor_1">\n' +
		'                                <div class="card-body">\n' +
		'                                    <table class="states_table table order-list">\n' +
		'                                        <thead>\n' +
		'                                        <tr>\n' +
		'                                            <th>STATEID</th>\n' +
		'                                            <th>LABEL</th>\n' +
		'                                            <th>TYPE</th>\n' +
		'                                            <th>OUTPUT</th>\n' +
		'                                            <th>delete</th>\n' +
		'                                        </tr>\n' +
		'                                        </thead>\n' +
		'                                        <tbody>\n' +
		'                                        <tr>\n' +
		'                                            <td>\n' +
		'                                                <input type="text" name="id" class="form-control">\n' +
		'                                            </td>\n' +
		'                                            <td>\n' +
		'                                                <input type="text" name="label" class="form-control">\n' +
		'                                            </td>\n' +
		'                                            <td>\n' +
		'                                                <input type="text" name="type" class="form-control">\n' +
		'                                            </td>\n' +
		'                                            <td>\n' +
		'                                                <input type="text" name="output" class="form-control">\n' +
		'                                            </td>\n' +
		'                                            <td>\n' +
		'                                                <a class="deleteRow">Delete This Row</a>\n' +
		'\n' +
		'                                            </td>\n' +
		'\n' +
		'                                        </tr>\n' +
		'                                        </tbody>\n' +
		'                                        <tfoot>\n' +
		'                                        <tr>\n' +
		'                                            <td colspan="5" style="text-align: left;">\n' +
		'                                                <input type="button" class="btn btn-lg btn-block addStateRowButton" value="Add One State<">\n' +
		'                                            </td>\n' +
		'                                        </tr>\n' +
		'                                        <tr>\n' +
		'                                        </tr>\n' +
		'                                        </tfoot>\n' +
		'                                    </table>\n' +
		'                                </div>\n' +
		'                            </div>\n' +
		'                            <div class="card-header" id="heading_1_transitions">\n' +
		'                                <h2 class="mb-0">\n' +
		'                                    <button type="button" class="btn btn-link" data-toggle="collapse" data-target="#accordionActor_1_transitions"><span class="actorNameLabel">Actor 1</span> Transitions\n' +
		'                                    </button>\n' +
		'                                </h2>\n' +
		'                            </div>\n' +
		'                            <div id="accordionActor_1_transitions" class="collapse" aria-labelledby="heading_1_transitions" data-parent="#accordionActor_1">\n' +
		'                                <div class="card-body">\n' +
		'                                    <table class=" transitions_table table order-list">\n' +
		'                                        <thead>\n' +
		'                                        <tr>\n' +
		'                                            <th>FROM</th>\n' +
		'                                            <th>TO</th>\n' +
		'                                            <th>INPUT</th>\n' +
		'                                            <th>TYPE</th>\n' +
		'                                            <th>delete</th>\n' +
		'                                        </tr>\n' +
		'                                        </thead>\n' +
		'                                        <tbody>\n' +
		'                                        <tr>\n' +
		'                                            <td>\n' +
		'                                                <input type="text" name="from" class="form-control">\n' +
		'                                            </td>\n' +
		'                                            <td>\n' +
		'                                                <input type="text" name="to" class="form-control">\n' +
		'                                            </td>\n' +
		'                                            <td>\n' +
		'                                                <input type="text" name="input" class="form-control">\n' +
		'                                            </td>\n' +
		'                                            <td>\n' +
		'                                                <input type="text" name="type" class="form-control">\n' +
		'                                            </td>\n' +
		'                                            <th>\n' +
		'                                                <a class="deleteRow">Delete This Row</a>\n' +
		'\n' +
		'                                            </th>\n' +
		'                                        </tr>\n' +
		'                                        </tbody>\n' +
		'                                        <tfoot>\n' +
		'                                        <tr>\n' +
		'                                            <td colspan="5" style="text-align: left;">\n' +
		'                                                <input type="button" class="btn btn-lg btn-block addTransitionRowButton" value="Add One Transition">\n' +
		'                                            </td>\n' +
		'                                        </tr>\n' +
		'                                        <tr>\n' +
		'                                        </tr>\n' +
		'                                        </tfoot>\n' +
		'                                    </table>\n' +
		'                                </div>\n' +
		'                            </div>\n' +
		'                        </div>\n' +
		'                    </div>\n' +
		'                </div>\n' +
		'            </div></div>';

	renderer.init('#graph');
	renderer.errorHandler(function(error) {
		bar.text(error);
	});

	var attachEvents = function() {
		$('#fsmcreation').find('*').off();

		$('#fsmcreation input[type=text]').on('input', function() {
			let jsonString = generateCurrentFSMs();
			createFSMJSON = jsonString;
			actor.contents(jsonString);
		});

		$('.deleteRow').click(function(event) {
			let row = $(this).closest('tr'); //use this to get current row
			$(row).remove();
			let jsonString = generateCurrentFSMs();
			createFSMJSON = jsonString;
			actor.contents(jsonString);
			event.preventDefault();
		});

		$('.addStateRowButton').on('click', function(event) {
			$(this)
				.closest('table')
				.find('tbody')
				.append(
					'<tr>\n' +
						'                                            <td >\n' +
						'                                                <input type="text" name="id" class="form-control" />\n' +
						'                                            </td>\n' +
						'                                            <td >\n' +
						'                                                <input type="text" name="label"  class="form-control"/>\n' +
						'                                            </td>\n' +
						'                                            <td >\n' +
						'                                                <input type="text" name="type"  class="form-control"/>\n' +
						'                                            </td>\n' +
						'                                            <td >\n' +
						'                                                <input type="text" name="output"  class="form-control"/>\n' +
						'                                            </td>\n' +
						'                                            <td>\n' +
						'                                                <a class="deleteRow">Delete This Row</a>\n' +
						'\n' +
						'                                            </td>\n' +
						'\n' +
						'                                        </tr>'
				);
			attachEvents();
			event.preventDefault();
		});

		$('.addTransitionRowButton').on('click', function(event) {
			$(this)
				.closest('table')
				.find('tbody')
				.append(
					'<tr>\n' +
						'                                            <td>\n' +
						'                                                <input type="text" name="from" class="form-control" />\n' +
						'                                            </td>\n' +
						'                                            <td>\n' +
						'                                                <input type="text" name="to"  class="form-control"/>\n' +
						'                                            </td>\n' +
						'                                            <td>\n' +
						'                                                <input type="text" name="input"  class="form-control"/>\n' +
						'                                            </td>\n' +
						'                                            <td>\n' +
						'                                                <input type="text" name="type"  class="form-control"/>\n' +
						'                                            </td>\n' +
						'                                            <th>\n' +
						'                                                <a class="deleteRow">Delete This Row</a>\n' +
						'\n' +
						'                                            </th>\n' +
						'                                        </tr>'
				);
			attachEvents();
			event.preventDefault();
		});

	};

	var transformToDot = function(jsonTxt, mode) {
		let result = '';
		let dot = 'strict digraph G { \r\n node [shape=circle fixedsize=shape fontsize=8 width=1];\r\nrankdir=LR;\r\n';
		let states = [];
		let transitions = [];
		if (jsonTxt && jsonTxt.length > 0) {
			let obj = JSON.parse(jsonTxt);
			let results = obj['actorsFSM'];
			if (results && results.length > 0) {
				results.forEach(function(actor, index) {
					// console.log(actor['transitions'], transitions);
					let actorFullname = actor['actor'].replace(/ /g, '_');
					result = result + 'subgraph cluster_' + actorFullname + ' { label="' + actor['actor'] + '";\r\n';
					actor['transitions'].forEach(function(value, key) {
						// console.log(value['FROM'], value['TO']);
						if (value['FROM'] && value['TO'] && value['FROM'].length > 0 && value['TO'].length > 0) {
							result =
								result +
								actorFullname +
								'_' +
								value['FROM'] +
								' -> ' +
								actorFullname +
								'_' +
								value['TO'];

							result = result + '[';
							if (value['LABEL'] && value['LABEL'].length > 0) {
								result = result + 'label="' + value['LABEL'] + '"];';
							}
							if (value['TYPE'] == 'contingency') {
								result = result + 'style=dashed]';
							} else {
								result = result + 'style=solid]';
							}
							result = result + ';\r\n';
						}
					});
					transitions = transitions.concat(actor['transitions']);

					actor['states'].forEach(function(state, index) {
						if (state['STATEID'] && state['STATEID'].length > 0) {
							if (!state['LABEL'] || state['LABEL'].length == 0) state['LABEL'] = state['STATEID'];
							result = result + actorFullname + '_' + state['STATEID'] + '[';
							if (state['TYPE'] == 'contingency') {
								result = result + 'style=dashed,';
							} else {
								state['actors'] = [ actorFullname ];
								result = result + 'style=solid,';
							}
							result = result + 'label="' + state['LABEL'] + '"];\r\n';
						}
					});
					states = states.concat(actor['states']);
					result = result + '}\r\n';
				});
			}

			let uniqueActorID = [];
			states.slice().forEach(function(state, index) {
				let actorName = '';
				if (state['actors'] && state['actors'][0]) {
					actorName = state['actors'][0];
				}
				if (actorName.length && actorName.length > 0) {
					if (uniqueActorID.indexOf(state['STATEID']) == -1) {
						uniqueActorID.push(state['STATEID']);
					} else {
						states.map((s) => {
							if (state['STATEID'] == s['STATEID']) {
								if (s['actors'].indexOf(actorName) == -1) {
									s['actors'].push(actorName);
								}
							}
						});
					}
				}
			});
		}

		if (mode == 'merge') {
			mergedFSM = { actorsFSM: [] };
			let fsmObj = {};
			fsmObj['actor'] = 'mergedFSM';

			let mergedTrans = transitions.filter((t) => {
				return t['TYPE'] != 'contingency';
			});
			let mergedTransitions = mergedTrans.filter(
				(mt, index, self) => index === self.findIndex((t) => t['FROM'] === mt['FROM'] && t['TO'] === mt['TO'])
			);
			let mergedS = states.filter((t) => {
				return t['TYPE'] != 'contingency';
			});
			let mergedStates = mergedS.filter(
				(mt, index, self) => index === self.findIndex((t) => t['STATEID'] === mt['STATEID'])
			);

			fsmObj['states'] = mergedStates;
			fsmObj['transitions'] = mergedTransitions;
			mergedFSM['actorsFSM'].push(fsmObj);

			result = result + 'subgraph cluster_merged { label="merged actor model";\r\n';
			mergedDOT =
				'strict digraph G { \r\n node [shape=circle fixedsize=shape fontsize=8 width=1];\r\nrankdir=LR;\r\n';
			// console.log('mergedStates', mergedStates)
			mergedStates.forEach(function(state, index) {
				if (state['STATEID'] && state['STATEID'].length > 0) {
					if (!state['LABEL'] || state['LABEL'].length == 0) state['LABEL'] = state['STATEID'];
					result = result + 'merged_' + state['STATEID'] + '[';
					mergedDOT = mergedDOT + 'merged_' + state['STATEID'] + '[';
					result = result + 'label="' + state['LABEL'] + '"];\r\n';
					mergedDOT = mergedDOT + 'label="' + state['LABEL'] + '"];\r\n';
				}
			});
			mergedTransitions.forEach(function(value, key) {
				result = result + 'merged_' + value['FROM'] + ' -> ' + 'merged_' + value['TO'];
				mergedDOT = mergedDOT + 'merged_' + value['FROM'] + ' -> ' + 'merged_' + value['TO'];

				result = result + ';\r\n';
				mergedDOT = mergedDOT + ';\r\n';
			});
			result = result + '}\r\n';
			mergedDOT = mergedDOT + '}\r\n';
		}

		// result = JSON.stringify(result);
		dot = dot + result + '}';
		// console.log(dot);
		return dot;
	};

	actors.onChange(function(value) {
		// renderer.render(value)
		var newtext = transformToDot(value, 'merge');
		// console.log("mergedFSM", JSON.stringify(mergedFSM, null, 4));
		mergeFSMJSON = newtext;
		editor.contents(newtext);
	});

	var generateHTML = function(jsonTxt) {
		if (jsonTxt && jsonTxt.length > 0) {
			$('#accordionActors').html('');
			let obj = JSON.parse(jsonTxt);
			let results = obj['actorsFSM'];
			results.forEach(function(actor, index) {
				let tempHtml = basicActorHTML.replace(/Actor 1/g, actor['actor'].replace(/ /g, '_'));
				tempHtml = tempHtml.replace(/_1/g, '_' + index);
				$('#accordionActors').append(tempHtml);
				let actorHTML = $('.actorCard:last');
				let transTable = actorHTML.find('.transitions_table tbody');
				let stateTable = actorHTML.find('.states_table tbody');
				// console.log("trans table:", $(transTable).html());

				$(transTable).empty();
				$(stateTable).empty();

				actor['transitions'].forEach(function(trans, key) {
					let appendText =
						'<tr>\n' +
						'                                            <td>\n' +
						'                                                <input type="text" name="from" value="' +
						trans['FROM'] +
						'" class="form-control" />\n' +
						'                                            </td>\n' +
						'                                            <td>\n' +
						'                                                <input type="text" name="to"  value="' +
						trans['TO'] +
						'" class="form-control"/>\n' +
						'                                            </td>\n' +
						'                                            <td>\n' +
						'                                                <input type="text" name="input"  value="' +
						trans['INPUT'] +
						'" class="form-control"/>\n' +
						'                                            </td>\n' +
						'                                            <td>\n' +
						'                                                <input type="text" name="type"  value="' +
						trans['TYPE'] +
						'" class="form-control"/>\n' +
						'                                            </td>\n' +
						'                                            <th>\n' +
						'                                                <a class="deleteRow">Delete This Row</a>\n' +
						'\n' +
						'                                            </th>\n' +
						'                                        </tr>';
					// console.log("add one transiton:", $(transTable).html());
					$(transTable).append($(appendText));
				});

				actor['states'].forEach(function(state, index) {
					let temText =
						'<tr>\n' +
						'                                            <td >\n' +
						'                                                <input type="text" name="id" value="' +
						state['STATEID'] +
						'" class="form-control" />\n' +
						'                                            </td>\n' +
						'                                            <td >\n' +
						'                                                <input type="text" name="label"  value="' +
						state['LABEL'] +
						'" class="form-control"/>\n' +
						'                                            </td>\n' +
						'                                            <td >\n' +
						'                                                <input type="text" name="type"  value="' +
						state['TYPE'] +
						'" class="form-control"/>\n' +
						'                                            </td>\n' +
						'                                            <td >\n' +
						'                                                <input type="text" name="output"  value="' +
						state['OUTPUT'] +
						'" class="form-control"/>\n' +
						'                                            </td>\n' +
						'                                            <td>\n' +
						'                                                <a class="deleteRow">Delete This Row</a>\n' +
						'\n' +
						'                                            </td>\n' +
						'\n' +
						'                                        </tr>';
					// console.log("add one state:", temText);

					$(stateTable).append($(temText));
				});
			});
			attachEvents();
		}
	};

	actor.onChange(function(value) {
		// renderer.render(value)
		currentFSMs = value;
		let newtext = transformToDot(value, 'diagram');
		createDOT = newtext;
		editor.contents(newtext);
		generateHTML(value);
	});

	var generateCurrentFSMs = function() {
		let result = { actorsFSM: [] };

		let actorsFSM = $(document).find('.actorCard');

		for (let i = 0; i < actorsFSM.length; i++) {
			let actor = actorsFSM[i];
			let actorObj = {};
			let actorName = $(actor).find('input[id^="actorName_"]');
			actorObj['actor'] = $(actorName).val();
			let actorNameLabel = $(actor).find('.actorNameLabel');
			$(actorNameLabel).text(actorObj['actor']);
			let transTable = $(actor).find('.transitions_table');
			let jsonTransTable = new JSONTable($(transTable));
			actorObj['transitions'] = jsonTransTable.toJSON();
			let stateTable = $(actor).find('.states_table');

			let jsonStatesTable = new JSONTable($(stateTable));
			actorObj['states'] = jsonStatesTable.toJSON();
			result['actorsFSM'].push(actorObj);
		}
		currentFSMSObj = result;
		let jsonString = JSON.stringify(result, null, 4);
		currentFSMs = jsonString;
		return jsonString;
	};

	editor.onChange(function(value) {
		renderer.render(value);
		bar.text('Generating FSM.');
	});

	var transitions = {
		new: 'Save',
		home: 'Save',
		fiddle: 'Update',
		gallery: 'Fork'
	};

	var middleware = {
		image: function(req, event, next) {
			var img = renderer.stage.getImage(false);
			img.onload = function() {
				req.image = img.src;
				next();
			};
		}
	};

	gallery.resources.forEach(function(e) {
		$('#examples select').append('<option>' + e + '</option>');
	});

	$('#actorsFSM').click(function(event) {
		$('#actors').hide();
		$('#actor').show();
		$('#graph').show();
		$('#fsmcreation').hide();
		$('#merged_actor').hide();
		$('#smartcontractdiv').hide();
		$('#merged_FSM').hide();
		$('#editor').show();
		$('#cluster_d3_graph').hide();
		$('#cluster_graph').hide();
		if (createFSMJSON && createFSMJSON.indexOf('actorsFSM') > -1) {
			actor.contents(createFSMJSON);
		} else {
			$.get('/' + baseDir + 'gallery/ecommerce.json').done(function(diagram) {
				createFSMJSON = JSON.stringify(diagram, null, 4);
				actor.contents(createFSMJSON);
			});
		}
		event.preventDefault();
	});

	$('#actorsMerge').click(function(event) {
		$('#actors').show();
		$('#actor').hide();
		$('#graph').show();
		$('#fsmcreation').hide();
		$('#merged_actor').hide();
		$('#smartcontractdiv').hide();
		$('#merged_FSM').hide();
		$('#editor').show();
		$('#cluster_d3_graph').hide();
		$('#cluster_graph').hide();
		if (createFSMJSON && createFSMJSON.indexOf('actorsFSM') > -1) {
			actors.contents(createFSMJSON);
		} else {
			$.get('/' + baseDir + 'gallery/ecommerce.json').done(function(diagram) {
				console.log(diagram);
				mergeFSMJSON = JSON.stringify(diagram, null, 4);
				createFSMJSON = mergeFSMJSON;
				actors.contents(mergeFSMJSON);
			});
		}
		event.preventDefault();
	});

	$('#createFSM').click(function(event) {
		$('#actors').hide();
		$('#actor').show();
		$('#graph').hide();
		$('#fsmcreation').show();
		$('#merged_actor').hide();
		$('#smartcontractdiv').hide();
		$('#merged_FSM').hide();
		$('#editor').show();
		$('#cluster_d3_graph').hide();
		$('#cluster_graph').hide();
		// $.get("/"+baseDir+"gallery/actors_test.json" ).done(function(diagram) {
		//     console.log(diagram);
		//     actors.contents(JSON.stringify(diagram,  null, 4));
		// });
		// actor.contents();
		generateHTML(actor.contents());
		event.preventDefault();
	});

	var getAllComplexNodes = function() {
		let complexNode = [];

		if (
			mergedFSM &&
			mergedFSM['actorsFSM'] &&
			mergedFSM['actorsFSM'].length > 0 &&
			mergedFSM['actorsFSM'][0]['transitions'].length > 0
		) {
			//do nothing
		} else {
			if (createFSMJSON && createFSMJSON.indexOf('actorsFSM') > -1) {
				transformToDot(createFSMJSON, 'merge');
			} else {
				$.get('/' + baseDir + 'gallery/ecommerce.json').done(function(diagram) {
					console.log(diagram);
					mergeFSMJSON = JSON.stringify(diagram, null, 4);
					createFSMJSON = mergeFSMJSON;
					transformToDot(createFSMJSON, 'merge');
				});
			}
		}
		HSMJSON = Object.assign({}, mergedFSM);
		// HSMJSON = Object.assign({}, mergedFSM);

		if (HSMJSON['actorsFSM'].length > 0) {
			let actor = HSMJSON['actorsFSM'][0];
			let transitions = actor['transitions'];
			transitions.forEach(function(t, index) {
				let from = t['FROM'];
				let to = t['TO'];
				let from_obj = actor['states'].find((f) => f['STATEID'] == from);
				let to_obj = actor['states'].find((t) => t['STATEID'] == to);
				if (to_obj) {
					if (!to_obj['FROMEDGES']) to_obj['FROMEDGES'] = [ from ];
					else {
						if (to_obj['FROMEDGES'].indexOf(from) === -1) {
							to_obj['FROMEDGES'].push(from);
						}
					}
				}
				if (from_obj) {
					if (!from_obj['TOEDGES']) from_obj['TOEDGES'] = [ to ];
					else {
						if (from_obj['TOEDGES'].indexOf(to) === -1) {
							from_obj['TOEDGES'].push(to);
						}
					}
				}
			});
			let states = actor['states'];
			let states_sorted = [];
			states.forEach(function(s, index) {
				//if it is state node or end node
				if (!s['FROMEDGES'] || s['FROMEDGES'].length == 0) {
					s['LEVEL'] = 0;
					states_sorted.push(s);
				}
			});

			while (states_sorted.length < states.length) {
				let difference = states.filter((x) => {
					let tem = states_sorted.filter((y) => x['STATEID'] == y['STATEID']);
					return !tem || tem.length < 1;
				});
				let lastLevel = 0;
				if (states_sorted[states_sorted.length - 1]) {
					lastLevel = states_sorted[states_sorted.length - 1]['LEVEL'];
				}
				let lastLevelStates = states_sorted.filter((x) => x['LEVEL'] == lastLevel);
				if (lastLevelStates && lastLevelStates.length > 0) {
					lastLevelStates.forEach(function(s, index) {
						if (s['TOEDGES'] && s['TOEDGES'].length > 0) {
							let nextLevalStates = difference.filter((x) => s['TOEDGES'].includes(x['STATEID']));
							nextLevalStates = nextLevalStates.filter((x) => {
								let tem = states_sorted.filter((y) => x['STATEID'] == y['STATEID']);
								return !tem || tem.length < 1;
							});
							nextLevalStates.map((n) => (n['LEVEL'] = lastLevel + 1));
							states_sorted = states_sorted.concat(nextLevalStates);
						}
					});
				}
			}
			HSM_sortedNodes = states_sorted;
			states = states_sorted;
			actor['states'] = states_sorted;
			states.forEach(function(s, index) {
				//if it is state node or end node
				if (!s['FROMEDGES'] || s['FROMEDGES'].length == 0 || !s['TOEDGES'] || s['TOEDGES'].length == 0) {
					complexNode.push(s);
				} else if (s['FROMEDGES'].length > 1 || s['TOEDGES'].length > 1) {
					// if it have more than 1 income or outgoing edges
					complexNode.push(s);
				}
			});
		} else throw new Error('merged FSM is null');
		return complexNode;
	};

	var findAllSubsets = function(nodesArr) {
		let result = [];
		for (i = 0; i < nodesArr.length; i++) {
			for (j = i; j < nodesArr.length; j++) {
				result.push([ nodesArr[i], nodesArr[j] ]);
			}
		}
		return result;
	};

	var isSquence = function(jsonTxt) {
		let result = '';

		return result;
	};

	var isMoutN = function(jsonTxt) {
		let result = '';

		return result;
	};

	let nodeTravserString = '';
	var nodeTravser = function(node, endnode, str) {
		let suffix =''
		if(str) suffix = str;
		if (node['STATEID'] == endnode['STATEID']) {
			return;
		}
		let result = '';
		result = result + node['STATEID'] + suffix+'[';
		result = result + 'label="' + node['LABEL'] + '"];\r\n';
		let nextNodes = node['TOEDGES'];

		if (nextNodes && nextNodes.length > 0) {
			nextNodes.forEach(function(nextnode) {
				
				nextnode = HSM_sortedNodes.filter((s) => s['STATEID'] == nextnode)[0];
				result = result + node['STATEID'] +suffix+ ' -> ' + nextnode['STATEID'] + suffix+';\r\n';
				nodeTravserString = nodeTravserString + result;
				nodeTravser(nextnode, endnode, suffix);
				
			});
		}
		

		
	};

	var findAllSimpleSubgraph = function(allSubsets) {
		let results = [];
		let index = 1;
		let suffix = '_single_view'
		allSubsets.forEach(function(subset) {
			suffix =  '_single_view_S'+index 
			if (subset[0]['STATEID'] != subset[1]['STATEID']) {
				let result =
					'subgraph cluster_S' + index + ' { \r\nmargin=10;label="S' + index + '";\r\nstyle=dashed;\r\n';
				let endnodeid = HSM_sortedNodes.filter((s) => s['STATEID'] == subset[1]['STATEID'])[0];
				nodeTravserString = endnodeid['STATEID'] +suffix+ '[';
				nodeTravserString = nodeTravserString + 'label="' + endnodeid['LABEL'] + '"];\r\n';
				nodeTravser(subset[0], subset[1], suffix);

				// console.log('get one subgraph dot:', subset[0]['STATEID'], subset[1]['STATEID'], nodeTravserString);
				result = result + nodeTravserString;

				result += '}\r\n';

				// result +=
				// let result = 
				// 	'subgraph cluster_S' + index + suffix+' { \r\nmargin=10;label="S' + index + '";\r\nstyle=dashed;\r\n';
				// nodeTravserString = endnodeid['STATEID'] +suffix+ '[';
				// nodeTravserString = nodeTravserString + 'label="' + endnodeid['LABEL'] + '"];\r\n';
				// nodeTravser(subset[0], subset[1], suffix);

				// // console.log('get one subgraph dot:', subset[0]['STATEID'], subset[1]['STATEID'], nodeTravserString);
				// result += result + nodeTravserString;

				// result += '}\r\n';

				index++;
				results.push(result);
			}
		});

		return results;
	};

	var drawHFM = function(simpleSubgraphs) {
		let result =
			'strict digraph G {\r\n node [shape=circle fixedsize=shape fontsize=8 width=1];\r\nrankdir=LR;\r\n';
		result += simpleSubgraphs.reverse().join('\r\n');
		result += '}';
		HSMDOT = result;
		editor.contents(result);
	};

	
	$('#transformHSM').click(function(event) {
		$('#actors').hide();
		$('#actor').hide();
		$('#graph').show();
		$('#fsmcreation').hide();
		$('#merged_actor').show();
		$('#smartcontractdiv').hide();
		$('#merged_FSM').hide();
		$('#editor').show();
		$('#cluster_d3_graph').hide();
		$('#cluster_graph').hide();
		// $.get("/"+baseDir+"gallery/actors_test.json" ).done(function(diagram) {
		//     console.log(diagram);
		//     actors.contents(JSON.stringify(diagram,  null, 4));
		// });
		// actor.contents();
		// generateHTML(actor.contents());
		let complexNodes = getAllComplexNodes();
		// console.log(JSON.stringify(complexNodes));
		let allSubsets = findAllSubsets(complexNodes);
		// console.log(JSON.stringify(allSubsets));
		let simpleSubgraphs = findAllSimpleSubgraph(allSubsets);
		drawHFM(simpleSubgraphs);
		$('#merged_actor #mergedFSM').text(JSON.stringify(HSMJSON, null, 4));
		// editor.contents(mergedDOT);
		event.preventDefault();
	});

	$(document).ready(function() {
		attachEvents();
		$('#actorsFSM').click();
	});

	var router = new Grapnel();
	router
		.add('/', function() {
			editor.contents('strict digraph G {\n  ex -> am -> ple\n}');
		})
		.add('/new', function() {
			editor.contents('strict digraph G {\n\t\n}');
		})
		.add(
			'/save',
			middleware.image,
			editor.middleware.source,
			db.middleware.save,
			db.middleware.update,
			db.middleware.image,
			function(req) {
				router.navigate('/' + req.params.fiddle);
			}
		)
		.add('/fork', editor.middleware.source, db.middleware.save, db.middleware.update, function(req) {
			router.navigate('/' + req.params.fiddle);
		})
		.add('/update', middleware.image, editor.middleware.source, db.middleware.update, db.middleware.image, function(
			req
		) {
			router.navigate('/' + [ req.params.fiddle, req.params.attachment ].join('/'));
		})
		.add('/gallery', function() {
			router.navigate('/gallery/ecommerce.json');
		})
		.add('/gallery/:gallery', gallery.middleware.load, function(req) {
			// document = req.document;
			//   console.log(req.source);
			// actors.contents(JSON.stringify(req.source,  null, 4));
		})
		.add('/:fiddle([a-zA-Z]{8})/:attachment?', db.middleware.load, db.middleware.source, function(req) {
			document = req.document;
			editor.contents(req.source);
		})
		.add('*', function(req, e) {
			if (!e.parent()) {
				router.navigate('/gallery');
			} else {
				var clazz =
					e.previousState.req.keys.length > 0
						? e.previousState.req.keys[0].name
						: e.previousState.route.replace('/', '');
				clazz = clazz || 'home';
				$('body').removeClass().addClass(clazz);
				var state = transitions[clazz];
				if (state != undefined) {
					$('#button').attr('href', '#/' + state.toLowerCase());
					$('#button span').text(state + ' diagram');
				}
				ga('send', 'pageview', e.value);
				e.stopPropagation();
			}
		});
	//
	// $('#examples select').on('keydown change', function () {
	//   var example = this.value;
	//   setTimeout(function () {
	//     router.navigate("/gallery/" + example);
	//   }, 50);
	// });
});
