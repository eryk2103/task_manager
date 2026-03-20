<ul>
    <?php 
        $name = $props['form']['name'] ?? '';
        $description = $props['form']['description'] ?? '';
        $errors = $props['errors'] ?? [];
        foreach($errors as $key => $error): 
    ?>
        <li>
            <?= $key . ' => ' . $error ?>
        </li>
    <?php endforeach ?>
</ul>
<form method="post">
    <div>
        <label for="name">Name</label>
        <input type="text" id="name" name="name" value="<?= htmlspecialchars($name) ?>"/>
    </div>
    <div>
        <label for="description">Description</label>
        <input type="text" id="description" name="description" value="<?= htmlspecialchars($description) ?>"/>
    </div>
    <button type="submit">Submit</button>
</form>