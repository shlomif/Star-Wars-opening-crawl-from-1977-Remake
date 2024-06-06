/*
 * Star Wars opening crawl from 1977
 *
 * I freaking love Star Wars, but could not find
 * a web version of the original opening crawl from 1977.
 * So I created this one.
 *
 * I wrote an article where I explain how this works:
 * https://timpietrusky.com/star-wars-opening-crawl-from-1977
 *
 * Watch the Start Wars opening crawl on YouTube.
 * https://www.youtube.com/watch?v=7jK-jZo6xjY
 *
 * Stuff I used:
 * - CSS (animation, transform)
 * - HTML audio (the opening theme)
 * - SVG (the Star Wars logo from wikimedia.org)
 *   https://commons.wikimedia.org/wiki/File:Star_Wars_Logo.svg
 * - JavaScript (to sync the animation/audio)
 *
 * Thanks to Craig Buckler for his amazing article
 * which helped me to create this remake of the Star Wars opening crawl.
 * https://www.sitepoint.com/css3-starwars-scrolling-text/
 *
 * Sound copyright by The Walt Disney Company.
 *
 *
 * 2013 by Tim Pietrusky
 * timpietrusky.com
 *
 */
const VOLUME_STEP = 5;
const VOLUME_RANGE = 100;
const VOLUME_key = "starwars_volume";
const VOLUME_muted_key = "starwars_volume_muted";
class StarWars {
    /*
     * Constructor
     */
    constructor(args) {
        const obj = this;
        obj.title_selector = args.title_selector;
        // Context wrapper
        obj._document_elem = $(args.el);
        // Audio to play the opening crawl
        obj.audio = obj._document_elem.find("audio").get(0);
        // Start the animation
        obj.start = obj._document_elem.find(".start");
        obj.widgets = $(".widgets");
        // The animation wrapper
        obj.animation = obj._document_elem.find(".main_animation");
        if (!obj.animation) {
            alert("foo");
        }
        obj.reset();
        $(".accessibility").bind("click", () => {
            return obj._on_accessible_click();
        });
        obj.stopped = false;
        obj.timeout_id = null;
        obj._volume_timeout_id = null;
        const _handle_keyboard_presses = (my_event) => {
            const prevent = () => {
                my_event.preventDefault();
                return;
            };
            const key = my_event.key;
            const downkeycode = 40;
            const upkeycode = 38;
            if (obj._yes_accessible()) {
                return;
            }
            if (key == "Escape") {
                obj._stop_audio();
                prevent();
            }
            else if (my_event.which == 77 || my_event.which == 109) {
                obj._volume_muted = !obj._volume_muted;
                obj._change_volume(0, true);
                prevent();
            }
            else if (my_event.which == upkeycode) {
                obj._volume_up();
                prevent();
            }
            else if (my_event.which == downkeycode) {
                obj._volume_down();
                prevent();
            }
            return;
        };
        $(document).on("keyup", _handle_keyboard_presses);
        // Start the animation on click
        $(".play").bind("click", () => {
            return obj._on_play_click();
        });
        // Reset the animation and shows the start screen
        $(obj.audio).bind("ended", () => {
            return obj._stop_audio();
        });
        const v = window.localStorage.getItem(VOLUME_key);
        if (v) {
            obj._volume = parseInt(v, 10);
        }
        else {
            obj._volume = 80;
        }
        const vm = window.localStorage.getItem(VOLUME_muted_key);
        if (vm) {
            obj._volume_muted = parseInt(vm, 10) == 0 ? false : true;
        }
        else {
            obj._volume_muted = false;
        }
        obj._change_volume(0, false);
    }
    _yes_accessible() {
        return $("html").hasClass("yes_accessible");
    }
    _on_accessible_click() {
        $("html").toggleClass(["no_accessible", "yes_accessible"]);
        return;
    }
    _change_volume(offset, display) {
        const obj = this;
        obj._volume += offset;
        if (obj._volume < 0) {
            obj._volume = 0;
        }
        if (obj._volume > VOLUME_RANGE) {
            obj._volume = VOLUME_RANGE;
        }
        obj.audio.volume = obj._volume_muted ? 0 : obj._volume / VOLUME_RANGE;
        window.localStorage.setItem(VOLUME_key, "" + obj._volume);
        window.localStorage.setItem(VOLUME_muted_key, "" + (obj._volume_muted ? "1" : "0"));
        if (display) {
            const widget = $("#volume_display");
            widget.html("Volume: " + obj._volume + "%");
            widget.addClass("display_on");
            widget.removeClass("display_off");
            if (obj._volume_timeout_id) {
                clearTimeout(obj._volume_timeout_id);
                obj._volume_timeout_id = null;
            }
            obj._volume_timeout_id = setTimeout(() => {
                widget.removeClass("display_on");
                widget.addClass("display_off");
                if (obj._volume_timeout_id) {
                    obj._volume_timeout_id = null;
                }
                return;
            }, 1000);
        }
        return;
    }
    _volume_down() {
        const obj = this;
        obj._change_volume(-VOLUME_STEP, true);
        return;
    }
    _volume_up() {
        const obj = this;
        obj._change_volume(VOLUME_STEP, true);
        return;
    }
    _title() {
        const obj = this;
        return $(obj.title_selector);
    }
    _on_play_click() {
        const obj = this;
        obj.stopped = false;
        obj._title().addClass("hide");
        const _document_elem = obj._document_elem;
        if (obj._yes_accessible()) {
            alert("Cannot play the multimedia demo while the page is in accessibility mode.");
            return;
        }
        obj.widgets.addClass("hide");
        obj.audio.play();
        _document_elem.addClass(["animation", "on"]);
        obj.animation.removeClass("hidden");
        if (false) {
            obj.timeout_id = setTimeout(() => {
                return obj._stop_audio();
            }, 77 * 1000);
        }
        return;
    }
    /*
     * Resets the animation and shows the start screen.
     */
    reset() {
        const obj = this;
        obj._title().removeClass("hide");
        obj.widgets.removeClass("hide");
        obj.animation.addClass(["hidden"]);
        const _document_elem = obj._document_elem;
        _document_elem.removeClass("animation").removeClass("on");
        return;
    }
    _stop_audio() {
        const obj = this;
        if (obj.stopped) {
            return;
        }
        obj.stopped = true;
        if (obj.timeout_id) {
            clearTimeout(obj.timeout_id);
            obj.timeout_id = null;
        }
        obj.audio.pause();
        obj.audio.currentTime = 0;
        obj.reset();
        return;
    }
}
new StarWars({
    el: ".starwars",
    title_selector: "body > h1",
});
