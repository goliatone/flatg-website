<?php

/*
 * We store sensitive data in .passwords, mainly to stay out 
 * of the repo.
 * $passwords is an associative array that holds backend
 * storage user account info.
 */
$passwords = include_once('./config/.passwords');

return array(
    'base_path' => APPPATH,
    'view_dir'  => "themes",
    'theme' => 'default',
    'articles_extension' =>'yaml',
    'articles_path' => ROOT_DIR."articles",
    //we dont have the localhost/dreamcach.es this should be base url plu
    'asset_dir' => "assets/",
    'layout' => 'layout',
    'featured_article' => 'hello-world',
    'router' => array(
        'basePath' => '/'
     ),
     //TODO: We should we able to get this by default.
    'base_url' => '/',
    
    'analytics_code'=>'UA-46640957-1',
    
    'backend_storage' =>array(
        'default'=>'dropbox',
        'dropbox'=>array(
            'class' => 'goliatone\flatg\backend\drivers\DropboxDriver',
            'key'=>$passwords['dropbox']['key'],
            'secret'=>$passwords['dropbox']['secret'],
            'folder'=>'/articles/'
            
        ),
        'github'=>array(
            'class' => 'goliatone\flatg\backend\drivers\GithubDriver',
            'key'=>$passwords['github']['key'],
            'secret'=>$passwords['github']['secret'],
            'repo'=>'https://github.com/goliatone/jii',
            'branch'=>'gh-pages'
            
        ),
    ),
);