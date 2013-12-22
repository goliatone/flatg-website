<!DOCTYPE html>
<!--[if IE 8]><html class="no-js lt-ie9" lang="en" ><![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en" > <!--<![endif]-->
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>FlatG</title>

    <link rel="stylesheet" href="assets/css/app.css">

    <link href='http://fonts.googleapis.com/css?family=Lato:700' rel='stylesheet' type='text/css'>
    <!-- font-family: 'Open Sans', sans-serif; -->
    <link href='http://fonts.googleapis.com/css?family=Open+Sans:300,400' rel='stylesheet' type='text/css'>

    <script src="assets/js/scripts.js"></script>
</head>
<body>
<!-- TEMPLATE -->

    <div class="banner">
        <div class="row">
            <div class="large-8 large-centered small-10 small-centered columns">
                <div class="row">
                    <div class="large-2 small-5 small-centered-only center-content columns">
                        <img src="/assets/images/flat-g-logo-128.png" class="flatg logo" alt="flatg logo">
                    </div>
                </div>
                <div class="row">
                    <div class="large-10 large-offset-2 columns">
                        <img src="/assets/images/flat-g.png" alt="flatg type">
                    </div>
                </div>
                <div class="row">
                    <div class="large-2 columns"></div>
                    <div class="large-10  columns tag-line">
                        <h3>PHP flat file engine</h3>
                    </div>
                </div>
                <div class="row download-holder">
                    <div class="large-8 large-centered columns github-release"><a href="https://api.github.com/repos/goliatone/flatg-core/zipball/v0.0.0" class="button-flat radius download">Download aFlatG v0.0.0</a></div>
                </div>
            </div>
        </div>
    </div>

    
    
<!-- Header and Nav -->
    <?php echo FlatG::renderView("header", $data);?>
<!-- Header and Nav -->
    

    <!-- Main Grid Section -->
    <?php if(isset($content)) echo $content;?>
    <!-- Main Grid Section -->


        
  <!-- End Grid Section -->

  <!-- Footer -->
  <?php echo FlatG::renderView("footer", $data);?>
  <!-- Footer -->
<!-- TEMPLATE -->
</body>
    <script src="assets/js/foundation.js"></script>

    <script src="/components/requirejs/require.js" data-main="/main"></script>
    <script type="text/javascript">$(document).foundation();</script>

    <?php if(isset($analytics_code)): ?>
        <!-- Google Analytics: change UA-XXXXX-X to be your site's ID. -->
        <script>
            var _gaq=[['_setAccount','<?php echo $analytics_code;?>'],['_trackPageview']];
            (function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
            g.src=('https:'==location.protocol?'//ssl':'//www')+'.google-analytics.com/ga.js';
            s.parentNode.insertBefore(g,s)}(document,'script'));
        </script>
    <?php endif;?>
</html>