import amqp from 'amqplib/callback_api.js'

console.log("Hello World!");
amqp.connect('amqp://rabbitmq', function(error0, connection) {
    if(error0){
        throw error0;
    }
    connection.createChannel(function(error1, channel){
        if(error1){
            throw error1;
        }
        var queue = 'information';
        var msg = 'Hello World!';

        channel.assertQueue(queue, {
            durable: false
        });
//
        //channel.sendToQueue(queue, Buffer.from(msg));
        //console.log("[+] Sent %s", msg);

        //setTimeout(function() {
        //    connection.close();
        //    process.exit(0)
        //  }, 500);
    });
});