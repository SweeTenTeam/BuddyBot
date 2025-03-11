import amqp from 'amqplib'
import { JiraController } from '../JiraController';

class MessageListener{
    private conn: amqp.ChannelModel;
    private channelInput: amqp.Channel;
    private channelOutput: amqp.Channel;
    private jiraController: JiraController;

    constructor() {
        this.jiraController = new JiraController();
    }

    async connect(): Promise<void> {
        this.conn = await amqp.connect("amqp://rabbitmq");
        console.log("[+] Connected!");
    }

    async close(): Promise<void> {
        await this.channelInput.close();
        await this.conn.close();
        console.log("[+] Disconnected!");
    }

    async listen(): Promise<void> {
        const queueInput = 'information-input';
        const queueOutput = 'information-output';

        console.log(`[+] Listening on ${queueInput}...`);

        this.channelInput = await this.conn.createChannel();
        await this.channelInput.assertQueue(queueInput);
        this.channelOutput = await this.conn.createChannel();
        await this.channelOutput.assertQueue(queueOutput);

        this.channelInput.consume(queueInput, async (msg) => {
            const command = JSON.parse(msg.content.toString());
            if(command['origin'] == 'Jira'){
                const tickets = await this.jiraController.fetchJiraInfo(command);
                for(const ticket of tickets){
                    console.log(`[+] Sending ticket to ${queueOutput}`);
                    this.channelInput.sendToQueue(queueOutput,Buffer.from(JSON.stringify(ticket.toJson())));
                    console.log('[+] Ticket sent');
                }
            }
            this.channelInput.ack(msg);
        });
    }
}

async function test(): Promise<void> {
    const listener = new MessageListener();
    await listener.connect();
    await listener.listen();
}

test();