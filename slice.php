<?php
header('content-type:application/json;charset=utf-8');

$file = isset($_FILES['filedata'])? $_FILES['filedata']['tmp_name']:null;
$filename = isset($_POST['filename'])? $_POST['filename']:'';
$isTheLastTime = isset($_POST['isTheLastTime'])? $_POST['isTheLastTime']:'';

$filepath = iconv('utf-8', 'gbk', $_POST['filename']);
$res = file_put_contents($filepath, file_get_contents($file), FILE_APPEND);

if ($res !== false) {
    $status = $isTheLastTime==1? 2:1;
    $info = $status==2? '文件上传成功':'文件切片上传成功';
    echo json_encode([
        'status' => $status,
        'info' => $info,
        'data' => [
            'filename' => $filename,
            'isTheLastTime' => $isTheLastTime
        ]
    ]);
} else {
    echo json_encode([
        'status' => 0,
        'info' => '文件写入失败',
        'data' => [
            'filename' => $filename,
            'isTheLastTime' => $isTheLastTime
        ]
    ]);
}
?>