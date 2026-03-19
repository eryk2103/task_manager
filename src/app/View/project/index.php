
<h1>Project index</h1>
<a href="/new">New project</a>
<ul>
    <?php foreach($props['projects'] as $project): ?>
    <li>
        <?= $project['name'] ?>
    </li>
    <?php endforeach ?>
</ul>
