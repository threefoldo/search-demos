FlowRouter.route('/', {
    name: "home",
    action: function(path, params) {
        if (params.genre) {
            // console.log(params.genre);
            Session.set('genre', params.genre);
        }
    }
});

Template.content.rendered = function() {
    // initialize mobile-menu
    $('#mmenu').mmenu({
        classes: "mm-white",
        header: true,
        buttonbar: "Buttonbar",
        counters: true,
        offCanvas: {
            position: "left",
            zposition: "front"
        },
        onClick: {
            blockUI: false,
            close: true,
            preventDefault: false,
            setSelected: true
        }
    });
};

Template.content.helpers({
    items: function() {
        // get all records, group by type
        var groups = _.groupBy(Movies.find({}, {
            fields: {type: true, genre: true}
        }).fetch(), function(r) {
            return r.type;
        });
        // reduce
        var result = [];
        _.map(_.keys(groups), function(key) {
            var r = _.reduce(groups[key], function(r1, r2) {
                return {
                    type: r1.type,
                    genre: _.union(r1.genre, r2.genre)
                };
            });
            if (r.type.length > 0) {
                r.genre = r.genre.sort();
                result.push(r);
            }
        });
        return result;
    }
});
