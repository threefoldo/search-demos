SearchSource.defineSource('movies', function(searchText, options){
    var selector = [];
    options = _.extend({
        skip: 0,
        limit: 50,
        sort: {title: -1}
    }, options);

    if (options.genre) {
        selector.push({genre: options.genre});
    }
    if (options.cat) {
        selector.push({type: options.cat});
    }
    if (searchText) {
        var parts = searchText.trim().split(' '),
            regExp = new RegExp("(" + parts.join('|') + ")", "ig"),
            search = {$or: [{title: regExp}, {yeartype: regExp}, {episode: regExp}, {outline: regExp}, {credit: regExp}]};

        selector.push(search);
    }
    console.log(searchText, options.genre);
    console.log("query: ", searchText);

    if (selector.length > 0) {
        return Movies.find({"$and": selector}, options).fetch();
    } else {
        return Movies.find({}, options).fetch();
    }
});
