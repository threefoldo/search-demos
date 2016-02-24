Movies = new Meteor.Collection('Movies');

Template.content.helpers({
    movies: function() {
        var genre = Session.get('genre') || '';
        var keyword = Session.get('search');
        return Movies.find({});
    }
});

Template.menu.helpers({
    genres: function() {
        // return Movies.find({}, {fields: {yeartype: true}});
        return _.uniq(_.flatten(Movies.find({}, {
            fields: {genre: true}
        }).fetch().map(function(x) {
            return x.genre;
        })).sort(), true);
    }
});

Template.content.rendered = function() {
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
}

Template.content.events({
    'click .genre': function (e) {

    }
});
