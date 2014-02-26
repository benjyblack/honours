angular.module('mean.questions').factory('WordClouds', function() {
    var fill = d3.scale.category20();

    function createCommonWordDictionary(answers) {
        var formattedArray = []; // the array the function returns, formatted to work with the wordcloud library
        var dictionary = {}; // temporary dictionary that associates each term with the amount of times its repeated
        var terms = []; // temporary array to hold all of the terms seen in the answers

        var numTotalTerms = 0;

        var ignoredTerms = ['the', 'and', 'an', 'of', 'at', 'because', 'it', 'like', 'was', 'would', 'a'];

        answers.forEach(function(answer) {
            var termsForThisAnswer = [];
            var tokens = answer.content.split(' ');

            tokens.forEach(function(token) {
                var sanitizedToken = token.toLowerCase();
                if (termsForThisAnswer.indexOf(sanitizedToken) === -1 && ignoredTerms.indexOf(sanitizedToken) === -1) // only count each unique word in an answer
                    termsForThisAnswer.push(sanitizedToken.toLowerCase());
            });

            terms = terms.concat(termsForThisAnswer);
        });

        terms.forEach( function(x) {
            dictionary[x] = (dictionary[x] || 0)+1;
            numTotalTerms++;
        });

        angular.forEach(dictionary, function(value, key) {
            formattedArray.push({
                text: key,
                size: (value/numTotalTerms) * 300 // size is weighted proportionally to the frequency of the term
            });
        });

        return formattedArray;
    }

    return {
        createCloud: function(question, elementId) {
            
            var cloud = d3.layout.cloud().size([300, 300])
                .words(createCommonWordDictionary(question.answers))
                .padding(5)
                .rotate(function() { return ~~(Math.random() * 2) * 90; })
                .font('Impact')
                .fontSize(function(d) { return d.size; })
                .on('end', function(words) {
                    d3.select(elementId).append('svg')
                    .attr('width', 300)
                    .attr('height', 300)
                    .append('g')
                    .attr('transform', 'translate(150,150)')
                    .selectAll('text')
                    .data(words)
                    .enter().append('text')
                    .style('font-size', function(d) { return d.size + 'px'; })
                    .style('font-family', 'Impact')
                    .style('fill', function(d, i) { return fill(i); })
                    .attr('text-anchor', 'middle')
                    .attr('transform', function(d) {
                        return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')';
                    })
                    .text(function(d) { return d.text; });
                });

            return cloud;
        }
    };
});