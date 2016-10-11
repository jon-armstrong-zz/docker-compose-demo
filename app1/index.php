<?php
echo('hello from app1');
echo('<br/>');

// Call app2_nginx on its "internal" port (80).
echo(file_get_contents('http://app2_nginx/app2/'));
