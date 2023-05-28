import { Player } from 'src/lobby';

interface ChatMessage {
	id: any;
	objectId: any;
	message: string;
	nickname: string;
}

interface ChatUser {
	objectId: any;
	avatar: string;
	name: string;
}

export class Channel {
	objectId: any = '';
	name: string = '';
	messages: ChatMessage[] = [];
	password: string = '';
	avatar: string = '';
	players: Player[] = [];

	public join(player: Player): void {
		this.players.push(player);
		this.emitAll('join_chat', this.getData());

		//player.emit('list_chat', this.getData());
	}

	public addMessage(player: Player, data: any) {
		this.messages.push(data.message);
		this.emitAll('send_message', data, player);
	}

	public emitAll(event: string, data: any, ignorerPlayer?: Player): void {
		this.players.forEach((clientSocket) => {
			if (ignorerPlayer === undefined || clientSocket.objectId !== ignorerPlayer.objectId) clientSocket.emit(event, data);
		});
	}

	public getData() {
		return {
			objectId: this.objectId,
			name: this.name,
			messages: this.messages,
			avatar: this.avatar,
			password: this.password,
			users: this.players.map((e) => {
				const data: ChatUser = {
					objectId: e.objectId,
					avatar: e.avatar,
					name: e.name,
				};
				return data;
			}),
		};
	}
}

export class ChatController {
	channels: Channel[] = [];

	constructor() {
		const channel = new Channel();
		channel.name = 'Global';
		channel.objectId = 'global';
		this.channels.push(channel);
	}

	public connection(player: Player) {
		this.channels.forEach((channel) => {
			channel.join(player);
		});
		player.on('send_message', (data) => {
			const channel = this.channels.find((e) => e.objectId == data.objectId);
			if (channel) channel.addMessage(player, data);
			console.log(data);
		});
	}
}