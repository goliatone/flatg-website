<!--//NOTE-->
<section class="note single">
    <div class="meta">
        <!-- <hr class="sup"/> -->
        <span class="date"><?php echo $note->formatDate();?></span><br/>
        <h1><?php echo $note->title?></h1>
        <hr/>
    </div>
    <div class="body">
        <?php echo FlatG::$markdown->transform($note->content);?>
    </div>
</section>
<!--// NOTE -->
<div class="actions">
    <?php if(isset($note->tags)):?>
    <ul class="inline-list">
        <li><i>Found under:</i></li>
        <?php foreach($note->tags as $tag) 
            echo "<li>".GHtml::a( GHtml::b($tag), 
                            array('href' =>FlatG::$router->generate('tag', array('tag' => $tag )))
                           )."</li>";?>
    </ul>
    <?php endif;?>                   
</div> 