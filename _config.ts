import lume from "lume/mod.ts";
import metas from "lume/plugins/metas.ts";
import inline from "lume/plugins/inline.ts";
import attributes from "lume/plugins/attributes.ts";
import imagick from "lume/plugins/imagick.ts";
import netlify_cms from "lume/plugins/netlify_cms.ts";
import postcss from "lume/plugins/postcss.ts";
import sass from "lume/plugins/sass.ts";
import svgo from "lume/plugins/svgo.ts";
import esbuild from "lume/plugins/esbuild.ts";

const site = lume({
    location: new URL("https://rosita.nl"),
    src: "./_src"
});

site.use(attributes())
    .use(sass())
    .use(postcss())
    .use(esbuild({
        extensions: [".ts", ".js"],
        options: {
            bundle: true,
            format: "esm",
            minify: true,
            keepNames: true,
            platform: "browser",
            target: "esnext",
            incremental: true,
            treeShaking: true,
        },
    }))
    .use(metas())
    .use(imagick())
    .use(inline())
    .use(svgo())
    .use(netlify_cms());

site.copy("static", ".");

export default site;
