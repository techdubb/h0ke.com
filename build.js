var metalsmith = require('metalsmith'),
    markdown = require('metalsmith-markdown'),
    templates = require('metalsmith-templates'),
    serve = require('metalsmith-serve'),
    watch = require('metalsmith-watch'),
    excerpts = require('metalsmith-excerpts'),
    collections = require('metalsmith-collections'),
    permalinks = require('metalsmith-permalinks'),
    branch = require('metalsmith-branch'),
    feed = require('metalsmith-feed'),
    handlebars  = require('handlebars'),
    fs = require('fs');


handlebars.registerPartial('header', fs.readFileSync(__dirname + '/templates/partials/header.hbt').toString());
handlebars.registerPartial('footer', fs.readFileSync(__dirname + '/templates/partials/footer.hbt').toString());
handlebars.registerHelper('moment', require('helper-moment'));

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

var siteBuild = metalsmith(__dirname)
  .metadata({
    site: {
      title: 'h0ke.com',
      url: 'http://localhost:8080'
    },
    author: "M. Hokanson"
  })
  .source('./src')
  .use(markdown())
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
  .use(templates('handlebars'))
  .use(feed({collection: 'posts'}))
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