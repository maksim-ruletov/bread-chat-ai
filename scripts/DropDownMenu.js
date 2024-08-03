class DropDownMenu {
    constructor(dropDownController, dropDownList) {
        this.dropDownController = dropDownController;
        this.dropDownList = dropDownList;
    }

    CreateClickEvent() {
        this.dropDownController.addEventListener('click', (event) => {
            const condition = this.dropDownList.style.opacity == 0;

            if (!condition) {
                $(this.dropDownList).animate({
                    'opacity': 0
                }, ANIMATION_TIME, () => {
                    $(this.dropDownList).css({
                        'z-index': -2
                    });

                    $(this.dropDownController.children[0]).css({
                        'border-bottom-left-radius': '6px',
                        'border-bottom-right-radius': '6px'
                    });
                });
            }
            else {
                $(this.dropDownList).css({
                    'z-index': 2
                });

                $(this.dropDownController.children[0]).css({
                    'border-bottom-left-radius': '0px',
                    'border-bottom-right-radius': '0px'
                });

                $(this.dropDownList).animate({
                    'opacity': 1
                }, ANIMATION_TIME);
            }
        });
    }
}