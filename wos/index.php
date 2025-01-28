<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title>World of Story</title>
    <link href='http://fonts.googleapis.com/css?family=Roboto' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" type="text/css" href="style.css">
</head>
<body>
    <script>
        var position = -1;
        <?php
            $scroll = $_GET['pos'];
            if (filter_var($scroll, FILTER_VALIDATE_INT) || $scroll == '0') {
                print 'position = ' . $scroll . ";\n";
            }
        ?>
        function updatePosLink(elem, pos) {
            pos = pos.toString();
            elem.innerHTML = '<a href="?pos=' + pos + '">boyangtang.ca/wos/?pos=' + pos + '</a>';
        }
    </script>
    <div id="story" onscroll="updatePosLink(link, storyText.scrollTop)">
        <p>
            <?php
                $file = 'story.txt';
                $input = $_POST['userInput'];
                

                if (!empty($input)) {
                    $input = filter_var($input, FILTER_SANITIZE_SPECIAL_CHARS);
                    $input = str_replace("&#13;&#10;", "\n", $input);
                    file_put_contents($file, $input . "\n", FILE_APPEND);
                }

                $content = file_get_contents($file);
                if (!$content || $content == '') {
                    print 'There is nothing here.';
                }
                else {
                    print nl2br($content);
                }
            ?>
        </p>
    </div>
    <div id="writer">
        <form action="./" method="post">    
            <textarea name="userInput" cols="30" placeholder="What happens now?"></textarea>
            <input name="submit" type="submit" value="It is written"/>
        </form>
        <p id="link"></p>
    </div>
    <script src="sizer.js"></script>
    <script>
        var storyText = document.getElementById("story"),
            link = document.getElementById("link");
        if (position < 0) position = storyText.scrollHeight;
        storyText.scrollTop = position;
        updatePosLink(link, storyText.scrollTop);
    </script>    
</body>
</html>