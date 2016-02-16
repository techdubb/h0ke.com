var metalsmith = require('metalsmith'),
    markdown = require('metalsmith-markdownit'),
    templates = require('metalsmith-templates'),
    serve = require('metalsmith-serve'),
    watch = require('metalsmith-watch'),
    excerpts = require('metalsmith-excerpts'),
    collections = require('metalsmith-collections'),
    permalinks = require('metalsmith-permalinks'),
    branch = require('metalsmith-branch'),
    feed = require('metalsmith-feed'),
    handlebars  = require('handlebars'),
    fs = require('fs'),
    path = require('path');

var md = markdown({
      typographer: true,
      html: true
    }).use(require('markdown-it-footnote'));

var filePathTask = function(files, metalsmith, done){
    for(var file in files){
      if (file.indexOf('posts/') !== -1) {
        files[file].blogPath = files[file].path;
        files[file].path = file;
      }
      files[file].path = file;
    }
    done();
};

var relativePathHelper = function(current, target) {
    // normalize and remove starting slash
    current = path.normalize(current).slice(0);
    target = path.normalize(target).slice(0);

    current = path.dirname(current);
    var out = path.relative(current, target);
    return out;
};

handlebars.registerPartial('header', fs.readFileSync(__dirname + '/templates/partials/header.hbt').toString());
handlebars.registerPartial('footer', fs.readFileSync(__dirname + '/templates/partials/footer.hbt').toString());
handlebars.registerHelper('moment', require('helper-moment'));
handlebars.registerHelper('relative_path', relativePathHelper);

var findTemplate = function(config) {
  var pattern = new RegExp(config.pattern);

  return function(files, metalsmith, done) {
    for (var file in files) {
      if (pattern.test(file)) {
        var _f = files[file];
        if (!_f.template) {
          _f.template = config.templateName;
        }
      }
    }
    done();
  };
};


var url = 'http://localhost:8080';
if (process.env.NODE_ENV == 'production') {
  url = 'http://h0ke.com';
}

var siteBuild = metalsmith(__dirname)
  .metadata({
    site: {
      title: 'h0ke.com',
      url: url
    },
    author: "M. Hokanson"
  })
  .source('./src')
  .use(md)
  .use(excerpts())
  .use(collections({
    pages: {
      pattern: 'content/pages/*.html'
    },
    posts: {
      pattern: 'content/posts/*.html',
      sortBy: 'date',
      reverse: true
    }
  }))
  .use(findTemplate({
      pattern: 'posts',
      templateName: 'post.hbt'
  }))
  .use(branch('content/posts/**.html')
    .use(permalinks({
      pattern: ':collection/:title',
      relative: false
    }))
  )
  .use(branch('content/pages/**.html')
    .use(permalinks({
      pattern: ':title',
      relative: false
    }))
  )
  .use(feed({collection: 'posts'}))
  .use(filePathTask)
  .use(templates('handlebars'))
  .destination('./build');

if (process.env.NODE_ENV !== 'production') {
  siteBuild = siteBuild
    .use(serve({
      port: 8080,
      verbose: true
    }));
}

siteBuild.build(function (err) {
  if (err) {
    console.log(err);
  }
  else {
    console.log('Site build complete!');
  }
});