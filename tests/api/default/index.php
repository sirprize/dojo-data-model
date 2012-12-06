<?php

function listing($items)
{
    header("HTTP/1.1 200 OK");
    echo json_encode($items);
}

function detail($id, $items)
{
    header("HTTP/1.1 200 OK");
    echo json_encode($items[0]);
}

function create()
{
    $item = json_decode(file_get_contents("php://input"), true);
    $item['id'] = 3;
    header("HTTP/1.1 200 OK");
    json_encode($item);
}

function update($id)
{
    header("HTTP/1.1 200 OK");
    echo file_get_contents("php://input");
}

function remove($id)
{
    header("HTTP/1.1 204 No Content");
}

function badRequest()
{
    header("HTTP/1.1 400 Bad Request");
}

function run()
{
    $method = strtolower($_SERVER["REQUEST_METHOD"]);
    $id = ltrim($_SERVER["REQUEST_URI"], dirname($_SERVER["SCRIPT_NAME"]));
    $id = ($id !== '') ? $id : null;

    $items = array(
        array(
            'id' => 0,
            'task' => 'Task 1',
            'due' => '2012-12-21'
        ),
        array(
            'id' => 1,
            'task' => 'Task 2',
            'due' => '2013-01-01'
        ),
        array(
            'id' => 2,
            'task' => 'Task 3',
            'due' => '2014-01-01'
        )
    );

    switch($method) {
        case 'get': {
            return ($id === null) ? listing($items) : detail($id, $items);
        }
        case 'post': {
            return ($id === null) ? create() : badRequest();
        }
        case 'put': {
            return ($id !== null) ? update($id) : badRequest();
        }
        case 'delete': {
            return ($id !== null) ? remove($id) : badRequest();
        }
    }

    return badRequest();
}

run();