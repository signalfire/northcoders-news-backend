module.exports.formatArticleData = (articlesData, topicRefs, userRefs) => {
    return articlesData.map(articleDatum => {
        const created_by = userRefs[articleDatum.created_by];
        const belongs_to = topicRefs[articleDatum.topic];
        return {...articleDatum, created_by, belongs_to};
    });
}

module.exports.formatCommentData = (commentsData, articleRefs, userRefs) => {
    return commentsData.map(commentDatum => {
        const belongs_to = articleRefs[commentDatum.belongs_to];
        const created_by = userRefs[commentDatum.created_by];
        return {...commentDatum, created_by, belongs_to};
    });
}

module.exports.createRefObj = (data, docs, key, doc_key) => {
    return data.reduce((data, datum, i) => {
        data[datum[key]] = docs[i][doc_key];
        return data;
    }, {});
}
