import amqp from 'amqplib/callback_api.js'

console.log("Receiver!");
amqp.connect('amqp://rabbitmq', function(error0, connection) {
    if(error0){
        throw error0;
    }
    connection.createChannel(function(error1, channel){
        if(error1){
            throw error1;
        }
        var queue = 'information-output';

        channel.assertQueue(queue);

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
        channel.consume(queue, function(msg){
            console.log(" [x] Received %s", msg.content.toString());
        }, {
            noAck: true
        });

        //setTimeout(function() {
        //    connection.close();
        //    process.exit(0)
        //  }, 500);
    });
});