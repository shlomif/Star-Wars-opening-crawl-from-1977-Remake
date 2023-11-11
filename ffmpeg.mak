all: generated-style.css starwars-theme.mp3 starwars-theme.ogg

END_AT = 01:35

starwars-theme.mp3 starwars-theme.ogg: Star_Wars_-_Theme.mp3 ffmpeg.mak
	ffmpeg -to $(END_AT) -i $< $@

generated-style.css: css/style.css
	cp -f $< $@

css/style.css: scss/style.scss
	pysassc "$<" "$@"
	# compass compile # "$<" "$@"

POST_DEST = .
TYPESCRIPT_basenames = index.js
DEST_JS_DIR = $(POST_DEST)/ts-jses
dest_jsify = $(addprefix $(DEST_JS_DIR)/,$(1))

OUT_PREF = js
TYPESCRIPT_DEST_FILES = $(patsubst %.js,$(OUT_PREF)/%.js,$(TYPESCRIPT_basenames))

DEST_BABEL_JSES = $(call dest_jsify, $(TYPESCRIPT_basenames))

$(DEST_BABEL_JSES): $(DEST_JS_DIR)/%.js: $(OUT_PREF)/%.js
	$(MULTI_YUI) -o $@ $<

run_tsc = tsc --project lib/typescript/$1/tsconfig.json

$(TYPESCRIPT_DEST_FILES): $(OUT_PREF)/%.js: ts/%.ts $(TYPESCRIPT_COMMON_DEPS) lib/typescript/www/tsconfig.json
	$(call run_tsc,www)

all: ts

ts: $(TYPESCRIPT_DEST_FILES)

prettier:
	prettier --parser scss --arrow-parens always --tab-width 2 --trailing-comma all --write scss/*.scss
	prettier --parser typescript --arrow-parens always --tab-width 2 --trailing-comma all --write ts/*.ts
