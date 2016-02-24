SearchSource.defineSource('movies', function(searchText, params){
    var options = {sort: {isoScore: -1}, limit:20};
    var selector = [];

    if (params.genre) {
        selector.push({genre: params.genre});
    }
    if (searchText) {
        selector.push({
            "$text": {"$search": searchText}
        });
    }
    if (selector.length > 0) {
        return Movies.find({"$and": selector}, options).fetch();
    } else {
        return Movies.find({}, options).fetch();
    }
});
