<?php

$data = array(
    'id' => 'add.php',
    'task' => 'Task 3',
    'due' => '2015-01-01'
);

header("HTTP/1.1 200 OK");
echo json_encode($data);