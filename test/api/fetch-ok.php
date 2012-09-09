<?php

$data = array(
    'id' => 'some id',
    'task' => 'some task',
    'priority' => 'some priority',
    'due' => '2012-12-21',
    'cost' => 100,
    'completed' => true,
    'note' => 'some note'
);

header("HTTP/1.1 200 OK");
echo json_encode($data);