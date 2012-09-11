<?php
/*
if (array_key_exists('id', $_GET))
{
    $data = array(
        array(
            'id' => 0,
            'task' => 'Task 0',
            'due' => '2012-12-21'
        )
    );
}
else {
    $data = array(
        array(
            'id' => 0,
            'task' => 'Task 0',
            'due' => '2012-12-21'
        ),
        array(
            'id' => 1,
            'task' => 'Task 1',
            'due' => '2013-01-01'
        ),
        array(
            'id' => 2,
            'task' => 'Task 2',
            'due' => '2014-01-01'
        )
    );
}
*/
$data = array(
    array(
        'id' => 0,
        'task' => 'Task 0',
        'due' => '2012-12-21'
    ),
    array(
        'id' => 1,
        'task' => 'Task 1',
        'due' => '2013-01-01'
    ),
    array(
        'id' => 2,
        'task' => 'Task 2',
        'due' => '2014-01-01'
    )
);

header("HTTP/1.1 200 OK");
echo json_encode($data);