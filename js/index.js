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
const VOLUME_factor = 1.0 / VOLUME_RANGE;
const VOLUME_key = "starwars_volume";
class StarWars {
    /*
     * Constructor
     */
    constructor(args) {
        const obj = this;
        obj.title_selector = args.title_selector;
        // Context wrapper
        obj.elem = $(args.el);
        // Audio to play the opening crawl
        obj.audio = obj.elem.find("audio").get(0);
        // Start the animation
        obj.start = obj.elem.find(".start");
        obj.widgets = $(".widgets");
        // obj.start.show();
        // The animation wrapper
        const old_animation = obj.elem.find(".main_animation");
        obj.animation = old_animation;
        // old_animation.remove();
        if (!obj.animation) {
            alert("foo");
        }
        // Remove animation and shows the start screen
        obj.reset();
        $(".accessibility").bind("click", () => {
            return obj._on_accessible_click();
        });
        obj.stopped = false;
        obj.timeout_id = null;
        obj._volume_timeout_id = null;
        const _handle_keyboard_presses = function (my_event) {
            const prevent = function () {
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
        obj.audio.volume = obj._volume / VOLUME_RANGE;
        window.localStorage.setItem(VOLUME_key, "" + obj._volume);
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
    _remove_animation_element() {
        const obj = this;
        if (false) {
            const found = obj.elem.find(".main_animation");
            if (found) {
                found.remove();
            }
        }
        return;
    }
    _replace_animation_element() {
        const obj = this;
        obj._remove_animation_element();
        // obj.elem.append(obj.animation);
        return;
    }
    _on_play_click() {
        const obj = this;
        obj.stopped = false;
        $(obj.title_selector).addClass("hide");
        const elem = obj.elem;
        if (elem.hasClass("accessible_body")) {
            alert("accessible_body");
        }
        // obj.start.addClass("hide");
        obj.widgets.addClass("hide");
        obj.audio.play();
        elem.addClass(["animation", "on"]);
        // obj.animation.addClass("animation");
        obj.animation.removeClass("hidden");
        obj._replace_animation_element();
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
        $(obj.title_selector).removeClass("hide");
        // obj.start.show();
        // obj.start.removeClass("hide");
        obj.widgets.removeClass("hide");
        // const cloned = obj.animation.clone(true);
        // obj.animation.remove();
        obj.animation.addClass(["hidden"]);
        // obj.animation = cloned;
        const elem = obj.elem;
        elem.removeClass("animation").removeClass("on");
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
