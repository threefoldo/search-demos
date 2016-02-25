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
    if (searchText) {
        selector.push({
            "$text": {"$search": searchText}
        });
    }
    console.log(searchText, options.genre);
    console.log(selector);

    if (selector.length > 0) {
        return Movies.find({"$and": selector}, options).fetch();
    } else {
        return Movies.find({}, options).fetch();
    }
});
