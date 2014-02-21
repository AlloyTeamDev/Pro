<div class="section-header">
    <h1 class="section-title">Getting started</h1>
    <p class="section-description">An overview of Pro, how to download and use, basic templates.</p>
</div>

<h1 id="download" class="article-title">Download</h1>

<p>Pro has a few easy ways to quickly get started, each one appealing to a different skill level and use case. Read through to see what suits your particular needs.</p>

<h3>Download Pro</h3>
<p><a href="#" class="ui-button" role="button" onclick="">Download Pro</a> Compiled and minified CSS, JavaScript.</p>

<p><a href="#" class="ui-button" role="button" onclick="">Download Source</a> Source CSS, JavaScript.</p>

<h3>Install with Bower</h3>
<p>Install and manage Pro's CSS, JavaScript, using <a href="http://bower.io">Bower</a>.</p>

```bash
bower install pro
```

<h1 id="setup" class="article-title">Setup</h1>

3 steps for structuring your Pro application

<ol>
    <li>
        <h3>Set <code>viewport</code> meta</h3>
        <p><code>&lt;name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no"&gt;</code></p>
    </li>
    <li>
        <h3>Set fixed bars</h3>
        <p>All fixed bars (<code>.ui-top-bar</code>, <code>.ui-bottom-bar</code>) should always be the first thing in the body of the page. This is really important!</p>
    </li>
    <li>
        <h3>Put content into <code>.ui-page</code> </h3>
        <p>Anything that's not a <code>-bar</code> should be put in a div with the class <code>ui-page</code>. Put this div after the bars in the body tag.</p>
    </li>
</ol>

<h1 id="basic-template" class="article-title">Basic template</h1>

Start with this basic HTML template, or modify it, adapting them to suit your needs.

Copy the HTML below to begin working with a minimal Pro document.

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <title>Pro Template</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">

    <!-- Pro CSS -->
    <link rel="stylesheet" type="text/css" href="css/pro.css">
</head>
<body class="ui-app">

    <div class="ui-top-bar js-no-bounce">
        PRO Template
    </div>

    <div class="ui-bottom-bar js-no-bounce" role="toolbar" tabindex="0">
        <button class="ui-bottom-bar-button js-active" data-toggle="tab" data-target="#page1">
            <span class="ui-icon"></span>
            <span class="ui-label">CSS</span>
        </button>
        </div>
    </div>

    <div id="page1" class="ui-page js-active">
        <div class="ui-page-content">
             <h1>Hello, world!</h1>
        </div>
    </div>

    <!-- Pro JS -->
    <script src="js/pro.js"></script>
  </body>
</html>
```

