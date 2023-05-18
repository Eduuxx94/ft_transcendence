import { Socket } from 'socket.io';
import * as fs from 'fs';
import * as path from 'path';
import { Player } from './Player';

export class GameMap {
	public players: Player[] = [];
	public gameObjets: any[] = [];
	private map: any;

	constructor(mapFile: string = 'map_1.json') {
		const jsonPath = path.join(__dirname, '..', 'public/maps', mapFile);
		const jsonData = fs.readFileSync(jsonPath, 'utf-8');
		const jsonObject = JSON.parse(jsonData);
		this.map = jsonObject;
	}

	public join(player: Player): void {
		if (player.map.current) {
			player.map.current.removePlayer(player);
			player.map.current.emitAll('remove_gameobject', player.data);
			player.map.position_preveiw = { x: player.data.x, y: player.data.y };
			player.map.preveiw = player.map.current;
			player.map.current = this;
		}
		const clientSocket = this.players.find((clientSocket) => clientSocket.objectId === player.objectId);
		const data: any[] = this.players.filter((e) => e.objectId != player.objectId).map((e) => e.data);
		data.push(...this.gameObjets);
		console.log('load load_map: ', data);
		player.data.x = this.map.start_position.x;
		player.data.y = this.map.start_position.y;
		player.emit('load_map', {
			map: this.map,
			player: clientSocket ? clientSocket.data : player.data,
			data: data,
		});
		if (clientSocket) {
			clientSocket.socket = player.socket;
			console.log('re-connected socket: ', player.objectId);
		} else {
			this.players.push(player);
			this.emitAll('new_gameobject', player.data, player);
			console.log('new player: ', player.objectId);
		}
		player.socket.on('new_gameobject', (data) => {
			this.gameObjets.push(data);
			this.emitAll('new_gameobject', data, player);
		});
		player.socket.on('update_gameobject', (data) => {
			player.data = data;
			this.emitAll('update_gameobject', data, player);
		});
	}

	public emitAll(event: string, data: any, ignorerPlayer?: Player): void {
		this.players.forEach((clientSocket) => {
			if (ignorerPlayer === undefined || clientSocket.objectId !== ignorerPlayer.objectId) clientSocket.emit(event, data);
		});
	}

	public removePlayer(player: Player): void {
		this.players = this.players.filter((clientSocket) => {
			return clientSocket.socket.id !== player.socket.id;
		});
	}

	public get objectId(): string {
		return this.map.objectId;
	}
}
