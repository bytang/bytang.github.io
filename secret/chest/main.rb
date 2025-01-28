require 'csv'
require 'sqlite3'
$stdout.sync = true

$db = SQLite3::Database.new "games.sqlite"
$db.execute <<-SQL
    CREATE TABLE IF NOT EXISTS games (
        Id INTEGER PRIMARY KEY,
        Name TEXT,
        Service TEXT,
        Redeem TEXT
    );
SQL

$run = true

def interpret(args)
    args = tokenize(args)
    if args.length > 0
        if args[0] == 'q'
            $run = false
        elsif args[0] == 'add'
            if args.length == 1
                print "Name: "
                name = gets.chomp
                print "Service: "
                service = gets.chomp
                print "Code: "
                code = gets.chomp
            elsif args[1] == 'csv'
                read_csv(args[2])
            elsif args.length == 4
                name = args[1]
                service = args[2]
                code = args[3]
            end
            if name && service && code && name.length > 0 && service.length > 0 && code.length > 0
                add_game(name, service, code)
            end
        elsif args[0] == 'list'
            if args.length == 1
                print_games
            elsif args.length > 1
                print_games(Regexp.new(args[1], true))
            end
        elsif args[0] == 'html'
            generate_html
        elsif args[0] == 'rm'
            if args.length == 1
                print "Code: "
                code = gets.chomp
            elsif args.length > 1
                code = args[1]
            end
            if code && code.length > 0
                remove_game(code)
            end
        end
    end
end

def add_game(name, service, code)
    if (search = $db.execute "SELECT * FROM games WHERE Service=\"#{service}\" AND Redeem=\"#{code}\"").length > 0
        puts "Game already in database as #{search}"
    else
        $db.execute "INSERT INTO games(Name, Service, Redeem) VALUES (\"#{name}\", \"#{service}\", \"#{code}\")"
        game = $db.execute "SELECT * FROM games where Id=#{$db.last_insert_row_id}"
        puts "Successfully added #{game}"
    end
end

def remove_game(code)
    $db.execute "DELETE FROM games WHERE Redeem=\"#{code}\""
end

def read_csv(path_to_file)
    CSV.foreach(path_to_file) do |row|
        if row.length == 3
            add_game(row[0], row[1], row[2])
        end
    end
end

def tokenize(string)
    tokens = []
    start = -1
    finish = -1
    count = 0
    delim = ' '
    string.each_char do |char|
        if (char == "\'" || char == "\"") && start == -1
            delim = char
        else
            if char == delim
                if finish - start > 0
                    tokens.push(string[start..finish])
                    start = -1
                    finish = -1                    
                end
                delim = ' '            
            else
                if start == -1
                    start = count
                else
                    finish = count
                end
            end
        end        
        count += 1
    end
    if start > -1
        tokens.push(string[start..finish])
    end
    #puts "#{tokens.length} token#{tokens.length == 1 ? '' : 's'}: #{tokens}"
    return tokens
end

def print_games(query = /.*/)
    games = $db.execute "SELECT * FROM games ORDER BY Name"
    count = 1
    for game in games
        if game[1] =~ query
            puts "#{count}: #{game[1]} | #{game[2]} | #{game[3]}"
            count += 1
        end
    end
end

def generate_html
    head = 
"<!DOCTYPE html>
<html>
<head>
    <title>Bo's Treasure Hole</title>
    <meta charset=\"UTF-8\">
    <link rel=\"stylesheet\" type\"text/css\" href=\"/lib/style.css\">
    <link rel=\"shortcut icon\" type=\"image/x-icon\" href=\"/img/favicon.ico\">
</head>
<body>
    <div id=\"container\" style=\"width:1000px;\">
        <div id=\"content\">\n"

    tail = 
"        <p style=\"text-align: right;\">Page generated on #{Time.now.to_s}</p>
        </div>
        <div id=\"footer\">
            Bo Yang Tang 2014
        </div>
    </div>
</body>
</html>"

    game_list = $db.execute "SELECT * FROM games ORDER BY Name"

    out = File.new("index.html", "w")

    for game in game_list
        if game[3] =~ /https?:\/\//i
            game[3] = "<a href=#{game[3]} target=_blank>Humble Bundle Gift</a>"
        else
            game[3] = "<b>#{game[3]}</b>"
        end
    end

    out.syswrite(head)

    for game in game_list
        out.syswrite("            <p>#{game[1]} (#{game[2]}): #{game[3]}</p>\n")
    end

    out.syswrite(tail)
    out.close
end

while $run
    print "Input> "
    #tokenize(gets.chomp)
    interpret(gets.chomp)
end

$db.close
