FlowRouter.route('/', {
    name: "home",
    action: function(path, params) {
        if (params.type) {
            Session.set('type',  params.type);
            Session.set('genre',  "");
        }
        if (params.genre) {
            Session.set('genre', params.genre);
        }
    }
});

Template.mmenu.onRendered(function() {
    // initialize mobile-menu
    $('#mmenu').slimmenu({
        resizeWidth: '480',
        collapserTitle: 'Main Menu',
        animSpeed: 'medium',
        easingEffect: null,
        indentChildren: false,
        childrenIndenter: '&nbsp;'
    });
});

Template.mmenu.helpers({
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
                r.genres = _.map(r.genre.sort(), function(t){
                    return {
                        type: r.type,
                        genre: t
                    };
                });
                result.push(r);
            }
        });
        return result;
    }
});
