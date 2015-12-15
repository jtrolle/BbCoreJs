define(['jquery'], function (jQuery) {
    'use strict';

    var $ = jQuery;
    return {

        defaultRenderer: function (pager) {
            var widget = pager.widget,
                mainContainer = $(widget).find('ul'),
                firstBtn = mainContainer.find('.first-btn'),
                prevCurrent = mainContainer.find('.page-link.prev').eq(0),
                nextCurrent = mainContainer.find('.next').eq(0),
                lastBtn = mainContainer.find('.last-btn');

            $(mainContainer).addClass(pager.defaultConfig.cls);
            /* append first && last if needed */
            if (!firstBtn.length) {
                $(mainContainer).prepend($('<li><a class="bb5-pagination-btn first-btn" href="#"><i class="fa fa-angle-double-left"></i></a></li>'));
            }
            if (!lastBtn.length) {
                $(mainContainer).append($('<li><a class="bb5-pagination-btn last-btn" href="#"><i class="fa fa-angle-double-right"></i></a></li>'));
            }
            /*handle current prev*/
            if (!prevCurrent.length) {
                prevCurrent = mainContainer.find('.current.prev').eq(0);
            }
            prevCurrent.parent().append('<a class="current prev bb5-pagination-btn bb5-pagination-prev" href="javascript:;"><i class="fa fa-angle-left"></i></a>');
            prevCurrent.remove();
            /*handle next */
            nextCurrent.parent().append('<a class="page-link next bb5-pagination-btn bb5-pagination-next" href="javascript:;"> <i class="fa fa-angle-right"></i></a>');
            nextCurrent.remove();
            mainContainer.find('.current').eq(1).addClass('bb5-pagination-current').parent().removeClass('active');
            mainContainer.find('.disabled').removeClass('disabled');
            pager.checkState();
            return widget;
        },

        /*We only show*/
        singlePageRenderer: function (pager) {
            var widget = pager.widget,
                mainContainer = $(widget).find('ul'),
                prevCurrent = mainContainer.find('.page-link.prev').eq(0),
                nextCurrent = mainContainer.find('.next').eq(0),
                allLinks =  mainContainer.find('li');

            $(mainContainer).addClass(pager.defaultConfig.cls);

            if (!prevCurrent.length) {
                prevCurrent = mainContainer.find('.current.prev').eq(0);
            }

            /* clean up */
            $.map(allLinks, function (link) {
                if ($(link).find(".prev").length) {
                    return true;
                }
                if ($(link).find(".next").length) {
                    return true;
                }
                $(link).remove();
            });

            /* change: prev style */
            prevCurrent.parent().append('<a class="current prev bb5-pagination-btn bb5-pagination-prev" href="javascript:;"><i class="fa fa-angle-left"></i></a>');
            prevCurrent.remove();

            /* change: next style */
            nextCurrent.parent().append('<a class="page-link next bb5-pagination-btn bb5-pagination-next" href="javascript:;"> <i class="fa fa-angle-right"></i></a>');
            nextCurrent.remove();

            /*hide disabled if needed */
            mainContainer.find('.disabled').remove();

            if (pager.onLastPage) {
                mainContainer.find(".next").hide();
            }
            pager.checkState();
            return widget;
        },

        render: function (renderName, pagerInstance) {
            if (typeof this[renderName + "Renderer"] !== "function") {
                return false;
            }
            return this[renderName + "Renderer"](pagerInstance);
        }

    };


});