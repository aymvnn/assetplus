<?php
// Serve the static HTML site — overrides Cloudways default index.php
header('Content-Type: text/html; charset=UTF-8');
readfile(__DIR__ . '/index.html');
exit;
