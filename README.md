# FlatG
![FlatG website](https://raw.github.com/goliatone/flatg-website/master/app/assets/images/flat-g-logo-128.png)

Source for [FlatG][]'s website.

## Development
`sudo npm install && bower install`

## Bower
>Bower is a package manager for the web. It offers a generic, unopinionated solution to the problem of front-end package management, while exposing the package dependency model via an API that can be consumed by a more opinionated build stack. There are no system wide dependencies, no dependencies are shared between different apps, and the dependency tree is flat.

To register FlatG in the [bower](http://bower.io/) [registry](http://sindresorhus.com/bower-components/):
`bower register FlatG git://github.com/goliatone/FlatG.git`


#### NOTES:

- Use rsync to deploy builds. [Grunt][a] [tasks][b]
- Refine build process and only export theme, rebuild assets and bundle together.


[FlatG]: http://flat-g.com
[a]: https://github.com/jedrichards/grunt-rsync
[b]: https://npmjs.org/package/grunt-rsync-2
