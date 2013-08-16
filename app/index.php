<?php
/* TODO: Move to bootstrap//shell.
 * TODO: Header management, so we can take care of 304 and
 *       all that good stuff.
 * TODO: Add global pre render filter, ie to add vars to 
 *       params.
 * TODO: Integrate Dispatcher. Integrate Flash (notices)
 * TODO: Handle callbacks, controllers. Need simple class
 *       loader.
 */
define('EXT', '.php');
define('DS', DIRECTORY_SEPARATOR);
// Set the full path to the docroot
define('ROOT_DIR', realpath(dirname(__FILE__)).DS);

$application = './backend';
define('APPPATH', realpath($application).DIRECTORY_SEPARATOR);
// Define the absolute paths for configured directories
/*
define('MODPATH', realpath($modules).DIRECTORY_SEPARATOR);
define('SYSPATH', realpath($system).DIRECTORY_SEPARATOR);
*/
include('./backend/autoload.php');
$config = require('./config/main.php');
use goliatone\flatg\FlatG;
FlatG::initialize($config);

////////////////////////////////////////////////////////////////////////
//DEFAULT ACTIONS
////////////////////////////////////////////////////////////////////////
/**
 * TODO: Move to its own module, then we just need to include.
 *       That way, we can plug it in and have it running. 
 * TODO: Make a redirect, have the default / route redirect
 *       to beta.
 *
 **/
// FlatG::map('/',    array("goliatone\\flatg\\controllers\\DefaultController", "home") , array('methods' => 'GET', 'name'=>'home'));
FlatG::map('/404', array("goliatone\\flatg\\controllers\\DefaultController", "error404") , array('methods' => 'GET', 'name'=>'404'));

////////////////////////////////////////////////////////////////////////
//BETA
////////////////////////////////////////////////////////////////////////
$splash_handler = function($params){
    echo file_get_contents('./index.html');
};

FlatG::map('/', $splash_handler , array('methods' => 'GET', 'name'=>'home'));



/////////////////////////////////////////////////////
//Let's fire this BadBoy :)   
FlatG::run();