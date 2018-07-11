/**
 * 
 * @param {string} classSection class of the section where drag andd drop has to be enabled ('sortable-list' by default)
 * @param {string} classElement class of element wich will be moved ('sortable' by default)
 * @param {string} classElementDrag class of element wich you have to hold to move element ('element-drag' by default)
 * @param {function} callback the callback
 */
function addSortHandler(callback, classSection, classElement, classElementDrag) {
    if (classSection === undefined) {
        classSection = 'sortable-list';
    }

    if (classElement === undefined) {
        classElement = 'sortable';
    }

    if (classElementDrag === undefined) {
        classElementDrag = 'element-drag';
    }

    $('.' + classSection + ' .' + classElement + ' .' + classElementDrag).off('mousedown');
    $('.' + classSection).off('mousemove');

    $('.' + classSection + ' .' + classElement + ' .' + classElementDrag).on('mousedown', function () {
        let isMouseUp = false;
        let element = $(this).parents(' .' + classElement).first();
        let elementGhost = $(element).clone();

        $(element).after(elementGhost);
        $(elementGhost).css('position', 'absolute').css('zIndex', 2).css('left', $(element).position().left);
        $(element).css('opacity', '0.2');

        $('.' + classSection).on('mousemove', function (event) {
            let posY = event.pageY;
            let posX = event.pageX;
            //$(elementGhost).css({top: (posY - ($(element).height() / 2)), left: (posX - ($(element).width() / 2))});
            $(elementGhost).css({ top: (posY - 20), left: (posX - 20) });

            let elements = $('.' + classSection + ' .' + classElement);
            let numberOfElements = elements.length;
            for (let i = 0; i < numberOfElements; i++) {
                if (($(elements[i]).position().top + ($(elements[i]).height() / 2)) <= posY && ($(elements[i]).position().top + $(elements[i]).height() * 2) >= posY) {
                    $(elements[i]).after(element);

                    $(elementGhost).on('mouseup', function () {
                        $(element).css('opacity', '1');
                        $(elementGhost).off('mouseup');
                        isMouseUp = true;
                        return;
                    });
                }
            }

            if (isMouseUp) {
                $(this).off('mousemove');
                $('.' + classSection + ' .' + classElement).off('mousedown');
                isMouseUp = false;
                addSortHandler(classSection, classElement, classElementDrag);
            }
        });

        $(elementGhost).on('mouseup', function () {
            $(element).css('opacity', '1');
            $(elementGhost).off('mouseup');
            $(elementGhost).remove();
            isMouseUp = true;

            if (callback) {
                callback();
            }
            return;
        });

        $('.' + classSection).mouseleave(function () {
            $(element).css('opacity', '1');
            $(elementGhost).remove();
            isMouseUp = true;
            /*
            if (callback) {
                callback();
            }
            */
        });
        
    });

    
}