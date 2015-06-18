var Server = require('./../lib/koco-server').Server;

var argv = require('optimist')
    .usage([
            'USAGE: $0 [-p <port>] [<directory>]',
            'simple, rfc 2616 compliant file streaming module for node'
        ]
        .join('\n\n'))
    .option('port', {
        alias: 'p',
        'default': 8080,
        description: 'TCP port at which the files will be served'
    })
    .option('root', {
        alias: 'r',
        'default': '',
        description: 'the root path of the application'
    })
    .option('help', {
        alias: 'h',
        description: 'display this help message'
    })
    .argv;

var dir = argv._[0] || '.';

if (argv.help) {
    require('optimist').showHelp(console.log);
    process.exit(0);
}

var server = new Server({
    dir: dir,
    root: argv.root
});

server.listen(+argv.port, function() {
    console.log('serving "' + dir + '" at ' + server.getUrl());
});
