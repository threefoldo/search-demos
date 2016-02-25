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
    genres: function() {
        // get distinct 'genre'
        return _.uniq(_.flatten(Movies.find({}, {
            fields: {genre: true}
        }).fetch().map(function(x) {
            return x.genre;
        })).sort(), true);
    }
});
