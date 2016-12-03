<?php 
exec("node app.js &",$output);
header("Location: http://$_SERVER[HTTP_HOST]:23000");