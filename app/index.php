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

$application = 'system';
define('APPPATH', realpath($application).DIRECTORY_SEPARATOR);
// Define the absolute paths for configured directories
/*
define('MODPATH', realpath($modules).DIRECTORY_SEPARATOR);
define('SYSPATH', realpath($system).DIRECTORY_SEPARATOR);
*/

//require APPPATH.'flatg.php';
require APPPATH.'flattened.php';

$config = require(APPPATH.'config/main.php');

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
FlatG::map('/',    array("DefaultController", "home") , array('methods' => 'GET', 'name'=>'home'));
FlatG::map('/404', array("DefaultController", "error404") , array('methods' => 'GET', 'name'=>'404'));

////////////////////////////////////////////////////////////////////////
//BETA
////////////////////////////////////////////////////////////////////////
$splash_handler = function($params){
    
    if(key_exists('analytics_code', FlatG::$config))
        $params['analytics_code'] = FlatG::$config['analytics_code'];
    
    FlatG::render('splash', $params, 'splash');  
};
FlatG::map('/beta', $splash_handler , array('methods' => 'GET', 'name'=>'beta'));

////////////////////////////////////////////////////////////////////////
//NEWSLETTER
//We have two behaviors based on request type: JSON and HTTP.
//Actions: 
//- Subscribe
//- Unsubscribe page.
//- Unsubscribe request
//- Unsubscribe confirmation
//- Show/Manage options.
////////////////////////////////////////////////////////////////////////
$newsletter_handler = function($params){
    
    if(key_exists('analytics_code', FlatG::$config))
        $params['analytics_code'] = FlatG::$config['analytics_code'];
    
    $newsletter = new NewsletterController();
    $result = $newsletter->run();
    
    FlatG::render('newsletter/options', $params, 'newsletter');  
};
FlatG::map('/newsletter(/:email(/:token))',
           $newsletter_handler,
           array('methods' => 'GET',
                 'name'=>'newsletter',
                 'filters' => array( 'email' => '(([a-z]|[0-9]|\.|-|_)+@([a-z]|[0-9]|\.|-|_)+\.([a-z]|[0-9]){2,3})',
                                     'token' => '(.*){49}')
                 )
          );
/**                                               
 * 
 */
$newsletter_api = function($params){
    $newsletter = new NewsletterController();
    $result = $newsletter->run();
    
    FlatG::renderJSON($result);      
};                                
FlatG::map('/newsletter', $newsletter_api , array('methods' => 'POST', 
                                                'name'=>'newsletter')
                                                );
FlatG::map('/newsletter/unsubscribe(/:email(/:token))',
             $newsletter_handler, 
             array('name' => 'newsletter.unsubscribe',
                   'filters' => array('email' => '(([a-z]|[0-9]|\.|-|_)+@([a-z]|[0-9]|\.|-|_)+\.([a-z]|[0-9]){2,3})',
                                      'token' => '(.*){49}',
                                     )
             )
        );

////////////////////////////////////////////////////////////////////////
//LOGBOOK
////////////////////////////////////////////////////////////////////////
/**
 * 
 */
$logbook_index_handler = function($params){
        
    $params['articles'] = FlatG::$articles;
    
    $slug = FlatG::featuredArticle();
    //If we have slug, try to retrieve it. If we
    //don't have a slug or the slug is invalid, get
    //a default value. TODO: We should be able to 
    //filter posts by.
    $file = ArticleModel::findBy('slug',$slug, 0);     
    $params['note'] = new ArticleModel($file);
    
    //TODO: If we are in 1, we should suggest a different
    //model. Make method. ArticleModel::suggestNext();
    $file = ArticleModel::findBy('slug',NULL, 1);
    $params['next'] = new ArticleModel($file);
    
    FlatG::render('home', $params, 'logbook');  
};
//ADD ROUTES AND HANDLERS.
//Blog Home Route.
FlatG::map('/logbook/', $logbook_index_handler , array('methods' => 'GET', 'name'=>'logbook'));

/**
 * 
 */
$archives_handler = function($params){
    #Move to GHelper::get_arguments()
    
    $archives = array();
    $articles = FlatG::$articles;
    
    //TODO: Move to helper class:
    $args = array();
    $keys = array('year', 'month', 'day');
    foreach($keys as $key)
    {
        if(key_exists($key, $params))
            $args[$key] = $params[$key];
    }
    //
    
    $dateFormat = function($args, $format){
        $temp_date = is_array($args) ? implode('-', $args) : $args;
        $date   = new DateTime($temp_date);
        return $date->format($format);
    };

    if(count($args)>0) {
        switch(count($args)){
            case 1 :    //only year is present
                $format = 'Y';
            break;
            case 2 :    //year and month are present
                $format = 'Y-m';
            break;
            case 3 : //year, month and date are present
                $format = 'Y-m-d';
            break;
        }
        
        $date = $dateFormat($args,$format);
        // filter articles
        foreach($articles as $article){
            if($dateFormat($article->date, $format) === $date){
                $archives[] = $article;
            }
        }
    }
    else
    {
        //         
        $archives = ArticleModel::sortByDate($articles);
    }
    
    $params['archives'] = $archives;
    
    FlatG::render('archives', $params, 'logbook');
};
//Archives Route.
FlatG::map('/logbook/archives(/:year((/:month)(/:day)))',
             $archives_handler, 
             array('name' => 'archives',
                   'filters' => array('year' => '(19|20\d\d)',
                                      'month' => '([1-9]|[01][0-9])',
                                      'day' => '([1-9]|[01][0-9])'
                                      
                                     )
             )
        );

/**
 * 
 */
$category_handler = function($params){
    
    FlatG::render('category', $params, 'logbook');
};
//Category Route.        
FlatG::map('/logbook/category(/:category)', 
             $category_handler, 
             array('name' => 'category')
          );

/**
 * 
 */
$tags_handler = function($params){
    
    $params['articles'] = array();
    
    //If we are actually looking for a tag:
    if(array_key_exists('tag', $params))
    {
        $tags = $params['tag'];
        $params['articles'] = ArticleModel::findAllByMeta('tags', $tags);        
    }
    
    //we want to show all the tags.
    $params['tags'] = ArticleModel::$indexed_meta['tags'];
    // FlatG::dump(ArticleModel::$indexed_meta);
    
    
    FlatG::render('tags', $params, 'logbook');
};
//Tags Route.
FlatG::map('/logbook/tags(/:tag)',
             $tags_handler, 
             array('name' => 'tag')
        );


/**
 * 
 */
$article_handler = function($params){
    $params['articles'] = FlatG::$articles;
    
    $slug = $params['slug'];
    //If we have slug, try to retrieve it. If we
    //don't have a slug or the slug is invalid, get
    //a default value. TODO: We should be able to 
    //filter posts by.
    $file = ArticleModel::findBy('slug',$slug, 0);     
    $params['note'] = new ArticleModel($file);
    
    if(($file = ArticleModel::findBy('slug',NULL, 1)))
    {
        $params['next'] = new ArticleModel($file);
    }
    
    FlatG::render('article', $params, 'logbook');  
};
//Note Route.           
FlatG::map('/logbook/note/:slug', 
             $article_handler, 
             array( 'name'=>'note',
                    'filters' => array( 'slug' => '(.*)')
             )
          );
          
//Page Route.
FlatG::map('/logbook/:slug', 
            $article_handler, 
            array( 'name'=>'page',
                'filters' => array( 'slug' => '(.*)')
            )
          );

/***********************************************
 * ADMIN: trigger sync.
 * TODO: We should take a secret key.
 *       https://github.com/fkooman/php-simple-auth/
 **********************************************/
$sync_handler = function($params)
{
    //This is really all we have to do to sync.
    //We should check headers, if ajax, return json with
    //status. Else, html, render OK/KO status.
    //Also, we should some how check for password?!!
    FlatG::synchronize();
};

FlatG::map('/admin/sync', 
            $sync_handler, 
            array( 'name'=>'sync'
            )
          );

/***********************************************
 * API
 * http://phpmaster.com/creating-a-php-oauth-server/
 * https://code.google.com/p/oauth-php/
 **********************************************/
 /**
  * TODO: Handle article not found.
  */
$api_article_handler = function($params){
    $slug = $params['slug'];
    $file = ArticleModel::findBy('slug',$slug, 0);     
    $note = new ArticleModel($file);
    
    FlatG::renderJSON($note);
    
};
FlatG::map('/api/note/:slug', 
           $api_article_handler, 
           array( 'name'=>'api.note.get',
                  'filters' => array( 'slug' => '(.*)')
           )
);

/**
 * TODO: Add pagination?
 */
$api_index_handler = function($params){
    $params['count'] = count(FlatG::$articles);
    $output = array();
    
    foreach(FlatG::$articles as $slug => $model )
    {
        $note = new stdClass();
        $note->title = $model->title;
        $note->slug  = $model->slug;
        $note->date  = $model->date;
        $note->file  = $model->getFilename();
        $output[] = $note;
    }
    $params['notes'] = $output;
    FlatG::renderJSON($params);
};

FlatG::map('/api/notes', 
            $api_index_handler, 
            array( 'name'=>'api.notes.get',
                   'methods'=> 'GET'
            )
          );
          
/**
 * 
 */
$api_notes_full_handler = function($params){
    $params['count'] = count(FlatG::$articles);
    $params['notes'] = FlatG::$articles;
    
    FlatG::renderJSON($params);
};

FlatG::map('/api/notes/all', 
            $api_notes_full_handler, 
            array( 'name'=>'api.notes.get.all',
                   'methods'=> 'GET'
            )
          );

/////////////////////////////////////////////////////
//Let's fire this BadBoy :)   
FlatG::run();