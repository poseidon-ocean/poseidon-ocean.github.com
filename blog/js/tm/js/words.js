/**
 * Created by think on 2016/12/25.
 */
(function($){
    //查找所包含的标签里面是否有标签包裹，如果有就把每个span加入到自己的元素里面
    var searchText = function(element, pattern, callback) {
        for (var childi= element.childNodes.length; childi-->0;) {
            var child= element.childNodes[childi];
            if (child.nodeType==1) {
                searchText(child, pattern, callback);
            } else if (child.nodeType==3) {
                var matches= [];
                var match;
                while (match= pattern.exec(child.data))
                    matches.push(match);
                for (var i= matches.length; i-->0;)
                    callback.call(window, child, matches[i]);
            }
        }
    };



    $.fn.moveWords = function(options){
        var defaults = {
            moveHeight: '2em',
            uptime: 500,
            downtime: 700,
            wordClass: 'movewords',
            wordElement: 'span'
        };

        options = $.extend(defaults, options);
        return this.each(function(){
            searchText(this, /\S/g, function(node, match) {
                var element = $('<' + options.wordElement + '/>', {
                    'class': options.wordClass
                })[0];

                var replaceNode = node.splitText(match.index);
                element.appendChild(replaceNode);
                node.parentNode.insertBefore(element, node.nextSibling);
            });

            $(this).find(options.wordElement + '.' + options.wordClass).each(function() {
                $(this).css({position: 'relative' });
                $(this).mouseover(function(){
                    $(this).animate({ bottom: options.moveHeight },{
                        queue: false,
                        duration: options.bounceUpDuration,
                        easing: 'easeInOutExpo' in $.easing ? 'easeOutCubic' : 'swing',
                        complete: function(){
                            $(this).animate({
                                bottom: 0
                            }, {
                                queue: false,
                                duration: options.downtime,
                                easing: 'easeInOutExpo' in $.easing ? 'easeOutBounce' : 'swing'
                            });
                        }
                    });
                });

            });
        });
    };

})(jQuery);