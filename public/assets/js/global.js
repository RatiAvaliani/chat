class global {
    static setLoaderGif (to) {
        $(to).addClass('gif_blur');
        let pos = $(to).position();
        let width = $(to).width();
        let height = $(to).height();

        $('.gif').css({"left": pos.left, 'top': pos.top, 'width': width, 'height': height });
        $('.gif img').css({"top": (height/2)-64, 'left': (width/2)-55, 'position': 'absolute' });
        $('.gif').removeClass('d-none');
    }

    static removeLoaderGif (to) {
        $('.gif').addClass('d-none');
        $(to).removeClass('gif_blur');
    }
}