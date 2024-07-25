

(cd ../inner-angular-elements && ng build --output-hashing=none -c development && node bundle-for-spfx.js) && (cd ../outer-angular-spfx && gulp build && gulp bundle --ship) && (gulp package-solution --ship)
