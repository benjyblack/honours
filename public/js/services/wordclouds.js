'use strict';

angular.module('mean.questions').factory('WordClouds',
    function() {
        var fill = d3.scale.category20();

        function createCommonWordArray(answers) {
            var formattedArray = []; // the array the function returns, formatted to work with the wordcloud library
            var dictionary = {}; // temporary dictionary that associates each term with the amount of times its repeated
            var terms = []; // temporary array to hold all of the terms seen in the answers

            var numTotalTerms = 0;

            var stopList =
                [
                    'a','about','above','after','again','against',
                    'all','am','an','and','any','are','aren\'t','as',
                    'at','be','because','been','before','being','below',
                    'between','both','but','by','can\'t','cannot','could',
                    'couldn\'t','did','didn\'t','do','does','doesn\'t','doing',
                    'don\'t','down','during','each','few','for','from','further',
                    'had','hadn\'t','has','hasn\'t','have','haven\'t','having','he',
                    'he\'d','he\'ll','he\'s','her','here','here\'s','hers','herself',
                    'him','himself','his','how','how\'s','i','i\'d','i\'ll','i\'m','i\'ve',
                    'if','in','into','is','isn\'t','it','it\'s','its','itself','let\'s','me',
                    'more','most','mustn\'t','my','myself','no','nor','not','of','off','on','once',
                    'only','or','other','ought','our','ours ','ourselves','out','over','own','same',
                    'shan\'t','she','she\'d','she\'ll','she\'s','should','shouldn\'t','so','some','such',
                    'than','that','that\'s','the','their','theirs','them','themselves','then','there','there\'s',
                    'these','they','they\'d','they\'ll','they\'re','they\'ve','this','those','through','to','too','under',
                    'until','up','very','was','wasn\'t','we','we\'d','we\'ll','we\'re','we\'ve','were','weren\'t','what',
                    'what\'s','when','when\'s','where','where\'s','which','while','who','who\'s','whom','why','why\'s',
                    'with','won\'t','would','wouldn\'t','you','you\'d','you\'ll','you\'re','you\'ve','your','yours',
                    'yourself','yourselves'
                ];

            answers.forEach(function(answer) {
                var termsForThisAnswer = [];
                var tokens = answer.content.split(' ');

                tokens.forEach(function(token) {
                    var sanitizedToken = token.toLowerCase();
                    // only count each unique word in an answer
                    if (termsForThisAnswer.indexOf(sanitizedToken) === -1 && stopList.indexOf(sanitizedToken) === -1)
                        termsForThisAnswer.push(sanitizedToken);
                });

                terms = terms.concat(termsForThisAnswer);
            });

            terms.forEach( function(x) {
                dictionary[x] = (dictionary[x] || 0)+1;
                numTotalTerms++;
            });
            
            for (var key in dictionary) {
                if (dictionary.hasOwnProperty(key)) {
                    // size is weighted proportionally to the frequency of the term
                    formattedArray.push({
                        text: key,
                        size: (dictionary[key]/numTotalTerms) * 300
                    });
                }
            }

            return formattedArray;
        }

        return {
            createCloud: function(question, elementId) {
                
                var wordArray = createCommonWordArray(question.answers);

                var cloud = d3.layout.cloud().size([800, 600])
                    .words(wordArray)
                    .padding(5)
                    .rotate(function() { return ~~(Math.random() * 2) * 90; })
                    .font('Impact')
                    .fontSize(function(d) { return d.size; })
                    .on('end', function(words) {
                        d3.select(elementId).append('svg')
                        .attr('width', 800)
                        .attr('height', 600)
                        .append('g')
                        .attr('transform', 'translate(400,300)')
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
    }
);