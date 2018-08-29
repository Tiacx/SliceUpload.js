<?php
header('content-type:text/html;charset=utf-8');
$file = $_FILES['filedata']['tmp_name'];
$filename = iconv('utf-8', 'gbk', $_POST['filename']);
file_put_contents($filename, file_get_contents($file), FILE_APPEND);
echo $_POST['filename'];
?>