angular.module('mean.questions').factory("WordClouds", function() {
    var fill = d3.scale.category20();

    function draw(words) {
        d3.select('#cloud').append('svg')
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
    }

    function createCommonWordDictionary(answers) {
        var dictionary = {};
        var terms = [];
        var words = [];

        answers.forEach(function(answer) {
            var termsForThisAnswer = [];
            var tokens = answer.content.split(' ');

            tokens.forEach(function(token) {
                if (termsForThisAnswer.indexOf(token) === -1)
                    termsForThisAnswer.push(token);
            });

            terms = terms.concat(termsForThisAnswer);
        });

        terms.forEach( function(x) {
            dictionary[x] = (dictionary[x] || 0)+1;
        });

        angular.forEach(dictionary, function(value, key) {
            words.push({
                text: key,
                size: 10 + value * 10
            });
        });

        return words;
    }

    return {
        createCloud: function(question) {
            var words = createCommonWordDictionary(question.answers);

            var cloud = d3.layout.cloud().size([300, 300])
                .words(words)
                .padding(5)
                .rotate(function() { return ~~(Math.random() * 2) * 90; })
                .font("Impact")
                .fontSize(function(d) { return d.size; })
                .on("end", draw);

            return cloud;
        }
    };
});